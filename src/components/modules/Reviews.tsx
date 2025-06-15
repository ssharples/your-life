import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus, Calendar, CheckCircle2, Clock, BarChart3 } from 'lucide-react';
import { GuidedReview } from './reviews/GuidedReview';
import { ReviewsGuide } from '@/components/guides/ReviewsGuide';
import { useHelp } from '@/contexts/HelpContext';

export const Reviews = () => {
  const [showGuidedReview, setShowGuidedReview] = useState(false);
  const [selectedReviewType, setSelectedReviewType] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'>('daily');
  const queryClient = useQueryClient();
  const { showHelp } = useHelp();

  const { data: reviews } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', user.data.user.id)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createReview = useMutation({
    mutationFn: async (newReview: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('reviews')
        .insert([{ ...newReview, user_id: user.data.user.id }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({ title: "Success", description: "Review created successfully!" });
    },
  });

  const updateReview = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data, error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({ title: "Success", description: "Review updated successfully!" });
    },
  });

  const startReview = (type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual') => {
    setSelectedReviewType(type);
    setShowGuidedReview(true);
  };

  const getReviewTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-blue-100 text-blue-800';
      case 'weekly': return 'bg-green-100 text-green-800';
      case 'monthly': return 'bg-purple-100 text-purple-800';
      case 'quarterly': return 'bg-orange-100 text-orange-800';
      case 'annual': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showGuidedReview) {
    return (
      <GuidedReview 
        reviewType={selectedReviewType}
        onComplete={() => {
          setShowGuidedReview(false);
          queryClient.invalidateQueries({ queryKey: ['reviews'] });
        }}
        onCancel={() => setShowGuidedReview(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {showHelp && <ReviewsGuide />}
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reviews</h2>
          <p className="text-muted-foreground">Reflect and plan with regular reviews</p>
        </div>
      </div>

      {/* Quick Start Review Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[
          { type: 'daily' as const, title: 'Daily Review', description: 'Quick daily reflection' },
          { type: 'weekly' as const, title: 'Weekly Review', description: 'Weekly planning & progress' },
          { type: 'monthly' as const, title: 'Monthly Review', description: 'Monthly goal assessment' },
          { type: 'quarterly' as const, title: 'Quarterly Review', description: 'Strategic planning' },
          { type: 'annual' as const, title: 'Annual Review', description: 'Year-end reflection' }
        ].map((reviewType) => (
          <Card key={reviewType.type} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{reviewType.title}</CardTitle>
              <CardDescription className="text-xs">{reviewType.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                size="sm" 
                className="w-full" 
                onClick={() => startReview(reviewType.type)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Start
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Reviews */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Recent Reviews</h3>
        <div className="grid gap-4">
          {reviews?.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <CardTitle className="text-lg">
                      {review.review_type.charAt(0).toUpperCase() + review.review_type.slice(1)} Review
                    </CardTitle>
                    <Badge className={getReviewTypeColor(review.review_type)}>
                      {review.review_type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {review.is_completed ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        In Progress
                      </Badge>
                    )}
                  </div>
                </div>
                <CardDescription>
                  {new Date(review.date).toLocaleDateString()} - 
                  {review.is_completed ? ` Completed on ${new Date(review.updated_at).toLocaleDateString()}` : ' In progress'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {review.summary && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Summary</h4>
                    <p className="text-sm text-muted-foreground">{review.summary}</p>
                  </div>
                )}
                {review.reflections && (
                  <div className="space-y-2 mt-3">
                    <h4 className="font-medium text-sm">Key Reflections</h4>
                    <p className="text-sm text-muted-foreground">{review.reflections}</p>
                  </div>
                )}
                {!review.is_completed && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-3"
                    onClick={() => startReview(review.review_type as any)}
                  >
                    Continue Review
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
