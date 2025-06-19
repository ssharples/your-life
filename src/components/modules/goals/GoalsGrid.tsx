
import { IOSLayout } from '@/components/ios/IOSLayout';
import { IOSCard } from '@/components/ios/IOSCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Calendar, Edit, Trash2, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return 'bg-red-100 text-red-800';
    if (priority <= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <IOSLayout>
      <div className="space-y-4">
        {goals?.map((goal) => (
          <IOSCard key={goal.id} padding="md">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Target className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 leading-tight">{goal.title}</h3>
                      {goal.ai_enhanced && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Sparkles className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>AI Enhanced</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    {goal.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{goal.description}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className={getStatusColor(goal.status)}>
                  {goal.status}
                </Badge>
                <Badge variant="outline">{goal.type}</Badge>
                <Badge className={getPriorityColor(goal.priority)}>
                  Priority {goal.priority}
                </Badge>
                {goal.pillars && (
                  <Badge variant="secondary">{goal.pillars.name}</Badge>
                )}
              </div>

              {goal.target_date && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {new Date(goal.target_date).toLocaleDateString()}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                {goal.status !== 'completed' && (
                  <Button
                    size="sm"
                    onClick={() => onUpdateStatus(goal.id, 'completed')}
                    className="h-8"
                  >
                    Complete
                  </Button>
                )}
                {goal.status === 'active' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateStatus(goal.id, 'paused')}
                    className="h-8"
                  >
                    Pause
                  </Button>
                )}
                {goal.status === 'paused' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateStatus(goal.id, 'active')}
                    className="h-8"
                  >
                    Resume
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(goal)}
                  className="h-8"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(goal.id)}
                  className="h-8 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </IOSCard>
        ))}
      </div>
    </IOSLayout>
  );
};
