import { MetadataRoute } from 'next'
import { getProjects, getDynamicPolicies } from '@/lib/site-data'
import { categories } from '@/data/brands'

const BASE_URL = 'https://bpmparket.nl'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [projects, policies] = await Promise.all([
        getProjects(100),
        getDynamicPolicies()
    ])

    const staticPages: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
        { url: `${BASE_URL}/over-ons`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/projecten`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/offerte`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${BASE_URL}/showroom`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ]

    const categoryPages: MetadataRoute.Sitemap = categories.map(cat => ({
        url: `${BASE_URL}/producten/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    const brandPages: MetadataRoute.Sitemap = categories.flatMap(cat =>
        cat.brands.map(brand => ({
            url: `${BASE_URL}/producten/${cat.slug}/${brand.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }))
    )

    const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
        url: `${BASE_URL}/projecten/${project.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }))

    const policyPages: MetadataRoute.Sitemap = policies.map((policy) => ({
        url: `${BASE_URL}/beleid/${policy.id}`,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.4,
    }))

    return [...staticPages, ...categoryPages, ...brandPages, ...projectPages, ...policyPages]
}
