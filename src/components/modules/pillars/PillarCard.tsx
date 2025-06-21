
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Target, CheckSquare, Book, Dumbbell, FolderOpen } from 'lucide-react';

interface PillarCardProps {
  pillar: {
    id: string;
    name: string;
    description?: string;
    goalCount?: number;
    projectCount?: number;
    taskCount?: number;
    habitCount?: number;
    knowledgeCount?: number;
    energyDays?: number; // days this month energy was put into this pillar
  };
  onOpenDashboard: (pillarId: string) => void;
}

export const PillarCard = ({ pillar, onOpenDashboard }: PillarCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => onOpenDashboard(pillar.id)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{pillar.name}</CardTitle>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        {pillar.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{pillar.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Target className="h-3 w-3 text-blue-600" />
            <span>{pillar.goalCount || 0} Goals</span>
          </div>
          <div className="flex items-center gap-2">
            <FolderOpen className="h-3 w-3 text-purple-600" />
            <span>{pillar.projectCount || 0} Projects</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckSquare className="h-3 w-3 text-green-600" />
            <span>{pillar.taskCount || 0} Tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <Dumbbell className="h-3 w-3 text-orange-600" />
            <span>{pillar.habitCount || 0} Habits</span>
          </div>
        </div>

        {/* Energy tracking */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Energy this month</span>
            <Badge variant={pillar.energyDays && pillar.energyDays > 0 ? "default" : "outline"}>
              {pillar.energyDays || 0} days
            </Badge>
          </div>
        </div>

        <Button variant="ghost" size="sm" className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          Open Dashboard
          <ChevronRight className="h-3 w-3" />
        </Button>
      </CardContent>
    </Card>
  );
};
