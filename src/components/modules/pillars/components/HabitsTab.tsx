
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { HabitForm } from '../../habits/HabitForm';

interface HabitsTabProps {
  habits: any[];
  pillarId: string;
  onRefresh: () => void;
}

export const HabitsTab = ({ habits, pillarId, onRefresh }: HabitsTabProps) => {
  const [showHabitForm, setShowHabitForm] = useState(false);

  const handleHabitSubmit = (data: any) => {
    // Handle habit creation logic here
    console.log('Creating habit for pillar:', pillarId);
    setShowHabitForm(false);
    onRefresh();
  };

  const handleHabitCancel = () => {
    setShowHabitForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Habits</h3>
        <Dialog open={showHabitForm} onOpenChange={setShowHabitForm}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Habit</DialogTitle>
            </DialogHeader>
            <HabitForm 
              onSubmit={handleHabitSubmit}
              onCancel={handleHabitCancel}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4">
        {habits.map((habit) => (
          <Card key={habit.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{habit.title}</CardTitle>
                <Badge variant={habit.status === 'active' ? 'default' : 'secondary'}>
                  {habit.status}
                </Badge>
              </div>
              {habit.description && (
                <p className="text-sm text-muted-foreground">{habit.description}</p>
              )}
            </CardHeader>
          </Card>
        ))}
        {habits.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No habits yet. Click "Add Habit" to create your first habit for this pillar.
          </p>
        )}
      </div>
    </div>
  );
};
