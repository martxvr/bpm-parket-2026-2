'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';
import {
  acceptAll,
  rejectAll,
  setConsent,
  getConsent,
  type ConsentCategories,
} from '@/lib/consent';

type Prefs = Omit<ConsentCategories, 'necessary'>;

export function CookieBanner() {
  const [shown, setShown] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    setShown(!getConsent());
    const handleReopen = () => setShown(true);
    window.addEventListener('bpm:open-cookie-banner', handleReopen);
    return () =>
      window.removeEventListener('bpm:open-cookie-banner', handleReopen);
  }, []);

  if (!shown) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 sm:max-w-md z-50 rounded-2xl bg-white shadow-2xl border border-black/10 p-5 text-sm">
      <div className="flex items-center gap-2 mb-2">
        <Cookie className="h-5 w-5 text-[var(--color-brand-primary)]" />
        <h3 className="font-semibold">Cookies op deze site</h3>
      </div>

      <p className="text-black/70 mb-3 text-xs">
        We gebruiken cookies voor essentiële functies en — met je toestemming —
        om de site te verbeteren en advertenties te tonen.{' '}
        <Link href="/cookies" className="underline">
          Meer info
        </Link>
        .
      </p>

      {showDetails && (
        <div className="border-y border-black/5 py-3 my-3 space-y-2 text-xs">
          <label className="flex items-start gap-2 opacity-60 cursor-not-allowed">
            <input type="checkbox" checked disabled readOnly className="mt-0.5" />
            <div>
              <span className="font-medium">Noodzakelijk</span>
              <p className="text-black/60">
                Voor inlog, sessie, CSRF. Altijd actief.
              </p>
            </div>
          </label>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={prefs.functional}
              onChange={(e) =>
                setPrefs({ ...prefs, functional: e.target.checked })
              }
              className="mt-0.5"
            />
            <div>
              <span className="font-medium">Functioneel</span>
              <p className="text-black/60">
                Onthoudt voorkeuren zoals taal of weergave.
              </p>
            </div>
          </label>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={prefs.analytics}
              onChange={(e) =>
                setPrefs({ ...prefs, analytics: e.target.checked })
              }
              className="mt-0.5"
            />
            <div>
              <span className="font-medium">Analytisch</span>
              <p className="text-black/60">
                Anonieme bezoekersstatistieken (Google Analytics).
              </p>
            </div>
          </label>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={prefs.marketing}
              onChange={(e) =>
                setPrefs({ ...prefs, marketing: e.target.checked })
              }
              className="mt-0.5"
            />
            <div>
              <span className="font-medium">Marketing</span>
              <p className="text-black/60">
                Conversiemeting voor Google Ads.
              </p>
            </div>
          </label>
        </div>
      )}

      {showDetails ? (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setConsent(prefs);
              setShown(false);
            }}
            className="flex-1 rounded-lg bg-[var(--color-brand-primary)] text-white px-3 py-2 text-xs font-medium hover:bg-[var(--color-brand-primary-dark)]"
          >
            Voorkeuren opslaan
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => {
                rejectAll();
                setShown(false);
              }}
              className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-xs font-medium hover:bg-black/5"
            >
              Alleen noodzakelijk
            </button>
            <button
              onClick={() => {
                acceptAll();
                setShown(false);
              }}
              className="flex-1 rounded-lg bg-[var(--color-brand-primary)] text-white px-3 py-2 text-xs font-medium hover:bg-[var(--color-brand-primary-dark)]"
            >
              Alles accepteren
            </button>
          </div>
          <button
            onClick={() => setShowDetails(true)}
            className="w-full text-xs text-black/60 hover:text-black underline"
          >
            Voorkeuren aanpassen
          </button>
        </div>
      )}
    </div>
  );
}
