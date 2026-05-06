'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { assertAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { brandProductUpsertSchema } from '@/lib/validation/admin-forms';
import { uploadImage } from '@/lib/storage/upload';

export type ProductState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export async function uploadProductImageAction(formData: FormData) {
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

export async function upsertBrandProductAction(
  _prev: ProductState,
  formData: FormData,
): Promise<ProductState> {
  await assertAdmin();

  let specs: Record<string, string> = {};
  try {
    const raw = formData.get('specs') as string | null;
    if (raw) specs = JSON.parse(raw);
  } catch {}

  let decors: Array<{ name: string; image_url: string }> = [];
  try {
    const raw = formData.get('decors') as string | null;
    if (raw) decors = JSON.parse(raw);
  } catch {}

  const parsed = brandProductUpsertSchema.safeParse({
    id: formData.get('id') || undefined,
    brand_id: formData.get('brand_id'),
    service_id: formData.get('service_id'),
    slug: formData.get('slug'),
    name: formData.get('name'),
    description: formData.get('description') || undefined,
    hero_image: formData.get('hero_image') || undefined,
    specs,
    decors,
    spec_sheet_url: formData.get('spec_sheet_url') || undefined,
    sort_order: formData.get('sort_order') || undefined,
    is_active: formData.get('is_active') === 'on',
  });
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { id, brand_id, ...rest } = parsed.data;
  if (id) {
    const { error } = await supabase
      .from('products')
      .update({ ...rest, brand_id })
      .eq('id', id);
    if (error) return { status: 'error', message: error.message };
  } else {
    const { error } = await supabase
      .from('products')
      .insert({ ...rest, brand_id });
    if (error) return { status: 'error', message: error.message };
  }

  revalidatePath(`/admin/merken/${brand_id}`);
  revalidatePath('/merken');
  redirect(`/admin/merken/${brand_id}`);
}

export async function deleteBrandProductAction(id: string, brandId: string) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/merken/${brandId}`);
}
