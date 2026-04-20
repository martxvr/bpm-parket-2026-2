import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'announcement_dismissed';
const INTERVAL_MS = 8000;

const MESSAGES = [
  <>
    🎉 Tijdelijke actie: Gratis inmeting bij elke vloeropdracht boven €500 —{' '}
    <a href="tel:0401234567" className="font-bold text-brand-red hover:underline">
      Bel nu: 040 123 4567
    </a>
  </>,
  <>
    ⭐ Meer dan 49 vijfsterren reviews — bekijk wat onze klanten zeggen over BPM Parket
  </>,
];

const AnnouncementBar: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible || MESSAGES.length < 2) return;
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex(i => (i + 1) % MESSAGES.length);
        setFading(false);
      }, 400);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [visible]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="bg-black text-white text-sm py-2.5 px-4 flex items-center justify-center gap-3 relative overflow-hidden">
      <span
        className="transition-opacity duration-400"
        style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.4s ease' }}
      >
        {MESSAGES[index]}
      </span>
      <button
        onClick={dismiss}
        aria-label="Sluiten"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default AnnouncementBar;
