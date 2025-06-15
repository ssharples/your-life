
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

interface ReviewNavigationProps {
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
  onCancel: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const ReviewNavigation = ({ 
  currentStep, 
  totalSteps, 
  isLoading, 
  onCancel, 
  onPrevious, 
  onNext 
}: ReviewNavigationProps) => {
  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        {currentStep > 1 && (
          <Button variant="outline" onClick={onPrevious}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
        )}
      </div>
      
      <Button onClick={onNext} disabled={isLoading}>
        {currentStep === totalSteps ? (
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
  );
};
