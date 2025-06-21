
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Target, FolderOpen, CheckSquare, Book, Dumbbell, Calendar } from 'lucide-react';
import { GoalForm } from '../goals/GoalForm';
import { HabitForm } from '../habits/HabitForm';
import { ProjectForm } from './ProjectForm';
import { KnowledgeForm } from './KnowledgeForm';
import { ProjectView } from './ProjectView';

interface PillarDashboardProps {
  pillar: {
    id: string;
    name: string;
    description?: string;
  };
  goals: any[];
  projects: any[];
  habits: any[];
  knowledge: any[];
  energyLogs: any[];
  onBack: () => void;
  onRefresh: () => void;
  onOpenProject: (projectId: string) => void;
}

export const PillarDashboard = ({ 
  pillar, 
  goals, 
  projects, 
  habits, 
  knowledge, 
  energyLogs,
  onBack,
  onRefresh,
  onOpenProject
}: PillarDashboardProps) => {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [showKnowledgeForm, setShowKnowledgeForm] = useState(false);

  // Goal form state
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [goalType, setGoalType] = useState<'short-term' | 'long-term'>('short-term');
  const [goalTargetDate, setGoalTargetDate] = useState('');
  const [goalPriority, setGoalPriority] = useState(3);
  const [goalPillarId, setGoalPillarId] = useState(pillar.id);

  // Calculate energy days for current month
  const currentMonth = new Date();
  const energyDaysThisMonth = energyLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getMonth() === currentMonth.getMonth() && 
           logDate.getFullYear() === currentMonth.getFullYear();
  }).length;

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle goal creation logic here
    console.log('Creating goal with pillar:', goalPillarId);
    setShowGoalForm(false);
    onRefresh();
  };

  const handleHabitSubmit = (data: any) => {
    // Handle habit creation logic here
    console.log('Creating habit for pillar:', pillar.id);
    setShowHabitForm(false);
    onRefresh();
  };

  const handleHabitCancel = () => {
    setShowHabitForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals ({goals.length})</TabsTrigger>
          <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
          <TabsTrigger value="habits">Habits ({habits.length})</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge ({knowledge.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Goals</CardTitle>
                <Target className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{goals.length}</div>
                <p className="text-xs text-muted-foreground">
                  {goals.filter(g => g.status === 'active').length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projects</CardTitle>
                <FolderOpen className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
                <p className="text-xs text-muted-foreground">
                  {projects.filter(p => p.status === 'active').length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Habits</CardTitle>
                <Dumbbell className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{habits.length}</div>
                <p className="text-xs text-muted-foreground">
                  {habits.filter(h => h.status === 'active').length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Knowledge</CardTitle>
                <Book className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{knowledge.length}</div>
                <p className="text-xs text-muted-foreground">
                  Sources & insights
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Energy Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              {energyLogs.length > 0 ? (
                <div className="space-y-2">
                  {energyLogs.slice(0, 5).map((log: any) => (
                    <div key={log.id} className="flex items-center justify-between text-sm">
                      <span>Energy allocated</span>
                      <span className="text-muted-foreground">
                        {new Date(log.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No energy tracking yet. Complete daily reviews to start tracking.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Goals</h3>
            <Dialog open={showGoalForm} onOpenChange={setShowGoalForm}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Goal</DialogTitle>
                </DialogHeader>
                <GoalForm 
                  title={goalTitle}
                  setTitle={setGoalTitle}
                  description={goalDescription}
                  setDescription={setGoalDescription}
                  type={goalType}
                  setType={setGoalType}
                  targetDate={goalTargetDate}
                  setTargetDate={setGoalTargetDate}
                  priority={goalPriority}
                  setPriority={setGoalPriority}
                  pillarId={goalPillarId}
                  setPillarId={setGoalPillarId}
                  onSubmit={handleGoalSubmit}
                  isEditing={false}
                />
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid gap-4">
            {goals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{goal.title}</CardTitle>
                    <Badge variant={goal.status === 'active' ? 'default' : 'secondary'}>
                      {goal.status}
                    </Badge>
                  </div>
                  {goal.description && (
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  )}
                </CardHeader>
              </Card>
            ))}
            {goals.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No goals yet. Click "Add Goal" to create your first goal for this pillar.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
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
                  defaultPillarId={pillar.id}
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
        </TabsContent>

        <TabsContent value="habits" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Habits</h3>
            <Dialog open={showHabitForm} onOpenChange={setShowHabitForm}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Habit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Habit</DialogTitle>
                </DialogHeader>
                <HabitForm 
                  onSubmit={handleHabitSubmit}
                  onCancel={handleHabitCancel}
                />
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid gap-4">
            {habits.map((habit) => (
              <Card key={habit.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{habit.title}</CardTitle>
                    <Badge variant={habit.status === 'active' ? 'default' : 'secondary'}>
                      {habit.status}
                    </Badge>
                  </div>
                  {habit.description && (
                    <p className="text-sm text-muted-foreground">{habit.description}</p>
                  )}
                </CardHeader>
              </Card>
            ))}
            {habits.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No habits yet. Click "Add Habit" to create your first habit for this pillar.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Knowledge Sources</h3>
            <Dialog open={showKnowledgeForm} onOpenChange={setShowKnowledgeForm}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Knowledge
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Knowledge Source</DialogTitle>
                </DialogHeader>
                <KnowledgeForm 
                  defaultPillarId={pillar.id}
                  onSuccess={() => {
                    setShowKnowledgeForm(false);
                    onRefresh();
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid gap-4">
            {knowledge.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-3">{item.content}</p>
                  {item.source && (
                    <Badge variant="outline" className="w-fit">
                      {item.source}
                    </Badge>
                  )}
                </CardHeader>
              </Card>
            ))}
            {knowledge.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No knowledge sources yet. Click "Add Knowledge" to capture insights for this pillar.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
