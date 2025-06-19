import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Plus, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { TaskCard } from './tasks/TaskCard';
import { TaskActions } from './tasks/TaskActions';
import { TaskForm } from './tasks/TaskForm';
import { TasksGuide } from '@/components/guides/TasksGuide';
import { useHelp } from '@/contexts/HelpContext';
import { useItemCreation } from '@/components/hooks/useItemCreation';

export const Tasks = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { showHelp } = useHelp();

  // Use the same creation logic as quick add
  const createTask = useItemCreation('task', () => {
    console.log('Task created successfully');
  }, () => {
    console.log('Task creation completed');
  });

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
    setIsDialogOpen(false);
  };

  const handleTaskSubmit = (taskData: any) => {
    console.log('Tasks section submitting:', taskData);
    createTask.mutate(taskData);
    setIsDialogOpen(false);
  };

  const handleGoalChange = (value: string) => {
    if (value === 'new-goal') {
      console.log('Create new goal');
    }
  };

  const handleProjectChange = (value: string) => {
    if (value === 'new-project') {
      console.log('Create new project');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const completedTasks = tasks?.filter(task => task.status === 'completed') || [];
  const activeTasks = tasks?.filter(task => task.status !== 'completed') || [];

  return (
    <div className="space-y-6">
      {showHelp && <TasksGuide />}
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">Organize and track your daily tasks</p>
        </div>
        <TaskForm 
          goals={goals}
          projects={projects}
          onSubmit={handleTaskSubmit}
          onGoalChange={handleGoalChange}
          onProjectChange={handleProjectChange}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Active Tasks ({activeTasks.length})
            </CardTitle>
            <CardDescription>
              Tasks that are pending or in progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task}
                onStatusUpdate={(id, status) => updateTaskStatus.mutate({ id, status })}
              />
            ))}
            {activeTasks.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No active tasks. Create one to get started!
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Completed Tasks ({completedTasks.length})
            </CardTitle>
            <CardDescription>
              Tasks you've finished
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {completedTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task}
                onStatusUpdate={(id, status) => updateTaskStatus.mutate({ id, status })}
              />
            ))}
            {completedTasks.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No completed tasks yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
