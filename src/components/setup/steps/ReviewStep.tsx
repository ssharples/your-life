
import { IOSCard } from '@/components/ios/IOSCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, User, Building2, Target, Heart, Sparkles, Loader2 } from 'lucide-react';
import type { SetupData } from '../SetupWizard';

interface ReviewStepProps {
  data: SetupData;
  onFinish: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export const ReviewStep = ({ data, onFinish, onBack, isLoading }: ReviewStepProps) => {
  return (
    <IOSCard padding="lg">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Setup</h2>
        <p className="text-gray-600">Here's everything we'll create for your life organization system</p>
      </div>

      <div className="space-y-6">
        {/* Personal Info */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Personal Information
          </h3>
          <IOSCard padding="sm">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium">{data.personalInfo.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Age:</span>
                <span className="ml-2 font-medium">{data.personalInfo.age}</span>
              </div>
              <div>
                <span className="text-gray-600">Occupation:</span>
                <span className="ml-2 font-medium">{data.personalInfo.occupation}</span>
              </div>
              {data.personalInfo.location && (
                <div>
                  <span className="text-gray-600">Location:</span>
                  <span className="ml-2 font-medium">{data.personalInfo.location}</span>
                </div>
              )}
            </div>
          </IOSCard>
        </div>

        {/* Life Areas */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-green-600" />
            Life Areas ({data.lifeAreas.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.lifeAreas.map((area, index) => (
              <Badge key={index} variant="outline">{area}</Badge>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Goals ({data.goals.length})
          </h3>
          <div className="space-y-2">
            {data.goals.map((goal, index) => (
              <IOSCard key={index} padding="sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{goal.title}</h4>
                    {goal.description && (
                      <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <Badge variant="outline" className="text-xs">{goal.area}</Badge>
                    {goal.timeframe && (
                      <Badge variant="secondary" className="text-xs">{goal.timeframe}</Badge>
                    )}
                  </div>
                </div>
              </IOSCard>
            ))}
          </div>
        </div>

        {/* Values */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-600" />
            Values ({data.values.length})
          </h3>
          <div className="space-y-2">
            {data.values.map((value, index) => (
              <IOSCard key={index} padding="sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{value.title}</h4>
                    {value.description && (
                      <p className="text-sm text-gray-600 mt-1">{value.description}</p>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {value.importance}/10
                  </Badge>
                </div>
              </IOSCard>
            ))}
          </div>
        </div>

        {/* AI Recommendations Summary */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Recommendations
          </h3>
          <IOSCard padding="sm">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{data.aiRecommendations.pillars.length}</div>
                <div className="text-xs text-gray-600">Pillars</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{data.aiRecommendations.projects.length}</div>
                <div className="text-xs text-gray-600">Projects</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{data.aiRecommendations.tasks.length}</div>
                <div className="text-xs text-gray-600">Tasks</div>
              </div>
            </div>
          </IOSCard>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button onClick={onFinish} disabled={isLoading} className="flex-1">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating System...
              </>
            ) : (
              'Create My System'
            )}
          </Button>
        </div>
      </div>
    </IOSCard>
  );
};
