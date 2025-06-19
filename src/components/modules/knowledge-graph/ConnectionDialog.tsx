
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { GraphNode } from '../KnowledgeGraph';

interface ConnectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sourceNode: GraphNode | null;
  availableNodes: GraphNode[];
  onComplete: () => void;
}

export const ConnectionDialog = ({
  isOpen,
  onClose,
  sourceNode,
  availableNodes,
  onComplete
}: ConnectionDialogProps) => {
  const [targetNodeId, setTargetNodeId] = useState<string>('');
  const [connectionType, setConnectionType] = useState<'direct' | 'related'>('related');
  const queryClient = useQueryClient();

  const createConnectionMutation = useMutation({
    mutationFn: async ({ sourceId, targetId, type }: { sourceId: string; targetId: string; type: string }) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('knowledge_connections')
        .insert({
          user_id: user.data.user.id,
          source_id: sourceId,
          target_id: targetId,
          connection_type: type
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Connection created successfully!"
      });
      onComplete();
      onClose();
      setTargetNodeId('');
      queryClient.invalidateQueries({ queryKey: ['knowledge-graph-connections'] });
    },
    onError: (error) => {
      console.error('Error creating connection:', error);
      toast({
        title: "Error",
        description: "Failed to create connection.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = () => {
    if (!sourceNode || !targetNodeId) return;

    createConnectionMutation.mutate({
      sourceId: sourceNode.id,
      targetId: targetNodeId,
      type: connectionType
    });
  };

  const filteredNodes = availableNodes.filter(node => 
    node.id !== sourceNode?.id
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Connection</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {sourceNode && (
            <div>
              <label className="text-sm font-medium">From:</label>
              <div className="p-2 bg-secondary rounded">
                <span className="text-xs text-muted-foreground uppercase">
                  {sourceNode.type}
                </span>
                <div className="font-medium">{sourceNode.label}</div>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium">To:</label>
            <Select value={targetNodeId} onValueChange={setTargetNodeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select target item" />
              </SelectTrigger>
              <SelectContent>
                {filteredNodes.map(node => (
                  <SelectItem key={node.id} value={node.id}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground uppercase">
                        {node.type}
                      </span>
                      <span>{node.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Connection Type:</label>
            <Select value={connectionType} onValueChange={(value: 'direct' | 'related') => setConnectionType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direct">Direct</SelectItem>
                <SelectItem value="related">Related</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!targetNodeId || createConnectionMutation.isPending}
            >
              {createConnectionMutation.isPending ? 'Creating...' : 'Create Connection'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
