'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { assertAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { serviceUpdateSchema } from '@/lib/validation/admin-forms';

export type ServiceState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export async function updateServiceAction(
  _prev: ServiceState,
  formData: FormData,
): Promise<ServiceState> {
  await assertAdmin();
  const parsed = serviceUpdateSchema.safeParse({
    slug: formData.get('slug'),
    title: formData.get('title'),
    meta_title: formData.get('meta_title') || undefined,
    meta_description: formData.get('meta_description') || undefined,
    body_md: formData.get('body_md') || undefined,
    hero_image: formData.get('hero_image') || undefined,
    sort_order: formData.get('sort_order') || undefined,
  });
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { slug, ...rest } = parsed.data;
  const { error } = await supabase.from('services').update(rest).eq('slug', slug);
  if (error) return { status: 'error', message: error.message };

  revalidatePath('/admin/diensten');
  revalidatePath(`/${slug}`);
  redirect('/admin/diensten');
}
