import client from './client';
import type { TableColumnsResponse, TableSampleResponse } from '../types/metadata';

export async function getTables(): Promise<string[]> {
  const res = await client.get('/api/metadata/tables');
  return res.data;
}

export async function getTableColumns(tableName: string): Promise<TableColumnsResponse> {
  const res = await client.get(`/api/metadata/tables/${tableName}/columns`);
  return res.data;
}

export async function getTableSample(tableName: string): Promise<TableSampleResponse> {
  const res = await client.get(`/api/metadata/tables/${tableName}/sample`);
  return res.data;
}
