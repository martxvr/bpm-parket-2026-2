'use client';

import { useActionState, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createLeadAction, type CreateLeadState } from '@/actions/leads';
import { trackConversion } from '@/lib/analytics';

const initialState: CreateLeadState = { status: 'idle' };

const FLOOR_TYPES = [
  { value: '', label: 'Kies type', service_slug: '' },
  { value: 'pvc', label: 'PVC', service_slug: 'pvc-vloeren' },
  { value: 'parket', label: 'Parket', service_slug: 'traditioneel-parket' },
  { value: 'multiplanken', label: 'Multiplanken', service_slug: 'multiplanken' },
  { value: 'laminaat', label: 'Laminaat', service_slug: 'laminaat' },
  { value: 'traprenovatie', label: 'Traprenovatie', service_slug: 'traprenovatie' },
  { value: 'schuren', label: 'Schuren / onderhoud', service_slug: 'schuren-onderhoud' },
  { value: 'anders', label: 'Anders / weet ik nog niet', service_slug: '' },
];

type BrandOpt = {
  id: string;
  slug: string;
  name: string;
  products: Array<{ id: string; slug: string; name: string }>;
};

type Props = {
  source: string;
  floorType?: string;
  defaultMessage?: string;
};

export function LeadForm({ source, floorType = '', defaultMessage = '' }: Props) {
  const [state, formAction, pending] = useActionState(createLeadAction, initialState);
  const searchParams = useSearchParams();

  const [selectedFloor, setSelectedFloor] = useState(floorType);
  const [brands, setBrands] = useState<BrandOpt[]>([]);
  const [brandSlug, setBrandSlug] = useState(searchParams.get('brand') ?? '');
  const [productSlug, setProductSlug] = useState(searchParams.get('product') ?? '');

  const floorEntry = FLOOR_TYPES.find((f) => f.value === selectedFloor);
  const serviceSlug = floorEntry?.service_slug ?? '';

  useEffect(() => {
    if (!serviceSlug) {
      setBrands([]);
      return;
    }
    fetch(`/api/brands/by-service?service=${encodeURIComponent(serviceSlug)}`)
      .then((r) => r.json())
      .then((data: { brands?: BrandOpt[] }) => setBrands(data.brands ?? []))
      .catch(() => setBrands([]));
  }, [serviceSlug]);

  // Reset brand/product when floor changes (unless URL-prefilled and the brand is in the list)
  useEffect(() => {
    const urlBrand = searchParams.get('brand');
    if (urlBrand && brands.some((b) => b.slug === urlBrand)) return;
    setBrandSlug('');
    setProductSlug('');
  }, [selectedFloor, brands, searchParams]);

  const selectedBrand = brands.find((b) => b.slug === brandSlug);

  useEffect(() => {
    if (state.status === 'success') {
      trackConversion({
        name: 'lead_submit',
        source,
        brand: brandSlug || undefined,
        product: productSlug || undefined,
      });
    }
  }, [state.status, source, brandSlug, productSlug]);

  if (state.status === 'success') {
    return (
      <div className="rounded-xl bg-green-50 border border-green-200 p-6 text-sm text-green-900">
        <p className="font-medium">Bedankt voor je aanvraag!</p>
        <p className="mt-1">We nemen binnen 24 uur contact op. Spoed? Bel direct.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="text" name="website" tabIndex={-1} autoComplete="off"
        className="absolute opacity-0 -left-[9999px] h-0 w-0" aria-hidden="true" />
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="brand_id" value={selectedBrand?.id ?? ''} />
      <input
        type="hidden"
        name="product_id"
        value={selectedBrand?.products.find((p) => p.slug === productSlug)?.id ?? ''}
      />

      <label className="block">
        <span className="text-sm font-medium">Naam</span>
        <input type="text" name="name" required autoComplete="name"
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)]" />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input type="email" name="email" required autoComplete="email"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)]" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Telefoon</span>
          <input type="tel" name="phone" required autoComplete="tel"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)]" />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Type vloer</span>
        <select
          name="floor_type"
          value={selectedFloor}
          onChange={(e) => setSelectedFloor(e.target.value)}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm bg-white"
        >
          {FLOOR_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </label>

      {brands.length > 0 && (
        <label className="block">
          <span className="text-sm font-medium">Merkvoorkeur (optioneel)</span>
          <select
            value={brandSlug}
            onChange={(e) => {
              setBrandSlug(e.target.value);
              setProductSlug('');
            }}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm bg-white"
          >
            <option value="">Weet ik nog niet</option>
            {brands.map((b) => (
              <option key={b.slug} value={b.slug}>{b.name}</option>
            ))}
          </select>
        </label>
      )}

      {selectedBrand && selectedBrand.products.length > 0 && (
        <label className="block">
          <span className="text-sm font-medium">Product-lijn (optioneel)</span>
          <select
            value={productSlug}
            onChange={(e) => setProductSlug(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm bg-white"
          >
            <option value="">Weet ik nog niet</option>
            {selectedBrand.products.map((p) => (
              <option key={p.slug} value={p.slug}>{p.name}</option>
            ))}
          </select>
        </label>
      )}

      <label className="block">
        <span className="text-sm font-medium">Oppervlak (m²)</span>
        <input type="number" name="area_size" min={0}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)]" />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Bericht</span>
        <textarea name="message" rows={3} defaultValue={defaultMessage}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)]" />
      </label>

      {state.status === 'error' && (
        <p role="alert" className="text-sm text-red-700">{state.message}</p>
      )}

      <button type="submit" disabled={pending}
        className="w-full rounded-lg bg-[var(--color-brand-red)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50">
        {pending ? 'Versturen…' : 'Verstuur aanvraag'}
      </button>
    </form>
  );
}
