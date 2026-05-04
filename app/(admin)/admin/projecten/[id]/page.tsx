import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ProjectForm } from '@/components/admin/ProjectForm';

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (!project) notFound();

  return (
    <div>
      <Link
        href="/admin/projecten"
        className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Projecten
      </Link>
      <h1 className="text-2xl font-semibold mb-6">Bewerk: {project.title}</h1>
      <ProjectForm project={project} />
    </div>
  );
}
