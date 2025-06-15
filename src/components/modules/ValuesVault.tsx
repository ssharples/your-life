
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus, Heart, Star, Edit, Trash2 } from 'lucide-react';
import { ValuesGuide } from '@/components/guides/ValuesGuide';

export const ValuesVault = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [importanceRating, setImportanceRating] = useState(5);
  const queryClient = useQueryClient();

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
    createValue.mutate({ value, description });
  };

  const getImportanceColor = (rating: number) => {
    if (rating >= 8) return 'bg-red-100 text-red-800';
    if (rating >= 6) return 'bg-orange-100 text-orange-800';
    if (rating >= 4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <ValuesGuide />
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Values Vault</h2>
          <p className="text-muted-foreground">Define and track your core values and principles</p>
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
              <DialogTitle>Add Core Value</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Value name (e.g., Integrity, Family, Growth)"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
              <Textarea
                placeholder="Description of what this value means to you..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
              <div>
                <label className="text-sm font-medium">Importance Rating (1-10): {importanceRating}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={importanceRating}
                  onChange={(e) => setImportanceRating(parseInt(e.target.value))}
                  className="w-full mt-2"
                />
              </div>
              <Button type="submit" className="w-full">Add Value</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {values?.map((valueItem) => (
          <Card key={valueItem.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  {valueItem.value}
                </CardTitle>
                <Badge className={getImportanceColor(valueItem.importance_rating)}>
                  <Star className="h-3 w-3 mr-1" />
                  {valueItem.importance_rating}/10
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {valueItem.description && (
                <p className="text-sm text-muted-foreground">{valueItem.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
