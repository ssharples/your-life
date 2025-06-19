
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ValueLog {
  id: string;
  user_id: string;
  value_id: string;
  date: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export const useValueLogs = (valueId?: string) => {
  const queryClient = useQueryClient();

  const { data: valueLogs, isLoading } = useQuery({
    queryKey: ['value-logs', valueId],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      let query = supabase
        .from('value_logs')
        .select('*')
        .eq('user_id', user.data.user.id)
        .order('date', { ascending: false });

      if (valueId) {
        query = query.eq('value_id', valueId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ValueLog[];
    },
  });

  const createValueLog = useMutation({
    mutationFn: async (log: { value_id: string; description: string; date?: string }) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('value_logs')
        .insert([{
          user_id: user.data.user.id,
          value_id: log.value_id,
          description: log.description,
          date: log.date || new Date().toISOString().split('T')[0],
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['value-logs'] });
      toast({
        title: "Success",
        description: "Value log created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create value log. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    valueLogs,
    isLoading,
    createValueLog,
  };
};
