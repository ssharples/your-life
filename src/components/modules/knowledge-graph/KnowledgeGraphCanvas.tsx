
import { useEffect, useRef, useState } from 'react';
import { GraphNode, GraphConnection } from '../KnowledgeGraph';

interface KnowledgeGraphCanvasProps {
  nodes: GraphNode[];
  connections: GraphConnection[];
  onNodeClick: (node: GraphNode) => void;
  onCreateConnection: (node: GraphNode) => void;
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

export const KnowledgeGraphCanvas = ({ 
  nodes, 
  connections, 
  onNodeClick, 
  onCreateConnection 
}: KnowledgeGraphCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Position nodes using force-directed layout
  useEffect(() => {
    if (nodes.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Initialize positions if not set
    nodes.forEach((node, index) => {
      if (node.x === undefined || node.y === undefined) {
        const angle = (index / nodes.length) * 2 * Math.PI;
        const radius = Math.min(centerX, centerY) * 0.6;
        node.x = centerX + Math.cos(angle) * radius;
        node.y = centerY + Math.sin(angle) * radius;
      }
    });

    // Simple force-directed layout simulation
    for (let iteration = 0; iteration < 100; iteration++) {
      // Repulsion between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const node1 = nodes[i];
          const node2 = nodes[j];
          const dx = node2.x! - node1.x!;
          const dy = node2.y! - node1.y!;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0) {
            const force = 1000 / (distance * distance);
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            
            node1.x! -= fx;
            node1.y! -= fy;
            node2.x! += fx;
            node2.y! += fy;
          }
        }
      }

      // Attraction along connections
      connections.forEach(connection => {
        const source = nodes.find(n => n.id === connection.source);
        const target = nodes.find(n => n.id === connection.target);
        
        if (source && target) {
          const dx = target.x! - source.x!;
          const dy = target.y! - source.y!;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0) {
            const force = distance * 0.01;
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            
            source.x! += fx;
            source.y! += fy;
            target.x! -= fx;
            target.y! -= fy;
          }
        }
      });

      // Center attraction
      nodes.forEach(node => {
        const dx = centerX - node.x!;
        const dy = centerY - node.y!;
        node.x! += dx * 0.001;
        node.y! += dy * 0.001;
      });
    }

    draw();
  }, [nodes, connections]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 2;
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
      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNode?.id === node.id;
      
      ctx.fillStyle = NODE_COLORS[node.type];
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, isSelected || isHovered ? 25 : 20, 0, 2 * Math.PI);
      ctx.fill();
      
      if (isSelected) {
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Draw label
      ctx.fillStyle = '#374151';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        node.label.length > 15 ? node.label.substring(0, 15) + '...' : node.label,
        node.x!,
        node.y! + 35
      );
    });
  };

  const getNodeAtPosition = (x: number, y: number): GraphNode | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const canvasX = x - rect.left;
    const canvasY = y - rect.top;

    return nodes.find(node => {
      const dx = canvasX - node.x!;
      const dy = canvasY - node.y!;
      return Math.sqrt(dx * dx + dy * dy) <= 25;
    }) || null;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const node = getNodeAtPosition(e.clientX, e.clientY);
    
    if (isDragging && selectedNode) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      selectedNode.x = e.clientX - rect.left - dragOffset.x;
      selectedNode.y = e.clientY - rect.top - dragOffset.y;
      draw();
    } else {
      setHoveredNode(node);
      if (node !== hoveredNode) {
        draw();
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const node = getNodeAtPosition(e.clientX, e.clientY);
    if (node) {
      setSelectedNode(node);
      setIsDragging(true);
      
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left - node.x!,
        y: e.clientY - rect.top - node.y!
      });
      
      onNodeClick(node);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const node = getNodeAtPosition(e.clientX, e.clientY);
    if (node) {
      onCreateConnection(node);
    }
  };

  useEffect(() => {
    draw();
  }, [selectedNode, hoveredNode]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
      />
      
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs space-y-1">
        <div className="font-semibold mb-2">Legend</div>
        {Object.entries(NODE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: color }}
            />
            <span className="capitalize">{type}</span>
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs">
        <div><strong>Click:</strong> Select node</div>
        <div><strong>Drag:</strong> Move node</div>
        <div><strong>Double-click:</strong> Create connection</div>
      </div>
    </div>
  );
};
