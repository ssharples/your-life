
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, CheckSquare, Circle, Clock } from 'lucide-react';
import { TaskInput } from '../tasks/TaskInput';

interface ProjectViewProps {
  project: {
    id: string;
    title: string;
    description?: string;
    status: string;
    start_date?: string;
    end_date?: string;
  };
  tasks: any[];
  onBack: () => void;
  onRefresh: () => void;
}

export const ProjectView = ({ project, tasks, onBack, onRefresh }: ProjectViewProps) => {
  const [showTaskForm, setShowTaskForm] = useState(false);

  const completedTasks = tasks.filter(task => task.status === 'completed');
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress');

  const handleTaskSubmit = async (taskData: any) => {
    // TaskInput will handle the creation, we just need to refresh
    setShowTaskForm(false);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pillar
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">{project.title}</h2>
            <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
              {project.status}
            </Badge>
          </div>
          {project.description && (
            <p className="text-muted-foreground">{project.description}</p>
          )}
          {(project.start_date || project.end_date) && (
            <div className="flex gap-4 text-sm text-muted-foreground mt-2">
              {project.start_date && <span>Start: {new Date(project.start_date).toLocaleDateString()}</span>}
              {project.end_date && <span>End: {new Date(project.end_date).toLocaleDateString()}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Task Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckSquare className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressTasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Circle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{pendingTasks.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Add Task */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tasks</CardTitle>
            <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Task to {project.title}</DialogTitle>
                </DialogHeader>
                <TaskInput
                  onSubmit={handleTaskSubmit}
                  projects={[{ id: project.id, title: project.title }]}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Task Groups */}
          {inProgressTasks.length > 0 && (
            <div>
              <h4 className="font-medium text-blue-600 mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                In Progress
              </h4>
              <div className="space-y-2 pl-6">
                {inProgressTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-2 border rounded">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="flex-1">{task.description}</span>
                    {task.due_date && (
                      <Badge variant="outline">
                        {new Date(task.due_date).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {pendingTasks.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-600 mb-2 flex items-center gap-2">
                <Circle className="h-4 w-4" />
                Pending
              </h4>
              <div className="space-y-2 pl-6">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-2 border rounded">
                    <Circle className="h-4 w-4 text-gray-400" />
                    <span className="flex-1">{task.description}</span>
                    {task.due_date && (
                      <Badge variant="outline">
                        {new Date(task.due_date).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {completedTasks.length > 0 && (
            <div>
              <h4 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Completed
              </h4>
              <div className="space-y-2 pl-6">
                {completedTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-2 border rounded opacity-75">
                    <CheckSquare className="h-4 w-4 text-green-600" />
                    <span className="flex-1 line-through">{task.description}</span>
                    {task.due_date && (
                      <Badge variant="outline">
                        {new Date(task.due_date).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tasks.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No tasks yet. Click "Add Task" to create your first task for this project.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
