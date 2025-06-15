
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Calendar } from 'lucide-react';
import { TaskActions } from './TaskActions';

interface Task {
  id: string;
  description: string;
  status: string;
  priority: number;
  due_date?: string;
  tags?: string[];
  goals?: { title: string };
  los_projects?: { title: string };
}

interface TaskCardProps {
  task: Task;
  onStatusUpdate: (id: string, status: string) => void;
}

export const TaskCard = ({ task, onStatusUpdate }: TaskCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return 'bg-red-100 text-red-800';
    if (priority === 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <Card className={task.status === 'completed' ? 'opacity-75' : ''}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center">
            <CheckSquare className="h-4 w-4 mr-2" />
            {task.description}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(task.status)}>
              {task.status}
            </Badge>
            <Badge className={getPriorityColor(task.priority)} variant="outline">
              P{task.priority}
            </Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {task.goals && (
            <Badge variant="outline">Goal: {task.goals.title}</Badge>
          )}
          {task.los_projects && (
            <Badge variant="secondary">Project: {task.los_projects.title}</Badge>
          )}
          {task.tags?.map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {task.due_date && (
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Calendar className="h-3 w-3 mr-1" />
            Due: {new Date(task.due_date).toLocaleDateString()}
          </div>
        )}
        <TaskActions task={task} onStatusUpdate={onStatusUpdate} />
      </CardContent>
    </Card>
  );
};
