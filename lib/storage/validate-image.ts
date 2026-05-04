import 'server-only';
import { fileTypeFromBuffer } from 'file-type';

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

export type ValidatedImage = {
  buffer: Buffer;
  mime: string;
  ext: string;
};

export async function validateImage(file: File): Promise<ValidatedImage> {
  if (file.size === 0) throw new Error('Bestand is leeg.');
  if (file.size > MAX_SIZE) {
    throw new Error('Bestand is te groot (max 10 MB).');
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Layer 1: Browser-reported MIME
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error('Alleen JPEG, PNG of WebP toegestaan.');
  }

  // Layer 2: Magic-byte sniff
  const detected = await fileTypeFromBuffer(buffer);
  if (!detected || !ALLOWED_MIME.has(detected.mime)) {
    throw new Error('Bestand is geen geldig beeld.');
  }

  // Layer 3: Reported MIME must match magic bytes
  if (file.type !== detected.mime) {
    throw new Error('Bestandstype komt niet overeen met de extensie.');
  }

  return { buffer, mime: detected.mime, ext: detected.ext };
}
