
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePillarDashboardData = (pillarId: string) => {
  return useQuery({
    queryKey: ['pillar-dashboard', pillarId],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      // Fetch pillar details
      const { data: pillar, error: pillarError } = await supabase
        .from('pillars')
        .select('*')
        .eq('id', pillarId)
        .single();

      if (pillarError) throw pillarError;

      // Fetch related data in parallel
      const [goalsResult, projectsResult, habitsResult, knowledgeResult, energyLogsResult] = await Promise.all([
        // Goals
        supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.data.user.id)
          .eq('pillar_id', pillarId),

        // Projects with task counts
        supabase
          .from('los_projects')
          .select(`
            *,
            los_tasks(id)
          `)
          .eq('user_id', user.data.user.id)
          .eq('pillar_id', pillarId),

        // Habits (filter by goals that belong to this pillar)
        supabase
          .from('habits')
          .select(`
            *,
            goals!inner(pillar_id)
          `)
          .eq('user_id', user.data.user.id)
          .eq('goals.pillar_id', pillarId),

        // Knowledge (we'll need to add pillar linking later)
        supabase
          .from('knowledge_vault')
          .select('*')
          .eq('user_id', user.data.user.id),

        // Energy logs
        supabase
          .from('pillar_energy_logs')
          .select('*')
          .eq('user_id', user.data.user.id)
          .eq('pillar_id', pillarId)
          .order('date', { ascending: false })
      ]);

      if (goalsResult.error) throw goalsResult.error;
      if (projectsResult.error) throw projectsResult.error;
      if (habitsResult.error) throw habitsResult.error;
      if (knowledgeResult.error) throw knowledgeResult.error;
      if (energyLogsResult.error) throw energyLogsResult.error;

      // Process projects to add task counts
      const processedProjects = projectsResult.data?.map(project => ({
        ...project,
        taskCount: project.los_tasks?.length || 0
      })) || [];

      return {
        pillar,
        goals: goalsResult.data || [],
        projects: processedProjects,
        habits: habitsResult.data || [],
        knowledge: knowledgeResult.data || [],
        energyLogs: energyLogsResult.data || []
      };
    },
    enabled: !!pillarId,
  });
};
