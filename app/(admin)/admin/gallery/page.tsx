import type { Metadata } from 'next';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { GalleryUploader } from '@/components/admin/GalleryUploader';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteGalleryItemAction } from './actions';

export const metadata: Metadata = { title: 'Gallery' };

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from('gallery')
    .select('*')
    .order('sort_order')
    .order('created_at', { ascending: false });
  const list = items ?? [];

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Gallery</h1>
        <p className="text-sm text-black/60 mt-1">
          Foto&apos;s die op de homepage worden getoond.
        </p>
      </header>

      <GalleryUploader />

      <h2 className="font-semibold mt-10 mb-4">
        Bestaande foto&apos;s ({list.length})
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {list.map((g) => (
          <div key={g.id} className="relative group">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-black/5">
              <Image
                src={g.image_url}
                alt={g.caption ?? ''}
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition rounded-full bg-white/95 p-1 shadow">
              <DeleteButton
                action={async () => {
                  'use server';
                  await deleteGalleryItemAction(g.id, g.image_url);
                }}
                confirmMessage="Foto verwijderen?"
              />
            </div>
            {g.caption && (
              <p className="mt-1 text-xs text-black/50 truncate">{g.caption}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
