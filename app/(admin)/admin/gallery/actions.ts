'use server';

import { revalidatePath } from 'next/cache';
import { assertAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { uploadImage, deleteImage } from '@/lib/storage/upload';

export async function uploadGalleryAction(formData: FormData) {
  await assertAdmin();
  const file = formData.get('file') as File | null;
  const caption = (formData.get('caption') as string) || undefined;
  if (!file) return { error: 'Geen bestand' };

  try {
    const { url } = await uploadImage(file, 'gallery');
    const supabase = await createClient();
    const { error } = await supabase
      .from('gallery')
      .insert({ image_url: url, caption });
    if (error) return { error: error.message };
    revalidatePath('/admin/gallery');
    revalidatePath('/');
    return { url };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Upload mislukt' };
  }
}

export async function deleteGalleryItemAction(id: string, imageUrl: string) {
  await assertAdmin();
  const match = imageUrl.match(/\/storage\/v1\/object\/public\/media\/(.+)$/);
  if (match) {
    await deleteImage(match[1]).catch((e) =>
      console.error('Storage delete failed (continuing):', e),
    );
  }
  const supabase = await createClient();
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/gallery');
}
