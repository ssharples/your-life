
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface QuickGoalCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  goalId?: string;
}

export const QuickGoalCreator = ({ isOpen, onClose, goalId }: QuickGoalCreatorProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('outcome');
  const [priority, setPriority] = useState(3);
  const [targetDate, setTargetDate] = useState('');
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  const createGoal = useMutation({
    mutationFn: async (newGoal: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('goals')
        .insert([{ 
          ...newGoal, 
          user_id: user.data.user.id,
          target_date: targetDate || null
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast({ title: "Success", description: "Goal created successfully!" });
      resetForm();
      onClose();
    },
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('outcome');
    setPriority(3);
    setTargetDate('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createGoal.mutate({ title, description, type, priority });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-[425px] ${
        isMobile 
          ? 'fixed top-4 left-4 right-4 mx-0 translate-x-0 translate-y-0' 
          : ''
      }`}>
        <DialogHeader>
          <DialogTitle>Add Goal Details</DialogTitle>
        </DialogHeader>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Input
            placeholder="Goal title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          
          <Textarea
            placeholder="Describe your goal..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Goal type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="outcome">Outcome Goal</SelectItem>
              <SelectItem value="process">Process Goal</SelectItem>
              <SelectItem value="performance">Performance Goal</SelectItem>
            </SelectContent>
          </Select>

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

          <Input
            type="date"
            placeholder="Target date (optional)"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />

          <div className="flex gap-2">
            <Button type="submit" disabled={createGoal.isPending} className="flex-1">
              {createGoal.isPending ? 'Creating...' : 'Create Goal'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};
