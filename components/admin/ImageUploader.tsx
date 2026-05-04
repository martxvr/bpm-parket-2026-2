'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';

type Props = {
  name: string;
  defaultUrl?: string;
  onUploaded?: (url: string) => void;
  uploadAction: (formData: FormData) => Promise<{ url?: string; error?: string }>;
  folder?: 'projects' | 'gallery' | 'services' | 'site';
};

export function ImageUploader({
  name,
  defaultUrl,
  onUploaded,
  uploadAction,
  folder = 'projects',
}: Props) {
  const [url, setUrl] = useState(defaultUrl ?? '');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError('');
    setPending(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);
      const result = await uploadAction(fd);
      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        setUrl(result.url);
        onUploaded?.(result.url);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black/5">
          <Image src={url} alt="" fill sizes="600px" className="object-cover" />
          <button
            type="button"
            onClick={() => setUrl('')}
            className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 shadow hover:bg-white"
            aria-label="Verwijder afbeelding"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          onClick={() => fileRef.current?.click()}
          className="aspect-video rounded-xl border-2 border-dashed border-black/15 flex flex-col items-center justify-center gap-2 text-sm text-black/60 cursor-pointer hover:bg-black/[0.02]"
        >
          <Upload className="h-6 w-6" />
          <span>{pending ? 'Bezig met uploaden…' : 'Klik of sleep een afbeelding hier'}</span>
          <span className="text-xs">JPG, PNG of WebP, max 10 MB</span>
        </div>
      )}

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
        <p className="mt-2 text-xs text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
