
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { GoalsGuide } from '@/components/guides/GoalsGuide';
import { useHelp } from '@/contexts/HelpContext';
import { useGoalsData } from './goals/hooks/useGoalsData';
import { usePillarsData } from './goals/hooks/usePillarsData';
import { GoalsHeader } from './goals/GoalsHeader';
import { GoalsGrid } from './goals/GoalsGrid';

export const Goals = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { showHelp } = useHelp();

  const { data: goals } = useGoalsData();
  const { data: pillars } = usePillarsData();

  const createGoal = useMutation({
    mutationFn: async (newGoal: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('goals')
        .insert([{ 
          ...newGoal, 
          user_id: user.data.user.id
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast({ title: "Success", description: "SMART Goal created successfully!" });
      setIsDialogOpen(false);
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

  const handleCreateGoal = (goalData: any) => {
    createGoal.mutate(goalData);
  };

  const handleUpdateStatus = (id: string, status: string) => {
    updateGoalStatus.mutate({ id, status });
  };

  return (
    <div className="space-y-6">
      {showHelp && <GoalsGuide />}
      
      <GoalsHeader
        pillars={pillars}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        onCreateGoal={handleCreateGoal}
      />

      <GoalsGrid
        goals={goals}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};
