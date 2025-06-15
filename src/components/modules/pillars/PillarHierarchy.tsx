
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronRight, 
  Building2, 
  Heart, 
  Target, 
  Clock, 
  FolderOpen, 
  CheckSquare,
  Circle
} from 'lucide-react';

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

interface PillarHierarchyProps {
  pillarsData: Pillar[];
}

export const PillarHierarchy = ({ pillarsData }: PillarHierarchyProps) => {
  const [expandedPillars, setExpandedPillars] = useState<Set<string>>(new Set());
  const [expandedValues, setExpandedValues] = useState<Set<string>>(new Set());
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  const togglePillar = (pillarId: string) => {
    const newExpanded = new Set(expandedPillars);
    if (newExpanded.has(pillarId)) {
      newExpanded.delete(pillarId);
    } else {
      newExpanded.add(pillarId);
    }
    setExpandedPillars(newExpanded);
  };

  const toggleValue = (valueId: string) => {
    const newExpanded = new Set(expandedValues);
    if (newExpanded.has(valueId)) {
      newExpanded.delete(valueId);
    } else {
      newExpanded.add(valueId);
    }
    setExpandedValues(newExpanded);
  };

  const toggleGoal = (goalId: string) => {
    const newExpanded = new Set(expandedGoals);
    if (newExpanded.has(goalId)) {
      newExpanded.delete(goalId);
    } else {
      newExpanded.add(goalId);
    }
    setExpandedGoals(newExpanded);
  };

  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!pillarsData || pillarsData.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Life Pillars Yet</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Start building your life structure by creating your first pillar. Pillars represent the major areas of your life.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {pillarsData.map((pillar) => (
        <Card key={pillar.id} className="overflow-hidden">
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
                      <Card key={value.id} className="border-l-4 border-l-blue-200">
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
                                    <Card key={goal.id} className="border-l-4 border-l-green-200">
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
                                              {goal.habits.length > 0 && (
                                                <div>
                                                  <h6 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    HABITS
                                                  </h6>
                                                  <div className="space-y-1">
                                                    {goal.habits.map((habit) => (
                                                      <div key={habit.id} className="flex items-center justify-between text-xs p-2 bg-muted/30 rounded">
                                                        <div className="flex items-center gap-2">
                                                          <Circle className="h-2 w-2 fill-current text-orange-500" />
                                                          <span>{habit.title}</span>
                                                        </div>
                                                        <div className="flex gap-1">
                                                          <Badge className={getStatusColor(habit.status)}>
                                                            {habit.status}
                                                          </Badge>
                                                          {habit.frequency && (
                                                            <Badge className="bg-orange-100 text-orange-800">
                                                              {habit.frequency}
                                                            </Badge>
                                                          )}
                                                        </div>
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                              )}

                                              {goal.projects.length > 0 && (
                                                <div>
                                                  <h6 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                                                    <FolderOpen className="h-3 w-3" />
                                                    PROJECTS
                                                  </h6>
                                                  <div className="space-y-2">
                                                    {goal.projects.map((project) => (
                                                      <Card key={project.id} className="border-l-4 border-l-purple-200">
                                                        <Collapsible 
                                                          open={expandedProjects.has(project.id)} 
                                                          onOpenChange={() => toggleProject(project.id)}
                                                        >
                                                          <CollapsibleTrigger asChild>
                                                            <CardHeader className="cursor-pointer hover:bg-muted/25 transition-colors py-1">
                                                              <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                  <FolderOpen className="h-3 w-3 text-purple-600" />
                                                                  <span className="text-xs font-medium">{project.title}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                  <Badge className={getStatusColor(project.status)}>
                                                                    {project.status}
                                                                  </Badge>
                                                                  <Badge className="bg-purple-100 text-purple-800">
                                                                    {project.tasks.length} tasks
                                                                  </Badge>
                                                                  {expandedProjects.has(project.id) ? (
                                                                    <ChevronDown className="h-2 w-2" />
                                                                  ) : (
                                                                    <ChevronRight className="h-2 w-2" />
                                                                  )}
                                                                </div>
                                                              </div>
                                                            </CardHeader>
                                                          </CollapsibleTrigger>

                                                          <CollapsibleContent>
                                                            <CardContent className="pt-0 pb-1">
                                                              {project.tasks.length === 0 ? (
                                                                <div className="text-center py-2 text-muted-foreground text-xs">
                                                                  <CheckSquare className="h-4 w-4 mx-auto mb-1 opacity-50" />
                                                                  <p>No tasks in this project yet.</p>
                                                                </div>
                                                              ) : (
                                                                <div className="ml-3 space-y-1">
                                                                  {project.tasks.map((task) => (
                                                                    <div key={task.id} className="flex items-center justify-between text-xs p-1 bg-muted/20 rounded">
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
                                                                  ))}
                                                                </div>
                                                              )}
                                                            </CardContent>
                                                          </CollapsibleContent>
                                                        </Collapsible>
                                                      </Card>
                                                    ))}
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          </CardContent>
                                        </CollapsibleContent>
                                      </Collapsible>
                                    </Card>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  );
};
