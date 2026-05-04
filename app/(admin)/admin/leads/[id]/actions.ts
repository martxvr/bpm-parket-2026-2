'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { assertAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { leadStatusSchema } from '@/lib/validation/admin-forms';

export async function updateLeadStatusAction(formData: FormData) {
  await assertAdmin();
  const id = formData.get('id') as string;
  const status = leadStatusSchema.parse(formData.get('status'));

  const supabase = await createClient();
  const { error } = await supabase.from('leads').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/leads');
  revalidatePath(`/admin/leads/${id}`);
}

export async function deleteLeadAction(id: string) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/leads');
  redirect('/admin/leads');
}
