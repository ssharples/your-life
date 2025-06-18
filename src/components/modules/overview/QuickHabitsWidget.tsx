
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Circle, Calendar, BookOpen, BarChart3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QuickHabitsWidgetProps {
  onStartReview?: () => void;
}

export const QuickHabitsWidget = ({ onStartReview }: QuickHabitsWidgetProps) => {
  const [journalEntry, setJournalEntry] = useState('');
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const { data: essentialHabits } = useQuery({
    queryKey: ['essential-habits'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.data.user.id)
        .in('title', ['Daily Journal', 'Daily Review'])
        .eq('status', 'active');

      if (error) throw error;
      return data;
    },
  });

  const { data: todayLogs } = useQuery({
    queryKey: ['today-habit-logs', today],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', user.data.user.id)
        .eq('date', today);

      if (error) throw error;
      return data;
    },
  });

  const { data: todayJournal } = useQuery({
    queryKey: ['today-journal', today],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .eq('user_id', user.data.user.id)
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  const handleQuickJournal = async () => {
    if (!journalEntry.trim()) return;

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      if (todayJournal) {
        // Update existing journal
        const { error } = await supabase
          .from('journals')
          .update({ content: journalEntry })
          .eq('id', todayJournal.id);

        if (error) throw error;
      } else {
        // Create new journal
        const { error } = await supabase
          .from('journals')
          .insert([{
            user_id: user.data.user.id,
            date: today,
            content: journalEntry,
          }]);

        if (error) throw error;
      }

      // Mark habit as completed
      const journalHabit = essentialHabits?.find(h => h.title === 'Daily Journal');
      if (journalHabit) {
        const existingLog = todayLogs?.find(log => log.habit_id === journalHabit.id);
        
        if (!existingLog) {
          await supabase
            .from('habit_logs')
            .insert([{
              user_id: user.data.user.id,
              habit_id: journalHabit.id,
              date: today,
              completed: true,
            }]);
        }
      }

      setJournalEntry('');
      setIsJournalOpen(false);
      toast({
        title: "Journal Saved!",
        description: "Your daily journal entry has been saved.",
      });
    } catch (error) {
      console.error('Error saving journal:', error);
      toast({
        title: "Error",
        description: "Failed to save journal entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStartReview = () => {
    if (onStartReview) {
      onStartReview();
    } else {
      // Fallback: navigate to reviews page
      window.location.hash = '#reviews';
    }
  };

  const isCompleted = (habitId: string) => {
    return todayLogs?.some(log => log.habit_id === habitId && log.completed);
  };

  const isJournalCompleted = () => {
    const journalHabit = essentialHabits?.find(h => h.title === 'Daily Journal');
    return journalHabit ? isCompleted(journalHabit.id) : false;
  };

  const isReviewCompleted = () => {
    const reviewHabit = essentialHabits?.find(h => h.title === 'Daily Review');
    return reviewHabit ? isCompleted(reviewHabit.id) : false;
  };

  if (!essentialHabits?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Today's Essentials
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Daily Journal */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            {isJournalCompleted() ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400" />
            )}
            <div>
              <p className="font-medium">Daily Journal</p>
              <p className="text-sm text-muted-foreground">Reflect on your day through journaling</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isJournalCompleted() ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Complete
              </Badge>
            ) : (
              <Dialog open={isJournalOpen} onOpenChange={setIsJournalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Journal
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Quick Journal Entry</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="What's on your mind today? Reflect on your experiences, thoughts, and feelings..."
                      value={journalEntry}
                      onChange={(e) => setJournalEntry(e.target.value)}
                      className="min-h-32"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleQuickJournal} disabled={!journalEntry.trim()}>
                        Save Journal
                      </Button>
                      <Button variant="outline" onClick={() => setIsJournalOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Daily Review */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            {isReviewCompleted() ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400" />
            )}
            <div>
              <p className="font-medium">Daily Review</p>
              <p className="text-sm text-muted-foreground">Complete your daily reflection and planning</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isReviewCompleted() ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Complete
              </Badge>
            ) : (
              <Button size="sm" onClick={handleStartReview}>
                <BarChart3 className="h-3 w-3 mr-1" />
                Start Review
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
