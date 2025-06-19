import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Plus, Zap, TrendingUp, Calendar } from 'lucide-react';
import { HabitsGuide } from '@/components/guides/HabitsGuide';
import { useHelp } from '@/contexts/HelpContext';
import { HabitCard } from './habits/HabitCard';
import { HabitForm } from './habits/HabitForm';
import { HabitAnalytics } from './habits/HabitAnalytics';
import { HabitStreaks } from './habits/HabitStreaks';

// Define the habit type
interface Habit {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  frequency: string;
  type: 'do' | 'dont';
  status: string;
  tracking_period: number;
  goal_id?: string;
  created_at: string;
  updated_at: string;
}
export const Habits = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const queryClient = useQueryClient();
  const {
    showHelp
  } = useHelp();
  const {
    data: habits
  } = useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      const {
        data,
        error
      } = await supabase.from('habits').select('*').eq('user_id', user.data.user.id).order('created_at', {
        ascending: false
      });
      if (error) throw error;
      return data as Habit[];
    }
  });
  const {
    data: habitLogs
  } = useQuery({
    queryKey: ['habit-logs'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const {
        data,
        error
      } = await supabase.from('habit_logs').select('*').eq('user_id', user.data.user.id).gte('date', thirtyDaysAgo.toISOString().split('T')[0]).order('date', {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  const createHabit = useMutation({
    mutationFn: async (newHabit: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      const {
        data,
        error
      } = await supabase.from('habits').insert([{
        ...newHabit,
        user_id: user.data.user.id
      }]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['habits']
      });
      toast({
        title: "Success",
        description: "Habit created successfully!"
      });
      setIsDialogOpen(false);
    }
  });
  const handleSubmit = (habitData: any) => {
    createHabit.mutate(habitData);
  };

  // Separate habits into do's and don'ts
  const doHabits = habits?.filter(habit => habit.type === 'do') || [];
  const dontHabits = habits?.filter(habit => habit.type === 'dont') || [];

  // Calculate stats
  const totalHabits = habits?.length || 0;
  const activeHabits = habits?.filter(habit => habit.status === 'active').length || 0;
  const todayLogs = habitLogs?.filter(log => log.date === new Date().toISOString().split('T')[0]).length || 0;
  return <div className="space-y-6">
      {showHelp && <HabitsGuide />}
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Habit Tracker</h2>
          <p className="text-muted-foreground">Build positive habits and break negative ones</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Habit</DialogTitle>
            </DialogHeader>
            <HabitForm onSubmit={handleSubmit} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Habits</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHabits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Habits</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeHabits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Logs</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayLogs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalHabits > 0 ? Math.round(todayLogs / totalHabits * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="streaks">Streaks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Do's Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-semibold">Build Habits</h3>
              <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm">{doHabits.length} habits</span>
            </div>
            {doHabits.length === 0 ? <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Zap className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    No positive habits yet. Create your first habit to get started!
                  </p>
                </CardContent>
              </Card> : <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {doHabits.map(habit => <HabitCard key={habit.id} habit={habit} logs={habitLogs || []} />)}
              </div>}
          </div>

          {/* Don'ts Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-semibold">Break Habits</h3>
              <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm">{dontHabits.length} habits</span>
            </div>
            {dontHabits.length === 0 ? <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Zap className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    No habits to avoid yet. Create habits for things you want to stop doing.
                  </p>
                </CardContent>
              </Card> : <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {dontHabits.map(habit => <HabitCard key={habit.id} habit={habit} logs={habitLogs || []} />)}
              </div>}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <HabitAnalytics habits={habits || []} logs={habitLogs || []} />
        </TabsContent>

        <TabsContent value="streaks">
          <HabitStreaks habits={habits || []} logs={habitLogs || []} />
        </TabsContent>
      </Tabs>
    </div>;
};