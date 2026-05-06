import Image from 'next/image';
import type { Decor } from '@/lib/db/products';

export function DecorGrid({ decors }: { decors: Decor[] }) {
  if (decors.length === 0) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {decors.map((d) => (
        <div key={d.name} className="text-center">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-black/5">
            <Image
              src={d.image_url}
              alt={d.name}
              fill
              sizes="(max-width: 768px) 50vw, 200px"
              className="object-cover"
            />
          </div>
          <p className="mt-2 text-xs">{d.name}</p>
        </div>
      ))}
    </div>
  );
}
