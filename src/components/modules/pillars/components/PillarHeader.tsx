
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar } from 'lucide-react';

interface PillarHeaderProps {
  pillar: {
    id: string;
    name: string;
    description?: string;
  };
  energyDaysThisMonth: number;
  onBack: () => void;
}

export const PillarHeader = ({ pillar, energyDaysThisMonth, onBack }: PillarHeaderProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Pillars
      </Button>
      <div className="flex-1">
        <h2 className="text-2xl font-bold">{pillar.name}</h2>
        {pillar.description && (
          <p className="text-muted-foreground">{pillar.description}</p>
        )}
      </div>
      <Badge variant="outline" className="flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        {energyDaysThisMonth} days this month
      </Badge>
    </div>
  );
};
