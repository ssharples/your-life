
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Network, Link2 } from 'lucide-react';
import { KnowledgeGraphCanvas } from './knowledge-graph/KnowledgeGraphCanvas';
import { ConnectionDialog } from './knowledge-graph/ConnectionDialog';

export interface GraphNode {
  id: string;
  label: string;
  type: 'pillar' | 'goal' | 'project' | 'task' | 'habit' | 'journal' | 'knowledge' | 'value';
  data: any;
  x?: number;
  y?: number;
}

export interface GraphConnection {
  id: string;
  source: string;
  target: string;
  type: 'direct' | 'related';
}

export const KnowledgeGraph = () => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false);
  const [connectionSource, setConnectionSource] = useState<GraphNode | null>(null);
  const queryClient = useQueryClient();

  // Fetch all user data
  const { data: allData, isLoading } = useQuery({
    queryKey: ['knowledge-graph-data'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const [
        pillarsData,
        goalsData,
        projectsData,
        tasksData,
        habitsData,
        journalsData,
        knowledgeData,
        valuesData
      ] = await Promise.all([
        supabase.from('pillars').select('*').eq('user_id', user.data.user.id),
        supabase.from('goals').select('*, pillars(name)').eq('user_id', user.data.user.id),
        supabase.from('los_projects').select('*, goals(title), pillars(name)').eq('user_id', user.data.user.id),
        supabase.from('los_tasks').select('*, goals(title), los_projects(title)').eq('user_id', user.data.user.id),
        supabase.from('habits').select('*, goals(title)').eq('user_id', user.data.user.id),
        supabase.from('journals').select('*').eq('user_id', user.data.user.id),
        supabase.from('knowledge_vault').select('*, goals(title), los_projects(title)').eq('user_id', user.data.user.id),
        supabase.from('values_vault').select('*').eq('user_id', user.data.user.id)
      ]);

      return {
        pillars: pillarsData.data || [],
        goals: goalsData.data || [],
        projects: projectsData.data || [],
        tasks: tasksData.data || [],
        habits: habitsData.data || [],
        journals: journalsData.data || [],
        knowledge: knowledgeData.data || [],
        values: valuesData.data || []
      };
    }
  });

  // Fetch custom connections
  const { data: customConnections } = useQuery({
    queryKey: ['knowledge-graph-connections'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('knowledge_connections')
        .select('*')
        .eq('user_id', user.data.user.id);

      if (error) throw error;
      return data || [];
    }
  });

  // Transform data into graph nodes and connections
  const { nodes, connections } = useCallback(() => {
    if (!allData) return { nodes: [], connections: [] };

    const nodes: GraphNode[] = [];
    const connections: GraphConnection[] = [];

    // Create nodes for each data type
    allData.pillars.forEach(item => {
      nodes.push({
        id: `pillar-${item.id}`,
        label: item.name,
        type: 'pillar',
        data: item
      });
    });

    allData.goals.forEach(item => {
      nodes.push({
        id: `goal-${item.id}`,
        label: item.title,
        type: 'goal',
        data: item
      });
      
      // Connect to pillar if exists
      if (item.pillar_id) {
        connections.push({
          id: `goal-${item.id}-pillar-${item.pillar_id}`,
          source: `pillar-${item.pillar_id}`,
          target: `goal-${item.id}`,
          type: 'direct'
        });
      }
    });

    allData.projects.forEach(item => {
      nodes.push({
        id: `project-${item.id}`,
        label: item.title,
        type: 'project',
        data: item
      });
      
      // Connect to goal if exists
      if (item.linked_goal_id) {
        connections.push({
          id: `project-${item.id}-goal-${item.linked_goal_id}`,
          source: `goal-${item.linked_goal_id}`,
          target: `project-${item.id}`,
          type: 'direct'
        });
      }
      
      // Connect to pillar if exists
      if (item.pillar_id) {
        connections.push({
          id: `project-${item.id}-pillar-${item.pillar_id}`,
          source: `pillar-${item.pillar_id}`,
          target: `project-${item.id}`,
          type: 'direct'
        });
      }
    });

    allData.tasks.forEach(item => {
      nodes.push({
        id: `task-${item.id}`,
        label: item.description.substring(0, 30) + (item.description.length > 30 ? '...' : ''),
        type: 'task',
        data: item
      });
      
      // Connect to project if exists
      if (item.project_id) {
        connections.push({
          id: `task-${item.id}-project-${item.project_id}`,
          source: `project-${item.project_id}`,
          target: `task-${item.id}`,
          type: 'direct'
        });
      }
      
      // Connect to goal if exists
      if (item.goal_id) {
        connections.push({
          id: `task-${item.id}-goal-${item.goal_id}`,
          source: `goal-${item.goal_id}`,
          target: `task-${item.id}`,
          type: 'direct'
        });
      }
    });

    allData.habits.forEach(item => {
      nodes.push({
        id: `habit-${item.id}`,
        label: item.title,
        type: 'habit',
        data: item
      });
      
      // Connect to goal if exists
      if (item.goal_id) {
        connections.push({
          id: `habit-${item.id}-goal-${item.goal_id}`,
          source: `goal-${item.goal_id}`,
          target: `habit-${item.id}`,
          type: 'direct'
        });
      }
    });

    allData.journals.forEach(item => {
      nodes.push({
        id: `journal-${item.id}`,
        label: `Journal - ${new Date(item.date).toLocaleDateString()}`,
        type: 'journal',
        data: item
      });
    });

    allData.knowledge.forEach(item => {
      nodes.push({
        id: `knowledge-${item.id}`,
        label: item.title,
        type: 'knowledge',
        data: item
      });
      
      // Connect to goal if exists
      if (item.linked_goal_id) {
        connections.push({
          id: `knowledge-${item.id}-goal-${item.linked_goal_id}`,
          source: `goal-${item.linked_goal_id}`,
          target: `knowledge-${item.id}`,
          type: 'direct'
        });
      }
      
      // Connect to project if exists
      if (item.linked_project_id) {
        connections.push({
          id: `knowledge-${item.id}-project-${item.linked_project_id}`,
          source: `project-${item.linked_project_id}`,
          target: `knowledge-${item.id}`,
          type: 'direct'
        });
      }
    });

    allData.values.forEach(item => {
      nodes.push({
        id: `value-${item.id}`,
        label: item.value,
        type: 'value',
        data: item
      });
    });

    // Add custom connections from database
    if (customConnections) {
      customConnections.forEach(conn => {
        connections.push({
          id: conn.id,
          source: conn.source_id,
          target: conn.target_id,
          type: conn.connection_type as 'direct' | 'related'
        });
      });
    }

    return { nodes, connections };
  }, [allData, customConnections])();

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
  };

  const handleCreateConnection = (source: GraphNode) => {
    setConnectionSource(source);
    setIsConnectionDialogOpen(true);
  };

  const handleConnectionComplete = () => {
    setIsConnectionDialogOpen(false);
    setConnectionSource(null);
    queryClient.invalidateQueries({ queryKey: ['knowledge-graph-connections'] });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Network className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading knowledge graph...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Knowledge Graph</h2>
          <p className="text-muted-foreground">Visualize and manage connections between your data</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['knowledge-graph-data'] })}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Interactive Graph
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full p-0">
              <KnowledgeGraphCanvas
                nodes={nodes}
                connections={connections}
                onNodeClick={handleNodeClick}
                onCreateConnection={handleCreateConnection}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Node Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedNode ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      {selectedNode.type}
                    </h4>
                    <h3 className="font-semibold text-lg">{selectedNode.label}</h3>
                  </div>
                  
                  {selectedNode.data.description && (
                    <div>
                      <h4 className="font-medium mb-1">Description</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedNode.data.description}
                      </p>
                    </div>
                  )}
                  
                  {selectedNode.data.status && (
                    <div>
                      <h4 className="font-medium mb-1">Status</h4>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary">
                        {selectedNode.data.status}
                      </span>
                    </div>
                  )}
                  
                  <Button
                    onClick={() => handleCreateConnection(selectedNode)}
                    className="w-full"
                    size="sm"
                  >
                    <Link2 className="h-4 w-4 mr-2" />
                    Create Connection
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Network className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-sm">
                    Click on a node to view details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Graph Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Nodes:</span>
                  <span className="font-medium">{nodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Connections:</span>
                  <span className="font-medium">{connections.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pillars:</span>
                  <span className="font-medium">{nodes.filter(n => n.type === 'pillar').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Goals:</span>
                  <span className="font-medium">{nodes.filter(n => n.type === 'goal').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Projects:</span>
                  <span className="font-medium">{nodes.filter(n => n.type === 'project').length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConnectionDialog
        isOpen={isConnectionDialogOpen}
        onClose={() => setIsConnectionDialogOpen(false)}
        sourceNode={connectionSource}
        availableNodes={nodes}
        onComplete={handleConnectionComplete}
      />
    </div>
  );
};
