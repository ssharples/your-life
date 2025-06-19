
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Goal {
  id: string;
  title: string;
}

interface ValueFormProps {
  value: string;
  setValue: (value: string) => void;
  description: string;
  setDescription: (description: string) => void;
  importanceRating: number;
  setImportanceRating: (rating: number) => void;
  selectedGoalIds: string[];
  setSelectedGoalIds: (ids: string[]) => void;
  goals?: Goal[];
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
}

export const ValueForm = ({
  value,
  setValue,
  description,
  setDescription,
  importanceRating,
  setImportanceRating,
  selectedGoalIds,
  setSelectedGoalIds,
  goals,
  onSubmit,
  isEditing
}: ValueFormProps) => {
  const isMobile = useIsMobile();

  const handleGoalSelection = (goalId: string) => {
    if (selectedGoalIds.includes(goalId)) {
      setSelectedGoalIds(selectedGoalIds.filter(id => id !== goalId));
    } else {
      setSelectedGoalIds([...selectedGoalIds, goalId]);
    }
  };

  const removeGoal = (goalId: string) => {
    setSelectedGoalIds(selectedGoalIds.filter(id => id !== goalId));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        placeholder="Value name (e.g., Integrity, Growth, Family)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      />
      <Textarea
        placeholder="What does this value mean to you? How does it guide your decisions?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />
      <div className="space-y-2">
        <label className="text-sm font-medium">Connected Goals</label>
        <Select onValueChange={handleGoalSelection}>
          <SelectTrigger>
            <SelectValue placeholder="Select goals to connect" />
          </SelectTrigger>
          <SelectContent className={isMobile ? 'max-h-[200px]' : ''}>
            {goals?.filter(goal => !selectedGoalIds.includes(goal.id)).map((goal) => (
              <SelectItem key={goal.id} value={goal.id}>
                {goal.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedGoalIds.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedGoalIds.map((goalId) => {
              const goal = goals?.find(g => g.id === goalId);
              return goal ? (
                <Badge key={goalId} variant="secondary" className="flex items-center gap-1">
                  {goal.title}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-3 w-3 p-0 hover:bg-transparent"
                    onClick={() => removeGoal(goalId)}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ) : null;
            })}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Importance Rating: {importanceRating}/10
        </label>
        <Input
          type="range"
          min="1"
          max="10"
          value={importanceRating}
          onChange={(e) => setImportanceRating(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Less Important</span>
          <span>Very Important</span>
        </div>
      </div>
      <Button type="submit" className="w-full">
        {isEditing ? 'Update Value' : 'Add Value'}
      </Button>
    </form>
  );
};
