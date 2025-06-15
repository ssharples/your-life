
import { Badge } from '@/components/ui/badge';
import { CheckSquare } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: string;
  priority?: string;
}

interface TaskItemProps {
  task: Task;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
}

export const TaskItem = ({ task, getStatusColor, getPriorityColor }: TaskItemProps) => {
  return (
    <div className="flex items-center justify-between text-xs p-1 bg-muted/20 rounded">
      <div className="flex items-center gap-1">
        <CheckSquare className="h-2 w-2 text-purple-500" />
        <span>{task.title}</span>
      </div>
      <div className="flex gap-1">
        <Badge className={getStatusColor(task.status)}>
          {task.status}
        </Badge>
        {task.priority && (
          <Badge className={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
        )}
      </div>
    </div>
  );
};
