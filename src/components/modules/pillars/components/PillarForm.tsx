
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

export const PillarForm = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();

  const createPillar = useMutation({
    mutationFn: async (newPillar: any) => {
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
      queryClient.invalidateQueries({ queryKey: ['pillars-hierarchy'] });
      toast({ title: "Success", description: "Pillar created successfully!" });
      resetForm();
    },
  });

  const resetForm = () => {
    setName('');
    setDescription('');
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPillar.mutate({ name, description });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => resetForm()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Pillar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Life Pillar</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Pillar name (e.g., Health, Career, Relationships)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Textarea
            placeholder="Description of this life area and why it's important to you"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          <Button type="submit" className="w-full">Create Pillar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
