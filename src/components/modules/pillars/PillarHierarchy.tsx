import { useState } from 'react';
import { IOSLayout } from '@/components/ios/IOSLayout';
import { IOSCard } from '@/components/ios/IOSCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Heart, Target, FolderOpen, CheckSquare, Clock, ChevronDown, ChevronRight } from 'lucide-react';

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
      <IOSLayout>
        <IOSCard padding="lg">
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900">No Life Pillars Yet</h3>
            <p className="text-gray-600 leading-relaxed">
              Start building your life structure by creating your first pillar. Pillars represent the major areas of your life.
            </p>
          </div>
        </IOSCard>
      </IOSLayout>
    );
  }

  return (
    <IOSLayout>
      <div className="space-y-6">
        {pillarsData.map((pillar) => (
          <IOSCard key={pillar.id} padding="lg">
            <Button
              variant="ghost"
              onClick={() => togglePillar(pillar.id)}
              className="w-full justify-between p-0 h-auto font-normal hover:bg-transparent mb-4"
            >
              <div className="flex items-start gap-4 text-left">
                <Building2 className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{pillar.name}</h3>
                  {pillar.description && (
                    <p className="text-sm text-gray-600">{pillar.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Badge variant="secondary" className="text-xs">
                  {pillar.values.length} values
                </Badge>
                {expandedPillars.has(pillar.id) ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </Button>

            {expandedPillars.has(pillar.id) && (
              <div className="space-y-4 pl-6">
                {pillar.values.length === 0 ? (
                  <IOSCard padding="lg">
                    <div className="text-center py-8">
                      <Heart className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                      <p className="text-gray-600">No values defined for this pillar yet.</p>
                    </div>
                  </IOSCard>
                ) : (
                  pillar.values.map((value) => (
                    <IOSCard key={value.id} padding="lg">
                      <Button
                        variant="ghost"
                        onClick={() => toggleValue(value.id)}
                        className="w-full justify-between p-0 h-auto font-normal hover:bg-transparent mb-4"
                      >
                        <div className="flex items-start gap-3 text-left">
                          <Heart className="h-5 w-5 text-pink-500 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-gray-900 text-base mb-1">{value.title}</h4>
                            {value.description && (
                              <p className="text-sm text-gray-600">{value.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant="outline" className="text-xs">
                            {value.goals.length} goals
                          </Badge>
                          {expandedValues.has(value.id) ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                      </Button>

                      {expandedValues.has(value.id) && (
                        <div className="space-y-4 pl-6">
                          {value.goals.length === 0 ? (
                            <IOSCard padding="md">
                              <div className="text-center py-6">
                                <Target className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm text-gray-600">No goals set for this value yet.</p>
                              </div>
                            </IOSCard>
                          ) : (
                            value.goals.map((goal) => (
                              <IOSCard key={goal.id} padding="md">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <Target className="h-4 w-4 text-green-500" />
                                    <span className="text-sm font-medium text-gray-900">{goal.title}</span>
                                  </div>
                                  <Badge className={getStatusColor(goal.status)}>
                                    {goal.status}
                                  </Badge>
                                </div>
                                
                                {(goal.habits.length > 0 || goal.projects.length > 0) && (
                                  <div className="space-y-3">
                                    {goal.habits.map((habit) => (
                                      <IOSCard key={habit.id} padding="sm">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-orange-500" />
                                            <span className="text-sm text-gray-900">{habit.title}</span>
                                          </div>
                                          <Badge className={getStatusColor(habit.status)}>
                                            {habit.status}
                                          </Badge>
                                        </div>
                                      </IOSCard>
                                    ))}
                                    
                                    {goal.projects.map((project) => (
                                      <IOSCard key={project.id} padding="sm">
                                        <div className="flex items-center justify-between mb-3">
                                          <div className="flex items-center gap-2">
                                            <FolderOpen className="h-4 w-4 text-purple-500" />
                                            <span className="text-sm font-medium text-gray-900">{project.title}</span>
                                          </div>
                                          <Badge className={getStatusColor(project.status)}>
                                            {project.status}
                                          </Badge>
                                        </div>
                                        
                                        {project.tasks.length > 0 && (
                                          <div className="space-y-2 pl-4">
                                            {project.tasks.map((task) => (
                                              <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                <div className="flex items-center gap-2">
                                                  <CheckSquare className="h-3 w-3 text-purple-500" />
                                                  <span className="text-xs text-gray-900">{task.title}</span>
                                                </div>
                                                <Badge className={getStatusColor(task.status)}>
                                                  {task.status}
                                                </Badge>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </IOSCard>
                                    ))}
                                  </div>
                                )}
                              </IOSCard>
                            ))
                          )}
                        </div>
                      )}
                    </IOSCard>
                  ))
                )}
              </div>
            )}
          </IOSCard>
        ))}
      </div>
    </IOSLayout>
  );
};
