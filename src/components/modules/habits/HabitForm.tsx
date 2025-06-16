
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface HabitFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const HabitForm = ({ onSubmit, onCancel }: HabitFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [type, setType] = useState<'do' | 'dont'>('do');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ 
      title, 
      description, 
      frequency, 
      type,
      status: 'active'
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setFrequency('daily');
    setType('do');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Habit Type</Label>
        <Select value={type} onValueChange={(value: any) => setType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select habit type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="do">Do (Positive habit to build)</SelectItem>
            <SelectItem value="dont">Don't (Negative habit to break)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Habit Title</Label>
        <Input
          id="title"
          placeholder={type === 'do' ? "e.g., Exercise for 30 minutes" : "e.g., Don't check social media"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Add more details about this habit..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="frequency">Frequency</Label>
        <Select value={frequency} onValueChange={(value: any) => setFrequency(value)}>
          <SelectTrigger>
            <SelectValue placeholder="How often?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">Create Habit</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};
