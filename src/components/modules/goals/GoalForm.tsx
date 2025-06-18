
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Pillar {
  id: string;
  name: string;
}

interface GoalFormProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  type: 'short-term' | 'long-term';
  setType: (type: 'short-term' | 'long-term') => void;
  targetDate: string;
  setTargetDate: (date: string) => void;
  priority: number;
  setPriority: (priority: number) => void;
  pillarId: string;
  setPillarId: (id: string) => void;
  pillars?: Pillar[];
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
}

export const GoalForm = ({
  title,
  setTitle,
  description,
  setDescription,
  type,
  setType,
  targetDate,
  setTargetDate,
  priority,
  setPriority,
  pillarId,
  setPillarId,
  pillars,
  onSubmit,
  isEditing
}: GoalFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
      <Button type="submit" className="w-full">
        {isEditing ? 'Update Goal' : 'Create Goal'}
      </Button>
    </form>
  );
};
