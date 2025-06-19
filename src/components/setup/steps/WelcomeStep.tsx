
import { IOSCard } from '@/components/ios/IOSCard';
import { Button } from '@/components/ui/button';
import { Sparkles, Target, Heart, FolderOpen } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <IOSCard padding="lg" className="text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Your Life Organization System</h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          Let's create a personalized system to help you organize your life, achieve your goals, and live according to your values.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Target className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Set Goals</h3>
          <p className="text-sm text-gray-600">Define what you want to achieve</p>
        </div>

        <div className="text-center p-4">
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Heart className="h-6 w-6 text-pink-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Define Values</h3>
          <p className="text-sm text-gray-600">Identify what matters most</p>
        </div>

        <div className="text-center p-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FolderOpen className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Create Structure</h3>
          <p className="text-sm text-gray-600">Organize with pillars & projects</p>
        </div>

        <div className="text-center p-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Sparkles className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">AI Assistance</h3>
          <p className="text-sm text-gray-600">Get personalized recommendations</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600">
          This setup will take about 5-10 minutes and will create a complete life management system tailored to you.
        </p>
        <Button onClick={onNext} size="lg" className="w-full">
          Let's Get Started
        </Button>
      </div>
    </IOSCard>
  );
};
