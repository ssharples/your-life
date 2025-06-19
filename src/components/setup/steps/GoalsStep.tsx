
import { useState } from 'react';
import { IOSCard } from '@/components/ios/IOSCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, Plus, X } from 'lucide-react';

interface Goal {
  title: string;
  description: string;
  area: string;
  timeframe: string;
}

interface GoalsStepProps {
  data: Goal[];
  lifeAreas: string[];
  onNext: (data: any) => void;
  onBack: () => void;
}

export const GoalsStep = ({ data, lifeAreas, onNext, onBack }: GoalsStepProps) => {
  const [goals, setGoals] = useState<Goal[]>(data.length > 0 ? data : [{ title: '', description: '', area: '', timeframe: '' }]);

  const addGoal = () => {
    setGoals([...goals, { title: '', description: '', area: '', timeframe: '' }]);
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const updateGoal = (index: number, field: keyof Goal, value: string) => {
    setGoals(goals.map((goal, i) => 
      i === index ? { ...goal, [field]: value } : goal
    ));
  };

  const handleSubmit = () => {
    const validGoals = goals.filter(goal => goal.title.trim() && goal.area);
    onNext({ goals: validGoals });
  };

  const validGoals = goals.filter(goal => goal.title.trim() && goal.area).length;

  return (
    <IOSCard padding="lg">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Your Goals</h2>
        <p className="text-gray-600">Define what you want to achieve in each life area</p>
      </div>

      <div className="space-y-6">
        {goals.map((goal, index) => (
          <IOSCard key={index} padding="md" className="relative">
            {goals.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeGoal(index)}
                className="absolute top-2 right-2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor={`goal-title-${index}`}>Goal Title *</Label>
                <Input
                  id={`goal-title-${index}`}
                  value={goal.title}
                  onChange={(e) => updateGoal(index, 'title', e.target.value)}
                  placeholder="What do you want to achieve?"
                />
              </div>

              <div>
                <Label htmlFor={`goal-area-${index}`}>Life Area *</Label>
                <Select value={goal.area} onValueChange={(value) => updateGoal(index, 'area', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a life area" />
                  </SelectTrigger>
                  <SelectContent>
                    {lifeAreas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor={`goal-timeframe-${index}`}>Timeframe</Label>
                <Select value={goal.timeframe} onValueChange={(value) => updateGoal(index, 'timeframe', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="When do you want to achieve this?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-month">Within 1 month</SelectItem>
                    <SelectItem value="3-months">Within 3 months</SelectItem>
                    <SelectItem value="6-months">Within 6 months</SelectItem>
                    <SelectItem value="1-year">Within 1 year</SelectItem>
                    <SelectItem value="2-years">Within 2 years</SelectItem>
                    <SelectItem value="5-years">Within 5 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor={`goal-description-${index}`}>Description (Optional)</Label>
                <Textarea
                  id={`goal-description-${index}`}
                  value={goal.description}
                  onChange={(e) => updateGoal(index, 'description', e.target.value)}
                  placeholder="Add more details about this goal..."
                  rows={2}
                />
              </div>
            </div>
          </IOSCard>
        ))}

        <Button type="button" onClick={addGoal} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Another Goal
        </Button>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={validGoals === 0} 
            className="flex-1"
          >
            Continue ({validGoals} goals)
          </Button>
        </div>
      </div>
    </IOSCard>
  );
};
