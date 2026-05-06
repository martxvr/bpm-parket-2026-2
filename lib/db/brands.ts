import 'server-only';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export type Brand = {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  website_url: string | null;
  hero_image: string | null;
  sort_order: number;
  is_active: boolean;
};

export type BrandWithInternals = Brand & {
  internal_notes: string | null;
};

export type BrandImage = {
  id: string;
  brand_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
};

const PUBLIC_FIELDS = 'id,slug,name,logo_url,description,website_url,hero_image,sort_order,is_active';

export const getActiveBrands = cache(async (): Promise<Brand[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('brands')
    .select(PUBLIC_FIELDS)
    .eq('is_active', true)
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
});

export const getBrandBySlug = cache(async (slug: string): Promise<Brand | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('brands')
    .select(PUBLIC_FIELDS)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  if (error) throw error;
  return data;
});

export const getBrandImagesForBrand = cache(
  async (brandId: string): Promise<BrandImage[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('brand_images')
      .select('*')
      .eq('brand_id', brandId)
      .order('sort_order');
    if (error) throw error;
    return data ?? [];
  },
);

export const getBrandsByService = cache(
  async (serviceSlug: string): Promise<Brand[]> => {
    const supabase = await createClient();
    const { data: service } = await supabase
      .from('services')
      .select('id')
      .eq('slug', serviceSlug)
      .maybeSingle();
    if (!service) return [];

    const { data: products } = await supabase
      .from('products')
      .select('brand_id')
      .eq('service_id', service.id)
      .eq('is_active', true);
    const brandIds = [...new Set((products ?? []).map((p) => p.brand_id))];
    if (brandIds.length === 0) return [];

    const { data: brands, error } = await supabase
      .from('brands')
      .select(PUBLIC_FIELDS)
      .in('id', brandIds)
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    return brands ?? [];
  },
);

export async function getBrandWithInternalsById(
  id: string,
): Promise<BrandWithInternals | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export const getPeerBrandsByServiceId = cache(
  async (excludeBrandId: string, serviceId: string): Promise<Brand[]> => {
    const supabase = await createClient();
    const { data: products } = await supabase
      .from('products')
      .select('brand_id')
      .eq('service_id', serviceId)
      .eq('is_active', true);
    const brandIds = [
      ...new Set((products ?? []).map((p) => p.brand_id)),
    ].filter((id) => id !== excludeBrandId);
    if (brandIds.length === 0) return [];

    const { data, error } = await supabase
      .from('brands')
      .select(PUBLIC_FIELDS)
      .in('id', brandIds)
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    return data ?? [];
  },
);
