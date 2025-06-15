import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Plus, Zap, Calendar, CheckCircle } from 'lucide-react';
import { HabitsGuide } from '@/components/guides/HabitsGuide';
import { useHelp } from '@/contexts/HelpContext';

export const Habits = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const queryClient = useQueryClient();
  const { showHelp } = useHelp();

  const { data: habits } = useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.data.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: habitLogs } = useQuery({
    queryKey: ['habit-logs'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', user.data.user.id)
        .eq('date', today);
      
      if (error) throw error;
      return data;
    },
  });

  const createHabit = useMutation({
    mutationFn: async (newHabit: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('habits')
        .insert([{ ...newHabit, user_id: user.data.user.id }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast({ title: "Success", description: "Habit created successfully!" });
      resetForm();
    },
  });

  const logHabit = useMutation({
    mutationFn: async ({ habitId, completed }: { habitId: string; completed: boolean }) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const today = new Date().toISOString().split('T')[0];
      
      if (completed) {
        const { data, error } = await supabase
          .from('habit_logs')
          .insert([{ 
            habit_id: habitId, 
            user_id: user.data.user.id, 
            date: today, 
            completed: true 
          }])
          .select();
        
        if (error) throw error;
        return data;
      } else {
        const { error } = await supabase
          .from('habit_logs')
          .delete()
          .eq('habit_id', habitId)
          .eq('user_id', user.data.user.id)
          .eq('date', today);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habit-logs'] });
      toast({ title: "Success", description: "Habit logged successfully!" });
    },
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFrequency('daily');
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createHabit.mutate({ title, description, frequency });
  };

  const isHabitCompleted = (habitId: string) => {
    return habitLogs?.some(log => log.habit_id === habitId && log.completed);
  };

  const handleHabitToggle = (habitId: string, completed: boolean) => {
    logHabit.mutate({ habitId, completed: !completed });
  };

  return (
    <div className="space-y-6">
      {showHelp && <HabitsGuide />}
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Habits</h2>
          <p className="text-muted-foreground">Build and track your daily habits</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Habit</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Habit title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Select value={frequency} onValueChange={(value: any) => setFrequency(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full">Create Habit</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {habits?.map((habit) => {
          const completed = isHabitCompleted(habit.id);
          return (
            <Card key={habit.id} className={completed ? 'border-green-200 bg-green-50' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    {habit.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{habit.frequency}</Badge>
                    <Checkbox
                      checked={completed}
                      onCheckedChange={() => handleHabitToggle(habit.id, completed)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {habit.description && (
                  <p className="text-sm text-muted-foreground mb-2">{habit.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <Badge className={habit.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {habit.status}
                  </Badge>
                  {completed && (
                    <div className="flex items-center text-green-600 text-sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Completed today
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
