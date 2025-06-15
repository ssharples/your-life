import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Building2, BarChart3 } from 'lucide-react';
import { PillarsGuide } from '@/components/guides/PillarsGuide';
import { useHelp } from '@/contexts/HelpContext';
import { PillarHierarchy } from './pillars/PillarHierarchy';
import { PillarStats } from './pillars/PillarStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Pillars = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();
  const { showHelp } = useHelp();

  // Fetch hierarchical data for pillars
  const { data: hierarchyData } = useQuery({
    queryKey: ['pillars-hierarchy'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      // Fetch pillars with all related data
      const { data: pillars, error: pillarsError } = await supabase
        .from('pillars')
        .select('*')
        .eq('user_id', user.data.user.id)
        .order('created_at', { ascending: false });
      
      if (pillarsError) throw pillarsError;

      // For each pillar, fetch values and their connected data
      const pillarsWithHierarchy = await Promise.all(
        pillars.map(async (pillar) => {
          // Get values for this pillar (connected through goals)
          const { data: goals } = await supabase
            .from('goals')
            .select(`
              *,
              habits(*),
              los_projects(*, los_tasks(*))
            `)
            .eq('user_id', user.data.user.id)
            .eq('pillar_id', pillar.id);

          // Get values connected to these goals
          const { data: values } = await supabase
            .from('values_vault')
            .select('*')
            .eq('user_id', user.data.user.id);

          // Create a map of values with their connected goals
          const valuesWithGoals = values?.map(value => ({
            id: value.id,
            title: value.value, // Map 'value' field to 'title'
            description: value.description,
            goals: goals?.filter(goal => {
              // For now, we'll show all goals under each value
              // In a real app, you might want a direct value-goal relationship
              return true;
            }).map(goal => ({
              ...goal,
              habits: goal.habits || [],
              projects: (goal.los_projects || []).map((project: any) => ({
                ...project,
                tasks: project.los_tasks || []
              }))
            })) || []
          })) || [];

          return {
            ...pillar,
            values: valuesWithGoals
          };
        })
      );

      return pillarsWithHierarchy;
    },
  });

  // Calculate stats
  const stats = hierarchyData ? {
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
  } : {
    totalPillars: 0, totalValues: 0, totalGoals: 0, activeGoals: 0,
    totalHabits: 0, activeHabits: 0, totalProjects: 0, activeProjects: 0,
    totalTasks: 0, completedTasks: 0, pendingTasks: 0
  };

  const createPillar = useMutation({
    mutationFn: async (newPillar: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('pillars')
        .insert([{ ...newPillar, user_id: user.data.user.id }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pillars-hierarchy'] });
      toast({ title: "Success", description: "Pillar created successfully!" });
      resetForm();
    },
  });

  const resetForm = () => {
    setName('');
    setDescription('');
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPillar.mutate({ name, description });
  };

  return (
    <div className="space-y-6">
      {showHelp && <PillarsGuide />}
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Life Pillars Dashboard</h2>
          <p className="text-muted-foreground">View your complete life hierarchy and connections</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Pillar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Life Pillar</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Pillar name (e.g., Health, Career, Relationships)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Textarea
                placeholder="Description of this life area and why it's important to you"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
              <Button type="submit" className="w-full">Create Pillar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <PillarStats stats={stats} />

      <Tabs defaultValue="hierarchy" className="w-full">
        <TabsList>
          <TabsTrigger value="hierarchy" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Hierarchy View
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hierarchy" className="mt-6">
          <PillarHierarchy pillarsData={hierarchyData || []} />
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold">Structure Overview</h4>
                  <div className="text-sm space-y-1">
                    <div>Pillars: {stats.totalPillars}</div>
                    <div>Values: {stats.totalValues}</div>
                    <div>Goals: {stats.totalGoals} ({stats.activeGoals} active)</div>
                    <div>Habits: {stats.totalHabits} ({stats.activeHabits} active)</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Work Progress</h4>
                  <div className="text-sm space-y-1">
                    <div>Projects: {stats.totalProjects} ({stats.activeProjects} active)</div>
                    <div>Tasks: {stats.totalTasks}</div>
                    <div>Completed: {stats.completedTasks}</div>
                    <div>Pending: {stats.pendingTasks}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
