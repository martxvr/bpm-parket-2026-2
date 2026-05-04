'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const updateSchema = z
  .object({
    password: z.string().min(12, 'Minimaal 12 tekens'),
    passwordConfirm: z.string(),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: 'Wachtwoorden komen niet overeen',
    path: ['passwordConfirm'],
  });

export type UpdateState = { error?: string };

export async function updatePasswordAction(
  _prev: UpdateState,
  formData: FormData,
): Promise<UpdateState> {
  const parsed = updateSchema.safeParse({
    password: formData.get('password'),
    passwordConfirm: formData.get('passwordConfirm'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  // User session is set by Supabase via the magic link cookie.
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: 'Sessie verlopen — vraag een nieuwe reset-link aan.' };
  }

  revalidatePath('/', 'layout');
  redirect('/admin');
}
