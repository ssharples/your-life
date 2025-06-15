
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
import { Plus, BookOpen, Calendar } from 'lucide-react';

export const Journals = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [content, setContent] = useState('');
  const [insights, setInsights] = useState('');
  const [entryType, setEntryType] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'>('daily');
  const [moodRating, setMoodRating] = useState<number>(5);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const queryClient = useQueryClient();

  const { data: journals } = useQuery({
    queryKey: ['journals'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .eq('user_id', user.data.user.id)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createJournal = useMutation({
    mutationFn: async (newJournal: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('journals')
        .insert([{ 
          ...newJournal, 
          user_id: user.data.user.id,
          mood_rating: moodRating,
          date: date
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      toast({ title: "Success", description: "Journal entry created successfully!" });
      resetForm();
    },
  });

  const resetForm = () => {
    setContent('');
    setInsights('');
    setEntryType('daily');
    setMoodRating(5);
    setDate(new Date().toISOString().split('T')[0]);
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createJournal.mutate({ content, insights, entry_type: entryType });
  };

  const getMoodColor = (rating: number) => {
    if (rating >= 8) return 'bg-green-100 text-green-800';
    if (rating >= 6) return 'bg-yellow-100 text-yellow-800';
    if (rating >= 4) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Journal</h2>
          <p className="text-muted-foreground">Document your thoughts, experiences, and insights</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Journal Entry</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <Select value={entryType} onValueChange={(value: any) => setEntryType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Entry type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
              <div>
                <label className="text-sm font-medium">Mood Rating (1-10): {moodRating}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={moodRating}
                  onChange={(e) => setMoodRating(parseInt(e.target.value))}
                  className="w-full mt-2"
                />
              </div>
              <Textarea
                placeholder="Write your journal entry..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={8}
              />
              <Textarea
                placeholder="Key insights or reflections (optional)"
                value={insights}
                onChange={(e) => setInsights(e.target.value)}
                rows={3}
              />
              <Button type="submit" className="w-full">Create Entry</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {journals?.map((journal) => (
          <Card key={journal.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {new Date(journal.date).toLocaleDateString()}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">{journal.entry_type}</Badge>
                  {journal.mood_rating && (
                    <Badge className={getMoodColor(journal.mood_rating)}>
                      Mood: {journal.mood_rating}/10
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4 whitespace-pre-wrap">{journal.content}</p>
              {journal.insights && (
                <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-2 rounded">
                  <p className="text-sm font-medium text-blue-800">Insights:</p>
                  <p className="text-sm text-blue-700">{journal.insights}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
