
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TaskForm } from './modules/tasks/TaskForm';
import { GoalFormWithAI } from './modules/goals/GoalFormWithAI';
import { HabitForm } from './modules/habits/HabitForm';
import { SimpleForm } from './forms/SimpleForm';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface QuickAddDialogProps {
  type: string | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const QuickAddDialog = ({ type, isOpen, onClose, onComplete }: QuickAddDialogProps) => {
  const [formData, setFormData] = useState<any>({});
  const queryClient = useQueryClient();

  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return [];
      
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
      if (!user.data.user) return [];
      
      const { data, error } = await supabase
        .from('los_projects')
        .select('*')
        .eq('user_id', user.data.user.id);
      
      if (error) throw error;
      return data;
    },
  });

  const createItem = useMutation({
    mutationFn: async (data: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const item = { ...data, user_id: user.data.user.id };

      switch (type) {
        case 'task': {
          const { data: result, error } = await supabase
            .from('los_tasks')
            .insert([{ ...item, status: 'pending' }])
            .select()
            .single();
          if (error) throw error;
          return result;
        }
        case 'goal': {
          // Ensure type is set to 'outcome' for goals
          const goalData = { 
            ...item, 
            type: 'outcome',
            status: 'active' 
          };
          console.log('Creating goal with data:', goalData);
          
          const { data: result, error } = await supabase
            .from('goals')
            .insert([goalData])
            .select()
            .single();
          if (error) {
            console.error('Goal creation error:', error);
            throw error;
          }
          return result;
        }
        case 'project': {
          const { data: result, error } = await supabase
            .from('los_projects')
            .insert([{ ...item, status: 'planning' }])
            .select()
            .single();
          if (error) throw error;
          return result;
        }
        case 'habit': {
          const { data: result, error } = await supabase
            .from('habits')
            .insert([{ ...item, status: 'active' }])
            .select()
            .single();
          if (error) throw error;
          return result;
        }
        case 'journal': {
          const { data: result, error } = await supabase
            .from('journals')
            .insert([item])
            .select()
            .single();
          if (error) throw error;
          return result;
        }
        case 'knowledge': {
          const { data: result, error } = await supabase
            .from('knowledge_vault')
            .insert([item])
            .select()
            .single();
          if (error) throw error;
          return result;
        }
        case 'pillar': {
          const { data: result, error } = await supabase
            .from('pillars')
            .insert([item])
            .select()
            .single();
          if (error) throw error;
          return result;
        }
        case 'value': {
          const { data: result, error } = await supabase
            .from('values_vault')
            .insert([item])
            .select()
            .single();
          if (error) throw error;
          return result;
        }
        default:
          throw new Error('Invalid type');
      }
    },
    onSuccess: () => {
      const queryKey = type === 'task' ? 'los-tasks' : 
                     type === 'project' ? 'los-projects' : 
                     type === 'knowledge' ? 'knowledge_vault' :
                     type === 'value' ? 'values_vault' : type;
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      onComplete();
      onClose();
      setFormData({});
      toast({
        title: "Success",
        description: "Item created successfully!",
      });
    },
    onError: (error) => {
      console.error('Failed to create item:', error);
      toast({
        title: "Error",
        description: `Failed to create item: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: any) => {
    createItem.mutate(data);
  };

  const handleGoalChange = () => {};
  const handleProjectChange = () => {};

  const getDialogTitle = () => {
    switch (type) {
      case 'task': return 'Quick Add Task';
      case 'goal': return 'Quick Add Goal';
      case 'project': return 'Quick Add Project';
      case 'habit': return 'Quick Add Habit';
      case 'journal': return 'Quick Add Journal Entry';
      case 'knowledge': return 'Quick Add Knowledge Note';
      case 'pillar': return 'Quick Add Pillar';
      case 'value': return 'Quick Add Value';
      default: return 'Quick Add';
    }
  };

  const renderForm = () => {
    switch (type) {
      case 'task':
        return (
          <TaskForm
            goals={goals}
            projects={projects}
            onSubmit={handleSubmit}
            onGoalChange={handleGoalChange}
            onProjectChange={handleProjectChange}
          />
        );
      
      case 'goal':
        return (
          <GoalFormWithAI
            onSubmit={handleSubmit}
            onCancel={onClose}
            createItem={createItem}
          />
        );
      
      case 'habit':
        return (
          <HabitForm
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        );

      default:
        return <SimpleForm type={type} onSubmit={handleSubmit} onCancel={onClose} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
};
