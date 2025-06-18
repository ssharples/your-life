
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useValueMutations = () => {
  const queryClient = useQueryClient();

  const createOrUpdateValue = useMutation({
    mutationFn: async (valueData: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      if (valueData.isEditing) {
        // Update the value
        const { data, error } = await supabase
          .from('values_vault')
          .update({
            value: valueData.value,
            description: valueData.description,
            importance_rating: valueData.importance_rating
          })
          .eq('id', valueData.id)
          .eq('user_id', user.data.user.id)
          .select();
        
        if (error) throw error;

        // Remove existing pillar connections
        await supabase
          .from('value_pillar_connections')
          .delete()
          .eq('value_id', valueData.id);

        // Add new pillar connections
        if (valueData.pillar_ids && valueData.pillar_ids.length > 0) {
          const connections = valueData.pillar_ids.map((pillarId: string) => ({
            value_id: valueData.id,
            pillar_id: pillarId
          }));

          await supabase
            .from('value_pillar_connections')
            .insert(connections);
        }

        return data;
      } else {
        // Create new value
        const { data, error } = await supabase
          .from('values_vault')
          .insert([{ 
            value: valueData.value,
            description: valueData.description,
            importance_rating: valueData.importance_rating,
            user_id: user.data.user.id
          }])
          .select();
        
        if (error) throw error;

        // Add pillar connections
        if (valueData.pillar_ids && valueData.pillar_ids.length > 0 && data[0]) {
          const connections = valueData.pillar_ids.map((pillarId: string) => ({
            value_id: data[0].id,
            pillar_id: pillarId
          }));

          await supabase
            .from('value_pillar_connections')
            .insert(connections);
        }

        return data;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['values-vault'] });
      queryClient.invalidateQueries({ queryKey: ['pillars-hierarchy'] });
      toast({ 
        title: "Success", 
        description: variables.isEditing ? "Value updated successfully!" : "Value added successfully!" 
      });
    },
  });

  const deleteValue = useMutation({
    mutationFn: async (valueId: string) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      // Delete pillar connections first (will be handled by CASCADE, but being explicit)
      await supabase
        .from('value_pillar_connections')
        .delete()
        .eq('value_id', valueId);

      const { error } = await supabase
        .from('values_vault')
        .delete()
        .eq('id', valueId)
        .eq('user_id', user.data.user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['values-vault'] });
      queryClient.invalidateQueries({ queryKey: ['pillars-hierarchy'] });
      toast({ title: "Success", description: "Value deleted successfully!" });
    },
  });

  return { createOrUpdateValue, deleteValue };
};
