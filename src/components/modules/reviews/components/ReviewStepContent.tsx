
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 50, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -50, scale: 0.95 }}
        transition={{ 
          duration: 0.4,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
      >
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="pb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <CheckCircle className="h-5 w-5 mr-3 text-green-600" />
                </motion.div>
                {template.step_title}
              </CardTitle>
            </motion.div>
            {template.step_description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-muted-foreground mt-2"
              >
                {template.step_description}
              </motion.p>
            )}
          </CardHeader>
          <CardContent className="space-y-6 px-4 sm:px-6">
            {/* Special components for daily review */}
            {reviewType === 'daily' && currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <DailyTaskReview 
                  responses={responses.tasks || []}
                  onUpdate={(tasks) => onUpdateResponse('tasks', tasks)}
                />
              </motion.div>
            )}
            
            {reviewType === 'daily' && currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <DailyHabitReview 
                  responses={responses.habits || []}
                  onUpdate={(habits) => onUpdateResponse('habits', habits)}
                />
              </motion.div>
            )}

            {/* Standard prompts for all other steps */}
            {(reviewType !== 'daily' || (currentStep !== 1 && currentStep !== 2)) && (
              <div className="space-y-6">
                {prompts.map((prompt: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: 0.2 + (index * 0.1)
                    }}
                    className="space-y-3"
                  >
                    <label className="text-sm font-medium text-gray-700 block">
                      {prompt}
                    </label>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Textarea
                        placeholder="Write your response here..."
                        value={responses[`step_${currentStep}_prompt_${index}`] || ''}
                        onChange={(e) => onUpdateResponse(`step_${currentStep}_prompt_${index}`, e.target.value)}
                        rows={4}
                        className="resize-none transition-all duration-200 focus:shadow-md border-gray-200 focus:border-blue-400"
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
