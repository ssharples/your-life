
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Building2, Heart } from 'lucide-react';
import { ValueCard } from './ValueCard';

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

interface Pillar {
  id: string;
  name: string;
  description?: string;
  values: Value[];
}

interface PillarCardProps {
  pillar: Pillar;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
  expandedPillars: Set<string>;
  expandedValues: Set<string>;
  expandedGoals: Set<string>;
  expandedProjects: Set<string>;
  togglePillar: (pillarId: string) => void;
  toggleValue: (valueId: string) => void;
  toggleGoal: (goalId: string) => void;
  toggleProject: (projectId: string) => void;
}

export const PillarCard = ({ 
  pillar, 
  getStatusColor, 
  getPriorityColor, 
  expandedPillars, 
  expandedValues, 
  expandedGoals, 
  expandedProjects, 
  togglePillar, 
  toggleValue, 
  toggleGoal, 
  toggleProject 
}: PillarCardProps) => {
  return (
    <Card className="overflow-hidden">
      <Collapsible 
        open={expandedPillars.has(pillar.id)} 
        onOpenChange={() => togglePillar(pillar.id)}
      >
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">{pillar.name}</CardTitle>
                  {pillar.description && (
                    <p className="text-sm text-muted-foreground mt-1">{pillar.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {pillar.values.length} values
                </Badge>
                {expandedPillars.has(pillar.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            {pillar.values.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No values defined for this pillar yet.</p>
              </div>
            ) : (
              <div className="space-y-3 ml-6">
                {pillar.values.map((value) => (
                  <ValueCard
                    key={value.id}
                    value={value}
                    getStatusColor={getStatusColor}
                    getPriorityColor={getPriorityColor}
                    expandedValues={expandedValues}
                    expandedGoals={expandedGoals}
                    expandedProjects={expandedProjects}
                    toggleValue={toggleValue}
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
