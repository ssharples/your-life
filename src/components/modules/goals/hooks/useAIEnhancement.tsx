
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AIGoalSuggestions {
  specificDetails: string;
  measurementCriteria: string;
  achievabilityNotes: string;
  relevanceReason: string;
  suggestedTimeframe: string;
}

export const useAIEnhancement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enhanceGoal = async (goalTitle: string): Promise<AIGoalSuggestions | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('enhance-goal-with-ai', {
        body: { goalTitle }
      });

      if (error) throw error;

      return data.suggestions;
    } catch (err) {
      console.error('Error enhancing goal:', err);
      setError(err instanceof Error ? err.message : 'Failed to enhance goal');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { enhanceGoal, isLoading, error };
};
