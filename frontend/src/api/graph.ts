import client from './client';
import type { GraphStats, GraphNode, GraphEdge } from '../types/graph';

export async function getGraphStats(): Promise<GraphStats> {
  const res = await client.get('/api/graph/stats');
  return res.data;
}

export async function getGraphNodes(): Promise<GraphNode[]> {
  const res = await client.get('/api/graph/nodes');
  return res.data;
}

export async function getGraphEdges(): Promise<GraphEdge[]> {
  const res = await client.get('/api/graph/edges');
  return res.data;
}

export async function getEntity(nodeId: number): Promise<GraphNode | null> {
  const res = await client.get(`/api/graph/entity/${nodeId}`);
  return res.data;
}

export async function getEntityNeighbors(nodeId: number): Promise<GraphNode[]> {
  const res = await client.get(`/api/graph/entity/${nodeId}/neighbors`);
  return res.data;
}

export async function searchGraph(keyword: string): Promise<GraphNode[]> {
  const res = await client.get('/api/graph/search', { params: { keyword } });
  return res.data;
}
