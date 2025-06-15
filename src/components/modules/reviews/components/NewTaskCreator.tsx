import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuickGoalCreator } from './QuickGoalCreator';
import { QuickProjectCreator } from './QuickProjectCreator';

interface NewTaskCreatorProps {
  createdTasks: any[];
  onTaskCreated: (task: any) => void;
  onTaskRemoved: (taskId: string) => void;
}

export const NewTaskCreator = ({ createdTasks, onTaskCreated, onTaskRemoved }: NewTaskCreatorProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(3);
  const [projectId, setProjectId] = useState('');
  const [goalId, setGoalId] = useState('');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [pendingTaskData, setPendingTaskData] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.data.user.id);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: projects } = useQuery({
    queryKey: ['los-projects'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('los_projects')
        .select('*')
        .eq('user_id', user.data.user.id);
      
      if (error) throw error;
      return data;
    },
  });

  const createTask = useMutation({
    mutationFn: async (newTask: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('los_tasks')
        .insert([{ 
          ...newTask, 
          user_id: user.data.user.id,
          project_id: projectId || null,
          goal_id: goalId || null,
          due_date: tomorrowDate,
          status: 'pending'
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      onTaskCreated(data);
      toast({ title: "Success", description: "Task created for tomorrow!" });
      
      // Check if we need to show modals for quick-created goals/projects
      if (pendingTaskData?.newGoal) {
        setShowGoalModal(true);
      } else if (pendingTaskData?.newProject) {
        setShowProjectModal(true);
      } else {
        resetForm();
      }
    },
  });

  const resetForm = () => {
    setDescription('');
    setPriority(3);
    setProjectId('');
    setGoalId('');
    setIsCreating(false);
    setPendingTaskData(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    
    const taskData = { description, priority };
    setPendingTaskData(taskData);
    createTask.mutate(taskData);
  };

  const handleGoalChange = (value: string) => {
    if (value === 'new-goal') {
      setGoalId('');
      setPendingTaskData({ ...pendingTaskData, newGoal: true });
    } else {
      setGoalId(value);
    }
  };

  const handleProjectChange = (value: string) => {
    if (value === 'new-project') {
      setProjectId('');
      setPendingTaskData({ ...pendingTaskData, newProject: true });
    } else {
      setProjectId(value);
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'Highest';
      case 2: return 'High';
      case 3: return 'Medium';
      case 4: return 'Low';
      case 5: return 'Lowest';
      default: return 'Medium';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return 'bg-red-100 text-red-800';
    if (priority === 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium">Tasks for Tomorrow</h4>
        <AnimatePresence>
          {!isCreating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button
                onClick={() => setIsCreating(true)}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Create New Task</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Textarea
                    placeholder="What needs to be done tomorrow?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    required
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select value={goalId} onValueChange={handleGoalChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Link to goal (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new-goal">
                          <span className="flex items-center gap-2">
                            <Plus className="h-3 w-3" />
                            Create new goal
                          </span>
                        </SelectItem>
                        {goals?.map((goal) => (
                          <SelectItem key={goal.id} value={goal.id}>
                            {goal.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={projectId} onValueChange={handleProjectChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Link to project (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new-project">
                          <span className="flex items-center gap-2">
                            <Plus className="h-3 w-3" />
                            Create new project
                          </span>
                        </SelectItem>
                        {projects?.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

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

                  <div className="flex gap-2">
                    <Button type="submit" disabled={createTask.isPending}>
                      {createTask.isPending ? 'Creating...' : 'Create Task'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {createdTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <p className="text-sm text-muted-foreground">
              {createdTasks.length} task{createdTasks.length !== 1 ? 's' : ''} created for tomorrow:
            </p>
            {createdTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{task.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getPriorityColor(task.priority)} variant="outline">
                      P{task.priority} - {getPriorityLabel(task.priority)}
                    </Badge>
                    {task.goals && (
                      <Badge variant="outline" className="text-xs">
                        Goal: {task.goals.title}
                      </Badge>
                    )}
                    {task.los_projects && (
                      <Badge variant="secondary" className="text-xs">
                        Project: {task.los_projects.title}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onTaskRemoved(task.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Components */}
      <QuickGoalCreator 
        isOpen={showGoalModal} 
        onClose={() => {
          setShowGoalModal(false);
          resetForm();
        }} 
      />
      
      <QuickProjectCreator 
        isOpen={showProjectModal} 
        onClose={() => {
          setShowProjectModal(false);
          resetForm();
        }} 
      />
    </motion.div>
  );
};
