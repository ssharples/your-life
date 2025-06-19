
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SimpleFormProps {
  type: string | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const SimpleForm = ({ type, onSubmit, onCancel }: SimpleFormProps) => {
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
