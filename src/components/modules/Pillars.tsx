
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PillarsGuide } from '@/components/guides/PillarsGuide';
import { useHelp } from '@/contexts/HelpContext';
import { PillarForm } from './pillars/components/PillarForm';
import { PillarCard } from './pillars/PillarCard';
import { PillarDashboard } from './pillars/PillarDashboard';
import { ProjectView } from './pillars/ProjectView';
import { usePillarDashboardData } from './pillars/hooks/usePillarDashboardData';
import { useProjectTasks } from './pillars/hooks/useProjectTasks';

export const Pillars = () => {
  const { showHelp } = useHelp();
  const [selectedPillarId, setSelectedPillarId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Fetch pillars with stats
  const { data: pillarsData, refetch: refetchPillars } = useQuery({
    queryKey: ['pillars-overview'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const { data: pillars, error } = await supabase
        .from('pillars')
        .select('*')
        .eq('user_id', user.data.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      // Get stats for each pillar
      const pillarsWithStats = await Promise.all(
        pillars.map(async (pillar) => {
          const [goals, projects, habits, knowledge, energyLogs] = await Promise.all([
            supabase.from('goals').select('id').eq('user_id', user.data.user.id).eq('pillar_id', pillar.id),
            supabase.from('los_projects').select('id').eq('user_id', user.data.user.id).eq('pillar_id', pillar.id),
            supabase.from('habits').select('id, goals!inner(pillar_id)').eq('user_id', user.data.user.id).eq('goals.pillar_id', pillar.id),
            supabase.from('knowledge_vault').select('id').eq('user_id', user.data.user.id),
            supabase.from('pillar_energy_logs').select('id').eq('user_id', user.data.user.id).eq('pillar_id', pillar.id).gte('date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0])
          ]);

          // Get task count from projects
          const { data: tasks } = await supabase
            .from('los_tasks')
            .select('id')
            .eq('user_id', user.data.user.id)
            .in('project_id', projects.data?.map(p => p.id) || []);

          return {
            ...pillar,
            goalCount: goals.data?.length || 0,
            projectCount: projects.data?.length || 0,
            taskCount: tasks?.length || 0,
            habitCount: habits.data?.length || 0,
            knowledgeCount: knowledge.data?.length || 0,
            energyDays: energyLogs.data?.length || 0
          };
        })
      );

      return pillarsWithStats;
    },
  });

  // Fetch pillar dashboard data when a pillar is selected
  const pillarDashboardQuery = usePillarDashboardData(selectedPillarId || '');
  
  // Fetch project tasks when a project is selected
  const projectTasksQuery = useProjectTasks(selectedProjectId || '');

  const handleRefresh = () => {
    refetchPillars();
    if (selectedPillarId) {
      pillarDashboardQuery.refetch();
    }
    if (selectedProjectId) {
      projectTasksQuery.refetch();
    }
  };

  // Show project view
  if (selectedProjectId && projectTasksQuery.data && pillarDashboardQuery.data) {
    const project = pillarDashboardQuery.data.projects.find(p => p.id === selectedProjectId);
    if (!project) return null;

    return (
      <ProjectView
        project={project}
        tasks={projectTasksQuery.data}
        onBack={() => setSelectedProjectId(null)}
        onRefresh={handleRefresh}
      />
    );
  }

  // Show pillar dashboard
  if (selectedPillarId && pillarDashboardQuery.data) {
    return (
      <PillarDashboard
        pillar={pillarDashboardQuery.data.pillar}
        goals={pillarDashboardQuery.data.goals}
        projects={pillarDashboardQuery.data.projects}
        habits={pillarDashboardQuery.data.habits}
        knowledge={pillarDashboardQuery.data.knowledge}
        energyLogs={pillarDashboardQuery.data.energyLogs}
        onBack={() => setSelectedPillarId(null)}
        onRefresh={handleRefresh}
        onOpenProject={(projectId) => setSelectedProjectId(projectId)}
      />
    );
  }

  // Show pillars overview
  return (
    <div className="space-y-6">
      {showHelp && <PillarsGuide />}
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Life Pillars</h2>
          <p className="text-muted-foreground">Organize your life around core pillars and track your energy allocation</p>
        </div>
        <PillarForm />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pillarsData?.map((pillar) => (
          <PillarCard
            key={pillar.id}
            pillar={pillar}
            onOpenDashboard={(pillarId) => setSelectedPillarId(pillarId)}
          />
        ))}
      </div>

      {(!pillarsData || pillarsData.length === 0) && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No pillars yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first life pillar to start organizing your goals, projects, and habits.
          </p>
          <PillarForm />
        </div>
      )}
    </div>
  );
};
