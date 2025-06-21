
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface KnowledgeFormProps {
  defaultPillarId?: string;
  onSuccess: () => void;
}

export const KnowledgeForm = ({ defaultPillarId, onSuccess }: KnowledgeFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    source: '',
    tags: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    setLoading(true);
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const tags = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

      const { error } = await supabase
        .from('knowledge_vault')
        .insert([{
          title: formData.title,
          content: formData.content,
          source: formData.source || null,
          tags,
          user_id: user.data.user.id,
          // Note: We'll need to add pillar_id to knowledge_vault table in future
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Knowledge source added successfully!",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error creating knowledge:', error);
      toast({
        title: "Error",
        description: "Failed to add knowledge source. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter knowledge title"
          required
        />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Capture your insights, learnings, or notes"
          className="min-h-32"
          required
        />
      </div>

      <div>
        <Label htmlFor="source">Source (Optional)</Label>
        <Input
          id="source"
          value={formData.source}
          onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
          placeholder="Book, article, website, etc."
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags (Optional)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          placeholder="Comma-separated tags"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading || !formData.title.trim() || !formData.content.trim()}>
          {loading ? 'Adding...' : 'Add Knowledge'}
        </Button>
      </div>
    </form>
  );
};
