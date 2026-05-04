'use client';

import { useActionState } from 'react';
import { createLeadAction, type CreateLeadState } from '@/actions/leads';

const initialState: CreateLeadState = { status: 'idle' };

type Props = {
  source: string;
  floorType?: string;
  defaultMessage?: string;
};

const FLOOR_TYPES = [
  { value: '', label: 'Kies type' },
  { value: 'pvc', label: 'PVC' },
  { value: 'parket', label: 'Parket' },
  { value: 'multiplanken', label: 'Multiplanken' },
  { value: 'laminaat', label: 'Laminaat' },
  { value: 'traprenovatie', label: 'Traprenovatie' },
  { value: 'schuren', label: 'Schuren / onderhoud' },
  { value: 'anders', label: 'Anders / weet ik nog niet' },
];

export function LeadForm({ source, floorType = '', defaultMessage = '' }: Props) {
  const [state, formAction, pending] = useActionState(createLeadAction, initialState);

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
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute opacity-0 -left-[9999px] h-0 w-0"
        aria-hidden="true"
      />

      <input type="hidden" name="source" value={source} />

      <label className="block">
        <span className="text-sm font-medium">Naam</span>
        <input
          type="text"
          name="name"
          required
          autoComplete="name"
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Telefoon</span>
          <input
            type="tel"
            name="phone"
            required
            autoComplete="tel"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-medium">Type vloer</span>
          <select
            name="floor_type"
            defaultValue={floorType}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
          >
            {FLOOR_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Oppervlak (m²)</span>
          <input
            type="number"
            name="area_size"
            min={0}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Bericht</span>
        <textarea
          name="message"
          rows={3}
          defaultValue={defaultMessage}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
        />
      </label>

      {state.status === 'error' && (
        <p role="alert" className="text-sm text-red-700">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-[var(--color-brand-primary)] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? 'Versturen…' : 'Verstuur aanvraag'}
      </button>
    </form>
  );
}
