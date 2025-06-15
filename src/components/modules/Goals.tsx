
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
import { toast } from '@/hooks/use-toast';
import { Plus, Target, Calendar } from 'lucide-react';

export const Goals = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'short-term' | 'long-term'>('short-term');
  const [targetDate, setTargetDate] = useState('');
  const [priority, setPriority] = useState(3);
  const [pillarId, setPillarId] = useState('');
  const queryClient = useQueryClient();

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
          user_id: user.data.user.id,
          pillar_id: pillarId || null,
          target_date: targetDate || null
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast({ title: "Success", description: "Goal created successfully!" });
      resetForm();
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

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('short-term');
    setTargetDate('');
    setPriority(3);
    setPillarId('');
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createGoal.mutate({ title, description, type, priority });
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Goals</h2>
          <p className="text-muted-foreground">Track your short-term and long-term objectives</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Goal title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Select value={type} onValueChange={(value: 'short-term' | 'long-term') => setType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select goal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short-term">Short-term</SelectItem>
                  <SelectItem value="long-term">Long-term</SelectItem>
                </SelectContent>
              </Select>
              <Select value={pillarId} onValueChange={setPillarId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pillar (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {pillars?.map((pillar) => (
                    <SelectItem key={pillar.id} value={pillar.id}>
                      {pillar.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                placeholder="Target date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
              <Select value={priority.toString()} onValueChange={(value) => setPriority(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Highest</SelectItem>
                  <SelectItem value="2">2 - High</SelectItem>
                  <SelectItem value="3">3 - Medium</SelectItem>
                  <SelectItem value="4">4 - Low</SelectItem>
                  <SelectItem value="5">5 - Lowest</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full">Create Goal</Button>
            </form>
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
                <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
              )}
              {goal.target_date && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  Target: {new Date(goal.target_date).toLocaleDateString()}
                </div>
              )}
              <div className="flex space-x-2 mt-4">
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
