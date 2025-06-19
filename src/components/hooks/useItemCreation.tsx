
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useItemCreation = (type: string | null, onComplete: () => void, onClose: () => void) => {
  const queryClient = useQueryClient();

  const createItem = useMutation({
    mutationFn: async (data: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const item = { ...data, user_id: user.data.user.id };

      switch (type) {
        case 'task': {
          // Map frontend field names to database column names
          const taskData = {
            user_id: user.data.user.id,
            description: item.description,
            status: 'pending',
            priority: item.priority || 3,
            due_date: item.dueDate || null, // Map dueDate to due_date
            project_id: item.projectId || null, // Map projectId to project_id
            goal_id: item.goalId || null, // Map goalId to goal_id
            tags: item.tags ? item.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : null
          };
          
          console.log('Creating task with data:', taskData);
          
          const { data: result, error } = await supabase
            .from('los_tasks')
            .insert([taskData])
            .select()
            .single();
          if (error) {
            console.error('Task creation error:', error);
            throw error;
          }
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
          // Map frontend field names to database column names for values
          const valueData = {
            user_id: user.data.user.id,
            value: item.value || item.title || item.name, // Handle multiple possible field names
            description: item.description,
            importance_rating: item.importance || item.importance_rating || item.importanceRating || 5
          };
          
          console.log('Creating value with data:', valueData);
          
          // Validate that we have a value before inserting
          if (!valueData.value || valueData.value.trim() === '') {
            throw new Error('Value name is required');
          }
          
          const { data: result, error } = await supabase
            .from('values_vault')
            .insert([valueData])
            .select()
            .single();
          if (error) {
            console.error('Value creation error:', error);
            throw error;
          }
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
      queryClient.invalidateQueries({ queryKey: ['values-vault'] }); // Also invalidate values-vault for consistency
      onComplete();
      onClose();
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

  return createItem;
};
