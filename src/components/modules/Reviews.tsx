
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus, FileText, Calendar, Clock, CheckCircle, Edit } from 'lucide-react';
import { ReviewsGuide } from '@/components/guides/ReviewsGuide';
import { GuidedReview } from './reviews/GuidedReview';

export const Reviews = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReviewType, setSelectedReviewType] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'>('daily');
  const [activeGuidedReview, setActiveGuidedReview] = useState<{ type: string; id?: string } | null>(null);
  const queryClient = useQueryClient();

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

  const startGuidedReview = () => {
    setActiveGuidedReview({ type: selectedReviewType });
    setIsDialogOpen(false);
  };

  const continueReview = (review: any) => {
    setActiveGuidedReview({ type: review.review_type, id: review.id });
  };

  const handleReviewComplete = () => {
    setActiveGuidedReview(null);
    queryClient.invalidateQueries({ queryKey: ['reviews'] });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-blue-100 text-blue-800';
      case 'weekly': return 'bg-green-100 text-green-800';
      case 'monthly': return 'bg-purple-100 text-purple-800';
      case 'quarterly': return 'bg-orange-100 text-orange-800';
      case 'annual': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (activeGuidedReview) {
    return (
      <div className="space-y-6">
        <GuidedReview
          reviewType={activeGuidedReview.type as any}
          reviewId={activeGuidedReview.id}
          onComplete={handleReviewComplete}
          onCancel={() => setActiveGuidedReview(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReviewsGuide />
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reviews</h2>
          <p className="text-muted-foreground">Conduct structured reviews and reflections</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Start Review
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start a New Review</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Review Type</label>
                <Select value={selectedReviewType} onValueChange={(value: any) => setSelectedReviewType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select review type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily Review</SelectItem>
                    <SelectItem value="weekly">Weekly Review</SelectItem>
                    <SelectItem value="monthly">Monthly Review</SelectItem>
                    <SelectItem value="quarterly">Quarterly Review</SelectItem>
                    <SelectItem value="annual">Annual Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={startGuidedReview} className="w-full">
                Start Guided Review
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {reviews?.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  {review.review_type.charAt(0).toUpperCase() + review.review_type.slice(1)} Review
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(review.review_type)}>
                    {review.review_type}
                  </Badge>
                  {review.is_completed ? (
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Complete
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      In Progress
                    </Badge>
                  )}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(review.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  {review.summary && (
                    <p className="text-sm text-muted-foreground mb-2">{review.summary}</p>
                  )}
                  {review.template_responses && Object.keys(review.template_responses).length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {Object.keys(review.template_responses).length} responses recorded
                    </p>
                  )}
                </div>
                {!review.is_completed && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => continueReview(review)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Continue
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {reviews?.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
              <p className="text-muted-foreground mb-6">
                Start your first guided review to begin reflecting on your progress and planning ahead.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Start Your First Review
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
