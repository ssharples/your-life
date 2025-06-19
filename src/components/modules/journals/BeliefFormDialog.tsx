
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Brain, Lightbulb, CheckCircle } from 'lucide-react';
import { useAffirmationGenerator } from './hooks/useAffirmationGenerator';

interface BeliefFormDialogProps {
  beliefs: any[];
  createBelief: any;
}

export const BeliefFormDialog = ({ beliefs, createBelief }: BeliefFormDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBelief, setSelectedBelief] = useState('');
  const [newBelief, setNewBelief] = useState('');
  const [beliefCategory, setBeliefCategory] = useState<'self' | 'others'>('self');
  const [customAffirmation, setCustomAffirmation] = useState('');
  
  const { 
    isGeneratingAffirmation, 
    generatedAffirmation, 
    generateAffirmation, 
    resetAffirmation 
  } = useAffirmationGenerator();

  const resetForm = () => {
    setSelectedBelief('');
    setNewBelief('');
    setBeliefCategory('self');
    setCustomAffirmation('');
    resetAffirmation();
    setIsDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    
    const beliefContent = selectedBelief || newBelief;
    const affirmation = customAffirmation || generatedAffirmation;
    
    if (!beliefContent.trim()) {
      toast({ title: "Error", description: "Please enter or select a belief.", variant: "destructive" });
      return;
    }

    console.log('Submitting belief:', { beliefContent, affirmation, beliefCategory });

    try {
      // If it's a new belief, save it as a reusable belief first
      if (newBelief && !selectedBelief) {
        await createBelief.mutateAsync({
          content: newBelief.trim(),
          entry_type: 'belief',
          insights: beliefCategory,
          tags: [beliefCategory]
        });
      }

      // Save today's belief entry with affirmation
      await createBelief.mutateAsync({
        content: beliefContent.trim(),
        entry_type: 'daily_belief',
        insights: affirmation?.trim() || null,
        tags: [beliefCategory, affirmation ? 'transformed' : 'logged']
      });
      
      resetForm();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
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

          <Button 
            type="submit" 
            className="w-full"
            disabled={createBelief.isPending}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {createBelief.isPending ? 'Recording...' : 'Record Belief Check-in'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
