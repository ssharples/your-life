
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X, Target } from 'lucide-react';

interface DailyHabitReviewProps {
  responses: any[];
  onUpdate: (habits: any[]) => void;
}

export const DailyHabitReview = ({ responses, onUpdate }: DailyHabitReviewProps) => {
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split('T')[0];

  const { data: habits } = useQuery({
    queryKey: ['active-habits'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.data.user.id)
        .eq('status', 'active')
        .order('title');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: todayLogs } = useQuery({
    queryKey: ['habit-logs', today],
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

  const logHabit = useMutation({
    mutationFn: async ({ habitId, completed, notes }: { habitId: string; completed: boolean; notes?: string }) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      // Check if log already exists
      const existingLog = todayLogs?.find(log => log.habit_id === habitId);
      
      if (existingLog) {
        const { error } = await supabase
          .from('habit_logs')
          .update({ completed, notes })
          .eq('id', existingLog.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('habit_logs')
          .insert([{
            user_id: user.data.user.id,
            habit_id: habitId,
            date: today,
            completed,
            notes
          }]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habit-logs', today] });
    },
  });

  const handleHabitLog = async (habitId: string, completed: boolean) => {
    await logHabit.mutateAsync({ habitId, completed });
    
    // Update responses to track what was logged
    const updatedResponses = [...responses];
    const existingIndex = updatedResponses.findIndex(r => r.habitId === habitId);
    
    if (existingIndex >= 0) {
      updatedResponses[existingIndex] = { habitId, completed };
    } else {
      updatedResponses.push({ habitId, completed });
    }
    
    onUpdate(updatedResponses);
  };

  if (!habits || habits.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Target className="h-12 w-12 mx-auto text-blue-500 mb-4" />
          <p className="text-lg font-medium">No active habits</p>
          <p className="text-muted-foreground">Create some habits to track your daily progress.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Mark each habit as successful or failed for today:
      </p>
      
      {habits.map((habit) => {
        const log = todayLogs?.find(log => log.habit_id === habit.id);
        const isLogged = !!log;
        
        return (
          <Card key={habit.id} className={isLogged ? 'border-green-200' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{habit.title}</h4>
                  {habit.description && (
                    <p className="text-sm text-muted-foreground mt-1">{habit.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="capitalize">
                      {habit.frequency}
                    </Badge>
                    {isLogged && (
                      <Badge variant={log.completed ? 'default' : 'destructive'}>
                        {log.completed ? 'Completed' : 'Missed'}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant={isLogged && log.completed ? 'default' : 'outline'}
                    onClick={() => handleHabitLog(habit.id, true)}
                    disabled={logHabit.isPending}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Success
                  </Button>
                  
                  <Button
                    size="sm"
                    variant={isLogged && !log.completed ? 'destructive' : 'outline'}
                    onClick={() => handleHabitLog(habit.id, false)}
                    disabled={logHabit.isPending}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Failed
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
