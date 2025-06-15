
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UseReviewDataProps {
  reviewType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  reviewId?: string;
  onComplete: () => void;
}

export const useReviewData = ({ reviewType, reviewId, onComplete }: UseReviewDataProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const queryClient = useQueryClient();

  const { data: templates } = useQuery({
    queryKey: ['review-templates', reviewType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('review_templates')
        .select('*')
        .eq('review_type', reviewType)
        .order('step_number');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: existingReview } = useQuery({
    queryKey: ['review', reviewId],
    queryFn: async () => {
      if (!reviewId) return null;
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('id', reviewId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!reviewId,
  });

  useEffect(() => {
    if (existingReview) {
      setCurrentStep(existingReview.review_step || 1);
      // Safely handle the Json type from Supabase
      const templateResponses = existingReview.template_responses;
      if (templateResponses && typeof templateResponses === 'object' && !Array.isArray(templateResponses)) {
        setResponses(templateResponses as Record<string, any>);
      }
    }
  }, [existingReview]);

  const saveProgress = useMutation({
    mutationFn: async (data: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      if (reviewId) {
        const { error } = await supabase
          .from('reviews')
          .update({
            template_responses: responses,
            review_step: currentStep,
            is_completed: data.isCompleted || false,
          })
          .eq('id', reviewId);
        
        if (error) throw error;
      } else {
        const { data: newReview, error } = await supabase
          .from('reviews')
          .insert([{
            user_id: user.data.user.id,
            review_type: reviewType,
            date: new Date().toISOString().split('T')[0],
            template_responses: responses,
            review_step: currentStep,
            is_completed: data.isCompleted || false,
          }])
          .select()
          .single();
        
        if (error) throw error;
        return newReview;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });

  const completeReview = async () => {
    await saveProgress.mutateAsync({ isCompleted: true });
    toast({ title: "Review completed!", description: `Your ${reviewType} review has been saved.` });
    onComplete();
  };

  const updateResponse = (key: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return {
    currentStep,
    setCurrentStep,
    responses,
    updateResponse,
    templates,
    saveProgress,
    completeReview,
  };
};
