import 'server-only';
import { createClient } from '@/lib/supabase/server';

export type LeadInsert = {
  name: string;
  email: string;
  phone: string;
  floor_type?: string;
  area_size?: number;
  message?: string;
  source: string;
  ip_hash?: string;
  user_agent_hash?: string;
};

export async function insertLead(input: LeadInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('leads')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}
