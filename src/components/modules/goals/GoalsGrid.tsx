
import { GoalCard } from './GoalCard';

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {goals?.map((goal) => (
        <GoalCard 
          key={goal.id} 
          goal={goal} 
          onUpdateStatus={onUpdateStatus}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
