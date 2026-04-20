import { Metadata } from 'next'
import ProjectsClient from './ProjectsClient'
import { getProjects } from '@/lib/site-data'

export const metadata: Metadata = {
    title: 'Projecten & Portfolio',
    description: 'Bekijk onze gerealiseerde projecten: PVC-vloeren, traprenovatie, vloerbedekking, raamdecoratie en gordijnen in Doetinchem en de Achterhoek.',
    alternates: { canonical: '/projecten' },
}

export default async function Page() {
    const projects = await getProjects(100)
    return <ProjectsClient initialProjects={projects} />
}
