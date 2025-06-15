
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface DailyTaskReviewProps {
  responses: any[];
  onUpdate: (tasks: any[]) => void;
}

export const DailyTaskReview = ({ responses, onUpdate }: DailyTaskReviewProps) => {
  const [newDueDate, setNewDueDate] = useState<Record<string, string>>({});

  const { data: dueTasks } = useQuery({
    queryKey: ['due-tasks', new Date().toISOString().split('T')[0]],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('los_tasks')
        .select('*')
        .eq('user_id', user.data.user.id)
        .lte('due_date', today)
        .eq('status', 'pending')
        .order('due_date');
      
      if (error) throw error;
      return data;
    },
  });

  const handleTaskAction = async (taskId: string, action: 'complete' | 'reschedule' | 'delete') => {
    if (action === 'complete') {
      const { error } = await supabase
        .from('los_tasks')
        .update({ status: 'completed' })
        .eq('id', taskId);
      
      if (error) throw error;
    } else if (action === 'delete') {
      const { error } = await supabase
        .from('los_tasks')
        .update({ status: 'cancelled' })
        .eq('id', taskId);
      
      if (error) throw error;
    } else if (action === 'reschedule') {
      const newDate = newDueDate[taskId];
      if (newDate) {
        const { error } = await supabase
          .from('los_tasks')
          .update({ due_date: newDate })
          .eq('id', taskId);
        
        if (error) throw error;
      }
    }

    // Update responses to track what was done
    const updatedResponses = [...responses];
    const existingIndex = updatedResponses.findIndex(r => r.taskId === taskId);
    
    if (existingIndex >= 0) {
      updatedResponses[existingIndex] = { taskId, action, newDate: newDueDate[taskId] };
    } else {
      updatedResponses.push({ taskId, action, newDate: newDueDate[taskId] });
    }
    
    onUpdate(updatedResponses);
  };

  if (!dueTasks || dueTasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
          <p className="text-lg font-medium">No overdue tasks!</p>
          <p className="text-muted-foreground">You're all caught up with your tasks.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Review each task and decide what to do with it:
      </p>
      
      {dueTasks.map((task) => {
        const taskResponse = responses.find(r => r.taskId === task.id);
        const isProcessed = !!taskResponse;
        
        return (
          <Card key={task.id} className={isProcessed ? 'opacity-50' : ''}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{task.description}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </span>
                    <Badge variant={task.priority <= 2 ? 'destructive' : task.priority <= 3 ? 'default' : 'secondary'}>
                      Priority {task.priority}
                    </Badge>
                  </div>
                  
                  {taskResponse && (
                    <Badge variant="outline" className="mt-2">
                      {taskResponse.action === 'complete' && 'Completed'}
                      {taskResponse.action === 'reschedule' && `Rescheduled to ${taskResponse.newDate}`}
                      {taskResponse.action === 'delete' && 'Cancelled'}
                    </Badge>
                  )}
                </div>
                
                {!isProcessed && (
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      size="sm"
                      onClick={() => handleTaskAction(task.id, 'complete')}
                      className="w-full"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Complete
                    </Button>
                    
                    <div className="flex gap-1">
                      <Input
                        type="date"
                        value={newDueDate[task.id] || ''}
                        onChange={(e) => setNewDueDate(prev => ({ ...prev, [task.id]: e.target.value }))}
                        className="text-xs"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTaskAction(task.id, 'reschedule')}
                        disabled={!newDueDate[task.id]}
                      >
                        <Clock className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleTaskAction(task.id, 'delete')}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
