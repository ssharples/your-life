
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { TasksGuide } from '@/components/guides/TasksGuide';
import { QuickGoalCreator } from '@/components/modules/reviews/components/QuickGoalCreator';
import { QuickProjectCreator } from '@/components/modules/reviews/components/QuickProjectCreator';
import { TaskCard } from './tasks/TaskCard';
import { TaskForm } from './tasks/TaskForm';

export const Tasks = () => {
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
          project_id: newTask.projectId || null,
          goal_id: newTask.goalId || null,
          due_date: newTask.dueDate || null,
          tags: newTask.tags ? newTask.tags.split(',').map((tag: string) => tag.trim()) : []
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
        setPendingTaskData(null);
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

  const handleTaskSubmit = (taskData: any) => {
    setPendingTaskData(taskData);
    createTask.mutate(taskData);
  };

  const handleGoalChange = (value: string) => {
    if (value === 'new-goal') {
      setPendingTaskData({ ...pendingTaskData, newGoal: true });
    }
  };

  const handleProjectChange = (value: string) => {
    if (value === 'new-project') {
      setPendingTaskData({ ...pendingTaskData, newProject: true });
    }
  };

  const handleStatusUpdate = (id: string, status: string) => {
    updateTaskStatus.mutate({ id, status });
  };

  const resetPendingData = () => {
    setPendingTaskData(null);
  };

  return (
    <div className="space-y-6">
      <TasksGuide />
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">Manage your actionable tasks and to-dos</p>
        </div>
        <TaskForm
          goals={goals}
          projects={projects}
          onSubmit={handleTaskSubmit}
          onGoalChange={handleGoalChange}
          onProjectChange={handleProjectChange}
        />
      </div>

      <div className="grid gap-4">
        {tasks?.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusUpdate={handleStatusUpdate}
          />
        ))}
      </div>

      {/* Modal Components */}
      <QuickGoalCreator 
        isOpen={showGoalModal} 
        onClose={() => {
          setShowGoalModal(false);
          resetPendingData();
        }} 
      />
      
      <QuickProjectCreator 
        isOpen={showProjectModal} 
        onClose={() => {
          setShowProjectModal(false);
          resetPendingData();
        }} 
      />
    </div>
  );
};
