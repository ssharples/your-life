
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { DailyTaskReview } from './DailyTaskReview';
import { DailyHabitReview } from './DailyHabitReview';

interface GuidedReviewProps {
  reviewType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  reviewId?: string;
  onComplete: () => void;
  onCancel: () => void;
}

export const GuidedReview = ({ reviewType, reviewId, onComplete, onCancel }: GuidedReviewProps) => {
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
      setResponses(existingReview.template_responses || {});
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

  const handleNext = async () => {
    await saveProgress.mutateAsync({ isCompleted: false });
    
    if (templates && currentStep < templates.length) {
      setCurrentStep(currentStep + 1);
    } else {
      await completeReview();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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

  if (!templates) return <div>Loading...</div>;

  const currentTemplate = templates.find(t => t.step_number === currentStep);
  if (!currentTemplate) return <div>Template not found</div>;

  const progress = (currentStep / templates.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold capitalize">{reviewType} Review</h2>
          <p className="text-muted-foreground">Step {currentStep} of {templates.length}</p>
        </div>
        <Badge variant="outline" className="capitalize">{reviewType}</Badge>
      </div>

      <Progress value={progress} className="w-full" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {currentTemplate.step_title}
          </CardTitle>
          {currentTemplate.step_description && (
            <p className="text-muted-foreground">{currentTemplate.step_description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Special components for daily review */}
          {reviewType === 'daily' && currentStep === 1 && (
            <DailyTaskReview 
              responses={responses.tasks || []}
              onUpdate={(tasks) => updateResponse('tasks', tasks)}
            />
          )}
          
          {reviewType === 'daily' && currentStep === 2 && (
            <DailyHabitReview 
              responses={responses.habits || []}
              onUpdate={(habits) => updateResponse('habits', habits)}
            />
          )}

          {/* Standard prompts for all other steps */}
          {(reviewType !== 'daily' || (currentStep !== 1 && currentStep !== 2)) && (
            <div className="space-y-4">
              {JSON.parse(currentTemplate.prompts).map((prompt: string, index: number) => (
                <div key={index} className="space-y-2">
                  <label className="text-sm font-medium">{prompt}</label>
                  <Textarea
                    placeholder="Write your response here..."
                    value={responses[`step_${currentStep}_prompt_${index}`] || ''}
                    onChange={(e) => updateResponse(`step_${currentStep}_prompt_${index}`, e.target.value)}
                    rows={4}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          {currentStep > 1 && (
            <Button variant="outline" onClick={handlePrevious}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
          )}
        </div>
        
        <Button onClick={handleNext} disabled={saveProgress.isPending}>
          {currentStep === templates.length ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Review
            </>
          ) : (
            <>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
