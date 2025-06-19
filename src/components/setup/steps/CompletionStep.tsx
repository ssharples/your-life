
import { IOSCard } from '@/components/ios/IOSCard';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';

export const CompletionStep = () => {
  const handleGetStarted = () => {
    // Navigate to main app
    window.location.href = '/';
  };

  return (
    <IOSCard padding="lg" className="text-center">
      <div className="mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Setup Complete!</h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          Your personalized life organization system has been created successfully. 
          You're ready to start achieving your goals and living according to your values.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Pillars Created</h3>
          <p className="text-sm text-gray-600">Your life structure is organized</p>
        </div>

        <div className="text-center p-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Goals Set</h3>
          <p className="text-sm text-gray-600">Your targets are defined</p>
        </div>

        <div className="text-center p-4">
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="h-6 w-6 text-pink-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Values Defined</h3>
          <p className="text-sm text-gray-600">Your principles are clear</p>
        </div>

        <div className="text-center p-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Sparkles className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">AI Optimized</h3>
          <p className="text-sm text-gray-600">Personalized recommendations ready</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Start working on your tasks and projects</li>
            <li>• Review and adjust your goals regularly</li>
            <li>• Track your progress and celebrate wins</li>
            <li>• Let AI help you optimize your system over time</li>
          </ul>
        </div>
        
        <Button onClick={handleGetStarted} size="lg" className="w-full">
          <ArrowRight className="h-5 w-5 mr-2" />
          Start Your Journey
        </Button>
      </div>
    </IOSCard>
  );
};
