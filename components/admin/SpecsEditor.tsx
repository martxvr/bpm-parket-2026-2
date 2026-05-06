'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';

type Props = {
  name: string;
  defaultValue?: Record<string, string>;
};

export function SpecsEditor({ name, defaultValue = {} }: Props) {
  const [rows, setRows] = useState<Array<[string, string]>>(
    Object.entries(defaultValue),
  );

  const update = (i: number, key: 'k' | 'v', val: string) => {
    setRows((r) => {
      const copy = [...r];
      const [k, v] = copy[i];
      copy[i] = key === 'k' ? [val, v] : [k, val];
      return copy;
    });
  };

  const json = JSON.stringify(
    Object.fromEntries(rows.filter(([k]) => k.trim().length > 0)),
  );

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={json} />
      {rows.map((row, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Naam (bijv. Dikte)"
            value={row[0]}
            onChange={(e) => update(i, 'k', e.target.value)}
            className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Waarde (bijv. 5 mm)"
            value={row[1]}
            onChange={(e) => update(i, 'v', e.target.value)}
            className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => setRows((r) => r.filter((_, j) => j !== i))}
            className="text-black/40 hover:text-red-700"
            aria-label="Verwijder spec"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setRows((r) => [...r, ['', '']])}
        className="text-xs text-[var(--color-brand-primary)] hover:underline inline-flex items-center gap-1"
      >
        <Plus className="h-3 w-3" /> Spec toevoegen
      </button>
    </div>
  );
}
