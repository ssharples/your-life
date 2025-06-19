
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { CheckCircle2, Clock, Plus } from 'lucide-react';
import { TasksGuide } from '@/components/guides/TasksGuide';
import { useHelp } from '@/contexts/HelpContext';
import { useItemCreation } from '@/components/hooks/useItemCreation';
import { TaskInput } from './tasks/TaskInput';
import { AppleTasksList } from './tasks/AppleTasksList';

export const Tasks = () => {
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

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('los_tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['los-tasks'] });
      toast({ title: "Success", description: "Task deleted successfully!" });
    },
  });

  const handleTaskSubmit = (taskData: any) => {
    console.log('Tasks section submitting:', taskData);
    createTask.mutate(taskData);
  };

  const completedTasks = tasks?.filter(task => task.status === 'completed') || [];
  const activeTasks = tasks?.filter(task => task.status !== 'completed') || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {showHelp && <TasksGuide />}
      
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-600 mb-2">Today</h1>
          <p className="text-sm text-gray-500">Organize and track your tasks</p>
        </div>

        {/* Task Input */}
        <TaskInput 
          onSubmit={handleTaskSubmit}
          goals={goals}
          projects={projects}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Tasks */}
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-blue-500" />
              Active Tasks
              <span className="text-sm font-normal text-gray-500">({activeTasks.length})</span>
            </CardTitle>
            <CardDescription className="text-sm">
              Tasks that need your attention
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <AppleTasksList
              tasks={activeTasks}
              title="Active Tasks"
              onStatusUpdate={(id, status) => updateTaskStatus.mutate({ id, status })}
              onDelete={(id) => deleteTask.mutate(id)}
              emptyMessage="No active tasks. Create one to get started!"
            />
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Completed Tasks
              <span className="text-sm font-normal text-gray-500">({completedTasks.length})</span>
            </CardTitle>
            <CardDescription className="text-sm">
              Tasks you've finished
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 max-h-96 overflow-y-auto">
            <AppleTasksList
              tasks={completedTasks}
              title="Completed Tasks"
              onStatusUpdate={(id, status) => updateTaskStatus.mutate({ id, status })}
              onDelete={(id) => deleteTask.mutate(id)}
              emptyMessage="No completed tasks yet."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
