import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProjectForm } from '@/components/admin/ProjectForm';

export default function NewProjectPage() {
  return (
    <div>
      <Link
        href="/admin/projecten"
        className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Projecten
      </Link>
      <h1 className="text-2xl font-semibold mb-6">Nieuw project</h1>
      <ProjectForm />
    </div>
  );
}
