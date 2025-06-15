
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus, FileText, Calendar } from 'lucide-react';
import { ReviewsGuide } from '@/components/guides/ReviewsGuide';

export const Reviews = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviewType, setReviewType] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'>('daily');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [summary, setSummary] = useState('');
  const [reflections, setReflections] = useState('');
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

  const createReview = useMutation({
    mutationFn: async (newReview: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('reviews')
        .insert([{ 
          ...newReview, 
          user_id: user.data.user.id,
          date: date
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({ title: "Success", description: "Review created successfully!" });
      resetForm();
    },
  });

  const resetForm = () => {
    setReviewType('daily');
    setDate(new Date().toISOString().split('T')[0]);
    setSummary('');
    setReflections('');
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReview.mutate({ review_type: reviewType, summary, reflections });
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

  return (
    <div className="space-y-6">
      <ReviewsGuide />
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reviews</h2>
          <p className="text-muted-foreground">Conduct regular reviews and reflections</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              New Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Review</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select value={reviewType} onValueChange={(value: any) => setReviewType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Review type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Review</SelectItem>
                  <SelectItem value="weekly">Weekly Review</SelectItem>
                  <SelectItem value="monthly">Monthly Review</SelectItem>
                  <SelectItem value="quarterly">Quarterly Review</SelectItem>
                  <SelectItem value="annual">Annual Review</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <Textarea
                placeholder="Summary of the period..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={4}
              />
              <Textarea
                placeholder="Key reflections, insights, and learnings..."
                value={reflections}
                onChange={(e) => setReflections(e.target.value)}
                rows={6}
              />
              <Button type="submit" className="w-full">Create Review</Button>
            </form>
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
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(review.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {review.summary && (
                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-2">Summary:</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{review.summary}</p>
                </div>
              )}
              {review.reflections && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Reflections:</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{review.reflections}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
