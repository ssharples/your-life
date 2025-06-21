
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { ProjectForm } from '../ProjectForm';

interface ProjectsTabProps {
  projects: any[];
  pillarId: string;
  onRefresh: () => void;
  onOpenProject: (projectId: string) => void;
}

export const ProjectsTab = ({ projects, pillarId, onRefresh, onOpenProject }: ProjectsTabProps) => {
  const [showProjectForm, setShowProjectForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Projects</h3>
        <Dialog open={showProjectForm} onOpenChange={setShowProjectForm}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
            </DialogHeader>
            <ProjectForm 
              defaultPillarId={pillarId}
              onSuccess={() => {
                setShowProjectForm(false);
                onRefresh();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onOpenProject(project.id)}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{project.title}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                  <Badge variant="outline">
                    {project.taskCount || 0} tasks
                  </Badge>
                </div>
              </div>
              {project.description && (
                <p className="text-sm text-muted-foreground">{project.description}</p>
              )}
            </CardHeader>
          </Card>
        ))}
        {projects.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No projects yet. Click "Add Project" to create your first project for this pillar.
          </p>
        )}
      </div>
    </div>
  );
};
