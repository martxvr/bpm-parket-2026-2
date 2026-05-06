'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import {
  addBrandImageAction,
  deleteBrandImageAction,
} from '@/app/(admin)/admin/merken/actions';
import { DeleteButton } from '@/components/admin/DeleteButton';
import type { BrandImage } from '@/lib/db/brands';

type Props = {
  brandId: string;
  images: BrandImage[];
};

export function BrandMoodGalleryUploader({ brandId, images }: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [caption, setCaption] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError('');
    setPending(true);
    try {
      const fd = new FormData();
      fd.append('brand_id', brandId);
      fd.append('file', file);
      if (caption) fd.append('caption', caption);
      const result = await addBrandImageAction(fd);
      if (result.error) setError(result.error);
      else {
        setCaption('');
        if (fileRef.current) fileRef.current.value = '';
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Onderschrift (optioneel)"
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          onClick={() => fileRef.current?.click()}
          className="rounded-xl border-2 border-dashed border-black/15 p-6 flex flex-col items-center justify-center gap-2 text-sm text-black/60 cursor-pointer hover:bg-black/[0.02]"
        >
          <Upload className="h-6 w-6" />
          <span>{pending ? 'Bezig…' : 'Sleep een foto hier of klik om te kiezen'}</span>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        {error && <p className="text-xs text-red-700" role="alert">{error}</p>}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative group">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-black/5">
                <Image src={img.image_url} alt={img.caption ?? ''} fill sizes="200px" className="object-cover" />
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition rounded-full bg-white/95 p-1 shadow">
                <DeleteButton
                  action={async () => {
                    'use server';
                    await deleteBrandImageAction(img.id, img.image_url, brandId);
                  }}
                  confirmMessage="Foto verwijderen?"
                />
              </div>
              {img.caption && (
                <p className="mt-1 text-xs text-black/50 truncate">{img.caption}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
