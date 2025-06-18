
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CalendarDays, Target, BookOpen, CheckCircle } from 'lucide-react';
import { QuickHabitsWidget } from './overview/QuickHabitsWidget';
import { ActiveProjectsWidget } from './overview/ActiveProjectsWidget';
import { ChristianQuoteWidget } from './overview/ChristianQuoteWidget';
import { initializeEssentialHabits } from '@/utils/essentialHabits';

export const Overview = () => {
  // Initialize essential habits when component mounts
  useEffect(() => {
    const initHabits = async () => {
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        await initializeEssentialHabits(user.data.user.id);
      }
    };
    initHabits();
  }, []);

  const { data: stats } = useQuery({
    queryKey: ['overview-stats'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const [goalsResult, journalsResult, habitsResult, tasksResult] = await Promise.all([
        supabase.from('goals').select('*').eq('user_id', user.data.user.id),
        supabase.from('journals').select('*').eq('user_id', user.data.user.id),
        supabase.from('habits').select('*').eq('user_id', user.data.user.id),
        supabase.from('los_tasks').select('*').eq('user_id', user.data.user.id),
      ]);

      const completedGoals = goalsResult.data?.filter(g => g.status === 'completed').length || 0;
      const totalGoals = goalsResult.data?.length || 0;
      const completedTasks = tasksResult.data?.filter(t => t.status === 'completed').length || 0;
      const totalTasks = tasksResult.data?.length || 0;

      return {
        totalGoals,
        completedGoals,
        totalJournals: journalsResult.data?.length || 0,
        totalHabits: habitsResult.data?.length || 0,
        totalTasks,
        completedTasks,
        goalProgress: totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0,
        taskProgress: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      };
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">Your life management dashboard at a glance</p>
      </div>

      {/* Quick Actions Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <QuickHabitsWidget />
        <ChristianQuoteWidget />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalGoals || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.completedGoals || 0} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTasks || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.completedTasks || 0} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Journal Entries</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalJournals || 0}</div>
            <p className="text-xs text-muted-foreground">Total entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Habits</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalHabits || 0}</div>
            <p className="text-xs text-muted-foreground">Being tracked</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Goal Progress</CardTitle>
            <CardDescription>Percentage of goals completed</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={stats?.goalProgress || 0} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round(stats?.goalProgress || 0)}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Completion</CardTitle>
            <CardDescription>Percentage of tasks completed</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={stats?.taskProgress || 0} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round(stats?.taskProgress || 0)}% complete
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Projects */}
      <ActiveProjectsWidget />
    </div>
  );
};
