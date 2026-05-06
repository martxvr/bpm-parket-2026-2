'use client';

import { useActionState } from 'react';
import {
  upsertBrandProductAction,
  uploadProductImageAction,
  type ProductState,
} from '@/app/(admin)/admin/merken/[id]/producten/actions';
import { FormField } from '@/components/admin/FormField';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { SpecsEditor } from '@/components/admin/SpecsEditor';
import { DecorsEditor } from '@/components/admin/DecorsEditor';
import type { Product } from '@/lib/db/products';
import type { Service } from '@/lib/db/services';

const initialState: ProductState = { status: 'idle' };

type Props = {
  brandId: string;
  services: Service[];
  product?: Product;
};

export function BrandProductForm({ brandId, services, product }: Props) {
  const [state, formAction, pending] = useActionState(
    upsertBrandProductAction,
    initialState,
  );
  const errMsg = state.status === 'error' ? state.message : undefined;

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-2xl bg-white p-6 shadow-sm"
    >
      <input type="hidden" name="brand_id" value={brandId} />
      {product && <input type="hidden" name="id" value={product.id} />}

      <FormField label="Slug" hint="URL: /merken/[brand]/[slug]" error={errMsg}>
        <input
          type="text"
          name="slug"
          required
          defaultValue={product?.slug}
          pattern="[a-z0-9-]+"
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm font-mono"
        />
      </FormField>

      <FormField label="Naam">
        <input
          type="text"
          name="name"
          required
          defaultValue={product?.name}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField label="Categorie (dienst)">
        <select
          name="service_id"
          required
          defaultValue={product?.service_id ?? ''}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm bg-white"
        >
          <option value="">Kies categorie</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Beschrijving" hint="Markdown, productverhaal">
        <textarea
          name="description"
          defaultValue={product?.description ?? ''}
          rows={6}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <FormField label="Hoofdfoto">
        <ImageUploader
          name="hero_image"
          defaultUrl={product?.hero_image ?? ''}
          uploadAction={uploadProductImageAction}
          folder="site"
        />
      </FormField>

      <FormField label="Specificaties" hint="Bijv. Dikte → 5 mm">
        <SpecsEditor name="specs" defaultValue={product?.specs ?? {}} />
      </FormField>

      <FormField label="Decors / kleuren" hint="Naam + kleurmonster per decor">
        <DecorsEditor name="decors" defaultValue={product?.decors ?? []} />
      </FormField>

      <FormField label="Spec sheet URL (PDF)" hint="Optioneel, link naar productblad">
        <input
          type="url"
          name="spec_sheet_url"
          defaultValue={product?.spec_sheet_url ?? ''}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Volgorde">
          <input
            type="number"
            name="sort_order"
            defaultValue={product?.sort_order ?? 0}
            className="w-32 rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </FormField>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={product?.is_active ?? true}
            className="rounded"
          />
          Actief
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[var(--color-brand-primary)] text-white px-5 py-2 text-sm font-medium disabled:opacity-50"
      >
        {pending ? 'Opslaan…' : product ? 'Product bijwerken' : 'Product aanmaken'}
      </button>
    </form>
  );
}
