
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { SmartGoalWizard } from './SmartGoalWizard';

interface Pillar {
  id: string;
  name: string;
}

interface GoalsHeaderProps {
  pillars?: Pillar[];
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  onCreateGoal: (goalData: any) => void;
}

export const GoalsHeader = ({ 
  pillars, 
  isDialogOpen, 
  setIsDialogOpen, 
  onCreateGoal 
}: GoalsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Goals</h2>
        <p className="text-muted-foreground">Create SMART goals to achieve your objectives</p>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add SMART Goal
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create a SMART Goal</DialogTitle>
          </DialogHeader>
          <SmartGoalWizard
            pillars={pillars}
            onSubmit={onCreateGoal}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
