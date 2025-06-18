
import { useState } from 'react';
import { GoalsGuide } from '@/components/guides/GoalsGuide';
import { useHelp } from '@/contexts/HelpContext';
import { useGoalsData } from './goals/hooks/useGoalsData';
import { usePillarsData } from './goals/hooks/usePillarsData';
import { useGoalMutations } from './goals/hooks/useGoalMutations';
import { GoalsHeader } from './goals/GoalsHeader';
import { GoalsGrid } from './goals/GoalsGrid';

export const Goals = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const { showHelp } = useHelp();

  const { data: goals } = useGoalsData();
  const { data: pillars } = usePillarsData();
  const { createOrUpdateGoal, updateGoalStatus, deleteGoal } = useGoalMutations();

  const handleCreateGoal = (goalData: any) => {
    createOrUpdateGoal.mutate(goalData, {
      onSuccess: () => setIsDialogOpen(false)
    });
  };

  const handleUpdateStatus = (id: string, status: string) => {
    updateGoalStatus.mutate({ id, status });
  };

  const handleEditGoal = (goal: any) => {
    setEditingGoal(goal);
    setIsDialogOpen(true);
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteGoal.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingGoal(null);
  };

  return (
    <div className="space-y-6">
      {showHelp && <GoalsGuide />}
      
      <GoalsHeader
        pillars={pillars}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        onCreateGoal={handleCreateGoal}
        onCancel={handleDialogClose}
        editingGoal={editingGoal}
      />

      <GoalsGrid
        goals={goals}
        onUpdateStatus={handleUpdateStatus}
        onEdit={handleEditGoal}
        onDelete={handleDeleteGoal}
      />
    </div>
  );
};
