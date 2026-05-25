import React, { useEffect, useRef, useCallback } from 'react';
import cytoscape from 'cytoscape';
import type { GraphNode, GraphEdge } from '../types/graph';

const TYPE_COLORS: Record<string, string> = {
  Equipment: '#1a3a5c',
  Manufacturer: '#e67e22',
  Location: '#27ae60',
  MaintenanceRecord: '#8e44ad',
  Supplier: '#c0392b',
  PurchaseContract: '#2980b9',
};

interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onNodeClick?: (nodeId: number) => void;
}

const GraphCanvas: React.FC<GraphCanvasProps> = ({ nodes, edges, onNodeClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  const buildElements = useCallback(() => {
    const displayNodes = nodes.slice(0, 100);
    const nodeIds = new Set(displayNodes.map((n) => n.id));

    const elements: cytoscape.ElementDefinition[] = displayNodes.map((n) => ({
      data: {
        id: String(n.id),
        label: n.label,
        entityType: n.entity_type,
      },
    }));

    const filteredEdges = edges.filter(
      (e) => nodeIds.has(e.source_node_id) && nodeIds.has(e.target_node_id),
    );

    filteredEdges.forEach((e) => {
      elements.push({
        data: {
          id: `e-${e.id}`,
          source: String(e.source_node_id),
          target: String(e.target_node_id),
          label: e.relation_type,
        },
      });
    });

    return { elements, truncated: nodes.length > 100 };
  }, [nodes, edges]);

  useEffect(() => {
    if (!containerRef.current) return;

    const { elements } = buildElements();

    if (cyRef.current) {
      cyRef.current.destroy();
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            'text-wrap': 'wrap',
            'text-max-width': '80px',
            'font-size': '11px',
            'text-valign': 'center',
            'text-halign': 'center',
            width: 50,
            height: 50,
            'background-color': (ele: cytoscape.NodeSingular) => {
              const et = ele.data('entityType') as string;
              return TYPE_COLORS[et] || '#999';
            },
            color: '#fff',
            'text-outline-color': (ele: cytoscape.NodeSingular) => {
              const et = ele.data('entityType') as string;
              return TYPE_COLORS[et] || '#999';
            },
            'text-outline-width': 2,
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            label: 'data(label)',
            'font-size': '9px',
            'text-rotation': 'autorotate',
            color: '#888',
            'text-outline-color': '#fff',
            'text-outline-width': 2,
          },
        },
      ],
      layout: {
        name: 'cose',
        padding: 30,
        nodeRepulsion: () => 8000,
        idealEdgeLength: () => 100,
        animate: false,
      } as cytoscape.LayoutOptions,
    });

    cy.on('tap', 'node', (evt) => {
      const nodeId = Number(evt.target.id());
      onNodeClick?.(nodeId);
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [nodes, edges, onNodeClick, buildElements]);

  const truncated = nodes.length > 100;

  return (
    <div>
      {truncated && (
        <div style={{ color: '#faad14', fontSize: 12, marginBottom: 4 }}>
          节点超过 100 个，仅展示前 100 个节点
        </div>
      )}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: 500,
          border: '1px solid #e8e8e8',
          borderRadius: 6,
          background: '#fff',
        }}
      />
    </div>
  );
};

export default GraphCanvas;
