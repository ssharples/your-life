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
import { Plus, Lightbulb, ExternalLink, BookOpen } from 'lucide-react';
import { KnowledgeGuide } from '@/components/guides/KnowledgeGuide';
import { useHelp } from '@/contexts/HelpContext';

export const KnowledgeVault = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [source, setSource] = useState('');
  const [tags, setTags] = useState('');
  const [goalId, setGoalId] = useState('');
  const [projectId, setProjectId] = useState('');
  const queryClient = useQueryClient();
  const { showHelp } = useHelp();

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

  const createKnowledge = useMutation({
    mutationFn: async (newItem: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('knowledge_vault')
        .insert([{ 
          ...newItem, 
          user_id: user.data.user.id,
          linked_goal_id: goalId || null,
          linked_project_id: projectId || null
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
    setContent('');
    setSource('');
    setTags('');
    setGoalId('');
    setProjectId('');
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    createKnowledge.mutate({ 
      title, 
      content, 
      source, 
      tags: tagsArray,
      linked_goal_id: goalId || null,
      linked_project_id: projectId || null
    });
  };

  return (
    <div className="space-y-6">
      {showHelp && <KnowledgeGuide />}
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Knowledge Vault</h2>
          <p className="text-muted-foreground">Capture and organize your insights and learnings</p>
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
              <DialogTitle>Add New Knowledge</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Title or main insight"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Textarea
                placeholder="Detailed content, notes, or explanation..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={6}
              />
              <Input
                placeholder="Source (book, article, video, etc.)"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select value={goalId} onValueChange={setGoalId}>
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
                <Select value={projectId} onValueChange={setProjectId}>
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
              </div>
              <Input
                placeholder="Tags (comma-separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <Button type="submit" className="w-full">Add Knowledge</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {knowledgeItems?.map((item) => (
          <Card key={item.id} className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg flex items-start gap-2">
                <Lightbulb className="h-4 w-4 mt-1 flex-shrink-0" />
                <span className="line-clamp-2">{item.title}</span>
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                {item.goals && (
                  <Badge variant="secondary" className="text-xs">
                    Goal: {item.goals.title}
                  </Badge>
                )}
                {item.los_projects && (
                  <Badge variant="outline" className="text-xs">
                    Project: {item.los_projects.title}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-4">{item.content}</p>
                {item.source && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {item.source.startsWith('http') ? (
                      <>
                        <ExternalLink className="h-3 w-3" />
                        <a 
                          href={item.source} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline truncate"
                        >
                          {item.source}
                        </a>
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-3 w-3" />
                        <span className="truncate">{item.source}</span>
                      </>
                    )}
                  </div>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  Added: {new Date(item.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
