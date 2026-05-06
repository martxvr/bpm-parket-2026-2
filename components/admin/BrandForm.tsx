'use client';

import { useActionState } from 'react';
import {
  upsertBrandAction,
  uploadBrandImageAction,
  type BrandState,
} from '@/app/(admin)/admin/merken/actions';
import { FormField } from '@/components/admin/FormField';
import { ImageUploader } from '@/components/admin/ImageUploader';
import type { BrandWithInternals } from '@/lib/db/brands';

const initialState: BrandState = { status: 'idle' };

export function BrandForm({ brand }: { brand?: BrandWithInternals }) {
  const [state, formAction, pending] = useActionState(upsertBrandAction, initialState);
  const errMsg = state.status === 'error' ? state.message : undefined;

  return (
    <form action={formAction} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      {brand && <input type="hidden" name="id" value={brand.id} />}

      <FormField label="Slug" hint="URL: /merken/[slug]" error={errMsg}>
        <input
          type="text"
          name="slug"
          required
          defaultValue={brand?.slug}
          pattern="[a-z0-9-]+"
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm font-mono"
        />
      </FormField>

      <FormField label="Naam">
        <input
          type="text"
          name="name"
          required
          defaultValue={brand?.name}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField label="Logo">
        <ImageUploader
          name="logo_url"
          defaultUrl={brand?.logo_url ?? ''}
          uploadAction={uploadBrandImageAction}
          folder="site"
        />
      </FormField>

      <FormField label="Hero image" hint="Groot sfeerbeeld bovenaan brand-pagina">
        <ImageUploader
          name="hero_image"
          defaultUrl={brand?.hero_image ?? ''}
          uploadAction={uploadBrandImageAction}
          folder="site"
        />
      </FormField>

      <FormField label="Beschrijving" hint="Markdown, 1-2 alinea's voor brand-pagina">
        <textarea
          name="description"
          defaultValue={brand?.description ?? ''}
          rows={5}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField label="Interne notities" hint="ALLEEN ZICHTBAAR HIER — niet op publieke site">
        <textarea
          name="internal_notes"
          defaultValue={brand?.internal_notes ?? ''}
          rows={3}
          className="w-full rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm"
          placeholder="Bijv. inkoopkanaal, contactpersoon bij wholesaler"
        />
      </FormField>

      <FormField label="Officiële website" hint="https://www.brand.nl">
        <input
          type="url"
          name="website_url"
          defaultValue={brand?.website_url ?? ''}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Volgorde">
          <input
            type="number"
            name="sort_order"
            defaultValue={brand?.sort_order ?? 0}
            className="w-32 rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </FormField>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={brand?.is_active ?? true}
            className="rounded"
          />
          Actief (zichtbaar op site)
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[var(--color-brand-primary)] text-white px-5 py-2 text-sm font-medium disabled:opacity-50"
      >
        {pending ? 'Opslaan…' : brand ? 'Brand bijwerken' : 'Brand aanmaken'}
      </button>
    </form>
  );
}
