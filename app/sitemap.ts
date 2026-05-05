import type { MetadataRoute } from 'next';
import { getServices } from '@/lib/db/services';
import { getProjects } from '@/lib/db/projects';

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

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes];
}
