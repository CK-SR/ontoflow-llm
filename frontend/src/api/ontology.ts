import client from './client';
import type { OntologySchemaResponse } from '../types/ontology';

export async function getOntologySchema(): Promise<OntologySchemaResponse> {
  const res = await client.get('/api/ontology/schema');
  return res.data;
}

export async function reloadOntologySchema(): Promise<OntologySchemaResponse> {
  const res = await client.post('/api/ontology/schema/reload');
  return res.data;
}
