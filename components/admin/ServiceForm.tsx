'use client';

import { useActionState } from 'react';
import {
  updateServiceAction,
  type ServiceState,
} from '@/app/(admin)/admin/diensten/actions';
import { FormField } from '@/components/admin/FormField';
import type { Service } from '@/lib/db/services';

const initialState: ServiceState = { status: 'idle' };

export function ServiceForm({ service }: { service: Service }) {
  const [state, formAction, pending] = useActionState(
    updateServiceAction,
    initialState,
  );
  const errMsg = state.status === 'error' ? state.message : undefined;

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-2xl bg-white p-6 shadow-sm"
    >
      <input type="hidden" name="slug" value={service.slug} />

      <FormField label="Titel" error={errMsg}>
        <input
          type="text"
          name="title"
          defaultValue={service.title}
          required
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField
        label="Meta title (SEO)"
        hint="Verschijnt in Google zoekresultaten"
      >
        <input
          type="text"
          name="meta_title"
          defaultValue={service.meta_title ?? ''}
          maxLength={200}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField
        label="Meta description (SEO)"
        hint="Beschrijving onder de titel in Google"
      >
        <textarea
          name="meta_description"
          defaultValue={service.meta_description ?? ''}
          maxLength={300}
          rows={2}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField
        label="Hero image URL"
        hint="Volledige URL naar afbeelding (later: upload)"
      >
        <input
          type="url"
          name="hero_image"
          defaultValue={service.hero_image ?? ''}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField
        label="Body (markdown)"
        hint="Hoofdtekst van de pagina, in markdown"
      >
        <textarea
          name="body_md"
          defaultValue={service.body_md ?? ''}
          maxLength={20000}
          rows={20}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm font-mono"
        />
      </FormField>

      <FormField label="Volgorde">
        <input
          type="number"
          name="sort_order"
          defaultValue={service.sort_order}
          className="w-32 rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[var(--color-brand-red)] text-white px-5 py-2 text-sm font-medium disabled:opacity-50"
      >
        {pending ? 'Opslaan…' : 'Opslaan'}
      </button>
    </form>
  );
}
