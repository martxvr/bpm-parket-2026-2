import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const querySchema = z.object({
  service: z.string().min(1).max(100),
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    service: url.searchParams.get('service'),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: service } = await supabase
    .from('services')
    .select('id')
    .eq('slug', parsed.data.service)
    .maybeSingle();
  if (!service) return NextResponse.json({ brands: [] });

  type ProductRow = {
    id: string;
    slug: string;
    name: string;
    brand_id: string;
    brands: { id: string; slug: string; name: string; is_active: boolean } | null;
  };

  const { data: products } = await supabase
    .from('products')
    .select(
      'id, slug, name, brand_id, brands!inner(id, slug, name, is_active)',
    )
    .eq('service_id', service.id)
    .eq('is_active', true)
    .eq('brands.is_active', true)
    .order('sort_order');

  const brandMap = new Map<
    string,
    {
      id: string;
      slug: string;
      name: string;
      products: Array<{ id: string; slug: string; name: string }>;
    }
  >();
  for (const row of (products ?? []) as unknown as ProductRow[]) {
    if (!row.brands) continue;
    const brand = brandMap.get(row.brand_id) ?? {
      id: row.brands.id,
      slug: row.brands.slug,
      name: row.brands.name,
      products: [],
    };
    brand.products.push({ id: row.id, slug: row.slug, name: row.name });
    brandMap.set(row.brand_id, brand);
  }

  return NextResponse.json({ brands: Array.from(brandMap.values()) });
}
