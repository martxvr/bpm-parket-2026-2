import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { BrandProductForm } from '@/components/admin/BrandProductForm';
import { getBrandWithInternalsById } from '@/lib/db/brands';
import { getServices } from '@/lib/db/services';
import type { Product } from '@/lib/db/products';

type Props = { params: Promise<{ id: string; pid: string }> };

export default async function EditBrandProductPage({ params }: Props) {
  const { id, pid } = await params;
  const supabase = await createClient();
  const [brand, services, productResult] = await Promise.all([
    getBrandWithInternalsById(id),
    getServices(),
    supabase.from('products').select('*').eq('id', pid).maybeSingle(),
  ]);
  if (!brand) notFound();
  const product = productResult.data as Product | null;
  if (!product) notFound();

  return (
    <div>
      <Link
        href={`/admin/merken/${id}`}
        className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        {brand.name}
      </Link>
      <h1 className="text-2xl font-semibold mb-6">Bewerk: {product.name}</h1>
      <BrandProductForm brandId={id} services={services} product={product} />
    </div>
  );
}
