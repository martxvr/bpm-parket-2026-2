import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, Plus } from 'lucide-react';
import { BrandForm } from '@/components/admin/BrandForm';
import { BrandMoodGalleryUploader } from '@/components/admin/BrandMoodGalleryUploader';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { getBrandWithInternalsById, getBrandImagesForBrand } from '@/lib/db/brands';
import { getAllProductsForBrandAdmin } from '@/lib/db/products';
import { deleteBrandImageAction } from './../actions';
import { deleteBrandProductAction } from './producten/actions';

type Props = { params: Promise<{ id: string }> };

export default async function EditBrandPage({ params }: Props) {
  const { id } = await params;
  const brand = await getBrandWithInternalsById(id);
  if (!brand) notFound();

  const [images, products] = await Promise.all([
    getBrandImagesForBrand(id),
    getAllProductsForBrandAdmin(id),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <Link
          href="/admin/merken"
          className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Merken
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Bewerk: {brand.name}</h1>
          {brand.is_active && (
            <Link
              href={`/merken/${brand.slug}`}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 text-sm text-black/60 hover:text-black"
            >
              Bekijk live <ExternalLink className="h-4 w-4" />
            </Link>
          )}
        </div>

        <BrandForm brand={brand} />
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">Sfeerbeelden</h2>
        <div className="space-y-4">
          <BrandMoodGalleryUploader brandId={id} />
          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((img) => (
                <div key={img.id} className="relative group">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-black/5">
                    <Image
                      src={img.image_url}
                      alt={img.caption ?? ''}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition rounded-full bg-white/95 p-1 shadow">
                    <DeleteButton
                      action={async () => {
                        'use server';
                        await deleteBrandImageAction(img.id, img.image_url, id);
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
      </section>

      <section>
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Producten</h2>
          <Link
            href={`/admin/merken/${id}/producten/nieuw`}
            className="inline-flex items-center gap-1 text-sm text-[var(--color-brand-primary)] hover:underline"
          >
            <Plus className="h-4 w-4" /> Nieuw product
          </Link>
        </header>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 p-6 text-sm text-black/60">
            Nog geen producten voor dit merk.
          </div>
        ) : (
          <ul className="space-y-2">
            {products.map((p) => (
              <li
                key={p.id}
                className="rounded-xl bg-white p-4 shadow-sm flex items-center justify-between gap-4"
              >
                <Link
                  href={`/admin/merken/${id}/producten/${p.id}`}
                  className="flex-1 min-w-0"
                >
                  <div className="flex items-center gap-3">
                    <p className="font-medium">{p.name}</p>
                    {!p.is_active && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        Inactief
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-black/50 mt-0.5">/{p.slug}</p>
                </Link>
                <DeleteButton
                  action={async () => {
                    'use server';
                    await deleteBrandProductAction(p.id, id);
                  }}
                  confirmMessage={`Product "${p.name}" verwijderen?`}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
