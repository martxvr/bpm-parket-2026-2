'use client';

import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { uploadGalleryAction } from '@/app/(admin)/admin/gallery/actions';

export function GalleryUploader() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [caption, setCaption] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError('');
    setPending(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      if (caption) fd.append('caption', caption);
      const result = await uploadGalleryAction(fd);
      if (result.error) {
        setError(result.error);
      } else {
        setCaption('');
        if (fileRef.current) fileRef.current.value = '';
      }
    } finally {
      setPending(false);
    }
  }

  return (
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
        className="rounded-xl border-2 border-dashed border-black/15 p-8 flex flex-col items-center justify-center gap-2 text-sm text-black/60 cursor-pointer hover:bg-black/[0.02]"
      >
        <Upload className="h-6 w-6" />
        <span>{pending ? 'Bezig met uploaden…' : 'Sleep een foto hier of klik om te kiezen'}</span>
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
      {error && (
        <p className="text-xs text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
