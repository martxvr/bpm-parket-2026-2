'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { assertAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { appointmentStatusSchema } from '@/lib/validation/admin-forms';

export async function updateAppointmentStatusAction(formData: FormData) {
  await assertAdmin();
  const id = formData.get('id') as string;
  const status = appointmentStatusSchema.parse(formData.get('status'));

  const supabase = await createClient();
  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/afspraken');
  revalidatePath(`/admin/afspraken/${id}`);
}

export async function deleteAppointmentAction(id: string) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('appointments').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/afspraken');
  redirect('/admin/afspraken');
}
