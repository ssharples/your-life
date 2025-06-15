
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

  if (!templates) return <div>Loading...</div>;

  const currentTemplate = templates.find(t => t.step_number === currentStep);
  if (!currentTemplate) return <div>Template not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
  );
};
