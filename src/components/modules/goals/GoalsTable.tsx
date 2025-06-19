
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Target, Calendar, Edit, Trash2, Sparkles, ChevronDown, ChevronRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SmartGoalDisplay } from './SmartGoalDisplay';

interface Goal {
  id: string;
  title: string;
  description?: string;
  status: string;
  type: string;
  priority: number;
  target_date?: string;
  ai_enhanced?: boolean;
  ai_suggestions?: {
    smart_breakdown?: {
      specific: string;
      measurable: string;
      achievable: string;
      relevant: string;
      timebound: string;
    };
  };
  pillars?: { name: string };
}

interface GoalsTableProps {
  goals?: Goal[];
  onUpdateStatus: (id: string, status: string) => void;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

export const GoalsTable = ({ goals, onUpdateStatus, onEdit, onDelete }: GoalsTableProps) => {
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());

  const toggleGoal = (goalId: string) => {
    const newExpanded = new Set(expandedGoals);
    if (newExpanded.has(goalId)) {
      newExpanded.delete(goalId);
    } else {
      newExpanded.add(goalId);
    }
    setExpandedGoals(newExpanded);
  };

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
    <div className="rounded-3xl overflow-hidden bg-white shadow-ios border border-gray-100">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-100">
            <TableHead className="w-8"></TableHead>
            <TableHead className="font-semibold text-gray-900">Goal</TableHead>
            <TableHead className="font-semibold text-gray-900">Status</TableHead>
            <TableHead className="font-semibold text-gray-900">Type</TableHead>
            <TableHead className="font-semibold text-gray-900">Priority</TableHead>
            <TableHead className="font-semibold text-gray-900">Target Date</TableHead>
            <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goals?.map((goal) => {
            const isExpanded = expandedGoals.has(goal.id);
            const smartData = goal.ai_suggestions?.smart_breakdown;
            const isSmartGoal = smartData && Object.values(smartData).some(value => value && value.trim().length > 0);

            return (
              <Collapsible key={goal.id} open={isExpanded} onOpenChange={() => toggleGoal(goal.id)}>
                <CollapsibleTrigger asChild>
                  <TableRow className="hover:bg-gray-50 cursor-pointer border-b border-gray-50">
                    <TableCell>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-gray-900">{goal.title}</span>
                        {goal.ai_enhanced && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Sparkles className="h-3 w-3 text-blue-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>AI Enhanced</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(goal.status)}>
                        {goal.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{goal.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(goal.priority)}>
                        {goal.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {goal.target_date ? (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {new Date(goal.target_date).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-gray-400">No date</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(goal);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(goal.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </CollapsibleTrigger>

                <CollapsibleContent asChild>
                  <TableRow>
                    <TableCell colSpan={7} className="p-0">
                      <div className="p-6 bg-gray-50 border-t border-gray-100">
                        {isSmartGoal ? (
                          <SmartGoalDisplay
                            smartData={smartData}
                            title={goal.title}
                            status={goal.status}
                            targetDate={goal.target_date}
                            getStatusColor={getStatusColor}
                          />
                        ) : (
                          <div className="space-y-4">
                            {goal.description && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                                <p className="text-sm text-gray-600 whitespace-pre-line">{goal.description}</p>
                              </div>
                            )}
                            
                            <div className="flex flex-wrap gap-2">
                              {goal.pillars && (
                                <Badge variant="secondary">{goal.pillars.name}</Badge>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
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
                      </div>
                    </TableCell>
                  </TableRow>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
