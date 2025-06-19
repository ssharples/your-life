
import { GoalsTable } from './GoalsTable';

interface Goal {
  id: string;
  title: string;
  description?: string;
  status: string;
  type: string;
  priority: number;
  target_date?: string;
  ai_enhanced?: boolean;
  pillars?: { name: string };
}

interface GoalsGridProps {
  goals?: Goal[];
  onUpdateStatus: (id: string, status: string) => void;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

export const GoalsGrid = ({ goals, onUpdateStatus, onEdit, onDelete }: GoalsGridProps) => {
  return (
    <GoalsTable 
      goals={goals}
      onUpdateStatus={onUpdateStatus}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};
