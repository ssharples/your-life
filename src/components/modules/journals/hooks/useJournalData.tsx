
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useJournalData = () => {
  const queryClient = useQueryClient();

  // Fetch existing beliefs
  const { data: beliefs } = useQuery({
    queryKey: ['beliefs'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .eq('user_id', user.data.user.id)
        .eq('entry_type', 'belief')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch today's belief entries
  const { data: todayEntries } = useQuery({
    queryKey: ['todayBeliefs'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .eq('user_id', user.data.user.id)
        .eq('entry_type', 'daily_belief')
        .eq('date', today)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Create or update belief
  const createBelief = useMutation({
    mutationFn: async (beliefData: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('journals')
        .insert([{ 
          ...beliefData, 
          user_id: user.data.user.id,
          date: new Date().toISOString().split('T')[0],
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beliefs'] });
      queryClient.invalidateQueries({ queryKey: ['todayBeliefs'] });
      toast({ title: "Success", description: "Belief entry recorded successfully!" });
    },
    onError: (error) => {
      console.error('Error creating belief:', error);
      toast({ 
        title: "Error", 
        description: "Failed to record belief entry. Please try again.",
        variant: "destructive"
      });
    }
  });

  return {
    beliefs,
    todayEntries,
    createBelief
  };
};
