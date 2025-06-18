
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Calendar, TrendingUp, CheckCircle, Clock, Lightbulb } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ReviewQuestion {
  id: string;
  question: string;
  category: string;
  context?: string;
}

interface SmartReview {
  id: string;
  date: string;
  questions: ReviewQuestion[];
  answers: Record<string, string>;
  insights: string[];
  status: 'pending' | 'in_progress' | 'completed';
}

export const SmartReviews = () => {
  const [currentReview, setCurrentReview] = useState<SmartReview | null>(null);
  const [recentReviews, setRecentReviews] = useState<SmartReview[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecentReviews();
    checkForTodaysReview();
  }, []);

  const loadRecentReviews = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For now, we'll use mock data since we haven't created the reviews table yet
      const mockReviews: SmartReview[] = [
        {
          id: '1',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
          questions: [],
          answers: {},
          insights: ['You showed consistent progress in your habits yesterday'],
          status: 'completed'
        },
        {
          id: '2',
          date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], // 2 days ago
          questions: [],
          answers: {},
          insights: ['Your productivity was higher in the morning hours'],
          status: 'completed'
        }
      ];

      setRecentReviews(mockReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkForTodaysReview = async () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysReview = recentReviews.find(review => review.date === today);
    
    if (!todaysReview) {
      await generateTodaysReview();
    } else {
      setCurrentReview(todaysReview);
    }
  };

  const generateTodaysReview = async () => {
    setIsGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Generate AI-powered review questions
      const { data, error } = await supabase.functions.invoke('generate-review-questions', {
        body: { 
          userId: user.id,
          reviewType: 'daily',
          context: 'morning_reflection'
        }
      });

      if (error) throw error;

      const newReview: SmartReview = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        questions: data.questions || getDefaultQuestions(),
        answers: {},
        insights: [],
        status: 'pending'
      };

      setCurrentReview(newReview);
      toast({
        title: "Smart Review Ready",
        description: "AI has generated personalized questions based on your recent activity.",
      });
    } catch (error) {
      console.error('Error generating review:', error);
      // Fallback to default questions
      const newReview: SmartReview = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        questions: getDefaultQuestions(),
        answers: {},
        insights: [],
        status: 'pending'
      };
      setCurrentReview(newReview);
    } finally {
      setIsGenerating(false);
    }
  };

  const getDefaultQuestions = (): ReviewQuestion[] => [
    {
      id: '1',
      question: 'What was the most meaningful accomplishment from yesterday?',
      category: 'reflection',
      context: 'achievement'
    },
    {
      id: '2',
      question: 'What challenges did you face, and how did you handle them?',
      category: 'growth',
      context: 'obstacles'
    },
    {
      id: '3',
      question: 'Which habits served you well, and which need adjustment?',
      category: 'habits',
      context: 'optimization'
    },
    {
      id: '4',
      question: 'What are your top 3 priorities for today?',
      category: 'planning',
      context: 'focus'
    },
    {
      id: '5',
      question: 'How aligned were your actions with your core values yesterday?',
      category: 'values',
      context: 'alignment'
    }
  ];

  const handleAnswerSubmit = () => {
    if (!currentReview || !currentAnswer.trim()) return;

    const updatedReview = {
      ...currentReview,
      answers: {
        ...currentReview.answers,
        [currentReview.questions[currentQuestionIndex].id]: currentAnswer
      }
    };

    setCurrentReview(updatedReview);
    setCurrentAnswer('');

    if (currentQuestionIndex < currentReview.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeReview(updatedReview);
    }
  };

  const completeReview = async (reviewData: SmartReview) => {
    try {
      const completedReview = {
        ...reviewData,
        status: 'completed' as const,
        insights: generateInsights(reviewData)
      };

      setCurrentReview(completedReview);
      setRecentReviews(prev => [completedReview, ...prev]);
      
      toast({
        title: "Review Completed",
        description: "Your insights have been generated and saved.",
      });
    } catch (error) {
      console.error('Error completing review:', error);
    }
  };

  const generateInsights = (reviewData: SmartReview): string[] => {
    // Simple insight generation based on answers
    const insights: string[] = [];
    const answers = Object.values(reviewData.answers);
    
    if (answers.some(answer => answer.toLowerCase().includes('productive'))) {
      insights.push('You had a productive day - consider what made it successful');
    }
    
    if (answers.some(answer => answer.toLowerCase().includes('challenge'))) {
      insights.push('You faced challenges - this shows growth and resilience');
    }
    
    if (answers.length === reviewData.questions.length) {
      insights.push('Complete reflection shows commitment to self-improvement');
    }

    return insights.length > 0 ? insights : ['Great job completing your review!'];
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Smart Reviews</h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-24 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Smart Reviews</h1>
        </div>
        <Button 
          onClick={generateTodaysReview} 
          disabled={isGenerating}
          variant="outline"
        >
          {isGenerating ? 'Generating...' : 'New Review'}
        </Button>
      </div>

      {/* Current Review */}
      {currentReview && currentReview.status !== 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Review
            </CardTitle>
            <CardDescription>
              Question {currentQuestionIndex + 1} of {currentReview.questions.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress 
              value={(currentQuestionIndex / currentReview.questions.length) * 100} 
              className="w-full"
            />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Badge variant="secondary">
                  {currentReview.questions[currentQuestionIndex]?.category}
                </Badge>
                <h3 className="text-lg font-medium">
                  {currentReview.questions[currentQuestionIndex]?.question}
                </h3>
              </div>
              
              <Textarea
                placeholder="Share your thoughts..."
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                className="min-h-24"
              />
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleAnswerSubmit}
                  disabled={!currentAnswer.trim()}
                >
                  {currentQuestionIndex === currentReview.questions.length - 1 ? 'Complete' : 'Next'}
                </Button>
                {currentQuestionIndex > 0 && (
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                  >
                    Previous
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Review Insights */}
      {currentReview && currentReview.status === 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Today's Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentReview.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <p className="text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReviews.map((review) => (
              <div key={review.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{review.date}</p>
                  <p className="text-sm text-muted-foreground">
                    {review.insights.length} insights generated
                  </p>
                </div>
                <Badge variant="secondary">
                  {review.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
