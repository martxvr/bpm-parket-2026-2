'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Decor } from '@/lib/db/products';

export function DecorGrid({ decors }: { decors: Decor[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + decors.length) % decors.length)),
    [decors.length],
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % decors.length)),
    [decors.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    // Lock body scroll while lightbox is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, prev, next]);

  if (decors.length === 0) return null;

  const active = openIndex === null ? null : decors[openIndex];

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {decors.map((d, i) => (
          <button
            key={d.name}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="text-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] rounded-xl"
            aria-label={`Bekijk ${d.name} groter`}
          >
            <div className="relative aspect-square rounded-xl overflow-hidden bg-black/5 transition-transform group-hover:scale-[1.02]">
              <Image
                src={d.image_url}
                alt={d.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1280px) 25vw, 320px"
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-xs">{d.name}</p>
          </button>
        ))}
      </div>

      {active !== null && openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.name} — afbeelding ${openIndex + 1} van ${decors.length}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
          onClick={close}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white"
            aria-label="Sluiten"
          >
            <X className="h-7 w-7" />
          </button>

          {decors.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-2 sm:left-6 p-3 text-white/80 hover:text-white"
                aria-label="Vorige"
              >
                <ChevronLeft className="h-9 w-9" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-2 sm:right-6 p-3 text-white/80 hover:text-white"
                aria-label="Volgende"
              >
                <ChevronRight className="h-9 w-9" />
              </button>
            </>
          )}

          <div
            className="relative w-[92vw] max-w-[1200px] h-[80vh] sm:h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.image_url}
              alt={active.name}
              fill
              sizes="(max-width: 1280px) 92vw, 1200px"
              className="object-contain"
              priority
            />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white">
            <p className="text-base font-medium">{active.name}</p>
            <p className="text-xs text-white/60 mt-0.5">
              {openIndex + 1} / {decors.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
