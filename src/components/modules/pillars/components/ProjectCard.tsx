
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, FolderOpen, CheckSquare } from 'lucide-react';
import { TaskItem } from './TaskItem';

interface Task {
  id: string;
  title: string;
  status: string;
  priority?: string;
}

interface Project {
  id: string;
  title: string;
  status: string;
  tasks: Task[];
}

interface ProjectCardProps {
  project: Project;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
  expandedProjects: Set<string>;
  toggleProject: (projectId: string) => void;
}

export const ProjectCard = ({ 
  project, 
  getStatusColor, 
  getPriorityColor, 
  expandedProjects, 
  toggleProject 
}: ProjectCardProps) => {
  return (
    <Card className="border-l-4 border-l-purple-200">
      <Collapsible 
        open={expandedProjects.has(project.id)} 
        onOpenChange={() => toggleProject(project.id)}
      >
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/25 transition-colors py-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-3 w-3 text-purple-600" />
                <span className="text-xs font-medium">{project.title}</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
                <Badge className="bg-purple-100 text-purple-800">
                  {project.tasks.length} tasks
                </Badge>
                {expandedProjects.has(project.id) ? (
                  <ChevronDown className="h-2 w-2" />
                ) : (
                  <ChevronRight className="h-2 w-2" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 pb-1">
            {project.tasks.length === 0 ? (
              <div className="text-center py-2 text-muted-foreground text-xs">
                <CheckSquare className="h-4 w-4 mx-auto mb-1 opacity-50" />
                <p>No tasks in this project yet.</p>
              </div>
            ) : (
              <div className="ml-3 space-y-1">
                {project.tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    getStatusColor={getStatusColor}
                    getPriorityColor={getPriorityColor}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
