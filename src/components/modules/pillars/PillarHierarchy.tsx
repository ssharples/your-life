
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Heart, Target, Clock, FolderOpen, CheckSquare, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface PillarData {
  id: string;
  name: string;
  description?: string;
  values: ValueData[];
}

interface ValueData {
  id: string;
  value: string;
  importance_rating: number;
  goals: GoalData[];
}

interface GoalData {
  id: string;
  title: string;
  type: string;
  status: string;
  habits: HabitData[];
  projects: ProjectData[];
}

interface HabitData {
  id: string;
  title: string;
  frequency: string;
  status: string;
}

interface ProjectData {
  id: string;
  title: string;
  status: string;
  tasks: TaskData[];
}

interface TaskData {
  id: string;
  description: string;
  status: string;
  priority: number;
}

interface PillarHierarchyProps {
  pillarsData: PillarData[];
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
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return 'bg-red-100 text-red-800';
    if (priority >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  if (pillarsData.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hierarchy data available</h3>
          <p className="text-muted-foreground">
            Create pillars, values, goals, and other items to see your life hierarchy.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {pillarsData.map((pillar) => (
        <Card key={pillar.id} className="border-2 border-blue-200">
          <Collapsible
            open={expandedPillars.has(pillar.id)}
            onOpenChange={() => togglePillar(pillar.id)}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <span className="text-lg">{pillar.name}</span>
                    <Badge variant="outline">{pillar.values.length} values</Badge>
                  </div>
                  {expandedPillars.has(pillar.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CardTitle>
                {pillar.description && (
                  <p className="text-sm text-muted-foreground">{pillar.description}</p>
                )}
              </CardHeader>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="ml-6 space-y-3">
                  {pillar.values.map((value) => (
                    <Card key={value.id} className="border border-purple-200">
                      <Collapsible
                        open={expandedValues.has(value.id)}
                        onOpenChange={() => toggleValue(value.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors py-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Heart className="h-4 w-4 text-purple-600" />
                                <span className="font-medium">{value.value}</span>
                                <Badge variant="secondary">★{value.importance_rating}/10</Badge>
                                <Badge variant="outline">{value.goals.length} goals</Badge>
                              </div>
                              {expandedValues.has(value.id) ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <ChevronRight className="h-3 w-3" />
                              )}
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <CardContent className="pt-0">
                            <div className="ml-6 space-y-3">
                              {value.goals.map((goal) => (
                                <Card key={goal.id} className="border border-green-200">
                                  <Collapsible
                                    open={expandedGoals.has(goal.id)}
                                    onOpenChange={() => toggleGoal(goal.id)}
                                  >
                                    <CollapsibleTrigger asChild>
                                      <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors py-3">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <Target className="h-4 w-4 text-green-600" />
                                            <span className="font-medium">{goal.title}</span>
                                            <Badge className={getStatusColor(goal.status)}>{goal.status}</Badge>
                                            <Badge variant="outline">{goal.type}</Badge>
                                            <Badge variant="outline">{goal.habits.length} habits</Badge>
                                            <Badge variant="outline">{goal.projects.length} projects</Badge>
                                          </div>
                                          {expandedGoals.has(goal.id) ? (
                                            <ChevronDown className="h-3 w-3" />
                                          ) : (
                                            <ChevronRight className="h-3 w-3" />
                                          )}
                                        </div>
                                      </CardHeader>
                                    </CollapsibleTrigger>
                                    
                                    <CollapsibleContent>
                                      <CardContent className="pt-0">
                                        <div className="ml-6 space-y-4">
                                          {/* Habits Section */}
                                          {goal.habits.length > 0 && (
                                            <div>
                                              <h4 className="text-sm font-semibold text-orange-600 mb-2 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                Habits ({goal.habits.length})
                                              </h4>
                                              <div className="space-y-2">
                                                {goal.habits.map((habit) => (
                                                  <div key={habit.id} className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                                                    <Clock className="h-3 w-3 text-orange-500" />
                                                    <span className="text-sm">{habit.title}</span>
                                                    <Badge className={getStatusColor(habit.status)} size="sm">{habit.status}</Badge>
                                                    <Badge variant="outline" size="sm">{habit.frequency}</Badge>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                          
                                          {/* Projects Section */}
                                          {goal.projects.length > 0 && (
                                            <div>
                                              <h4 className="text-sm font-semibold text-indigo-600 mb-2 flex items-center gap-1">
                                                <FolderOpen className="h-3 w-3" />
                                                Projects ({goal.projects.length})
                                              </h4>
                                              <div className="space-y-2">
                                                {goal.projects.map((project) => (
                                                  <Card key={project.id} className="border border-indigo-200">
                                                    <Collapsible
                                                      open={expandedProjects.has(project.id)}
                                                      onOpenChange={() => toggleProject(project.id)}
                                                    >
                                                      <CollapsibleTrigger asChild>
                                                        <div className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-50">
                                                          <div className="flex items-center gap-2">
                                                            <FolderOpen className="h-3 w-3 text-indigo-500" />
                                                            <span className="text-sm font-medium">{project.title}</span>
                                                            <Badge className={getStatusColor(project.status)} size="sm">{project.status}</Badge>
                                                            <Badge variant="outline" size="sm">{project.tasks.length} tasks</Badge>
                                                          </div>
                                                          {expandedProjects.has(project.id) ? (
                                                            <ChevronDown className="h-3 w-3" />
                                                          ) : (
                                                            <ChevronRight className="h-3 w-3" />
                                                          )}
                                                        </div>
                                                      </CollapsibleTrigger>
                                                      
                                                      <CollapsibleContent>
                                                        <div className="p-2 pt-0">
                                                          <div className="ml-4 space-y-1">
                                                            {project.tasks.map((task) => (
                                                              <div key={task.id} className="flex items-center gap-2 p-1 bg-gray-50 rounded text-xs">
                                                                <CheckSquare className="h-3 w-3 text-gray-500" />
                                                                <span className="flex-1">{task.description}</span>
                                                                <Badge className={getStatusColor(task.status)} size="sm">{task.status}</Badge>
                                                                <Badge className={getPriorityColor(task.priority)} size="sm">P{task.priority}</Badge>
                                                              </div>
                                                            ))}
                                                          </div>
                                                        </div>
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
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  );
};
