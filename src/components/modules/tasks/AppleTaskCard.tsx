
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Flag, MoreHorizontal, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format, parseISO, isValid } from 'date-fns';

interface AppleTaskCardProps {
  task: any;
  onStatusUpdate: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
}

export const AppleTaskCard = ({ task, onStatusUpdate, onDelete }: AppleTaskCardProps) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    await onStatusUpdate(task.id, task.status === 'completed' ? 'pending' : 'completed');
    setIsCompleting(false);
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = parseISO(dateStr);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
        return 'Today';
      } else if (format(date, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd')) {
        return 'Tomorrow';
      } else {
        return format(date, 'MMM d, yyyy');
      }
    } catch {
      return dateStr;
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return 'text-red-500';
    if (priority === 3) return 'text-orange-500';
    return 'text-gray-400';
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
  const isCompleted = task.status === 'completed';

  return (
    <div className={`group flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors ${isCompleted ? 'opacity-60' : ''}`}>
      {/* Completion Circle */}
      <button
        onClick={handleComplete}
        disabled={isCompleting}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          isCompleted 
            ? 'bg-blue-500 border-blue-500' 
            : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        {isCompleted && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        )}
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
          {task.description}
        </div>
        
        <div className="flex items-center gap-2 mt-1">
          {/* Category/Project */}
          {task.los_projects && (
            <span className="text-xs text-gray-500">
              {task.los_projects.title}
            </span>
          )}
          
          {/* Date */}
          {task.due_date && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-gray-400" />
              <span className={`text-xs ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
                {formatDateDisplay(task.due_date)}
              </span>
            </div>
          )}

          {/* Priority */}
          {task.priority && task.priority !== 3 && (
            <div className="flex items-center gap-1">
              <Flag className={`w-3 h-3 ${getPriorityColor(task.priority)}`} />
              <span className="text-xs text-gray-500">P{task.priority}</span>
            </div>
          )}

          {/* Goal */}
          {task.goals && (
            <Badge variant="outline" className="text-xs">
              {task.goals.title}
            </Badge>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex gap-1">
              {task.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onStatusUpdate(task.id, task.status === 'completed' ? 'pending' : 'completed')}>
            {task.status === 'completed' ? 'Mark as Pending' : 'Mark as Complete'}
          </DropdownMenuItem>
          {onDelete && (
            <DropdownMenuItem 
              onClick={() => onDelete(task.id)}
              className="text-red-600"
            >
              <Trash2 className="w-3 h-3 mr-2" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
