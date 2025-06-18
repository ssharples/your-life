
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const QuickHabitsWidget = () => {
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split('T')[0];

  const { data: essentialHabits } = useQuery({
    queryKey: ['essential-habits'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.data.user.id)
        .in('title', ['Daily Journal', 'Daily Review'])
        .eq('status', 'active');

      if (error) throw error;
      return data;
    },
  });

  const { data: todayLogs } = useQuery({
    queryKey: ['today-habit-logs', today],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', user.data.user.id)
        .eq('date', today);

      if (error) throw error;
      return data;
    },
  });

  const completeHabit = useMutation({
    mutationFn: async (habitId: string) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('habit_logs')
        .insert([{
          user_id: user.data.user.id,
          habit_id: habitId,
          date: today,
          completed: true,
        }])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, habitId) => {
      queryClient.invalidateQueries({ queryKey: ['today-habit-logs'] });
      const habit = essentialHabits?.find(h => h.id === habitId);
      toast({
        title: "Habit Completed!",
        description: `Great job completing your ${habit?.title}!`,
      });
    },
  });

  const isCompleted = (habitId: string) => {
    return todayLogs?.some(log => log.habit_id === habitId && log.completed);
  };

  if (!essentialHabits?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Today's Essentials
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {essentialHabits.map((habit) => {
          const completed = isCompleted(habit.id);
          return (
            <div key={habit.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
                <div>
                  <p className="font-medium">{habit.title}</p>
                  <p className="text-sm text-muted-foreground">{habit.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {completed ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Complete
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => completeHabit.mutate(habit.id)}
                    disabled={completeHabit.isPending}
                  >
                    Mark Done
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
