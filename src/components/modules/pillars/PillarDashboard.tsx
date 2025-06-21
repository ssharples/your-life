
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PillarHeader } from './components/PillarHeader';
import { PillarOverview } from './components/PillarOverview';
import { GoalsTab } from './components/GoalsTab';
import { ProjectsTab } from './components/ProjectsTab';
import { HabitsTab } from './components/HabitsTab';
import { KnowledgeTab } from './components/KnowledgeTab';

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
  // Calculate energy days for current month
  const currentMonth = new Date();
  const energyDaysThisMonth = energyLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getMonth() === currentMonth.getMonth() && 
           logDate.getFullYear() === currentMonth.getFullYear();
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PillarHeader 
        pillar={pillar}
        energyDaysThisMonth={energyDaysThisMonth}
        onBack={onBack}
      />

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals ({goals.length})</TabsTrigger>
          <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
          <TabsTrigger value="habits">Habits ({habits.length})</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge ({knowledge.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <PillarOverview 
            goals={goals}
            projects={projects}
            habits={habits}
            knowledge={knowledge}
            energyLogs={energyLogs}
          />
        </TabsContent>

        <TabsContent value="goals">
          <GoalsTab 
            goals={goals}
            pillarId={pillar.id}
            onRefresh={onRefresh}
          />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectsTab 
            projects={projects}
            pillarId={pillar.id}
            onRefresh={onRefresh}
            onOpenProject={onOpenProject}
          />
        </TabsContent>

        <TabsContent value="habits">
          <HabitsTab 
            habits={habits}
            pillarId={pillar.id}
            onRefresh={onRefresh}
          />
        </TabsContent>

        <TabsContent value="knowledge">
          <KnowledgeTab 
            knowledge={knowledge}
            pillarId={pillar.id}
            onRefresh={onRefresh}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
