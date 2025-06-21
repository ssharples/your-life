
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DailyTaskReview } from '../DailyTaskReview';
import { DailyHabitReview } from '../DailyHabitReview';
import { DailyValuesReview } from '../DailyValuesReview';
import { DailyPillarReview } from '../DailyPillarReview';
import { NewTaskCreator } from './NewTaskCreator';
import { useState } from 'react';

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
  const [createdTasks, setCreatedTasks] = useState<any[]>(responses.created_tasks || []);

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

  const handleTaskCreated = (task: any) => {
    const updatedTasks = [...createdTasks, task];
    setCreatedTasks(updatedTasks);
    onUpdateResponse('created_tasks', updatedTasks);
  };

  const handleTaskRemoved = (taskId: string) => {
    const updatedTasks = createdTasks.filter(task => task.id !== taskId);
    setCreatedTasks(updatedTasks);
    onUpdateResponse('created_tasks', updatedTasks);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ 
          duration: 0.3,
          type: "spring",
          stiffness: 120,
          damping: 20
        }}
        className="w-full"
      >
        <Card className="shadow-md border-0 bg-white">
          <CardHeader className="pb-3 px-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <CardTitle className="flex items-center text-base">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                </motion.div>
                {template.step_title}
              </CardTitle>
            </motion.div>
            {template.step_description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-xs text-muted-foreground mt-1 leading-relaxed"
              >
                {template.step_description}
              </motion.p>
            )}
          </CardHeader>
          <CardContent className="space-y-4 px-3 pb-3">
            {/* Special components for daily review */}
            {reviewType === 'daily' && currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <DailyTaskReview 
                  responses={responses.tasks || []}
                  onUpdate={(tasks) => onUpdateResponse('tasks', tasks)}
                />
              </motion.div>
            )}
            
            {reviewType === 'daily' && currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <DailyHabitReview 
                  responses={responses.habits || []}
                  onUpdate={(habits) => onUpdateResponse('habits', habits)}
                />
              </motion.div>
            )}

            {/* Values review for step 3 of daily review */}
            {reviewType === 'daily' && currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <DailyValuesReview 
                  responses={responses.values || []}
                  onUpdate={(values) => onUpdateResponse('values', values)}
                />
              </motion.div>
            )}

            {/* Pillar energy review for step 4 of daily review */}
            {reviewType === 'daily' && currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <DailyPillarReview 
                  responses={responses.pillars || []}
                  onUpdate={(pillars) => onUpdateResponse('pillars', pillars)}
                />
              </motion.div>
            )}

            {/* Task creation for step 5 of daily review */}
            {reviewType === 'daily' && currentStep === 5 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <NewTaskCreator
                  createdTasks={createdTasks}
                  onTaskCreated={handleTaskCreated}
                  onTaskRemoved={handleTaskRemoved}
                />
              </motion.div>
            )}

            {/* Standard prompts for all other steps */}
            {(reviewType !== 'daily' || (currentStep !== 1 && currentStep !== 2 && currentStep !== 3 && currentStep !== 4 && currentStep !== 5)) && (
              <div className="space-y-4">
                {prompts.map((prompt: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: 0.1 + (index * 0.05)
                    }}
                    className="space-y-2"
                  >
                    <label className="text-xs font-medium text-gray-700 block leading-relaxed">
                      {prompt}
                    </label>
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Textarea
                        placeholder="Write your response here..."
                        value={responses[`step_${currentStep}_prompt_${index}`] || ''}
                        onChange={(e) => onUpdateResponse(`step_${currentStep}_prompt_${index}`, e.target.value)}
                        rows={3}
                        className="resize-none text-sm border-gray-200 focus:border-blue-400"
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
