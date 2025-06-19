
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
import { Plus, Brain, Lightbulb, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { JournalsGuide } from '@/components/guides/JournalsGuide';
import { useHelp } from '@/contexts/HelpContext';

export const Journals = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBelief, setSelectedBelief] = useState('');
  const [newBelief, setNewBelief] = useState('');
  const [beliefCategory, setBeliefCategory] = useState<'self' | 'others'>('self');
  const [customAffirmation, setCustomAffirmation] = useState('');
  const [isGeneratingAffirmation, setIsGeneratingAffirmation] = useState(false);
  const [generatedAffirmation, setGeneratedAffirmation] = useState('');
  const queryClient = useQueryClient();
  const { showHelp } = useHelp();

  // Fetch existing beliefs
  const { data: beliefs } = useQuery({
    queryKey: ['beliefs'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .eq('user_id', user.data.user.id)
        .eq('entry_type', 'belief')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch today's belief entries
  const { data: todayEntries } = useQuery({
    queryKey: ['todayBeliefs'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .eq('user_id', user.data.user.id)
        .eq('entry_type', 'daily_belief')
        .eq('date', today)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Create or update belief
  const createBelief = useMutation({
    mutationFn: async (beliefData: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('journals')
        .insert([{ 
          ...beliefData, 
          user_id: user.data.user.id,
          date: new Date().toISOString().split('T')[0],
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beliefs'] });
      queryClient.invalidateQueries({ queryKey: ['todayBeliefs'] });
      toast({ title: "Success", description: "Belief entry recorded successfully!" });
      resetForm();
    },
  });

  // Generate affirmation with AI
  const generateAffirmation = async (negativeThought: string) => {
    setIsGeneratingAffirmation(true);
    try {
      const response = await supabase.functions.invoke('generate-affirmation', {
        body: { negativeThought }
      });

      if (response.error) throw response.error;
      setGeneratedAffirmation(response.data.affirmation);
    } catch (error) {
      console.error('Failed to generate affirmation:', error);
      toast({ 
        title: "Error", 
        description: "Failed to generate affirmation. Please try writing one manually.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAffirmation(false);
    }
  };

  const resetForm = () => {
    setSelectedBelief('');
    setNewBelief('');
    setBeliefCategory('self');
    setCustomAffirmation('');
    setGeneratedAffirmation('');
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const beliefContent = selectedBelief || newBelief;
    const affirmation = customAffirmation || generatedAffirmation;
    
    if (!beliefContent) {
      toast({ title: "Error", description: "Please enter or select a belief.", variant: "destructive" });
      return;
    }

    // If it's a new belief, save it as a reusable belief
    if (newBelief && !selectedBelief) {
      createBelief.mutate({
        content: newBelief,
        entry_type: 'belief',
        insights: beliefCategory,
        tags: [beliefCategory]
      });
    }

    // Save today's belief entry with affirmation
    createBelief.mutate({
      content: beliefContent,
      entry_type: 'daily_belief',
      insights: affirmation,
      tags: [beliefCategory, affirmation ? 'transformed' : 'logged']
    });
  };

  const uniqueBeliefs = beliefs?.reduce((acc, belief) => {
    if (belief.entry_type === 'belief' && !acc.some(b => b.content === belief.content)) {
      acc.push(belief);
    }
    return acc;
  }, [] as any[]) || [];

  const selfBeliefs = uniqueBeliefs.filter(b => b.insights === 'self');
  const othersBeliefs = uniqueBeliefs.filter(b => b.insights === 'others');

  return (
    <div className="space-y-6">
      {showHelp && <JournalsGuide />}
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mindset Journal</h2>
          <p className="text-muted-foreground">Transform negative beliefs into empowering affirmations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Log Belief
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Daily Belief Check-in</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Belief Category</label>
                <Select value={beliefCategory} onValueChange={(value: any) => setBeliefCategory(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self">About Myself</SelectItem>
                    <SelectItem value="others">About Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Select Existing Belief (Optional)</label>
                <Select value={selectedBelief} onValueChange={setSelectedBelief}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a recurring belief..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(beliefCategory === 'self' ? selfBeliefs : othersBeliefs).map((belief) => (
                      <SelectItem key={belief.id} value={belief.content}>
                        {belief.content.substring(0, 60)}...
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Or Enter New Negative Belief/Thought</label>
                <Textarea
                  placeholder="What negative thought or belief about yourself/others came up today?"
                  value={newBelief}
                  onChange={(e) => setNewBelief(e.target.value)}
                  disabled={!!selectedBelief}
                  rows={3}
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Transform into Affirmation</span>
                </div>
                
                <div className="flex gap-2 mb-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => generateAffirmation(selectedBelief || newBelief)}
                    disabled={!selectedBelief && !newBelief || isGeneratingAffirmation}
                  >
                    <Brain className="h-3 w-3 mr-1" />
                    {isGeneratingAffirmation ? 'Generating...' : 'AI Help'}
                  </Button>
                </div>

                {generatedAffirmation && (
                  <div className="bg-green-50 border border-green-200 rounded p-3 mb-3">
                    <div className="text-sm font-medium text-green-800 mb-1">Generated Affirmation:</div>
                    <div className="text-sm text-green-700">{generatedAffirmation}</div>
                  </div>
                )}

                <Textarea
                  placeholder="Write your positive affirmation here (flip the negative belief)..."
                  value={customAffirmation}
                  onChange={(e) => setCustomAffirmation(e.target.value)}
                  rows={2}
                />
              </div>

              <Button type="submit" className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Record Belief Check-in
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Today's Mindset Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayEntries && todayEntries.length > 0 ? (
            <div className="space-y-3">
              {todayEntries.map((entry) => (
                <div key={entry.id} className="border-l-4 border-l-blue-500 pl-4 py-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-red-600 mb-1">
                        <AlertCircle className="h-3 w-3 inline mr-1" />
                        Negative Belief:
                      </div>
                      <p className="text-sm mb-2">{entry.content}</p>
                      {entry.insights && (
                        <>
                          <div className="text-sm font-medium text-green-600 mb-1">
                            <Lightbulb className="h-3 w-3 inline mr-1" />
                            Positive Affirmation:
                          </div>
                          <p className="text-sm text-green-700 font-medium">{entry.insights}</p>
                        </>
                      )}
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {entry.tags?.[0] === 'self' ? 'About Self' : 'About Others'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No mindset work recorded today yet.</p>
              <p className="text-sm">Click "Log Belief" to start your daily check-in.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Belief Library */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Beliefs About Myself</CardTitle>
          </CardHeader>
          <CardContent>
            {selfBeliefs.length > 0 ? (
              <div className="space-y-2">
                {selfBeliefs.slice(0, 5).map((belief) => (
                  <div key={belief.id} className="text-sm p-2 bg-gray-50 rounded border-l-4 border-l-red-300">
                    {belief.content}
                  </div>
                ))}
                {selfBeliefs.length > 5 && (
                  <div className="text-xs text-muted-foreground">
                    +{selfBeliefs.length - 5} more beliefs tracked
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recurring beliefs about yourself tracked yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Beliefs About Others</CardTitle>
          </CardHeader>
          <CardContent>
            {othersBeliefs.length > 0 ? (
              <div className="space-y-2">
                {othersBeliefs.slice(0, 5).map((belief) => (
                  <div key={belief.id} className="text-sm p-2 bg-gray-50 rounded border-l-4 border-l-orange-300">
                    {belief.content}
                  </div>
                ))}
                {othersBeliefs.length > 5 && (
                  <div className="text-xs text-muted-foreground">
                    +{othersBeliefs.length - 5} more beliefs tracked
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recurring beliefs about others tracked yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
