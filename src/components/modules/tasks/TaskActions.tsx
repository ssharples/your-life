
import { Button } from '@/components/ui/button';

interface Task {
  id: string;
  status: string;
}

interface TaskActionsProps {
  task: Task;
  onStatusUpdate: (id: string, status: string) => void;
}

export const TaskActions = ({ task, onStatusUpdate }: TaskActionsProps) => {
  return (
    <div className="flex space-x-2">
      {task.status === 'pending' && (
        <Button
          size="sm"
          onClick={() => onStatusUpdate(task.id, 'in-progress')}
        >
          Start
        </Button>
      )}
      {task.status !== 'completed' && (
        <Button
          size="sm"
          onClick={() => onStatusUpdate(task.id, 'completed')}
        >
          Complete
        </Button>
      )}
      {task.status === 'in-progress' && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onStatusUpdate(task.id, 'pending')}
        >
          Pause
        </Button>
      )}
    </div>
  );
};
