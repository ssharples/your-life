
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Plus } from 'lucide-react';

interface ValueEmptyStateProps {
  onAddValue: () => void;
}

export const ValueEmptyState = ({ onAddValue }: ValueEmptyStateProps) => {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No values defined yet</h3>
        <p className="text-muted-foreground mb-4">
          Start by identifying your core values - the principles that guide your decisions and define who you are.
        </p>
        <Button onClick={onAddValue}>
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Value
        </Button>
      </CardContent>
    </Card>
  );
};
