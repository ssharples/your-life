
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Goal {
  id: string;
  title: string;
}

export const useGoalsData = () => {
  return useQuery({
    queryKey: ['goals-for-values'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('goals')
        .select('id, title')
        .eq('user_id', user.data.user.id)
        .order('title');
      
      if (error) throw error;
      return data as Goal[];
    },
  });
};
