import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getProjects } from '@/lib/db/projects';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteProjectAction } from './actions';

export const metadata: Metadata = { title: 'Projecten' };

export default async function ProjectsListPage() {
  const projects = await getProjects();

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Projecten</h1>
          <p className="text-sm text-black/60 mt-1">
            Portfolio voor de publieke site.
          </p>
        </div>
        <Button href="/admin/projecten/nieuw" size="sm">
          <Plus className="h-4 w-4" /> Nieuw project
        </Button>
      </header>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 p-12 text-center text-sm text-black/60">
          Nog geen projecten.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl bg-white shadow-sm overflow-hidden"
            >
              {p.image_url && (
                <div className="relative aspect-[4/3]">
                  <Image
                    src={p.image_url}
                    alt={p.title}
                    fill
                    sizes="33vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-medium">{p.title}</h3>
                <p className="text-xs text-black/50 mt-0.5">/{p.slug}</p>
                <div className="mt-3 flex items-center justify-between">
                  <Link
                    href={`/admin/projecten/${p.id}`}
                    className="text-xs text-[var(--color-brand-primary)] hover:underline inline-flex items-center gap-1"
                  >
                    <Pencil className="h-3 w-3" /> Bewerk
                  </Link>
                  <DeleteButton
                    action={async () => {
                      'use server';
                      await deleteProjectAction(p.id);
                    }}
                    confirmMessage={`Project "${p.title}" verwijderen?`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
