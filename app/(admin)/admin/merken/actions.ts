'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { assertAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import {
  brandUpsertSchema,
  brandImageInsertSchema,
} from '@/lib/validation/admin-forms';
import { uploadImage, deleteImage } from '@/lib/storage/upload';

export type BrandState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export async function uploadBrandImageAction(formData: FormData) {
  await assertAdmin();
  const file = formData.get('file') as File | null;
  if (!file) return { error: 'Geen bestand' };
  try {
    const { url } = await uploadImage(file, 'site');
    return { url };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Upload mislukt' };
  }
}

export async function upsertBrandAction(
  _prev: BrandState,
  formData: FormData,
): Promise<BrandState> {
  await assertAdmin();
  const parsed = brandUpsertSchema.safeParse({
    id: formData.get('id') || undefined,
    slug: formData.get('slug'),
    name: formData.get('name'),
    logo_url: formData.get('logo_url') || undefined,
    hero_image: formData.get('hero_image') || undefined,
    description: formData.get('description') || undefined,
    internal_notes: formData.get('internal_notes') || undefined,
    website_url: formData.get('website_url') || undefined,
    sort_order: formData.get('sort_order') || undefined,
    is_active: formData.get('is_active') === 'on',
  });
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { id, ...rest } = parsed.data;
  if (id) {
    const { error } = await supabase.from('brands').update(rest).eq('id', id);
    if (error) return { status: 'error', message: error.message };
  } else {
    const { error } = await supabase.from('brands').insert(rest);
    if (error) return { status: 'error', message: error.message };
  }

  revalidatePath('/admin/merken');
  revalidatePath('/merken');
  redirect('/admin/merken');
}

export async function deleteBrandAction(id: string) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('brands').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/merken');
}

export async function addBrandImageAction(formData: FormData) {
  await assertAdmin();
  const brand_id = formData.get('brand_id') as string;
  const caption = (formData.get('caption') as string) || undefined;
  const file = formData.get('file') as File | null;
  if (!file) return { error: 'Geen bestand' };

  try {
    const { url } = await uploadImage(file, 'site');
    const parsed = brandImageInsertSchema.safeParse({ brand_id, image_url: url, caption });
    if (!parsed.success) return { error: parsed.error.issues[0].message };

    const supabase = await createClient();
    const { error } = await supabase.from('brand_images').insert(parsed.data);
    if (error) return { error: error.message };
    revalidatePath(`/admin/merken/${brand_id}`);
    revalidatePath('/merken');
    return { url };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Upload mislukt' };
  }
}

export async function deleteBrandImageAction(id: string, imageUrl: string, brandId: string) {
  await assertAdmin();
  const match = imageUrl.match(/\/storage\/v1\/object\/public\/media\/(.+)$/);
  if (match) {
    await deleteImage(match[1]).catch((e) => console.error('Storage delete failed:', e));
  }
  const supabase = await createClient();
  const { error } = await supabase.from('brand_images').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/merken/${brandId}`);
}
