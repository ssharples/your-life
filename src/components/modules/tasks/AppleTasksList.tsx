
import { AppleTaskCard } from './AppleTaskCard';
import { Badge } from '@/components/ui/badge';

interface AppleTasksListProps {
  tasks: any[];
  title: string;
  onStatusUpdate: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
  emptyMessage?: string;
}

export const AppleTasksList = ({ 
  tasks, 
  title, 
  onStatusUpdate, 
  onDelete,
  emptyMessage = "No tasks"
}: AppleTasksListProps) => {
  const groupTasksByTime = (tasks: any[]) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const groups = {
      overdue: [] as any[],
      today: [] as any[],
      tomorrow: [] as any[],
      upcoming: [] as any[],
      noDate: [] as any[]
    };

    tasks.forEach(task => {
      if (!task.due_date) {
        groups.noDate.push(task);
      } else if (task.due_date < todayStr) {
        groups.overdue.push(task);
      } else if (task.due_date === todayStr) {
        groups.today.push(task);
      } else if (task.due_date === tomorrowStr) {
        groups.tomorrow.push(task);
      } else {
        groups.upcoming.push(task);
      }
    });

    return groups;
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  // For completed tasks, show them all together
  if (title.includes('Completed')) {
    return (
      <div className="space-y-1">
        {tasks.map((task) => (
          <AppleTaskCard
            key={task.id}
            task={task}
            onStatusUpdate={onStatusUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  // For active tasks, group by time
  const groups = groupTasksByTime(tasks);

  return (
    <div className="space-y-4">
      {groups.overdue.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-sm font-medium text-red-600">Overdue</h4>
            <Badge variant="destructive" className="h-5 text-xs">
              {groups.overdue.length}
            </Badge>
          </div>
          <div className="space-y-1">
            {groups.overdue.map((task) => (
              <AppleTaskCard
                key={task.id}
                task={task}
                onStatusUpdate={onStatusUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {groups.today.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-sm font-medium text-blue-600">Today</h4>
            <Badge variant="default" className="h-5 text-xs">
              {groups.today.length}
            </Badge>
          </div>
          <div className="space-y-1">
            {groups.today.map((task) => (
              <AppleTaskCard
                key={task.id}
                task={task}
                onStatusUpdate={onStatusUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {groups.tomorrow.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-sm font-medium text-orange-600">Tomorrow</h4>
            <Badge variant="secondary" className="h-5 text-xs">
              {groups.tomorrow.length}
            </Badge>
          </div>
          <div className="space-y-1">
            {groups.tomorrow.map((task) => (
              <AppleTaskCard
                key={task.id}
                task={task}
                onStatusUpdate={onStatusUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {groups.upcoming.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-sm font-medium text-gray-600">Upcoming</h4>
            <Badge variant="outline" className="h-5 text-xs">
              {groups.upcoming.length}
            </Badge>
          </div>
          <div className="space-y-1">
            {groups.upcoming.map((task) => (
              <AppleTaskCard
                key={task.id}
                task={task}
                onStatusUpdate={onStatusUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {groups.noDate.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-sm font-medium text-gray-600">No Date</h4>
            <Badge variant="outline" className="h-5 text-xs">
              {groups.noDate.length}
            </Badge>
          </div>
          <div className="space-y-1">
            {groups.noDate.map((task) => (
              <AppleTaskCard
                key={task.id}
                task={task}
                onStatusUpdate={onStatusUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
