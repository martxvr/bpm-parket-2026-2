import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'announcement_dismissed';

const AnnouncementBar: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="bg-black text-white text-sm py-2.5 px-4 flex items-center justify-center gap-3 relative">
      <span>
        🎉 Tijdelijke actie: Gratis inmeting bij elke vloeropdracht boven €500 —{' '}
        <a href="tel:0401234567" className="font-bold text-brand-red hover:underline">
          Bel nu: 040 123 4567
        </a>
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
