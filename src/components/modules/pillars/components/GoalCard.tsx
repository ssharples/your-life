
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Target, Clock, FolderOpen } from 'lucide-react';
import { HabitItem } from './HabitItem';
import { ProjectCard } from './ProjectCard';

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

interface GoalCardProps {
  goal: Goal;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
  expandedGoals: Set<string>;
  expandedProjects: Set<string>;
  toggleGoal: (goalId: string) => void;
  toggleProject: (projectId: string) => void;
}

export const GoalCard = ({ 
  goal, 
  getStatusColor, 
  getPriorityColor, 
  expandedGoals, 
  expandedProjects, 
  toggleGoal, 
  toggleProject 
}: GoalCardProps) => {
  return (
    <Card className="border-l-4 border-l-green-200">
      <Collapsible 
        open={expandedGoals.has(goal.id)} 
        onOpenChange={() => toggleGoal(goal.id)}
      >
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/25 transition-colors py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-3 w-3 text-green-600" />
                <span className="text-sm font-medium">{goal.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(goal.status)}>
                  {goal.status}
                </Badge>
                <Badge variant="outline">
                  {goal.habits.length + goal.projects.length} items
                </Badge>
                {expandedGoals.has(goal.id) ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 pb-2">
            <div className="ml-4 space-y-3">
              {/* Habits */}
              {goal.habits.length > 0 && (
                <div>
                  <h6 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    HABITS
                  </h6>
                  <div className="space-y-1">
                    {goal.habits.map((habit) => (
                      <HabitItem
                        key={habit.id}
                        habit={habit}
                        getStatusColor={getStatusColor}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {goal.projects.length > 0 && (
                <div>
                  <h6 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                    <FolderOpen className="h-3 w-3" />
                    PROJECTS
                  </h6>
                  <div className="space-y-2">
                    {goal.projects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        getStatusColor={getStatusColor}
                        getPriorityColor={getPriorityColor}
                        expandedProjects={expandedProjects}
                        toggleProject={toggleProject}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
