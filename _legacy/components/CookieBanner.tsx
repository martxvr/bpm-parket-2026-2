// components/CookieBanner.tsx
import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'cookie_consent';

const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'all');
    setVisible(false);
  };

  const necessary = () => {
    localStorage.setItem(STORAGE_KEY, 'necessary');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white border-t border-gray-200 shadow-2xl px-4 py-5 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-gray-600 max-w-2xl">
          Wij gebruiken cookies om uw ervaring te verbeteren en onze website te analyseren.{' '}
          <a href="#policy-privacy" className="underline hover:text-black transition-colors">
            Lees ons privacybeleid
          </a>
          .
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={necessary}
            className="px-5 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            Alleen noodzakelijk
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            Accepteren
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
