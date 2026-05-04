'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'bpm_cookie_consent_v1';

export function CookieBanner() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    setShown(!localStorage.getItem(STORAGE_KEY));
  }, []);

  if (!shown) return null;

  const dismiss = (consent: 'all' | 'necessary') => {
    localStorage.setItem(STORAGE_KEY, consent);
    setShown(false);
  };

  return (
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 sm:max-w-sm z-50 rounded-2xl bg-white shadow-2xl border border-black/10 p-5 text-sm">
      <h3 className="font-semibold mb-2">Cookies op deze site</h3>
      <p className="text-black/70 mb-3 text-xs">
        We gebruiken cookies voor essentiële functies en — met je toestemming — om
        de site te verbeteren en advertenties te tonen.{' '}
        <Link href="/cookies" className="underline">Meer info</Link>.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => dismiss('necessary')}
          className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-xs font-medium hover:bg-black/5"
        >
          Alleen noodzakelijk
        </button>
        <button
          onClick={() => dismiss('all')}
          className="flex-1 rounded-lg bg-[var(--color-brand-primary)] text-white px-3 py-2 text-xs font-medium hover:bg-[var(--color-brand-primary-dark)]"
        >
          Alles accepteren
        </button>
      </div>
    </div>
  );
}
