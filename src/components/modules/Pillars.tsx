import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Building2 } from 'lucide-react';
import { PillarsGuide } from '@/components/guides/PillarsGuide';
import { useHelp } from '@/contexts/HelpContext';

export const Pillars = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();
  const { showHelp } = useHelp();

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
      queryClient.invalidateQueries({ queryKey: ['pillars'] });
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
    <div className="space-y-6">
      {showHelp && <PillarsGuide />}
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Life Pillars</h2>
          <p className="text-muted-foreground">Define the core areas that support your life structure</p>
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pillars?.map((pillar) => (
          <Card key={pillar.id}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Building2 className="h-4 w-4 mr-2" />
                {pillar.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pillar.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              )}
              <div className="text-xs text-muted-foreground mt-3">
                Created: {new Date(pillar.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pillars && pillars.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No pillars defined yet</h3>
            <p className="text-muted-foreground mb-4">
              Life pillars represent the major areas that support your life structure. Common examples include Health, Career, Relationships, and Personal Growth.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Pillar
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
