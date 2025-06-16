
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Trophy, Target, Calendar } from 'lucide-react';

interface HabitStreaksProps {
  habits: any[];
  logs: any[];
}

export const HabitStreaks = ({ habits, logs }: HabitStreaksProps) => {
  const calculateStreaks = (habit: any) => {
    const habitLogs = logs
      .filter(log => log.habit_id === habit.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate current streak
    const today = new Date();
    for (let i = 0; i < habitLogs.length; i++) {
      const logDate = new Date(habitLogs[i].date);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      const isSuccessful = (habit.type === 'do' && habitLogs[i].completed) || 
                          (habit.type === 'dont' && !habitLogs[i].completed);
      
      if (logDate.toDateString() === expectedDate.toDateString() && isSuccessful) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    for (let i = 0; i < habitLogs.length; i++) {
      const isSuccessful = (habit.type === 'do' && habitLogs[i].completed) || 
                          (habit.type === 'dont' && !habitLogs[i].completed);
      
      if (isSuccessful) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    return { currentStreak, longestStreak };
  };

  const habitStreaks = habits.map(habit => {
    const streaks = calculateStreaks(habit);
    return {
      ...habit,
      ...streaks
    };
  }).sort((a, b) => b.currentStreak - a.currentStreak);

  const bestCurrentStreak = habitStreaks.length > 0 ? habitStreaks[0].currentStreak : 0;
  const totalCurrentStreaks = habitStreaks.reduce((sum, habit) => sum + habit.currentStreak, 0);

  return (
    <div className="space-y-6">
      {/* Streak Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bestCurrentStreak}</div>
            <p className="text-sm text-muted-foreground">days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active Streaks</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCurrentStreaks}</div>
            <p className="text-sm text-muted-foreground">combined days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Habits</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {habitStreaks.filter(h => h.currentStreak > 0).length}
            </div>
            <p className="text-sm text-muted-foreground">with streaks</p>
          </CardContent>
        </Card>
      </div>

      {/* Individual Habit Streaks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Habit Streaks Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {habitStreaks.map((habit, index) => (
              <div key={habit.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{habit.title}</h4>
                      <Badge variant={habit.type === 'do' ? 'default' : 'destructive'}>
                        {habit.type === 'do' ? 'Do' : "Don't"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground capitalize">
                      {habit.frequency} • {habit.status}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <Flame className={`h-4 w-4 ${habit.currentStreak > 0 ? 'text-orange-500' : 'text-gray-300'}`} />
                    <span className="text-lg font-bold">{habit.currentStreak}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Best: {habit.longestStreak} days
                  </div>
                </div>
              </div>
            ))}
            
            {habitStreaks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No habits to track yet. Create some habits to start building streaks!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Streak Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Streak Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Achievement Levels</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>🔥 Fire Starter (7 days)</span>
                  <span>{habitStreaks.filter(h => h.currentStreak >= 7).length} habits</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>⚡ Streak Master (30 days)</span>
                  <span>{habitStreaks.filter(h => h.currentStreak >= 30).length} habits</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>🏆 Habit Champion (100 days)</span>
                  <span>{habitStreaks.filter(h => h.currentStreak >= 100).length} habits</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>👑 Legend (365 days)</span>
                  <span>{habitStreaks.filter(h => h.currentStreak >= 365).length} habits</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">All-Time Records</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Longest streak ever</span>
                  <span>{Math.max(...habitStreaks.map(h => h.longestStreak), 0)} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Most concurrent streaks</span>
                  <span>{habitStreaks.filter(h => h.currentStreak > 0).length} habits</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Average streak length</span>
                  <span>
                    {habitStreaks.length > 0 
                      ? Math.round(habitStreaks.reduce((sum, h) => sum + h.currentStreak, 0) / habitStreaks.length)
                      : 0} days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
