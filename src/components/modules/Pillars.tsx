
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

export const Pillars = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPillar, setEditingPillar] = useState<any>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();

  const { data: pillars } = useQuery({
    queryKey: ['pillars'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('pillars')
        .select('*')
        .eq('user_id', user.data.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createPillar = useMutation({
    mutationFn: async (newPillar: { name: string; description: string }) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('pillars')
        .insert([{ ...newPillar, user_id: user.data.user.id }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pillars'] });
      toast({ title: "Success", description: "Pillar created successfully!" });
      resetForm();
    },
  });

  const updatePillar = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; name: string; description: string }) => {
      const { data, error } = await supabase
        .from('pillars')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pillars'] });
      toast({ title: "Success", description: "Pillar updated successfully!" });
      resetForm();
    },
  });

  const deletePillar = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('pillars').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pillars'] });
      toast({ title: "Success", description: "Pillar deleted successfully!" });
    },
  });

  const resetForm = () => {
    setName('');
    setDescription('');
    setEditingPillar(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPillar) {
      updatePillar.mutate({ id: editingPillar.id, name, description });
    } else {
      createPillar.mutate({ name, description });
    }
  };

  const startEdit = (pillar: any) => {
    setEditingPillar(pillar);
    setName(pillar.name);
    setDescription(pillar.description || '');
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Life Pillars</h2>
          <p className="text-muted-foreground">Define the core areas of your life</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Pillar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPillar ? 'Edit Pillar' : 'Create New Pillar'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Pillar name (e.g., Health, Family, Career)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button type="submit" className="w-full">
                {editingPillar ? 'Update' : 'Create'} Pillar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pillars?.map((pillar) => (
          <Card key={pillar.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{pillar.name}</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(pillar)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePillar.mutate(pillar.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {pillar.description && (
              <CardContent>
                <p className="text-sm text-muted-foreground">{pillar.description}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
