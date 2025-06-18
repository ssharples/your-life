
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useGoalMutations = () => {
  const queryClient = useQueryClient();

  const createOrUpdateGoal = useMutation({
    mutationFn: async (goalData: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      if (goalData.isEditing) {
        // Update existing goal
        const { data, error } = await supabase
          .from('goals')
          .update({
            title: goalData.title,
            description: goalData.description,
            type: goalData.type,
            priority: goalData.priority,
            pillar_id: goalData.pillar_id || null,
            target_date: goalData.target_date || null
          })
          .eq('id', goalData.id)
          .eq('user_id', user.data.user.id)
          .select();
        
        if (error) throw error;
        return data;
      } else {
        // Create new goal
        const { data, error } = await supabase
          .from('goals')
          .insert([{ 
            title: goalData.title,
            description: goalData.description,
            type: goalData.type,
            priority: goalData.priority,
            user_id: user.data.user.id,
            pillar_id: goalData.pillar_id || null,
            target_date: goalData.target_date || null
          }])
          .select();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['goals-for-values'] });
      queryClient.invalidateQueries({ queryKey: ['values-vault'] });
      toast({ 
        title: "Success", 
        description: variables.isEditing ? "Goal updated successfully!" : "Goal created successfully!" 
      });
    },
  });

  const updateGoalStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('goals')
        .update({ status })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast({ title: "Success", description: "Goal updated successfully!" });
    },
  });

  const deleteGoal = useMutation({
    mutationFn: async (goalId: string) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', user.data.user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['goals-for-values'] });
      queryClient.invalidateQueries({ queryKey: ['values-vault'] });
      toast({ title: "Success", description: "Goal deleted successfully!" });
    },
  });

  return { createOrUpdateGoal, updateGoalStatus, deleteGoal };
};
