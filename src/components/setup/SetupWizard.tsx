
import { useState } from 'react';
import { IOSLayout } from '@/components/ios/IOSLayout';
import { IOSCard } from '@/components/ios/IOSCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { WelcomeStep } from './steps/WelcomeStep';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { LifeAreasStep } from './steps/LifeAreasStep';
import { GoalsStep } from './steps/GoalsStep';
import { ValuesStep } from './steps/ValuesStep';
import { AIRecommendationsStep } from './steps/AIRecommendationsStep';
import { ReviewStep } from './steps/ReviewStep';
import { CompletionStep } from './steps/CompletionStep';
import { useSetupWizard } from './hooks/useSetupWizard';

export interface SetupData {
  personalInfo: {
    name: string;
    age: string;
    occupation: string;
    location: string;
  };
  lifeAreas: string[];
  goals: Array<{
    title: string;
    description: string;
    area: string;
    timeframe: string;
  }>;
  values: Array<{
    title: string;
    description: string;
    importance: number;
  }>;
  aiRecommendations: {
    pillars: any[];
    projects: any[];
    tasks: any[];
  };
}

const TOTAL_STEPS = 8;

const stepTitles = [
  'Welcome',
  'Personal Info',
  'Life Areas',
  'Goals',
  'Values',
  'AI Recommendations',
  'Review',
  'Complete'
];

export const SetupWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { setupData, updateSetupData, isProcessing, generateRecommendations, saveSetup } = useSetupWizard();

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepComplete = async (stepData: any) => {
    updateSetupData(stepData);
    
    // Generate AI recommendations after values step
    if (currentStep === 4) {
      await generateRecommendations();
    }
    
    nextStep();
  };

  const handleFinish = async () => {
    await saveSetup();
    nextStep();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={nextStep} />;
      case 1:
        return (
          <PersonalInfoStep
            data={setupData.personalInfo}
            onNext={handleStepComplete}
            onBack={prevStep}
          />
        );
      case 2:
        return (
          <LifeAreasStep
            data={setupData.lifeAreas}
            onNext={handleStepComplete}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <GoalsStep
            data={setupData.goals}
            lifeAreas={setupData.lifeAreas}
            onNext={handleStepComplete}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <ValuesStep
            data={setupData.values}
            onNext={handleStepComplete}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <AIRecommendationsStep
            data={setupData.aiRecommendations}
            isLoading={isProcessing}
            onNext={handleStepComplete}
            onBack={prevStep}
          />
        );
      case 6:
        return (
          <ReviewStep
            data={setupData}
            onFinish={handleFinish}
            onBack={prevStep}
            isLoading={isProcessing}
          />
        );
      case 7:
        return <CompletionStep />;
      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  return (
    <IOSLayout className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto">
        <IOSCard padding="lg" className="mb-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Life Organization Setup</h1>
            <p className="text-gray-600">Step {currentStep + 1} of {TOTAL_STEPS}: {stepTitles[currentStep]}</p>
            <Progress value={progress} className="mt-4" />
          </div>
        </IOSCard>

        {renderStep()}
      </div>
    </IOSLayout>
  );
};
