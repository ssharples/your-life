
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { KnowledgeForm } from '../KnowledgeForm';

interface KnowledgeTabProps {
  knowledge: any[];
  pillarId: string;
  onRefresh: () => void;
}

export const KnowledgeTab = ({ knowledge, pillarId, onRefresh }: KnowledgeTabProps) => {
  const [showKnowledgeForm, setShowKnowledgeForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Knowledge Sources</h3>
        <Dialog open={showKnowledgeForm} onOpenChange={setShowKnowledgeForm}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Knowledge
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Knowledge Source</DialogTitle>
            </DialogHeader>
            <KnowledgeForm 
              defaultPillarId={pillarId}
              onSuccess={() => {
                setShowKnowledgeForm(false);
                onRefresh();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4">
        {knowledge.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-3">{item.content}</p>
              {item.source && (
                <Badge variant="outline" className="w-fit">
                  {item.source}
                </Badge>
              )}
            </CardHeader>
          </Card>
        ))}
        {knowledge.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No knowledge sources yet. Click "Add Knowledge" to capture insights for this pillar.
          </p>
        )}
      </div>
    </div>
  );
};
