import 'server-only';
import { createClient } from '@/lib/supabase/server';

export type AdminSettings = {
  id: number;
  chatbot_enabled: boolean;
  system_prompt_extra: string | null;
  phone: string | null;
  whatsapp: string | null;
};

export async function getAdminSettings(): Promise<AdminSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('admin_settings')
    .select('*')
    .eq('id', 1)
    .single();
  if (error) throw error;
  return data;
}
