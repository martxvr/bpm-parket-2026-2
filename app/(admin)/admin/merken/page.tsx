import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/server';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteBrandAction } from './actions';

export const metadata: Metadata = { title: 'Merken' };

type BrandRow = {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  is_active: boolean;
  sort_order: number;
  product_count: number;
};

async function getBrandsList(): Promise<BrandRow[]> {
  const supabase = await createClient();
  const { data: brands } = await supabase
    .from('brands')
    .select('id, slug, name, logo_url, is_active, sort_order')
    .order('sort_order');

  if (!brands) return [];

  // Get product counts per brand
  const ids = brands.map((b) => b.id);
  const { data: products } = await supabase
    .from('products')
    .select('brand_id')
    .in('brand_id', ids);

  const counts = new Map<string, number>();
  for (const p of products ?? []) {
    counts.set(p.brand_id, (counts.get(p.brand_id) ?? 0) + 1);
  }

  return brands.map((b) => ({
    ...b,
    product_count: counts.get(b.id) ?? 0,
  }));
}

export default async function BrandsListPage() {
  const brands = await getBrandsList();

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Merken</h1>
          <p className="text-sm text-black/60 mt-1">
            Beheer de merken en hun product-lijnen.
          </p>
        </div>
        <Button href="/admin/merken/nieuw" size="sm">
          <Plus className="h-4 w-4" /> Nieuw merk
        </Button>
      </header>

      {brands.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-12 text-center text-sm text-black/60">
          Nog geen merken aangemaakt.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((b) => (
            <div key={b.id} className="rounded-2xl bg-white shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {b.logo_url && (
                    <div className="relative h-10 mb-3">
                      <Image src={b.logo_url} alt={b.name} fill sizes="160px" className="object-contain object-left" />
                    </div>
                  )}
                  <h3 className="font-medium">{b.name}</h3>
                  <p className="text-xs text-black/50 mt-0.5">/{b.slug}</p>
                  <p className="text-xs text-black/60 mt-2">
                    {b.product_count} {b.product_count === 1 ? 'product' : 'producten'}
                  </p>
                  {!b.is_active && (
                    <span className="mt-2 inline-block text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      Inactief
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Link
                  href={`/admin/merken/${b.id}`}
                  className="text-xs text-[var(--color-brand-primary)] hover:underline inline-flex items-center gap-1"
                >
                  <Pencil className="h-3 w-3" /> Bewerk
                </Link>
                <DeleteButton
                  action={async () => {
                    'use server';
                    await deleteBrandAction(b.id);
                  }}
                  confirmMessage={`Merk "${b.name}" verwijderen? (Alle producten worden ook verwijderd.)`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
