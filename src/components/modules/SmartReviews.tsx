
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Brain, Clock, TrendingUp, Target, CheckCircle, AlertCircle } from 'lucide-react';

interface SmartReviewQuestion {
  id: string;
  question: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  context: string;
  suggested_response?: string;
}

interface ReviewInsight {
  type: 'pattern' | 'achievement' | 'concern' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  data_source: string[];
}

export const SmartReviews = () => {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const queryClient = useQueryClient();

  const { data: reviewData, isLoading } = useQuery({
    queryKey: ['smart-review-data'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      // Generate AI-powered review questions based on user data
      const today = new Date().toISOString().split('T')[0];
      
      // Mock smart questions based on patterns and data
      const questions: SmartReviewQuestion[] = [
        {
          id: '1',
          question: "Your productivity was 23% higher yesterday after completing your morning exercise. How did that feel, and what enabled this success?",
          category: 'Pattern Recognition',
          priority: 'high',
          context: 'Based on correlation between exercise and productivity metrics',
          suggested_response: 'Reflect on the connection between physical activity and mental clarity'
        },
        {
          id: '2',
          question: "You've completed 85% of your habits this week, but missed journaling 3 times. What barriers prevented consistent journaling?",
          category: 'Habit Analysis',
          priority: 'medium',
          context: 'Based on habit completion patterns',
          suggested_response: 'Consider environmental or scheduling factors'
        },
        {
          id: '3',
          question: "Your goal 'Learn Spanish' shows limited progress. Would you like to adjust the approach, timeline, or break it into smaller milestones?",
          category: 'Goal Adjustment',
          priority: 'high',
          context: 'Based on goal progress tracking',
          suggested_response: 'Consider specific actionable steps or modified targets'
        },
        {
          id: '4',
          question: "Your mood ratings have been consistently positive this week (avg 7.8/10). What specific factors contributed to this positive trend?",
          category: 'Positive Pattern',
          priority: 'medium',
          context: 'Based on journal sentiment analysis',
          suggested_response: 'Identify successful strategies to maintain'
        }
      ];

      const insights: ReviewInsight[] = [
        {
          type: 'pattern',
          title: 'Sleep-Productivity Connection Strengthening',
          description: 'The correlation between your sleep quality and next-day productivity has increased from 0.65 to 0.73 over the past month.',
          confidence: 87,
          data_source: ['Habit Logs', 'Task Completion']
        },
        {
          type: 'achievement',
          title: 'Consistency Milestone Reached',
          description: 'You\'ve maintained a 21-day streak across 3 different habits - the longest streak in 6 months.',
          confidence: 100,
          data_source: ['Habit Tracking']
        },
        {
          type: 'concern',
          title: 'Weekend Goal Progress Decline',
          description: 'Goal-related task completion drops by 45% on weekends compared to weekdays.',
          confidence: 78,
          data_source: ['Task Completion', 'Goal Progress']
        },
        {
          type: 'recommendation',
          title: 'Optimize Tuesday Energy Peak',
          description: 'Your energy and productivity peak on Tuesdays. Consider scheduling your most important or challenging tasks on this day.',
          confidence: 82,
          data_source: ['Mood Tracking', 'Task Completion', 'Habit Analytics']
        }
      ];

      return { questions, insights };
    },
  });

  const saveReview = useMutation({
    mutationFn: async (reviewData: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('reviews')
        .insert([{
          user_id: user.data.user.id,
          review_type: 'smart_daily',
          date: new Date().toISOString().split('T')[0],
          template_responses: reviewData,
          is_completed: true
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({ title: "Success", description: "Smart review completed and insights saved!" });
      setCurrentStep(0);
      setResponses({});
    },
  });

  const handleResponse = (questionId: string, response: string) => {
    setResponses(prev => ({ ...prev, [questionId]: response }));
  };

  const completeReview = () => {
    const reviewData = {
      responses,
      insights: reviewData?.insights || [],
      timestamp: new Date().toISOString()
    };
    saveReview.mutate(reviewData);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Smart Daily Review</h2>
            <p className="text-muted-foreground">AI-powered reflection based on your data patterns</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const questions = reviewData?.questions || [];
  const insights = reviewData?.insights || [];
  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Smart Daily Review</h2>
          <p className="text-muted-foreground">AI-powered reflection based on your data patterns</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Brain className="h-3 w-3" />
          AI-Generated
        </Badge>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Review Progress</span>
            <span className="text-sm text-muted-foreground">{currentStep + 1} of {questions.length}</span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardContent>
      </Card>

      {/* Insights Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Today's Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
              <div className="flex-shrink-0 mt-1">
                {insight.type === 'achievement' && <CheckCircle className="h-4 w-4 text-green-500" />}
                {insight.type === 'pattern' && <TrendingUp className="h-4 w-4 text-blue-500" />}
                {insight.type === 'concern' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                {insight.type === 'recommendation' && <Target className="h-4 w-4 text-purple-500" />}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{insight.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">{insight.confidence}% confident</Badge>
                  <span className="text-xs text-muted-foreground">
                    Sources: {insight.data_source.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Current Question */}
      {currentQuestion && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={currentQuestion.priority === 'high' ? 'destructive' : 
                                 currentQuestion.priority === 'medium' ? 'default' : 'secondary'}>
                    {currentQuestion.priority} priority
                  </Badge>
                  <Badge variant="outline">{currentQuestion.category}</Badge>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{currentQuestion.context}</p>
            {currentQuestion.suggested_response && (
              <p className="text-xs text-blue-600 mt-1">💡 {currentQuestion.suggested_response}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Share your thoughts and reflections..."
              value={responses[currentQuestion.id] || ''}
              onChange={(e) => handleResponse(currentQuestion.id, e.target.value)}
              className="min-h-[120px]"
            />
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              {currentStep < questions.length - 1 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!responses[currentQuestion.id]?.trim()}
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  onClick={completeReview}
                  disabled={!responses[currentQuestion.id]?.trim() || saveReview.isPending}
                >
                  Complete Review
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
