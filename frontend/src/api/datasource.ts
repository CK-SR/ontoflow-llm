import client from './client';
import type { DataSource } from '../types/datasource';

export async function getDatasources(): Promise<DataSource[]> {
  const res = await client.get('/api/datasources');
  return res.data;
}
