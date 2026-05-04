'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { assertAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { knowledgeUpsertSchema } from '@/lib/validation/admin-forms';

export type KnowledgeState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export async function upsertKnowledgeAction(
  _prev: KnowledgeState,
  formData: FormData,
): Promise<KnowledgeState> {
  await assertAdmin();
  const parsed = knowledgeUpsertSchema.safeParse({
    id: formData.get('id') || undefined,
    topic: formData.get('topic'),
    content: formData.get('content'),
  });
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  if (parsed.data.id) {
    const { error } = await supabase
      .from('knowledge')
      .update({ topic: parsed.data.topic, content: parsed.data.content })
      .eq('id', parsed.data.id);
    if (error) return { status: 'error', message: error.message };
  } else {
    const { error } = await supabase
      .from('knowledge')
      .insert({ topic: parsed.data.topic, content: parsed.data.content });
    if (error) return { status: 'error', message: error.message };
  }

  revalidatePath('/admin/kennisbank');
  redirect('/admin/kennisbank');
}

export async function deleteKnowledgeAction(id: string) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('knowledge').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/kennisbank');
}
