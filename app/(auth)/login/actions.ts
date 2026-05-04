'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Ongeldig emailadres'),
  password: z.string().min(8, 'Wachtwoord moet minimaal 8 tekens zijn'),
  redirectTo: z.string().optional(),
});

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    redirectTo: formData.get('redirectTo') || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: 'Onjuist emailadres of wachtwoord' };
  }

  revalidatePath('/', 'layout');
  redirect(
    parsed.data.redirectTo && parsed.data.redirectTo.startsWith('/admin')
      ? parsed.data.redirectTo
      : '/admin',
  );
}
