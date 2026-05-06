'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Plus, X, Upload } from 'lucide-react';
import { uploadBrandImageAction } from '@/app/(admin)/admin/merken/actions';

type Decor = { name: string; image_url: string };

type Props = {
  name: string;
  defaultValue?: Decor[];
};

export function DecorsEditor({ name, defaultValue = [] }: Props) {
  const [decors, setDecors] = useState<Decor[]>(defaultValue);

  const json = JSON.stringify(decors.filter((d) => d.name.trim() && d.image_url));

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={json} />
      {decors.map((d, i) => (
        <DecorRow
          key={i}
          decor={d}
          onChange={(updated) =>
            setDecors((curr) => curr.map((x, j) => (j === i ? updated : x)))
          }
          onRemove={() => setDecors((curr) => curr.filter((_, j) => j !== i))}
        />
      ))}
      <button
        type="button"
        onClick={() => setDecors((curr) => [...curr, { name: '', image_url: '' }])}
        className="text-xs text-[var(--color-brand-primary)] hover:underline inline-flex items-center gap-1"
      >
        <Plus className="h-3 w-3" /> Decor toevoegen
      </button>
    </div>
  );
}

function DecorRow({
  decor,
  onChange,
  onRemove,
}: {
  decor: Decor;
  onChange: (d: Decor) => void;
  onRemove: () => void;
}) {
  const [pending, setPending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setPending(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const result = await uploadBrandImageAction(fd);
      if (result.url) onChange({ ...decor, image_url: result.url });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex gap-2 items-start rounded-lg border border-black/10 p-3">
      <div
        onClick={() => fileRef.current?.click()}
        className="relative h-16 w-16 shrink-0 rounded-lg bg-black/5 flex items-center justify-center cursor-pointer overflow-hidden"
      >
        {decor.image_url ? (
          <Image src={decor.image_url} alt="" fill sizes="64px" className="object-cover" />
        ) : (
          <Upload className="h-5 w-5 text-black/30" />
        )}
      </div>
      <input
        type="file"
        ref={fileRef}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      <input
        type="text"
        placeholder="Decor-naam (bijv. Eiken Naturel)"
        value={decor.name}
        onChange={(e) => onChange({ ...decor, name: e.target.value })}
        className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm"
      />
      <button
        type="button"
        onClick={onRemove}
        className="text-black/40 hover:text-red-700"
        disabled={pending}
        aria-label="Verwijder decor"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
