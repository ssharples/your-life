
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAffirmationGenerator = () => {
  const [isGeneratingAffirmation, setIsGeneratingAffirmation] = useState(false);
  const [generatedAffirmation, setGeneratedAffirmation] = useState('');

  const generateAffirmation = async (negativeThought: string) => {
    setIsGeneratingAffirmation(true);
    try {
      const response = await supabase.functions.invoke('generate-affirmation', {
        body: { negativeThought }
      });

      if (response.error) throw response.error;
      setGeneratedAffirmation(response.data.affirmation);
    } catch (error) {
      console.error('Failed to generate affirmation:', error);
      toast({ 
        title: "Error", 
        description: "Failed to generate affirmation. Please try writing one manually.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAffirmation(false);
    }
  };

  const resetAffirmation = () => {
    setGeneratedAffirmation('');
  };

  return {
    isGeneratingAffirmation,
    generatedAffirmation,
    generateAffirmation,
    resetAffirmation
  };
};
