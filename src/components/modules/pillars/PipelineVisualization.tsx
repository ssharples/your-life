
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Heart, Target, FolderOpen, CheckSquare, ArrowDown, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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

interface PipelineVisualizationProps {
  pillarsData: Pillar[];
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
}

export const PipelineVisualization = ({ 
  pillarsData, 
  getStatusColor, 
  getPriorityColor 
}: PipelineVisualizationProps) => {
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const [showAllConnections, setShowAllConnections] = useState(false);

  const getConnectionStats = (pillar: Pillar) => {
    const totalValues = pillar.values.length;
    const totalGoals = pillar.values.reduce((sum, value) => sum + value.goals.length, 0);
    const activeGoals = pillar.values.reduce((sum, value) => 
      sum + value.goals.filter(goal => goal.status === 'active').length, 0);
    const totalProjects = pillar.values.reduce((sum, value) => 
      sum + value.goals.reduce((goalSum, goal) => goalSum + goal.projects.length, 0), 0);
    const totalTasks = pillar.values.reduce((sum, value) => 
      sum + value.goals.reduce((goalSum, goal) => 
        goalSum + goal.projects.reduce((projSum, project) => projSum + project.tasks.length, 0), 0), 0);
    const completedTasks = pillar.values.reduce((sum, value) => 
      sum + value.goals.reduce((goalSum, goal) => 
        goalSum + goal.projects.reduce((projSum, project) => 
          projSum + project.tasks.filter(task => task.status === 'completed').length, 0), 0), 0);

    return { totalValues, totalGoals, activeGoals, totalProjects, totalTasks, completedTasks };
  };

  const renderPipelineFlow = (pillar: Pillar) => {
    const stats = getConnectionStats(pillar);
    
    return (
      <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border">
        {/* Pipeline Header */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">{pillar.name} Pipeline</h3>
          <p className="text-sm text-gray-600">Complete flow from life pillar to actionable tasks</p>
        </div>

        {/* Pipeline Flow */}
        <div className="flex flex-col items-center space-y-6">
          {/* Pillar Level */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-2">
              <Building2 className="h-8 w-8" />
            </div>
            <Badge className="bg-blue-100 text-blue-800 mb-1">PILLAR</Badge>
            <p className="text-sm font-medium text-center">{pillar.name}</p>
          </div>

          <ArrowDown className="h-6 w-6 text-gray-400" />

          {/* Values Level */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-14 h-14 bg-red-500 text-white rounded-full mb-2">
              <Heart className="h-6 w-6" />
            </div>
            <Badge className="bg-red-100 text-red-800 mb-1">VALUES</Badge>
            <p className="text-sm text-center">{stats.totalValues} core values</p>
            {showAllConnections && (
              <div className="mt-2 grid grid-cols-1 gap-1 max-w-xs">
                {pillar.values.slice(0, 3).map(value => (
                  <div key={value.id} className="text-xs bg-red-50 px-2 py-1 rounded text-center">
                    {value.title}
                  </div>
                ))}
                {pillar.values.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{pillar.values.length - 3} more
                  </div>
                )}
              </div>
            )}
          </div>

          <ArrowDown className="h-6 w-6 text-gray-400" />

          {/* Goals Level */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-14 h-14 bg-green-600 text-white rounded-full mb-2">
              <Target className="h-6 w-6" />
            </div>
            <Badge className="bg-green-100 text-green-800 mb-1">GOALS</Badge>
            <p className="text-sm text-center">{stats.activeGoals}/{stats.totalGoals} active goals</p>
          </div>

          <ArrowDown className="h-6 w-6 text-gray-400" />

          {/* Projects Level */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-14 h-14 bg-purple-600 text-white rounded-full mb-2">
              <FolderOpen className="h-6 w-6" />
            </div>
            <Badge className="bg-purple-100 text-purple-800 mb-1">PROJECTS</Badge>
            <p className="text-sm text-center">{stats.totalProjects} projects</p>
          </div>

          <ArrowDown className="h-6 w-6 text-gray-400" />

          {/* Tasks Level */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-14 h-14 bg-orange-600 text-white rounded-full mb-2">
              <CheckSquare className="h-6 w-6" />
            </div>
            <Badge className="bg-orange-100 text-orange-800 mb-1">TASKS</Badge>
            <p className="text-sm text-center">{stats.completedTasks}/{stats.totalTasks} completed</p>
          </div>
        </div>

        {/* Pipeline Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {Math.round((stats.completedTasks / Math.max(stats.totalTasks, 1)) * 100)}%
            </div>
            <div className="text-xs text-gray-600">Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {stats.activeGoals}
            </div>
            <div className="text-xs text-gray-600">Active Goals</div>
          </div>
        </div>
      </div>
    );
  };

  if (!pillarsData || pillarsData.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Pipeline Data</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Create pillars, values, and goals to see your life pipeline visualization.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Pipeline Visualization</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAllConnections(!showAllConnections)}
        >
          {showAllConnections ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Hide Details
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Show Details
            </>
          )}
        </Button>
      </div>

      {/* Pillar Selection */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pillarsData.map((pillar) => {
          const stats = getConnectionStats(pillar);
          const isSelected = selectedPillar === pillar.id;
          
          return (
            <Card 
              key={pillar.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedPillar(isSelected ? null : pillar.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-base">{pillar.name}</CardTitle>
                  </div>
                  <ArrowRight className={`h-4 w-4 transition-transform ${
                    isSelected ? 'rotate-90' : ''
                  }`} />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-900">{stats.totalValues}</div>
                    <div className="text-gray-500">Values</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{stats.activeGoals}</div>
                    <div className="text-gray-500">Active Goals</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{stats.totalProjects}</div>
                    <div className="text-gray-500">Projects</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{stats.completedTasks}/{stats.totalTasks}</div>
                    <div className="text-gray-500">Tasks Done</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Pillar Pipeline */}
      {selectedPillar && (
        <Collapsible open={true}>
          <CollapsibleContent>
            {renderPipelineFlow(pillarsData.find(p => p.id === selectedPillar)!)}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};
