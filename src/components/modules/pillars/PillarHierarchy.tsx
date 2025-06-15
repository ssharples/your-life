
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { PillarCard } from './components/PillarCard';

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
        <PillarCard
          key={pillar.id}
          pillar={pillar}
          getStatusColor={getStatusColor}
          getPriorityColor={getPriorityColor}
          expandedPillars={expandedPillars}
          expandedValues={expandedValues}
          expandedGoals={expandedGoals}
          expandedProjects={expandedProjects}
          togglePillar={togglePillar}
          toggleValue={toggleValue}
          toggleGoal={toggleGoal}
          toggleProject={toggleProject}
        />
      ))}
    </div>
  );
};
