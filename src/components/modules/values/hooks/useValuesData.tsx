
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Value {
  id: string;
  value: string;
  description: string | null;
  importance_rating: number;
  created_at: string;
  connected_pillars?: Array<{
    id: string;
    name: string;
  }>;
}

export const useValuesData = () => {
  return useQuery({
    queryKey: ['values-vault'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      // Get values
      const { data: valuesData, error: valuesError } = await supabase
        .from('values_vault')
        .select('*')
        .eq('user_id', user.data.user.id)
        .order('importance_rating', { ascending: false });
      
      if (valuesError) throw valuesError;

      // Get pillar connections for each value
      const valuesWithPillars = await Promise.all(
        valuesData.map(async (valueItem) => {
          const { data: connections } = await supabase
            .from('value_pillar_connections')
            .select(`
              pillar_id,
              pillars (id, name)
            `)
            .eq('value_id', valueItem.id);

          return {
            ...valueItem,
            connected_pillars: connections?.map(conn => conn.pillars).filter(Boolean) || []
          };
        })
      );
      
      return valuesWithPillars as Value[];
    },
  });
};
