
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface GoalCardProps {
  goal: Goal;
  onUpdateStatus: (id: string, status: string) => void;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

export const GoalCard = ({ goal, onUpdateStatus, onEdit, onDelete }: GoalCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center">
            <Target className="h-4 w-4 mr-2" />
            {goal.title}
            {goal.ai_enhanced && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Sparkles className="h-3 w-3 ml-2 text-blue-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>AI Enhanced</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(goal.status)}>
              {goal.status}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(goal)}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(goal.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{goal.type}</Badge>
          {goal.pillars && (
            <Badge variant="secondary">{goal.pillars.name}</Badge>
          )}
          <Badge variant="outline">Priority {goal.priority}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {goal.description && (
          <div className="text-sm text-muted-foreground mb-2 whitespace-pre-line">
            {goal.description}
          </div>
        )}
        {goal.target_date && (
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Calendar className="h-3 w-3 mr-1" />
            Target: {new Date(goal.target_date).toLocaleDateString()}
          </div>
        )}
        <div className="flex space-x-2">
          {goal.status !== 'completed' && (
            <Button
              size="sm"
              onClick={() => onUpdateStatus(goal.id, 'completed')}
            >
              Complete
            </Button>
          )}
          {goal.status === 'active' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateStatus(goal.id, 'paused')}
            >
              Pause
            </Button>
          )}
          {goal.status === 'paused' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateStatus(goal.id, 'active')}
            >
              Resume
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
