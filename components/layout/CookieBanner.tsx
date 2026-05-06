'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  acceptAll,
  rejectAll,
  setConsent,
  getConsent,
  type ConsentCategories,
} from '@/lib/consent';

type Prefs = Omit<ConsentCategories, 'necessary'>;

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    setVisible(!getConsent());
    const handleReopen = () => setVisible(true);
    window.addEventListener('bpm:open-cookie-banner', handleReopen);
    return () =>
      window.removeEventListener('bpm:open-cookie-banner', handleReopen);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white border-t border-gray-200 shadow-2xl px-4 py-5 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-gray-600 max-w-2xl">
            Wij gebruiken cookies om uw ervaring te verbeteren en onze website te analyseren.{' '}
            <Link href="/privacy" className="underline hover:text-black transition-colors">
              Lees ons privacybeleid
            </Link>
            .
          </p>
          <div className="flex gap-3 flex-shrink-0">
            {showDetails ? (
              <button
                onClick={() => {
                  setConsent(prefs);
                  setVisible(false);
                }}
                className="px-5 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Voorkeuren opslaan
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    rejectAll();
                    setVisible(false);
                  }}
                  className="px-5 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  Alleen noodzakelijk
                </button>
                <button
                  onClick={() => {
                    acceptAll();
                    setVisible(false);
                  }}
                  className="px-5 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
                >
                  Accepteren
                </button>
              </>
            )}
          </div>
        </div>

        {showDetails && (
          <div className="border-t border-gray-200 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <label className="flex items-start gap-2 opacity-60 cursor-not-allowed">
              <input type="checkbox" checked disabled readOnly className="mt-0.5" />
              <div>
                <span className="font-medium">Noodzakelijk</span>
                <p className="text-gray-500">Voor inlog, sessie, CSRF. Altijd actief.</p>
              </div>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs.functional}
                onChange={(e) => setPrefs({ ...prefs, functional: e.target.checked })}
                className="mt-0.5"
              />
              <div>
                <span className="font-medium">Functioneel</span>
                <p className="text-gray-500">Onthoudt voorkeuren zoals taal of weergave.</p>
              </div>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs.analytics}
                onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
                className="mt-0.5"
              />
              <div>
                <span className="font-medium">Analytisch</span>
                <p className="text-gray-500">Anonieme bezoekersstatistieken (Google Analytics).</p>
              </div>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs.marketing}
                onChange={(e) => setPrefs({ ...prefs, marketing: e.target.checked })}
                className="mt-0.5"
              />
              <div>
                <span className="font-medium">Marketing</span>
                <p className="text-gray-500">Conversiemeting voor Google Ads.</p>
              </div>
            </label>
          </div>
        )}

        {!showDetails && (
          <button
            onClick={() => setShowDetails(true)}
            className="self-start text-xs text-gray-500 hover:text-black underline"
          >
            Voorkeuren aanpassen
          </button>
        )}
      </div>
    </div>
  );
}
