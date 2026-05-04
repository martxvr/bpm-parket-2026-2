import 'server-only';
import { createClient } from '@/lib/supabase/server';

export type AppointmentInsert = {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  date: string;
  notes?: string;
  source: 'chatbot' | 'website' | 'manual';
  ip_hash?: string;
};

export async function insertAppointment(input: AppointmentInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('appointments')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function countAppointmentsForDate(
  dateYyyyMmDd: string,
): Promise<number> {
  const supabase = await createClient();
  const start = `${dateYyyyMmDd}T00:00:00.000Z`;
  const end = `${dateYyyyMmDd}T23:59:59.999Z`;
  const { count, error } = await supabase
    .from('appointments')
    .select('id', { count: 'exact', head: true })
    .gte('date', start)
    .lte('date', end);
  if (error) throw error;
  return count ?? 0;
}
