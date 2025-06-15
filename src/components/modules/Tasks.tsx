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
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Plus, CheckSquare, Calendar } from 'lucide-react';
import { TasksGuide } from '@/components/guides/TasksGuide';
import { QuickGoalCreator } from '@/components/modules/reviews/components/QuickGoalCreator';
import { QuickProjectCreator } from '@/components/modules/reviews/components/QuickProjectCreator';

export const Tasks = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState(3);
  const [projectId, setProjectId] = useState('');
  const [goalId, setGoalId] = useState('');
  const [tags, setTags] = useState('');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [pendingTaskData, setPendingTaskData] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: tasks } = useQuery({
    queryKey: ['los-tasks'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('los_tasks')
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

  const createTask = useMutation({
    mutationFn: async (newTask: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('los_tasks')
        .insert([{ 
          ...newTask, 
          user_id: user.data.user.id,
          project_id: projectId || null,
          goal_id: goalId || null,
          due_date: dueDate || null,
          tags: tags ? tags.split(',').map(tag => tag.trim()) : []
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['los-tasks'] });
      toast({ title: "Success", description: "Task created successfully!" });
      
      // Check if we need to show modals for quick-created goals/projects
      if (pendingTaskData?.newGoal) {
        setShowGoalModal(true);
      } else if (pendingTaskData?.newProject) {
        setShowProjectModal(true);
      } else {
        resetForm();
      }
    },
  });

  const updateTaskStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('los_tasks')
        .update({ status })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['los-tasks'] });
      toast({ title: "Success", description: "Task updated successfully!" });
    },
  });

  const resetForm = () => {
    setDescription('');
    setDueDate('');
    setPriority(3);
    setProjectId('');
    setGoalId('');
    setTags('');
    setIsDialogOpen(false);
    setPendingTaskData(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const taskData = { description, priority };
    setPendingTaskData(taskData);
    createTask.mutate(taskData);
  };

  const handleGoalChange = (value: string) => {
    if (value === 'new-goal') {
      setGoalId('');
      setPendingTaskData({ ...pendingTaskData, newGoal: true });
    } else {
      setGoalId(value);
    }
  };

  const handleProjectChange = (value: string) => {
    if (value === 'new-project') {
      setProjectId('');
      setPendingTaskData({ ...pendingTaskData, newProject: true });
    } else {
      setProjectId(value);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return 'bg-red-100 text-red-800';
    if (priority === 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      <TasksGuide />
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">Manage your actionable tasks and to-dos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="Task description (be specific and actionable)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <Select value={goalId} onValueChange={handleGoalChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Link to goal (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new-goal">
                    <span className="flex items-center gap-2">
                      <Plus className="h-3 w-3" />
                      Create new goal
                    </span>
                  </SelectItem>
                  {goals?.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={projectId} onValueChange={handleProjectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Link to project (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new-project">
                    <span className="flex items-center gap-2">
                      <Plus className="h-3 w-3" />
                      Create new project
                    </span>
                  </SelectItem>
                  {projects?.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                placeholder="Due date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <Select value={priority.toString()} onValueChange={(value) => setPriority(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Highest</SelectItem>
                  <SelectItem value="2">2 - High</SelectItem>
                  <SelectItem value="3">3 - Medium</SelectItem>
                  <SelectItem value="4">4 - Low</SelectItem>
                  <SelectItem value="5">5 - Lowest</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Tags (comma-separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <Button type="submit" className="w-full">Create Task</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {tasks?.map((task) => (
          <Card key={task.id} className={task.status === 'completed' ? 'opacity-75' : ''}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  {task.description}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                  <Badge className={getPriorityColor(task.priority)} variant="outline">
                    P{task.priority}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {task.goals && (
                  <Badge variant="outline">Goal: {task.goals.title}</Badge>
                )}
                {task.los_projects && (
                  <Badge variant="secondary">Project: {task.los_projects.title}</Badge>
                )}
                {task.tags?.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              {task.due_date && (
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Calendar className="h-3 w-3 mr-1" />
                  Due: {new Date(task.due_date).toLocaleDateString()}
                </div>
              )}
              <div className="flex space-x-2">
                {task.status === 'pending' && (
                  <Button
                    size="sm"
                    onClick={() => updateTaskStatus.mutate({ id: task.id, status: 'in-progress' })}
                  >
                    Start
                  </Button>
                )}
                {task.status !== 'completed' && (
                  <Button
                    size="sm"
                    onClick={() => updateTaskStatus.mutate({ id: task.id, status: 'completed' })}
                  >
                    Complete
                  </Button>
                )}
                {task.status === 'in-progress' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateTaskStatus.mutate({ id: task.id, status: 'pending' })}
                  >
                    Pause
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal Components */}
      <QuickGoalCreator 
        isOpen={showGoalModal} 
        onClose={() => {
          setShowGoalModal(false);
          resetForm();
        }} 
      />
      
      <QuickProjectCreator 
        isOpen={showProjectModal} 
        onClose={() => {
          setShowProjectModal(false);
          resetForm();
        }} 
      />
    </div>
  );
};
