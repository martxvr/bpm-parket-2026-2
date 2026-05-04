'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { assertAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { projectUpsertSchema } from '@/lib/validation/admin-forms';
import { uploadImage } from '@/lib/storage/upload';

export type ProjectState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export async function uploadProjectImageAction(formData: FormData) {
  await assertAdmin();
  const file = formData.get('file') as File | null;
  if (!file) return { error: 'Geen bestand' };
  try {
    const { url } = await uploadImage(file, 'projects');
    return { url };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Upload mislukt' };
  }
}

export async function upsertProjectAction(
  _prev: ProjectState,
  formData: FormData,
): Promise<ProjectState> {
  await assertAdmin();
  const parsed = projectUpsertSchema.safeParse({
    id: formData.get('id') || undefined,
    slug: formData.get('slug'),
    title: formData.get('title'),
    description: formData.get('description') || undefined,
    long_description: formData.get('long_description') || undefined,
    image_url: formData.get('image_url') || undefined,
    area_size: formData.get('area_size') || undefined,
    location: formData.get('location') || undefined,
    completed_date: formData.get('completed_date') || undefined,
    floor_type: formData.get('floor_type') || undefined,
    is_featured: formData.get('is_featured') === 'on',
    sort_order: formData.get('sort_order') || undefined,
  });
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { id, ...rest } = parsed.data;

  if (id) {
    const { error } = await supabase.from('projects').update(rest).eq('id', id);
    if (error) return { status: 'error', message: error.message };
  } else {
    const { error } = await supabase.from('projects').insert(rest);
    if (error) return { status: 'error', message: error.message };
  }

  revalidatePath('/admin/projecten');
  revalidatePath('/projecten');
  redirect('/admin/projecten');
}

export async function deleteProjectAction(id: string) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/projecten');
}
