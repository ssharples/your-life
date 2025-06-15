
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
import { Plus, Brain, ExternalLink } from 'lucide-react';
import { KnowledgeGuide } from '@/components/guides/KnowledgeGuide';

export const KnowledgeVault = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [content, setContent] = useState('');
  const [linkedGoalId, setLinkedGoalId] = useState('');
  const [linkedProjectId, setLinkedProjectId] = useState('');
  const queryClient = useQueryClient();

  const { data: knowledgeItems } = useQuery({
    queryKey: ['knowledge-vault'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('knowledge_vault')
        .select(`
          *,
          goals (title),
          los_projects (title)
        `)
        .eq('user_id', user.data.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.data.user.id);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: projects } = useQuery({
    queryKey: ['los-projects'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('los_projects')
        .select('*')
        .eq('user_id', user.data.user.id);
      
      if (error) throw error;
      return data;
    },
  });

  const createKnowledgeItem = useMutation({
    mutationFn: async (newItem: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('knowledge_vault')
        .insert([{ 
          ...newItem, 
          user_id: user.data.user.id,
          linked_goal_id: linkedGoalId || null,
          linked_project_id: linkedProjectId || null
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-vault'] });
      toast({ title: "Success", description: "Knowledge item created successfully!" });
      resetForm();
    },
  });

  const resetForm = () => {
    setTitle('');
    setSource('');
    setContent('');
    setLinkedGoalId('');
    setLinkedProjectId('');
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createKnowledgeItem.mutate({ title, source, content });
  };

  return (
    <div className="space-y-6">
      <KnowledgeGuide />
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Knowledge Vault</h2>
          <p className="text-muted-foreground">Store and organize your insights, notes, and ideas</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Knowledge
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Knowledge Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Input
                placeholder="Source (optional)"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
              <Textarea
                placeholder="Content, notes, or insights..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={8}
              />
              <Select value={linkedGoalId} onValueChange={setLinkedGoalId}>
                <SelectTrigger>
                  <SelectValue placeholder="Link to goal (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {goals?.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={linkedProjectId} onValueChange={setLinkedProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Link to project (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {projects?.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full">Add to Knowledge Vault</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {knowledgeItems?.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center">
                  <Brain className="h-4 w-4 mr-2" />
                  {item.title}
                </CardTitle>
                {item.source && (
                  <Badge variant="outline" className="flex items-center">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Source
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {item.goals && (
                  <Badge variant="outline">Goal: {item.goals.title}</Badge>
                )}
                {item.los_projects && (
                  <Badge variant="secondary">Project: {item.los_projects.title}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {item.source && (
                <p className="text-xs text-muted-foreground mb-2">Source: {item.source}</p>
              )}
              <p className="text-sm whitespace-pre-wrap">{item.content}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Added: {new Date(item.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
