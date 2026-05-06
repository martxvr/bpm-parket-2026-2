import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { BrandForm } from '@/components/admin/BrandForm';
import { BrandMoodGalleryUploader } from '@/components/admin/BrandMoodGalleryUploader';
import { getBrandWithInternalsById, getBrandImagesForBrand } from '@/lib/db/brands';
import { getAllProductsForBrandAdmin } from '@/lib/db/products';

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
        <BrandMoodGalleryUploader brandId={id} images={images} />
      </section>

      {/* Producten — nested CRUD wordt toegevoegd in Task 10 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Producten</h2>
        <div className="rounded-2xl border border-dashed border-black/10 p-6 text-sm text-black/60">
          Product-lijnen beheer volgt (Task 10). {products.length} producten reeds in database.
        </div>
      </section>
    </div>
  );
}
