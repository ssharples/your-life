
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { GoalForm } from '../../goals/GoalForm';

interface GoalsTabProps {
  goals: any[];
  pillarId: string;
  onRefresh: () => void;
}

export const GoalsTab = ({ goals, pillarId, onRefresh }: GoalsTabProps) => {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [goalType, setGoalType] = useState<'short-term' | 'long-term'>('short-term');
  const [goalTargetDate, setGoalTargetDate] = useState('');
  const [goalPriority, setGoalPriority] = useState(3);
  const [goalPillarId, setGoalPillarId] = useState(pillarId);

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle goal creation logic here
    console.log('Creating goal with pillar:', goalPillarId);
    setShowGoalForm(false);
    onRefresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Goals</h3>
        <Dialog open={showGoalForm} onOpenChange={setShowGoalForm}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
            </DialogHeader>
            <GoalForm 
              title={goalTitle}
              setTitle={setGoalTitle}
              description={goalDescription}
              setDescription={setGoalDescription}
              type={goalType}
              setType={setGoalType}
              targetDate={goalTargetDate}
              setTargetDate={setGoalTargetDate}
              priority={goalPriority}
              setPriority={setGoalPriority}
              pillarId={goalPillarId}
              setPillarId={setGoalPillarId}
              onSubmit={handleGoalSubmit}
              isEditing={false}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4">
        {goals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{goal.title}</CardTitle>
                <Badge variant={goal.status === 'active' ? 'default' : 'secondary'}>
                  {goal.status}
                </Badge>
              </div>
              {goal.description && (
                <p className="text-sm text-muted-foreground">{goal.description}</p>
              )}
            </CardHeader>
          </Card>
        ))}
        {goals.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No goals yet. Click "Add Goal" to create your first goal for this pillar.
          </p>
        )}
      </div>
    </div>
  );
};
