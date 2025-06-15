
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle } from 'lucide-react';
import { DailyTaskReview } from '../DailyTaskReview';
import { DailyHabitReview } from '../DailyHabitReview';

interface ReviewStepContentProps {
  reviewType: string;
  currentStep: number;
  template: any;
  responses: Record<string, any>;
  onUpdateResponse: (key: string, value: any) => void;
}

export const ReviewStepContent = ({ 
  reviewType, 
  currentStep, 
  template, 
  responses, 
  onUpdateResponse 
}: ReviewStepContentProps) => {
  // Safely parse prompts from Json type
  let prompts: string[] = [];
  try {
    if (template.prompts && Array.isArray(template.prompts)) {
      prompts = template.prompts as string[];
    } else if (typeof template.prompts === 'string') {
      prompts = JSON.parse(template.prompts);
    }
  } catch (error) {
    console.error('Error parsing prompts:', error);
    prompts = [];
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          {template.step_title}
        </CardTitle>
        {template.step_description && (
          <p className="text-muted-foreground">{template.step_description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Special components for daily review */}
        {reviewType === 'daily' && currentStep === 1 && (
          <DailyTaskReview 
            responses={responses.tasks || []}
            onUpdate={(tasks) => onUpdateResponse('tasks', tasks)}
          />
        )}
        
        {reviewType === 'daily' && currentStep === 2 && (
          <DailyHabitReview 
            responses={responses.habits || []}
            onUpdate={(habits) => onUpdateResponse('habits', habits)}
          />
        )}

        {/* Standard prompts for all other steps */}
        {(reviewType !== 'daily' || (currentStep !== 1 && currentStep !== 2)) && (
          <div className="space-y-4">
            {prompts.map((prompt: string, index: number) => (
              <div key={index} className="space-y-2">
                <label className="text-sm font-medium">{prompt}</label>
                <Textarea
                  placeholder="Write your response here..."
                  value={responses[`step_${currentStep}_prompt_${index}`] || ''}
                  onChange={(e) => onUpdateResponse(`step_${currentStep}_prompt_${index}`, e.target.value)}
                  rows={4}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
