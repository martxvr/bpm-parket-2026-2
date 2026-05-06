import type { MetadataRoute } from 'next';
import { getServices } from '@/lib/db/services';
import { getProjects } from '@/lib/db/projects';
import { getActiveBrands } from '@/lib/db/brands';
import { createClient } from '@/lib/supabase/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bpmparket.nl';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects] = await Promise.all([
    getServices().catch(() => []),
    getProjects().catch(() => []),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
      { url: `${SITE_URL}/projecten`, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${SITE_URL}/merken`, changeFrequency: 'weekly', priority: 0.85 },
      { url: `${SITE_URL}/showroom`, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${SITE_URL}/over-ons`, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${SITE_URL}/contact`, changeFrequency: 'yearly', priority: 0.6 },
      { url: `${SITE_URL}/offerte`, changeFrequency: 'yearly', priority: 0.7 },
      { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
      { url: `${SITE_URL}/algemene-voorwaarden`, changeFrequency: 'yearly', priority: 0.3 },
      { url: `${SITE_URL}/cookies`, changeFrequency: 'yearly', priority: 0.3 },
    ] as const
  ).map((r) => ({ ...r, lastModified: now }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${SITE_URL}/${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/projecten/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const brands = await getActiveBrands().catch(() => []);

  const supabase = await createClient();
  const { data: productRows } = await supabase
    .from('products')
    .select('slug, updated_at, brands!inner(slug, is_active)')
    .eq('is_active', true)
    .eq('brands.is_active', true);

  const brandRoutes: MetadataRoute.Sitemap = brands.map((b) => ({
    url: `${SITE_URL}/merken/${b.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  type ProductSitemapRow = {
    slug: string;
    updated_at: string;
    brands: { slug: string; is_active: boolean } | { slug: string; is_active: boolean }[] | null;
  };

  const productRoutes: MetadataRoute.Sitemap = ((productRows ?? []) as ProductSitemapRow[])
    .map((p) => {
      const brand = Array.isArray(p.brands) ? p.brands[0] : p.brands;
      if (!brand) return null;
      return {
        url: `${SITE_URL}/merken/${brand.slug}/${p.slug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes, ...brandRoutes, ...productRoutes];
}
