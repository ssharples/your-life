
import { IOSCard } from '@/components/ios/IOSCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Target, FolderOpen, CheckSquare, Loader2 } from 'lucide-react';

interface AIRecommendationsStepProps {
  data: {
    pillars: any[];
    projects: any[];
    tasks: any[];
  };
  isLoading: boolean;
  onNext: (data: any) => void;
  onBack: () => void;
}

export const AIRecommendationsStep = ({ data, isLoading, onNext, onBack }: AIRecommendationsStepProps) => {
  const handleSubmit = () => {
    onNext({ aiRecommendations: data });
  };

  if (isLoading) {
    return (
      <IOSCard padding="lg" className="text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Recommendations</h2>
        <p className="text-gray-600 mb-6">
          Our AI is analyzing your inputs to create personalized pillars, projects, and tasks...
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-gray-600">Analyzing your goals and values</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Target className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-600">Creating life pillars</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <FolderOpen className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-600">Generating projects and tasks</span>
          </div>
        </div>
      </IOSCard>
    );
  }

  return (
    <IOSCard padding="lg">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Recommendations</h2>
        <p className="text-gray-600">Based on your inputs, here's your personalized life structure</p>
      </div>

      <div className="space-y-6">
        {data.pillars.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Life Pillars ({data.pillars.length})
            </h3>
            <div className="grid gap-3">
              {data.pillars.map((pillar: any, index: number) => (
                <IOSCard key={index} padding="sm">
                  <h4 className="font-medium text-gray-900">{pillar.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{pillar.description}</p>
                </IOSCard>
              ))}
            </div>
          </div>
        )}

        {data.projects.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-green-600" />
              Suggested Projects ({data.projects.length})
            </h3>
            <div className="grid gap-3">
              {data.projects.map((project: any, index: number) => (
                <IOSCard key={index} padding="sm">
                  <h4 className="font-medium text-gray-900">{project.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  {project.relatedArea && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      {project.relatedArea}
                    </Badge>
                  )}
                </IOSCard>
              ))}
            </div>
          </div>
        )}

        {data.tasks.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-orange-600" />
              Initial Tasks ({data.tasks.length})
            </h3>
            <div className="grid gap-2">
              {data.tasks.map((task: any, index: number) => (
                <IOSCard key={index} padding="sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">{task.title}</span>
                    {task.priority && (
                      <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                        {task.priority}
                      </Badge>
                    )}
                  </div>
                </IOSCard>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            Looks Great!
          </Button>
        </div>
      </div>
    </IOSCard>
  );
};
