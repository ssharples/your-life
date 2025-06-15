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
import { Plus, Heart, Star } from 'lucide-react';
import { ValuesGuide } from '@/components/guides/ValuesGuide';
import { useHelp } from '@/contexts/HelpContext';

export const ValuesVault = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [importanceRating, setImportanceRating] = useState(5);
  const queryClient = useQueryClient();
  const { showHelp } = useHelp();

  const { data: values } = useQuery({
    queryKey: ['values-vault'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('values_vault')
        .select('*')
        .eq('user_id', user.data.user.id)
        .order('importance_rating', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createValue = useMutation({
    mutationFn: async (newValue: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('values_vault')
        .insert([{ 
          ...newValue, 
          user_id: user.data.user.id,
          importance_rating: importanceRating
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['values-vault'] });
      toast({ title: "Success", description: "Value added successfully!" });
      resetForm();
    },
  });

  const resetForm = () => {
    setValue('');
    setDescription('');
    setImportanceRating(5);
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createValue.mutate({ value, description, importance_rating: importanceRating });
  };

  const getImportanceColor = (rating: number) => {
    if (rating >= 9) return 'bg-red-100 text-red-800 border-red-200';
    if (rating >= 7) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (rating >= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (rating >= 3) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
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
              <DialogTitle>Add New Core Value</DialogTitle>
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
              <Button type="submit" className="w-full">Add Value</Button>
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
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  <span className="text-sm font-normal">{valueItem.importance_rating}/10</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {valueItem.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {valueItem.description}
                </p>
              )}
              <div className="text-xs text-muted-foreground mt-3">
                Added: {new Date(valueItem.created_at).toLocaleDateString()}
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
