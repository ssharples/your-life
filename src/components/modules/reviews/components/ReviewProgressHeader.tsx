
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ReviewProgressHeaderProps {
  reviewType: string;
  currentStep: number;
  totalSteps: number;
}

export const ReviewProgressHeader = ({ reviewType, currentStep, totalSteps }: ReviewProgressHeaderProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold capitalize">{reviewType} Review</h2>
          <p className="text-muted-foreground">Step {currentStep} of {totalSteps}</p>
        </div>
        <Badge variant="outline" className="capitalize">{reviewType}</Badge>
      </div>
      <Progress value={progress} className="w-full" />
    </>
  );
};
