
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FolderOpen, CheckCircle2, Clock } from 'lucide-react';

export const ActiveProjectsWidget = () => {
  const { data: activeProjects } = useQuery({
    queryKey: ['active-projects-with-tasks'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data: projects, error: projectsError } = await supabase
        .from('los_projects')
        .select(`
          *,
          goals (title),
          pillars (name)
        `)
        .eq('user_id', user.data.user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(3);

      if (projectsError) throw projectsError;

      if (!projects || projects.length === 0) return [];

      // Get tasks for each project
      const projectsWithTasks = await Promise.all(
        projects.map(async (project) => {
          const { data: tasks, error: tasksError } = await supabase
            .from('los_tasks')
            .select('*')
            .eq('user_id', user.data.user.id)
            .eq('project_id', project.id)
            .order('created_at', { ascending: false })
            .limit(5);

          if (tasksError) throw tasksError;

          const completedTasks = tasks?.filter(task => task.status === 'completed').length || 0;
          const totalTasks = tasks?.length || 0;
          const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

          return {
            ...project,
            tasks: tasks || [],
            progress,
            completedTasks,
            totalTasks,
          };
        })
      );

      return projectsWithTasks;
    },
  });

  if (!activeProjects?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Active Projects
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeProjects.map((project) => (
          <div key={project.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{project.title}</h4>
              <Badge variant="outline">{project.status}</Badge>
            </div>
            
            {project.description && (
              <p className="text-sm text-muted-foreground">{project.description}</p>
            )}

            <div className="flex items-center gap-4 text-sm">
              {project.goals && (
                <Badge variant="secondary">{project.goals.title}</Badge>
              )}
              {project.pillars && (
                <Badge variant="outline">{project.pillars.name}</Badge>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{project.completedTasks}/{project.totalTasks} tasks</span>
              </div>
              <Progress value={project.progress} className="w-full" />
            </div>

            {project.tasks.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Recent Tasks:</p>
                {project.tasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center gap-2 text-sm">
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                    <span className={task.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
