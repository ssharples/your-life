
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useGoalsData = () => {
  return useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('goals')
        .select(`
          *,
          pillars (name)
        `)
        .eq('user_id', user.data.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};
