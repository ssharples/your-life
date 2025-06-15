
import { motion } from 'framer-motion';
import { useReviewData } from './hooks/useReviewData';
import { ReviewProgressHeader } from './components/ReviewProgressHeader';
import { ReviewStepContent } from './components/ReviewStepContent';
import { ReviewNavigation } from './components/ReviewNavigation';

interface GuidedReviewProps {
  reviewType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  reviewId?: string;
  onComplete: () => void;
  onCancel: () => void;
}

export const GuidedReview = ({ reviewType, reviewId, onComplete, onCancel }: GuidedReviewProps) => {
  const {
    currentStep,
    setCurrentStep,
    responses,
    updateResponse,
    templates,
    saveProgress,
    completeReview,
  } = useReviewData({ reviewType, reviewId, onComplete });

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

  if (!templates) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[400px]"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"
        />
        <span className="ml-3 text-gray-600">Loading your review...</span>
      </motion.div>
    );
  }

  const currentTemplate = templates.find(t => t.step_number === currentStep);
  if (!currentTemplate) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="text-red-600 font-medium">Template not found</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="space-y-6 sm:space-y-8">
        <ReviewProgressHeader 
          reviewType={reviewType}
          currentStep={currentStep}
          totalSteps={templates.length}
        />

        <ReviewStepContent
          reviewType={reviewType}
          currentStep={currentStep}
          template={currentTemplate}
          responses={responses}
          onUpdateResponse={updateResponse}
        />

        <ReviewNavigation
          currentStep={currentStep}
          totalSteps={templates.length}
          isLoading={saveProgress.isPending}
          onCancel={onCancel}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </div>
    </motion.div>
  );
};
