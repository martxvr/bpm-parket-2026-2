'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'bpm_announcement_dismissed_v1';
const MESSAGES = [
  'Gratis inmeting bij offerte',
  'Bel direct voor advies: 040 123 4567',
  'Showroom in Geldrop, kom langs',
];

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === 'true');
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 5000);
    return () => clearInterval(t);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div className="bg-[var(--color-brand-charcoal)] text-white text-xs">
      <div className="mx-auto max-w-6xl px-6 py-2 flex items-center justify-between">
        <span aria-live="polite">{MESSAGES[index]}</span>
        <button
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, 'true');
            setDismissed(true);
          }}
          aria-label="Sluit aankondiging"
          className="opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
