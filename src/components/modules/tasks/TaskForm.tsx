import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Goal {
  id: string;
  title: string;
}

interface Project {
  id: string;
  title: string;
}

interface TaskFormProps {
  goals?: Goal[];
  projects?: Project[];
  onSubmit: (taskData: {
    description: string;
    priority: number;
    dueDate: string;
    projectId: string;
    goalId: string;
    tags: string;
  }) => void;
  onGoalChange: (value: string) => void;
  onProjectChange: (value: string) => void;
}

export const TaskForm = ({ 
  goals, 
  projects, 
  onSubmit, 
  onGoalChange, 
  onProjectChange 
}: TaskFormProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState(3);
  const [projectId, setProjectId] = useState('');
  const [goalId, setGoalId] = useState('');
  const [tags, setTags] = useState('');
  const isMobile = useIsMobile();

  const resetForm = () => {
    setDescription('');
    setDueDate('');
    setPriority(3);
    setProjectId('');
    setGoalId('');
    setTags('');
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    
    console.log('TaskForm submitting data:', {
      description,
      priority,
      dueDate,
      projectId,
      goalId,
      tags
    });
    
    onSubmit({
      description,
      priority,
      dueDate,
      projectId,
      goalId,
      tags
    });
    resetForm();
  };

  const handleGoalChangeInternal = (value: string) => {
    setGoalId(value === 'new-goal' ? '' : value);
    onGoalChange(value);
  };

  const handleProjectChangeInternal = (value: string) => {
    setProjectId(value === 'new-project' ? '' : value);
    onProjectChange(value);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={resetForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Task description (be specific and actionable)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Select value={goalId} onValueChange={handleGoalChangeInternal}>
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
          <Select value={projectId} onValueChange={handleProjectChangeInternal}>
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
          <Input
            type="date"
            placeholder="Due date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
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
          <Input
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <Button type="submit" className="w-full">Create Task</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
