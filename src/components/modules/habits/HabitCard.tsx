
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, X, Target, Clock, Flame } from 'lucide-react';

interface HabitCardProps {
  habit: any;
  logs: any[];
}

export const HabitCard = ({ habit, logs }: HabitCardProps) => {
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split('T')[0];
  
  // Check if habit was logged today
  const todayLog = logs.find(log => 
    log.habit_id === habit.id && log.date === today
  );
  
  // Calculate streak
  const habitLogs = logs
    .filter(log => log.habit_id === habit.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < habitLogs.length; i++) {
      const logDate = new Date(habitLogs[i].date);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (
        logDate.toDateString() === expectedDate.toDateString() && 
        ((habit.type === 'do' && habitLogs[i].completed) || 
         (habit.type === 'dont' && !habitLogs[i].completed))
      ) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  const logHabit = useMutation({
    mutationFn: async ({ completed, notes }: { completed: boolean; notes?: string }) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      if (todayLog) {
        const { error } = await supabase
          .from('habit_logs')
          .update({ completed, notes })
          .eq('id', todayLog.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('habit_logs')
          .insert([{
            user_id: user.data.user.id,
            habit_id: habit.id,
            date: today,
            completed,
            notes
          }]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habit-logs'] });
      toast({ 
        title: "Success", 
        description: `Habit ${todayLog ? 'updated' : 'logged'} successfully!` 
      });
    },
  });

  const handleHabitLog = (completed: boolean) => {
    logHabit.mutate({ completed });
  };

  const getSuccessAction = () => {
    if (habit.type === 'do') {
      return { label: 'Done', value: true, icon: CheckCircle };
    } else {
      return { label: 'Avoided', value: false, icon: CheckCircle };
    }
  };

  const getFailAction = () => {
    if (habit.type === 'do') {
      return { label: 'Missed', value: false, icon: X };
    } else {
      return { label: 'Did it', value: true, icon: X };
    }
  };

  const successAction = getSuccessAction();
  const failAction = getFailAction();
  
  const isSuccessLogged = todayLog && todayLog.completed === successAction.value;
  const isFailLogged = todayLog && todayLog.completed === failAction.value;

  return (
    <Card className={`${
      isSuccessLogged ? 'border-green-200 bg-green-50' : 
      isFailLogged ? 'border-red-200 bg-red-50' : ''
    }`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-4 w-4" />
              {habit.title}
            </CardTitle>
            {habit.description && (
              <p className="text-sm text-muted-foreground mt-1">{habit.description}</p>
            )}
          </div>
          <Badge variant={habit.type === 'do' ? 'default' : 'destructive'}>
            {habit.type === 'do' ? 'Do' : "Don't"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Frequency and Streak */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className="capitalize">{habit.frequency}</span>
            </div>
            <div className="flex items-center gap-1">
              <Flame className="h-3 w-3 text-orange-500" />
              <span>{currentStreak} day streak</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={isSuccessLogged ? 'default' : 'outline'}
              onClick={() => handleHabitLog(successAction.value)}
              disabled={logHabit.isPending}
              className="flex-1"
            >
              <successAction.icon className="h-3 w-3 mr-1" />
              {successAction.label}
            </Button>
            
            <Button
              size="sm"
              variant={isFailLogged ? 'destructive' : 'outline'}
              onClick={() => handleHabitLog(failAction.value)}
              disabled={logHabit.isPending}
              className="flex-1"
            >
              <failAction.icon className="h-3 w-3 mr-1" />
              {failAction.label}
            </Button>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <Badge className={habit.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
              {habit.status}
            </Badge>
            {(isSuccessLogged || isFailLogged) && (
              <div className="flex items-center text-sm">
                {isSuccessLogged ? (
                  <span className="text-green-600">✓ Logged today</span>
                ) : (
                  <span className="text-red-600">✗ Logged today</span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
