import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TaskForm } from './modules/tasks/TaskForm';
import { GoalForm } from './modules/goals/GoalForm';
import { HabitForm } from './modules/habits/HabitForm';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface QuickAddDialogProps {
  type: string | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const QuickAddDialog = ({ type, isOpen, onClose, onComplete }: QuickAddDialogProps) => {
  const [formData, setFormData] = useState<any>({});
  const queryClient = useQueryClient();

  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return [];
      
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
      if (!user.data.user) return [];
      
      const { data, error } = await supabase
        .from('los_projects')
        .select('*')
        .eq('user_id', user.data.user.id);
      
      if (error) throw error;
      return data;
    },
  });

  const createItem = useMutation({
    mutationFn: async (data: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const item = { ...data, user_id: user.data.user.id };

      switch (type) {
        case 'task': {
          const { data: result, error } = await supabase
            .from('los_tasks')
            .insert([{ ...item, status: 'pending' }])
            .select()
            .single();
          if (error) throw error;
          return result;
        }
        case 'goal': {
          const { data: result, error } = await supabase
            .from('goals')
            .insert([item])
            .select()
            .single();
          if (error) throw error;
          return result;
        }
        case 'project': {
          const { data: result, error } = await supabase
            .from('los_projects')
            .insert([{ ...item, status: 'planning' }])
            .select()
            .single();
          if (error) throw error;
          return result;
        }
        case 'habit': {
          const { data: result, error } = await supabase
            .from('habits')
            .insert([{ ...item, status: 'active' }])
            .select()
            .single();
          if (error) throw error;
          return result;
        }
        case 'journal': {
          const { data: result, error } = await supabase
            .from('journals')
            .insert([item])
            .select()
            .single();
          if (error) throw error;
          return result;
        }
        case 'knowledge': {
          const { data: result, error } = await supabase
            .from('knowledge_vault')
            .insert([item])
            .select()
            .single();
          if (error) throw error;
          return result;
        }
        case 'pillar': {
          const { data: result, error } = await supabase
            .from('pillars')
            .insert([item])
            .select()
            .single();
          if (error) throw error;
          return result;
        }
        case 'value': {
          const { data: result, error } = await supabase
            .from('values_vault')
            .insert([item])
            .select()
            .single();
          if (error) throw error;
          return result;
        }
        default:
          throw new Error('Invalid type');
      }
    },
    onSuccess: () => {
      const queryKey = type === 'task' ? 'los-tasks' : 
                     type === 'project' ? 'los-projects' : 
                     type === 'knowledge' ? 'knowledge_vault' :
                     type === 'value' ? 'values_vault' : type;
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      onComplete();
      onClose();
      setFormData({});
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: any) => {
    createItem.mutate(data);
  };

  const handleGoalChange = () => {};
  const handleProjectChange = () => {};

  const getDialogTitle = () => {
    switch (type) {
      case 'task': return 'Quick Add Task';
      case 'goal': return 'Quick Add Goal';
      case 'project': return 'Quick Add Project';
      case 'habit': return 'Quick Add Habit';
      case 'journal': return 'Quick Add Journal Entry';
      case 'knowledge': return 'Quick Add Knowledge Note';
      case 'pillar': return 'Quick Add Pillar';
      case 'value': return 'Quick Add Value';
      default: return 'Quick Add';
    }
  };

  const renderForm = () => {
    switch (type) {
      case 'task':
        return (
          <TaskForm
            goals={goals}
            projects={projects}
            onSubmit={handleSubmit}
            onGoalChange={handleGoalChange}
            onProjectChange={handleProjectChange}
          />
        );
      
      case 'goal':
        return (
          <GoalFormWithAI
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        );
      
      case 'habit':
        return (
          <HabitForm
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        );

      default:
        return <SimpleForm type={type} onSubmit={handleSubmit} onCancel={onClose} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
};

const GoalFormWithAI = ({ onSubmit, onCancel }: { onSubmit: (data: any) => void, onCancel: () => void }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(3);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: journalEntries } = useQuery({
    queryKey: ['journal-entries'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return [];
      
      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .eq('user_id', user.data.user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  const generateAIRecommendations = async () => {
    if (!journalEntries || journalEntries.length === 0) {
      toast({
        title: "No Journal Entries",
        description: "Add some mindset journal entries first to get AI-powered goal recommendations.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await supabase.functions.invoke('generate-goal-recommendations', {
        body: { journalEntries }
      });

      if (response.error) throw response.error;
      setAiRecommendations(response.data.recommendations || []);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const data = { 
      title, 
      description, 
      type: 'outcome',
      priority 
    };

    onSubmit(data);
  };

  const useRecommendation = (recommendation: string) => {
    setTitle(recommendation);
    setDescription(`This goal is inspired by your positive mindset journal entries to help you take action on your affirmations.`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="What do you want to achieve?"
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

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-sm text-gray-700">AI Goal Recommendations</h4>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={generateAIRecommendations}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Get AI Ideas'}
          </Button>
        </div>
        
        {aiRecommendations.length > 0 && (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {aiRecommendations.map((recommendation, index) => (
              <div 
                key={index}
                className="p-2 bg-blue-50 rounded text-sm cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => useRecommendation(recommendation)}
              >
                <span className="text-blue-700">💡 {recommendation}</span>
              </div>
            ))}
          </div>
        )}
        
        {aiRecommendations.length === 0 && journalEntries && journalEntries.length > 0 && (
          <p className="text-xs text-gray-500">
            Click "Get AI Ideas" to generate goal recommendations based on your mindset journal entries
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">Create Goal</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};

const SimpleForm = ({ type, onSubmit, onCancel }: { type: string | null, onSubmit: (data: any) => void, onCancel: () => void }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const data: any = { title, description };
    
    if (type === 'goal') {
      data.type = 'outcome';
      data.priority = priority;
    } else if (type === 'project') {
      data.priority = priority;
    } else if (type === 'pillar') {
      data.color = '#3B82F6';
    } else if (type === 'value') {
      data.importance = priority;
    } else if (type === 'journal') {
      data.content = description;
      data.mood = 5;
    } else if (type === 'knowledge') {
      data.content = description;
      data.tags = '';
    }

    onSubmit(data);
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'goal': return 'What do you want to achieve?';
      case 'project': return 'What project are you working on?';
      case 'pillar': return 'Name your life pillar';
      case 'value': return 'What do you value?';
      case 'journal': return 'Journal entry title';
      case 'knowledge': return 'Knowledge note title';
      default: return 'Enter title';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder={getPlaceholder()}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      
      <Textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      {(type === 'goal' || type === 'project' || type === 'value') && (
        <Select value={priority.toString()} onValueChange={(value) => setPriority(parseInt(value))}>
          <SelectTrigger>
            <SelectValue placeholder={type === 'value' ? 'Importance' : 'Priority'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 - Highest</SelectItem>
            <SelectItem value="2">2 - High</SelectItem>
            <SelectItem value="3">3 - Medium</SelectItem>
            <SelectItem value="4">4 - Low</SelectItem>
            <SelectItem value="5">5 - Lowest</SelectItem>
          </SelectContent>
        </Select>
      )}

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">Create</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};
