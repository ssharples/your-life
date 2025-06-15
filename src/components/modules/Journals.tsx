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
import { Plus, BookOpen, Calendar, Star } from 'lucide-react';
import { JournalsGuide } from '@/components/guides/JournalsGuide';
import { useHelp } from '@/contexts/HelpContext';

export const Journals = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [content, setContent] = useState('');
  const [insights, setInsights] = useState('');
  const [moodRating, setMoodRating] = useState<number>(5);
  const [entryType, setEntryType] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'>('daily');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tags, setTags] = useState('');
  const queryClient = useQueryClient();
  const { showHelp } = useHelp();

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
          date: date,
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
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
    setMoodRating(5);
    setEntryType('daily');
    setDate(new Date().toISOString().split('T')[0]);
    setTags('');
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    createJournal.mutate({ 
      content, 
      insights, 
      mood_rating: moodRating, 
      entry_type: entryType, 
      date, 
      tags: tagsArray 
    });
  };

  const getMoodEmoji = (rating: number) => {
    if (rating <= 2) return '😢';
    if (rating <= 4) return '😕';
    if (rating <= 6) return '😐';
    if (rating <= 8) return '😊';
    return '😄';
  };

  const getEntryTypeColor = (type: string) => {
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
      {showHelp && <JournalsGuide />}
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Journal</h2>
          <p className="text-muted-foreground">Reflect on your thoughts and experiences</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Journal Entry</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              <Textarea
                placeholder="What's on your mind? Write about your day, thoughts, or experiences..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={6}
              />
              <Textarea
                placeholder="Key insights or learnings from this entry..."
                value={insights}
                onChange={(e) => setInsights(e.target.value)}
                rows={3}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Mood Rating: {moodRating}/10 {getMoodEmoji(moodRating)}</label>
                <Input
                  type="range"
                  min="1"
                  max="10"
                  value={moodRating}
                  onChange={(e) => setMoodRating(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <Input
                placeholder="Tags (comma-separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
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
                <div className="flex items-center gap-2">
                  <Badge className={getEntryTypeColor(journal.entry_type)}>
                    {journal.entry_type}
                  </Badge>
                  {journal.mood_rating && (
                    <div className="flex items-center gap-1 text-sm">
                      <span>{getMoodEmoji(journal.mood_rating)}</span>
                      <span>{journal.mood_rating}/10</span>
                    </div>
                  )}
                </div>
              </div>
              {journal.tags && journal.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {journal.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm leading-relaxed">{journal.content}</p>
                {journal.insights && (
                  <div className="border-l-4 border-yellow-400 pl-4 bg-yellow-50 py-2">
                    <div className="flex items-center gap-1 text-sm font-medium text-yellow-800 mb-1">
                      <Star className="h-3 w-3" />
                      Insights
                    </div>
                    <p className="text-sm text-yellow-700">{journal.insights}</p>
                  </div>
                )}
                <div className="text-xs text-muted-foreground flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Created: {new Date(journal.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
