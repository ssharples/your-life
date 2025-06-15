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
import { Plus, FolderOpen, Calendar, Play, Pause, CheckCircle } from 'lucide-react';
import { ProjectsGuide } from '@/components/guides/ProjectsGuide';
import { useHelp } from '@/contexts/HelpContext';

export const Projects = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [goalId, setGoalId] = useState('');
  const [pillarId, setPillarId] = useState('');
  const queryClient = useQueryClient();
  const { showHelp } = useHelp();

  const { data: projects } = useQuery({
    queryKey: ['los-projects'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('los_projects')
        .select(`
          *,
          goals (title),
          pillars (name)
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

  const { data: pillars } = useQuery({
    queryKey: ['pillars'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('pillars')
        .select('*')
        .eq('user_id', user.data.user.id);
      
      if (error) throw error;
      return data;
    },
  });

  const createProject = useMutation({
    mutationFn: async (newProject: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('los_projects')
        .insert([{ 
          ...newProject, 
          user_id: user.data.user.id,
          linked_goal_id: goalId || null,
          pillar_id: pillarId || null,
          start_date: startDate || null,
          end_date: endDate || null
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['los-projects'] });
      toast({ title: "Success", description: "Project created successfully!" });
      resetForm();
    },
  });

  const updateProjectStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('los_projects')
        .update({ status })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['los-projects'] });
      toast({ title: "Success", description: "Project updated successfully!" });
    },
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setGoalId('');
    setPillarId('');
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProject.mutate({ title, description, start_date: startDate, end_date: endDate, linked_goal_id: goalId, pillar_id: pillarId });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'planning': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {showHelp && <ProjectsGuide />}
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">Manage your structured work plans</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Project title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  placeholder="Start date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  type="date"
                  placeholder="End date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
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
              <Select value={pillarId} onValueChange={setPillarId}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign to pillar (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {pillars?.map((pillar) => (
                    <SelectItem key={pillar.id} value={pillar.id}>
                      {pillar.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full">Create Project</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  {project.title}
                </CardTitle>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.goals && (
                  <Badge variant="secondary">{project.goals.title}</Badge>
                )}
                {project.pillars && (
                  <Badge variant="outline">{project.pillars.name}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {project.description && (
                <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
              )}
              <div className="space-y-2 text-sm text-muted-foreground">
                {project.start_date && (
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Start: {new Date(project.start_date).toLocaleDateString()}
                  </div>
                )}
                {project.end_date && (
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    End: {new Date(project.end_date).toLocaleDateString()}
                  </div>
                )}
              </div>
              <div className="flex space-x-2 mt-4">
                {project.status === 'planning' && (
                  <Button
                    size="sm"
                    onClick={() => updateProjectStatus.mutate({ id: project.id, status: 'active' })}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Start
                  </Button>
                )}
                {project.status === 'active' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => updateProjectStatus.mutate({ id: project.id, status: 'completed' })}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Complete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateProjectStatus.mutate({ id: project.id, status: 'paused' })}
                    >
                      <Pause className="h-3 w-3 mr-1" />
                      Pause
                    </Button>
                  </>
                )}
                {project.status === 'paused' && (
                  <Button
                    size="sm"
                    onClick={() => updateProjectStatus.mutate({ id: project.id, status: 'active' })}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Resume
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
