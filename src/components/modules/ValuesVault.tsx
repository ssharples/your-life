
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus, Heart, Star, Edit, Trash2, X } from 'lucide-react';
import { ValuesGuide } from '@/components/guides/ValuesGuide';
import { useHelp } from '@/contexts/HelpContext';

interface Value {
  id: string;
  value: string;
  description: string | null;
  importance_rating: number;
  created_at: string;
  connected_pillars?: Pillar[];
}

interface Pillar {
  id: string;
  name: string;
}

export const ValuesVault = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingValue, setEditingValue] = useState<Value | null>(null);
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [importanceRating, setImportanceRating] = useState(5);
  const [selectedPillarIds, setSelectedPillarIds] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { showHelp } = useHelp();

  const { data: pillars } = useQuery({
    queryKey: ['pillars'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('pillars')
        .select('id, name')
        .eq('user_id', user.data.user.id)
        .order('name');
      
      if (error) throw error;
      return data as Pillar[];
    },
  });

  const { data: values } = useQuery({
    queryKey: ['values-vault'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      // Get values
      const { data: valuesData, error: valuesError } = await supabase
        .from('values_vault')
        .select('*')
        .eq('user_id', user.data.user.id)
        .order('importance_rating', { ascending: false });
      
      if (valuesError) throw valuesError;

      // Get pillar connections for each value
      const valuesWithPillars = await Promise.all(
        valuesData.map(async (valueItem) => {
          const { data: connections } = await supabase
            .from('value_pillar_connections')
            .select(`
              pillar_id,
              pillars (id, name)
            `)
            .eq('value_id', valueItem.id);

          return {
            ...valueItem,
            connected_pillars: connections?.map(conn => conn.pillars).filter(Boolean) || []
          };
        })
      );
      
      return valuesWithPillars as Value[];
    },
  });

  const createOrUpdateValue = useMutation({
    mutationFn: async (valueData: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      if (editingValue) {
        // Update the value
        const { data, error } = await supabase
          .from('values_vault')
          .update({
            value: valueData.value,
            description: valueData.description,
            importance_rating: valueData.importance_rating
          })
          .eq('id', editingValue.id)
          .eq('user_id', user.data.user.id)
          .select();
        
        if (error) throw error;

        // Remove existing pillar connections
        await supabase
          .from('value_pillar_connections')
          .delete()
          .eq('value_id', editingValue.id);

        // Add new pillar connections
        if (valueData.pillar_ids && valueData.pillar_ids.length > 0) {
          const connections = valueData.pillar_ids.map((pillarId: string) => ({
            value_id: editingValue.id,
            pillar_id: pillarId
          }));

          await supabase
            .from('value_pillar_connections')
            .insert(connections);
        }

        return data;
      } else {
        // Create new value
        const { data, error } = await supabase
          .from('values_vault')
          .insert([{ 
            value: valueData.value,
            description: valueData.description,
            importance_rating: valueData.importance_rating,
            user_id: user.data.user.id
          }])
          .select();
        
        if (error) throw error;

        // Add pillar connections
        if (valueData.pillar_ids && valueData.pillar_ids.length > 0 && data[0]) {
          const connections = valueData.pillar_ids.map((pillarId: string) => ({
            value_id: data[0].id,
            pillar_id: pillarId
          }));

          await supabase
            .from('value_pillar_connections')
            .insert(connections);
        }

        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['values-vault'] });
      queryClient.invalidateQueries({ queryKey: ['pillars-hierarchy'] });
      toast({ 
        title: "Success", 
        description: editingValue ? "Value updated successfully!" : "Value added successfully!" 
      });
      resetForm();
    },
  });

  const deleteValue = useMutation({
    mutationFn: async (valueId: string) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      // Delete pillar connections first (will be handled by CASCADE, but being explicit)
      await supabase
        .from('value_pillar_connections')
        .delete()
        .eq('value_id', valueId);

      const { error } = await supabase
        .from('values_vault')
        .delete()
        .eq('id', valueId)
        .eq('user_id', user.data.user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['values-vault'] });
      queryClient.invalidateQueries({ queryKey: ['pillars-hierarchy'] });
      toast({ title: "Success", description: "Value deleted successfully!" });
    },
  });

  const resetForm = () => {
    setValue('');
    setDescription('');
    setImportanceRating(5);
    setSelectedPillarIds([]);
    setEditingValue(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (valueItem: Value) => {
    setEditingValue(valueItem);
    setValue(valueItem.value);
    setDescription(valueItem.description || '');
    setImportanceRating(valueItem.importance_rating);
    setSelectedPillarIds(valueItem.connected_pillars?.map(p => p.id) || []);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrUpdateValue.mutate({ 
      value, 
      description, 
      importance_rating: importanceRating,
      pillar_ids: selectedPillarIds
    });
  };

  const handleDelete = (valueId: string) => {
    if (confirm('Are you sure you want to delete this value?')) {
      deleteValue.mutate(valueId);
    }
  };

  const getImportanceColor = (rating: number) => {
    if (rating >= 9) return 'bg-red-100 text-red-800 border-red-200';
    if (rating >= 7) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (rating >= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (rating >= 3) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handlePillarSelection = (pillarId: string) => {
    if (selectedPillarIds.includes(pillarId)) {
      setSelectedPillarIds(selectedPillarIds.filter(id => id !== pillarId));
    } else {
      setSelectedPillarIds([...selectedPillarIds, pillarId]);
    }
  };

  const removePillar = (pillarId: string) => {
    setSelectedPillarIds(selectedPillarIds.filter(id => id !== pillarId));
  };

  return (
    <div className="space-y-6">
      {showHelp && <ValuesGuide />}
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Values Vault</h2>
          <p className="text-muted-foreground">Define and track your core values</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Value
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingValue ? 'Edit Core Value' : 'Add New Core Value'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Value name (e.g., Integrity, Growth, Family)"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
              <Textarea
                placeholder="What does this value mean to you? How does it guide your decisions?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Connected Pillars</label>
                <Select onValueChange={handlePillarSelection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pillars to connect" />
                  </SelectTrigger>
                  <SelectContent>
                    {pillars?.filter(pillar => !selectedPillarIds.includes(pillar.id)).map((pillar) => (
                      <SelectItem key={pillar.id} value={pillar.id}>
                        {pillar.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedPillarIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedPillarIds.map((pillarId) => {
                      const pillar = pillars?.find(p => p.id === pillarId);
                      return pillar ? (
                        <Badge key={pillarId} variant="secondary" className="flex items-center gap-1">
                          {pillar.name}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-3 w-3 p-0 hover:bg-transparent"
                            onClick={() => removePillar(pillarId)}
                          >
                            <X className="h-2 w-2" />
                          </Button>
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Importance Rating: {importanceRating}/10
                </label>
                <Input
                  type="range"
                  min="1"
                  max="10"
                  value={importanceRating}
                  onChange={(e) => setImportanceRating(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Less Important</span>
                  <span>Very Important</span>
                </div>
              </div>
              <Button type="submit" className="w-full">
                {editingValue ? 'Update Value' : 'Add Value'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {values?.map((valueItem) => (
          <Card key={valueItem.id} className={`border-2 ${getImportanceColor(valueItem.importance_rating || 5)}`}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  {valueItem.value}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-sm font-normal">{valueItem.importance_rating}/10</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(valueItem)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(valueItem.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {valueItem.description && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {valueItem.description}
                </p>
              )}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {valueItem.connected_pillars && valueItem.connected_pillars.length > 0 ? (
                    valueItem.connected_pillars.map((pillar) => (
                      <Badge key={pillar.id} variant="outline" className="text-xs">
                        {pillar.name}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Unassigned
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  Added: {new Date(valueItem.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {values && values.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No values defined yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by identifying your core values - the principles that guide your decisions and define who you are.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Value
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
