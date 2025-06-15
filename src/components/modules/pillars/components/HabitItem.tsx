
import { Badge } from '@/components/ui/badge';
import { Circle } from 'lucide-react';

interface Habit {
  id: string;
  title: string;
  status: string;
  frequency?: string;
}

interface HabitItemProps {
  habit: Habit;
  getStatusColor: (status: string) => string;
}

export const HabitItem = ({ habit, getStatusColor }: HabitItemProps) => {
  return (
    <div className="flex items-center justify-between text-xs p-2 bg-muted/30 rounded">
      <div className="flex items-center gap-2">
        <Circle className="h-2 w-2 fill-current text-orange-500" />
        <span>{habit.title}</span>
      </div>
      <div className="flex gap-1">
        <Badge className={getStatusColor(habit.status)}>
          {habit.status}
        </Badge>
        {habit.frequency && (
          <Badge className="bg-orange-100 text-orange-800">
            {habit.frequency}
          </Badge>
        )}
      </div>
    </div>
  );
};
