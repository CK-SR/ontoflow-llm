import client from './client';
import type { ChatResponse } from '../types/chat';

export async function sendChat(message: string): Promise<ChatResponse> {
  const res = await client.post('/api/chat', { message });
  return res.data;
}
