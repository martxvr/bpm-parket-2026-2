import 'server-only';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { createServiceClient } from '@/lib/supabase/server';
import { validateImage } from './validate-image';

const BUCKET = 'media';
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 85;

export async function uploadImage(
  file: File,
  folder: 'projects' | 'gallery' | 'services' | 'site',
): Promise<{ url: string; path: string }> {
  const { buffer } = await validateImage(file);

  // Process: rotate per EXIF then strip metadata, resize, encode WebP
  const processed = await sharp(buffer)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  // Content-hashed filename — same image dedupes naturally
  const hash = createHash('sha256').update(processed).digest('hex').slice(0, 16);
  const path = `${folder}/${hash}.webp`;

  const supabase = createServiceClient();
  const { error } = await supabase.storage.from(BUCKET).upload(path, processed, {
    contentType: 'image/webp',
    upsert: true,
  });
  if (error) throw new Error(`Upload mislukt: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function deleteImage(path: string): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw new Error(`Verwijderen mislukt: ${error.message}`);
}
