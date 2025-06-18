
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus, Target, Calendar } from 'lucide-react';
import { GoalsGuide } from '@/components/guides/GoalsGuide';
import { SmartGoalWizard } from './goals/SmartGoalWizard';
import { useHelp } from '@/contexts/HelpContext';

export const Goals = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { showHelp } = useHelp();

  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('goals')
        .select(`
          *,
          pillars (name)
        `)
        .eq('user_id', user.data.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: pillars } = useQuery({
    queryKey: ['pillars'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('pillars')
        .select('*')
        .eq('user_id', user.data.user.id);
      
      if (error) throw error;
      return data;
    },
  });

  const createGoal = useMutation({
    mutationFn: async (newGoal: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('goals')
        .insert([{ 
          ...newGoal, 
          user_id: user.data.user.id
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast({ title: "Success", description: "SMART Goal created successfully!" });
      setIsDialogOpen(false);
    },
  });

  const updateGoalStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('goals')
        .update({ status })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast({ title: "Success", description: "Goal updated successfully!" });
    },
  });

  const handleCreateGoal = (goalData: any) => {
    createGoal.mutate(goalData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {showHelp && <GoalsGuide />}
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Goals</h2>
          <p className="text-muted-foreground">Create SMART goals to achieve your objectives</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add SMART Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create a SMART Goal</DialogTitle>
            </DialogHeader>
            <SmartGoalWizard
              pillars={pillars}
              onSubmit={handleCreateGoal}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals?.map((goal) => (
          <Card key={goal.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  {goal.title}
                </CardTitle>
                <Badge className={getStatusColor(goal.status)}>
                  {goal.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{goal.type}</Badge>
                {goal.pillars && (
                  <Badge variant="secondary">{goal.pillars.name}</Badge>
                )}
                <Badge variant="outline">Priority {goal.priority}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {goal.description && (
                <div className="text-sm text-muted-foreground mb-2 whitespace-pre-line">
                  {goal.description}
                </div>
              )}
              {goal.target_date && (
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Calendar className="h-3 w-3 mr-1" />
                  Target: {new Date(goal.target_date).toLocaleDateString()}
                </div>
              )}
              <div className="flex space-x-2">
                {goal.status !== 'completed' && (
                  <Button
                    size="sm"
                    onClick={() => updateGoalStatus.mutate({ id: goal.id, status: 'completed' })}
                  >
                    Complete
                  </Button>
                )}
                {goal.status === 'active' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateGoalStatus.mutate({ id: goal.id, status: 'paused' })}
                  >
                    Pause
                  </Button>
                )}
                {goal.status === 'paused' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateGoalStatus.mutate({ id: goal.id, status: 'active' })}
                  >
                    Resume
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
