
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

      // For each pillar, fetch goals and their connected values
      const pillarsWithHierarchy = await Promise.all(
        pillars.map(async (pillar) => {
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

          // For each goal, get connected values
          const goalsWithValues = await Promise.all(
            (goals || []).map(async (goal) => {
              const { data: valueConnections } = await supabase
                .from('value_goal_connections')
                .select(`
                  value_id,
                  values_vault (*)
                `)
                .eq('goal_id', goal.id);

              const connectedValues = valueConnections?.map(conn => conn.values_vault).filter(Boolean) || [];

              return {
                ...goal,
                habits: goal.habits || [],
                projects: (goal.los_projects || []).map((project: any) => ({
                  ...project,
                  tasks: project.los_tasks || []
                })),
                connected_values: connectedValues
              };
            })
          );

          // Create a unique list of values for this pillar (from all connected goals)
          const pillarValues = new Map();
          goalsWithValues.forEach(goal => {
            goal.connected_values.forEach(value => {
              if (!pillarValues.has(value.id)) {
                pillarValues.set(value.id, {
                  id: value.id,
                  title: value.value, // Map 'value' field to 'title'
                  description: value.description,
                  goals: []
                });
              }
              pillarValues.get(value.id).goals.push({
                ...goal,
                connected_values: undefined // Remove to avoid circular reference
              });
            });
          });

          return {
            ...pillar,
            values: Array.from(pillarValues.values())
          };
        })
      );

      return pillarsWithHierarchy;
    },
  });
};
