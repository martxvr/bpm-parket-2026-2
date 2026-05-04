'use server';

import { revalidatePath } from 'next/cache';
import { assertAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { adminSettingsSchema } from '@/lib/validation/admin-forms';

export type SettingsState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export async function updateSettingsAction(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  await assertAdmin();
  const parsed = adminSettingsSchema.safeParse({
    chatbot_enabled: formData.get('chatbot_enabled') === 'on',
    system_prompt_extra: formData.get('system_prompt_extra') || undefined,
    phone: formData.get('phone') || undefined,
    whatsapp: formData.get('whatsapp') || undefined,
  });
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('admin_settings')
    .update(parsed.data)
    .eq('id', 1);
  if (error) return { status: 'error', message: error.message };

  revalidatePath('/admin/instellingen');
  revalidatePath('/', 'layout');
  return { status: 'success' };
}
