
import { useMemo } from 'react';

interface PillarStatsData {
  totalPillars: number;
  totalValues: number;
  totalGoals: number;
  activeGoals: number;
  totalHabits: number;
  activeHabits: number;
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

export const usePillarStats = (hierarchyData: any[] | undefined): PillarStatsData => {
  return useMemo(() => {
    if (!hierarchyData) {
      return {
        totalPillars: 0, totalValues: 0, totalGoals: 0, activeGoals: 0,
        totalHabits: 0, activeHabits: 0, totalProjects: 0, activeProjects: 0,
        totalTasks: 0, completedTasks: 0, pendingTasks: 0
      };
    }

    return {
      totalPillars: hierarchyData.length,
      totalValues: hierarchyData.reduce((sum, pillar) => sum + pillar.values.length, 0),
      totalGoals: hierarchyData.reduce((sum, pillar) => 
        sum + pillar.values.reduce((valueSum: number, value: any) => valueSum + value.goals.length, 0), 0),
      activeGoals: hierarchyData.reduce((sum, pillar) => 
        sum + pillar.values.reduce((valueSum: number, value: any) => 
          valueSum + value.goals.filter((goal: any) => goal.status === 'active').length, 0), 0),
      totalHabits: hierarchyData.reduce((sum, pillar) => 
        sum + pillar.values.reduce((valueSum: number, value: any) => 
          valueSum + value.goals.reduce((goalSum: number, goal: any) => goalSum + goal.habits.length, 0), 0), 0),
      activeHabits: hierarchyData.reduce((sum, pillar) => 
        sum + pillar.values.reduce((valueSum: number, value: any) => 
          valueSum + value.goals.reduce((goalSum: number, goal: any) => 
            goalSum + goal.habits.filter((habit: any) => habit.status === 'active').length, 0), 0), 0),
      totalProjects: hierarchyData.reduce((sum, pillar) => 
        sum + pillar.values.reduce((valueSum: number, value: any) => 
          valueSum + value.goals.reduce((goalSum: number, goal: any) => goalSum + goal.projects.length, 0), 0), 0),
      activeProjects: hierarchyData.reduce((sum, pillar) => 
        sum + pillar.values.reduce((valueSum: number, value: any) => 
          valueSum + value.goals.reduce((goalSum: number, goal: any) => 
            goalSum + goal.projects.filter((project: any) => project.status === 'active').length, 0), 0), 0),
      totalTasks: hierarchyData.reduce((sum, pillar) => 
        sum + pillar.values.reduce((valueSum: number, value: any) => 
          valueSum + value.goals.reduce((goalSum: number, goal: any) => 
            goalSum + goal.projects.reduce((projectSum: number, project: any) => projectSum + project.tasks.length, 0), 0), 0), 0),
      completedTasks: hierarchyData.reduce((sum, pillar) => 
        sum + pillar.values.reduce((valueSum: number, value: any) => 
          valueSum + value.goals.reduce((goalSum: number, goal: any) => 
            goalSum + goal.projects.reduce((projectSum: number, project: any) => 
              projectSum + project.tasks.filter((task: any) => task.status === 'completed').length, 0), 0), 0), 0),
      pendingTasks: hierarchyData.reduce((sum, pillar) => 
        sum + pillar.values.reduce((valueSum: number, value: any) => 
          valueSum + value.goals.reduce((goalSum: number, goal: any) => 
            goalSum + goal.projects.reduce((projectSum: number, project: any) => 
              projectSum + project.tasks.filter((task: any) => task.status === 'pending').length, 0), 0), 0), 0)
    };
  }, [hierarchyData]);
};
