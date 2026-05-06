import 'server-only';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export type ProductSpec = string;

export type Decor = {
  name: string;
  image_url: string;
};

export type Product = {
  id: string;
  brand_id: string;
  service_id: string;
  slug: string;
  name: string;
  description: string | null;
  hero_image: string | null;
  gallery_image_urls: string[];
  specs: Record<string, ProductSpec>;
  decors: Decor[];
  spec_sheet_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export const getProductsForBrand = cache(
  async (brandId: string): Promise<Product[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('brand_id', brandId)
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    return data ?? [];
  },
);

export const getProductsForBrandByServiceSlug = cache(
  async (brandId: string, serviceSlug: string): Promise<Product[]> => {
    const supabase = await createClient();
    const { data: service } = await supabase
      .from('services')
      .select('id')
      .eq('slug', serviceSlug)
      .maybeSingle();
    if (!service) return [];
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('brand_id', brandId)
      .eq('service_id', service.id)
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    return data ?? [];
  },
);

export const getProductBySlugs = cache(
  async (brandSlug: string, productSlug: string): Promise<Product | null> => {
    const supabase = await createClient();
    const { data: brand } = await supabase
      .from('brands')
      .select('id')
      .eq('slug', brandSlug)
      .eq('is_active', true)
      .maybeSingle();
    if (!brand) return null;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('brand_id', brand.id)
      .eq('slug', productSlug)
      .eq('is_active', true)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
);

export async function getAllProductsForBrandAdmin(
  brandId: string,
): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('brand_id', brandId)
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
}
