
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePillarsData = () => {
  return useQuery({
    queryKey: ['pillars-hierarchy'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      // Fetch pillars with all related data
      const { data: pillars, error: pillarsError } = await supabase
        .from('pillars')
        .select('*')
        .eq('user_id', user.data.user.id)
        .order('created_at', { ascending: false });
      
      if (pillarsError) throw pillarsError;

      // For each pillar, fetch values and their connected data
      const pillarsWithHierarchy = await Promise.all(
        pillars.map(async (pillar) => {
          // Get values connected to this specific pillar through the junction table
          const { data: valueConnections } = await supabase
            .from('value_pillar_connections')
            .select(`
              value_id,
              values_vault (*)
            `)
            .eq('pillar_id', pillar.id);

          const values = valueConnections?.map(conn => conn.values_vault).filter(Boolean) || [];

          // Get goals for this pillar
          const { data: goals } = await supabase
            .from('goals')
            .select(`
              *,
              habits(*),
              los_projects(*, los_tasks(*))
            `)
            .eq('user_id', user.data.user.id)
            .eq('pillar_id', pillar.id);

          // Create values with their connected goals
          const valuesWithGoals = values?.map(value => ({
            id: value.id,
            title: value.value, // Map 'value' field to 'title'
            description: value.description,
            goals: goals?.map(goal => ({
              ...goal,
              habits: goal.habits || [],
              projects: (goal.los_projects || []).map((project: any) => ({
                ...project,
                tasks: project.los_tasks || []
              }))
            })) || []
          })) || [];

          return {
            ...pillar,
            values: valuesWithGoals
          };
        })
      );

      return pillarsWithHierarchy;
    },
  });
};
