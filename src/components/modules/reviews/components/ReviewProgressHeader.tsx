
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface ReviewProgressHeaderProps {
  reviewType: string;
  currentStep: number;
  totalSteps: number;
}

export const ReviewProgressHeader = ({ reviewType, currentStep, totalSteps }: ReviewProgressHeaderProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold capitalize">{reviewType} Review</h2>
          <p className="text-muted-foreground">Step {currentStep} of {totalSteps}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Badge variant="outline" className="capitalize text-sm px-3 py-1">{reviewType}</Badge>
        </motion.div>
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="origin-left"
      >
        <Progress value={progress} className="w-full h-2" />
      </motion.div>
    </motion.div>
  );
};
