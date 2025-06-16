
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { TrendingUp, Calendar, Target, Percent } from 'lucide-react';

interface HabitAnalyticsProps {
  habits: any[];
  logs: any[];
}

export const HabitAnalytics = ({ habits, logs }: HabitAnalyticsProps) => {
  // Calculate completion rates for each habit
  const habitStats = habits.map(habit => {
    const habitLogs = logs.filter(log => log.habit_id === habit.id);
    const successfulLogs = habitLogs.filter(log => 
      (habit.type === 'do' && log.completed) || 
      (habit.type === 'dont' && !log.completed)
    );
    
    const completionRate = habitLogs.length > 0 
      ? (successfulLogs.length / habitLogs.length) * 100 
      : 0;

    return {
      ...habit,
      totalLogs: habitLogs.length,
      successfulLogs: successfulLogs.length,
      completionRate: Math.round(completionRate)
    };
  });

  // Generate daily completion data for the last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  const dailyCompletionData = last30Days.map(date => {
    const dayLogs = logs.filter(log => log.date === date);
    const successfulLogs = dayLogs.filter(log => {
      const habit = habits.find(h => h.id === log.habit_id);
      return habit && (
        (habit.type === 'do' && log.completed) || 
        (habit.type === 'dont' && !log.completed)
      );
    });

    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      completion: dayLogs.length > 0 ? Math.round((successfulLogs.length / dayLogs.length) * 100) : 0,
      total: dayLogs.length
    };
  });

  const chartConfig = {
    completion: {
      label: "Completion Rate",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Completion</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {habitStats.length > 0 
                ? Math.round(habitStats.reduce((sum, habit) => sum + habit.completionRate, 0) / habitStats.length)
                : 0}%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Habit</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {habitStats.length > 0 
                ? habitStats.reduce((best, current) => 
                    current.completionRate > best.completionRate ? current : best
                  ).title.substring(0, 20) + (habitStats.reduce((best, current) => 
                    current.completionRate > best.completionRate ? current : best
                  ).title.length > 20 ? '...' : '')
                : 'No data'
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dailyCompletionData.slice(-7).reduce((sum, day) => sum + day.completion, 0) / 7}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completion Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>30-Day Completion Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart data={dailyCompletionData}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="completion" 
                stroke="var(--color-completion)" 
                strokeWidth={2}
                dot={{ fill: "var(--color-completion)" }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Individual Habit Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Habit Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {habitStats.map(habit => (
              <div key={habit.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{habit.title}</h4>
                    <Badge variant={habit.type === 'do' ? 'default' : 'destructive'}>
                      {habit.type === 'do' ? 'Do' : "Don't"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {habit.successfulLogs} successful out of {habit.totalLogs} total logs
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{habit.completionRate}%</div>
                  <div className="text-sm text-muted-foreground">completion rate</div>
                </div>
              </div>
            ))}
            
            {habitStats.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No habits to analyze yet. Create some habits to see your performance!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
