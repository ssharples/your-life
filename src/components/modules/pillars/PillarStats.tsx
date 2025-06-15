
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Heart, Target, Clock, FolderOpen, CheckSquare, TrendingUp } from 'lucide-react';

interface PillarStatsProps {
  stats: {
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
  };
}

export const PillarStats = ({ stats }: PillarStatsProps) => {
  const completionRate = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;
  const activeGoalRate = stats.totalGoals > 0 ? Math.round((stats.activeGoals / stats.totalGoals) * 100) : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Life Structure</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPillars}</div>
          <p className="text-xs text-muted-foreground">
            Pillars with {stats.totalValues} values
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Goals Progress</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeGoals}/{stats.totalGoals}</div>
          <p className="text-xs text-muted-foreground">
            {activeGoalRate}% goals active
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Work</CardTitle>
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeProjects}</div>
          <p className="text-xs text-muted-foreground">
            Projects, {stats.activeHabits} habits
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.completedTasks}/{stats.totalTasks} tasks done
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
