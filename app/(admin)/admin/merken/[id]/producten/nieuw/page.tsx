import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BrandProductForm } from '@/components/admin/BrandProductForm';
import { getBrandWithInternalsById } from '@/lib/db/brands';
import { getServices } from '@/lib/db/services';

type Props = { params: Promise<{ id: string }> };

export default async function NewBrandProductPage({ params }: Props) {
  const { id } = await params;
  const [brand, services] = await Promise.all([
    getBrandWithInternalsById(id),
    getServices(),
  ]);
  if (!brand) notFound();

  return (
    <div>
      <Link
        href={`/admin/merken/${id}`}
        className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        {brand.name}
      </Link>
      <h1 className="text-2xl font-semibold mb-6">Nieuw product voor {brand.name}</h1>
      <BrandProductForm brandId={id} services={services} />
    </div>
  );
}
