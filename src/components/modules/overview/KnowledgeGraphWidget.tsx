
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Network, ArrowRight } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';

interface GraphNode {
  id: string;
  label: string;
  type: 'pillar' | 'goal' | 'project' | 'task' | 'habit' | 'journal' | 'knowledge' | 'value';
  x?: number;
  y?: number;
}

interface GraphConnection {
  id: string;
  source: string;
  target: string;
  type: 'direct' | 'related';
}

const NODE_COLORS = {
  pillar: '#8B5CF6',
  goal: '#10B981',
  project: '#3B82F6',
  task: '#F59E0B',
  habit: '#EF4444',
  journal: '#6366F1',
  knowledge: '#F97316',
  value: '#EC4899'
};

export const KnowledgeGraphWidget = ({ onViewFull }: { onViewFull: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fetch simplified data for the widget
  const { data: graphData } = useQuery({
    queryKey: ['overview-knowledge-graph'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const [
        pillarsData,
        goalsData,
        projectsData,
        habitsData,
        knowledgeData,
        valuesData,
        connectionsData
      ] = await Promise.all([
        supabase.from('pillars').select('id, name').eq('user_id', user.data.user.id).limit(5),
        supabase.from('goals').select('id, title, pillar_id').eq('user_id', user.data.user.id).limit(8),
        supabase.from('los_projects').select('id, title, linked_goal_id').eq('user_id', user.data.user.id).limit(6),
        supabase.from('habits').select('id, title, goal_id').eq('user_id', user.data.user.id).limit(5),
        supabase.from('knowledge_vault').select('id, title').eq('user_id', user.data.user.id).limit(4),
        supabase.from('values_vault').select('id, value').eq('user_id', user.data.user.id).limit(4),
        supabase.from('knowledge_connections').select('*').eq('user_id', user.data.user.id)
      ]);

      const nodes: GraphNode[] = [];
      const connections: GraphConnection[] = [];

      // Create nodes
      pillarsData.data?.forEach(item => {
        nodes.push({ id: `pillar-${item.id}`, label: item.name, type: 'pillar' });
      });

      goalsData.data?.forEach(item => {
        nodes.push({ id: `goal-${item.id}`, label: item.title, type: 'goal' });
        if (item.pillar_id) {
          connections.push({
            id: `goal-${item.id}-pillar-${item.pillar_id}`,
            source: `pillar-${item.pillar_id}`,
            target: `goal-${item.id}`,
            type: 'direct'
          });
        }
      });

      projectsData.data?.forEach(item => {
        nodes.push({ id: `project-${item.id}`, label: item.title, type: 'project' });
        if (item.linked_goal_id) {
          connections.push({
            id: `project-${item.id}-goal-${item.linked_goal_id}`,
            source: `goal-${item.linked_goal_id}`,
            target: `project-${item.id}`,
            type: 'direct'
          });
        }
      });

      habitsData.data?.forEach(item => {
        nodes.push({ id: `habit-${item.id}`, label: item.title, type: 'habit' });
        if (item.goal_id) {
          connections.push({
            id: `habit-${item.id}-goal-${item.goal_id}`,
            source: `goal-${item.goal_id}`,
            target: `habit-${item.id}`,
            type: 'direct'
          });
        }
      });

      knowledgeData.data?.forEach(item => {
        nodes.push({ id: `knowledge-${item.id}`, label: item.title, type: 'knowledge' });
      });

      valuesData.data?.forEach(item => {
        nodes.push({ id: `value-${item.id}`, label: item.value, type: 'value' });
      });

      // Add custom connections
      connectionsData.data?.forEach(conn => {
        connections.push({
          id: conn.id,
          source: conn.source_id,
          target: conn.target_id,
          type: conn.connection_type as 'direct' | 'related'
        });
      });

      return { nodes, connections };
    }
  });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !graphData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { nodes, connections } = graphData;
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Position nodes in a simple circle layout
    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI;
      const radius = Math.min(centerX, centerY) * 0.6;
      node.x = centerX + Math.cos(angle) * radius;
      node.y = centerY + Math.sin(angle) * radius;
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    connections.forEach(connection => {
      const source = nodes.find(n => n.id === connection.source);
      const target = nodes.find(n => n.id === connection.target);
      
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x!, source.y!);
        ctx.lineTo(target.x!, target.y!);
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      ctx.fillStyle = NODE_COLORS[node.type];
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Draw abbreviated labels
      ctx.fillStyle = '#374151';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      const shortLabel = node.label.length > 8 ? node.label.substring(0, 8) + '...' : node.label;
      ctx.fillText(shortLabel, node.x!, node.y! + 20);
    });
  }, [graphData]);

  useEffect(() => {
    draw();
  }, [draw]);

  const stats = graphData ? {
    nodes: graphData.nodes.length,
    connections: graphData.connections.length
  } : { nodes: 0, connections: 0 };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Knowledge Graph
          </div>
          <Button variant="ghost" size="sm" onClick={onViewFull}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-32 w-full relative">
            <canvas
              ref={canvasRef}
              className="w-full h-full border rounded"
              style={{ backgroundColor: '#fafafa' }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{stats.nodes} nodes</span>
            <span>{stats.connections} connections</span>
          </div>
          
          <Button variant="outline" size="sm" className="w-full" onClick={onViewFull}>
            View Full Graph
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
