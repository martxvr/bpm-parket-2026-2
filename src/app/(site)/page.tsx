import HomePageClient from './HomePageClient'
import { getProjects, getTestimonials } from '@/lib/site-data'

export default async function Page() {
    // Fetch testimonials and projects using Supabase
    const [testimonials, initialProjects] = await Promise.all([
        getTestimonials(10),
        getProjects(3)
    ])

    return <HomePageClient initialProjects={initialProjects} testimonials={testimonials} />
}
