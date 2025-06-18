
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, Edit, Trash2 } from 'lucide-react';
import { getImportanceColor } from './utils';

interface Pillar {
  id: string;
  name: string;
}

interface Value {
  id: string;
  value: string;
  description: string | null;
  importance_rating: number;
  created_at: string;
  connected_pillars?: Pillar[];
}

interface ValueCardProps {
  value: Value;
  onEdit: (value: Value) => void;
  onDelete: (valueId: string) => void;
}

export const ValueCard = ({ value, onEdit, onDelete }: ValueCardProps) => {
  return (
    <Card className={`border-2 ${getImportanceColor(value.importance_rating || 5)}`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            {value.value}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              <span className="text-sm font-normal">{value.importance_rating}/10</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(value)}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(value.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {value.description && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            {value.description}
          </p>
        )}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {value.connected_pillars && value.connected_pillars.length > 0 ? (
              value.connected_pillars.map((pillar) => (
                <Badge key={pillar.id} variant="outline" className="text-xs">
                  {pillar.name}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="text-xs">
                Unassigned
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Added: {new Date(value.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
