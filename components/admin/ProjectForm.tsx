'use client';

import { useActionState } from 'react';
import {
  upsertProjectAction,
  uploadProjectImageAction,
  type ProjectState,
} from '@/app/(admin)/admin/projecten/actions';
import { FormField } from '@/components/admin/FormField';
import { ImageUploader } from '@/components/admin/ImageUploader';
import type { Project } from '@/lib/db/projects';

const initialState: ProjectState = { status: 'idle' };

export function ProjectForm({ project }: { project?: Project }) {
  const [state, formAction, pending] = useActionState(
    upsertProjectAction,
    initialState,
  );
  const errMsg = state.status === 'error' ? state.message : undefined;

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-2xl bg-white p-6 shadow-sm"
    >
      {project && <input type="hidden" name="id" value={project.id} />}

      <FormField
        label="Slug"
        hint="URL-deel: kleine letters, cijfers, streepjes"
        error={errMsg}
      >
        <input
          type="text"
          name="slug"
          defaultValue={project?.slug}
          required
          pattern="[a-z0-9-]+"
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm font-mono"
        />
      </FormField>

      <FormField label="Titel">
        <input
          type="text"
          name="title"
          defaultValue={project?.title}
          required
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField
        label="Korte beschrijving"
        hint="1-2 zinnen voor de tegel op listing-pagina"
      >
        <textarea
          name="description"
          defaultValue={project?.description ?? ''}
          maxLength={500}
          rows={2}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField
        label="Lange beschrijving"
        hint="Volledig verhaal voor de detail-pagina"
      >
        <textarea
          name="long_description"
          defaultValue={project?.long_description ?? ''}
          maxLength={5000}
          rows={6}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField label="Hoofdfoto">
        <ImageUploader
          name="image_url"
          defaultUrl={project?.image_url ?? ''}
          uploadAction={uploadProjectImageAction}
          folder="projects"
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Oppervlak (m²)">
          <input
            type="number"
            name="area_size"
            defaultValue={project?.area_size ?? ''}
            min={0}
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </FormField>
        <FormField label="Locatie">
          <input
            type="text"
            name="location"
            defaultValue={project?.location ?? ''}
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </FormField>
        <FormField label="Opgeleverd">
          <input
            type="date"
            name="completed_date"
            defaultValue={project?.completed_date ?? ''}
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </FormField>
      </div>

      <FormField label="Type vloer">
        <input
          type="text"
          name="floor_type"
          defaultValue={project?.floor_type ?? ''}
          placeholder="Bijv. PVC, Eiken visgraat, Multiplanken"
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={project?.is_featured ?? false}
            className="rounded"
          />
          Featured op homepage
        </label>
        <FormField label="Volgorde">
          <input
            type="number"
            name="sort_order"
            defaultValue={project?.sort_order ?? 0}
            className="w-32 rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </FormField>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[var(--color-brand-red)] text-white px-5 py-2 text-sm font-medium disabled:opacity-50"
      >
        {pending ? 'Opslaan…' : project ? 'Project bijwerken' : 'Project aanmaken'}
      </button>
    </form>
  );
}
