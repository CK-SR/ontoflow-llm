export interface GraphNode {
  id: number;
  entity_type: string;
  source_table?: string;
  source_id?: number;
  label: string;
  properties_json?: string;
}

export interface GraphEdge {
  id: number;
  source_node_id: number;
  target_node_id: number;
  relation_type: string;
  properties_json?: string;
}

export interface GraphStats {
  node_count: number;
  edge_count: number;
  entity_types: Record<string, number>;
}
