import ProjectDetailClient from './ProjectDetailClient'
import { getProject } from '@/lib/site-data'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: { id: string } }) {
    try {
        const project = await getProject(params.id)

        if (!project) {
            notFound()
        }

        return <ProjectDetailClient project={project} />
    } catch (e) {
        notFound()
    }
}
