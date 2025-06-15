
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Heart, Target } from 'lucide-react';
import { GoalCard } from './GoalCard';

interface Task {
  id: string;
  title: string;
  status: string;
  priority?: string;
}

interface Project {
  id: string;
  title: string;
  status: string;
  tasks: Task[];
}

interface Habit {
  id: string;
  title: string;
  status: string;
  frequency?: string;
}

interface Goal {
  id: string;
  title: string;
  status: string;
  target_date?: string;
  habits: Habit[];
  projects: Project[];
}

interface Value {
  id: string;
  title: string;
  description?: string;
  goals: Goal[];
}

interface ValueCardProps {
  value: Value;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
  expandedValues: Set<string>;
  expandedGoals: Set<string>;
  expandedProjects: Set<string>;
  toggleValue: (valueId: string) => void;
  toggleGoal: (goalId: string) => void;
  toggleProject: (projectId: string) => void;
}

export const ValueCard = ({ 
  value, 
  getStatusColor, 
  getPriorityColor, 
  expandedValues, 
  expandedGoals, 
  expandedProjects, 
  toggleValue, 
  toggleGoal, 
  toggleProject 
}: ValueCardProps) => {
  return (
    <Card className="border-l-4 border-l-blue-200">
      <Collapsible 
        open={expandedValues.has(value.id)} 
        onOpenChange={() => toggleValue(value.id)}
      >
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/25 transition-colors py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="h-4 w-4 text-blue-600" />
                <div>
                  <h4 className="font-medium">{value.title}</h4>
                  {value.description && (
                    <p className="text-xs text-muted-foreground mt-1">{value.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {value.goals.length} goals
                </Badge>
                {expandedValues.has(value.id) ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 pb-3">
            {value.goals.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                <Target className="h-6 w-6 mx-auto mb-1 opacity-50" />
                <p>No goals set for this value yet.</p>
              </div>
            ) : (
              <div className="space-y-2 ml-4">
                {value.goals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    getStatusColor={getStatusColor}
                    getPriorityColor={getPriorityColor}
                    expandedGoals={expandedGoals}
                    expandedProjects={expandedProjects}
                    toggleGoal={toggleGoal}
                    toggleProject={toggleProject}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
