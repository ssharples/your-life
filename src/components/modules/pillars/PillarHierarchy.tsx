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
      <div className="space-y-4">
        {pillarsData.map((pillar) => (
          <IOSCard key={pillar.id} padding="none">
            <div className="p-5">
              <Button
                variant="ghost"
                onClick={() => togglePillar(pillar.id)}
                className="w-full justify-between p-0 h-auto font-normal hover:bg-transparent"
              >
                <div className="flex items-start gap-3 text-left">
                  <Building2 className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base mb-1">{pillar.name}</h3>
                    {pillar.description && (
                      <p className="text-sm text-gray-600">{pillar.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="secondary" className="text-xs">
                    {pillar.values.length} values
                  </Badge>
                  {expandedPillars.has(pillar.id) ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                </div>
              </Button>
            </div>

            {expandedPillars.has(pillar.id) && (
              <div className="border-t border-gray-100 bg-gray-50 p-5 space-y-4">
                {pillar.values.length === 0 ? (
                  <div className="text-center py-6">
                    <Heart className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600">No values defined for this pillar yet.</p>
                  </div>
                ) : (
                  pillar.values.map((value) => (
                    <div key={value.id} className="bg-white rounded-xl p-4 shadow-sm">
                      <Button
                        variant="ghost"
                        onClick={() => toggleValue(value.id)}
                        className="w-full justify-between p-0 h-auto font-normal hover:bg-transparent mb-3"
                      >
                        <div className="flex items-start gap-3 text-left">
                          <Heart className="h-4 w-4 text-pink-500 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-gray-900">{value.title}</h4>
                            {value.description && (
                              <p className="text-sm text-gray-600 mt-1">{value.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant="outline" className="text-xs">
                            {value.goals.length} goals
                          </Badge>
                          {expandedValues.has(value.id) ? (
                            <ChevronDown className="h-3 w-3 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-3 w-3 text-gray-500" />
                          )}
                        </div>
                      </Button>

                      {expandedValues.has(value.id) && (
                        <div className="space-y-3 pl-7">
                          {value.goals.length === 0 ? (
                            <div className="text-center py-4">
                              <Target className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                              <p className="text-sm text-gray-600">No goals set for this value yet.</p>
                            </div>
                          ) : (
                            value.goals.map((goal) => (
                              <div key={goal.id} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Target className="h-3 w-3 text-green-500" />
                                    <span className="text-sm font-medium text-gray-900">{goal.title}</span>
                                  </div>
                                  <Badge className={getStatusColor(goal.status)} size="sm">
                                    {goal.status}
                                  </Badge>
                                </div>
                                
                                {(goal.habits.length > 0 || goal.projects.length > 0) && (
                                  <div className="mt-3 space-y-2">
                                    {goal.habits.map((habit) => (
                                      <div key={habit.id} className="flex items-center justify-between bg-white rounded p-2 text-xs">
                                        <div className="flex items-center gap-2">
                                          <Clock className="h-3 w-3 text-orange-500" />
                                          <span className="text-gray-900">{habit.title}</span>
                                        </div>
                                        <Badge className={getStatusColor(habit.status)} size="sm">
                                          {habit.status}
                                        </Badge>
                                      </div>
                                    ))}
                                    
                                    {goal.projects.map((project) => (
                                      <div key={project.id} className="bg-white rounded p-2">
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center gap-2">
                                            <FolderOpen className="h-3 w-3 text-purple-500" />
                                            <span className="text-xs font-medium text-gray-900">{project.title}</span>
                                          </div>
                                          <Badge className={getStatusColor(project.status)} size="sm">
                                            {project.status}
                                          </Badge>
                                        </div>
                                        
                                        {project.tasks.map((task) => (
                                          <div key={task.id} className="flex items-center justify-between bg-gray-50 rounded p-1 text-xs ml-5 mt-1">
                                            <div className="flex items-center gap-1">
                                              <CheckSquare className="h-2 w-2 text-purple-500" />
                                              <span className="text-gray-900">{task.title}</span>
                                            </div>
                                            <Badge className={getStatusColor(task.status)} size="sm">
                                              {task.status}
                                            </Badge>
                                          </div>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
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
