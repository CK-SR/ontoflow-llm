import client from './client';
import type { Equipment, EquipmentRisk } from '../types/equipment';

export async function getEquipments(): Promise<Equipment[]> {
  const res = await client.get('/api/equipment');
  return res.data;
}

export async function getEquipmentRisks(): Promise<EquipmentRisk[]> {
  const res = await client.get('/api/equipment/risks');
  return res.data;
}

export async function getEquipmentRisk(equipmentId: number): Promise<EquipmentRisk> {
  const res = await client.get(`/api/equipment/${equipmentId}/risk`);
  return res.data;
}
