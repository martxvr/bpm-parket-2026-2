'use client';

export function CookiePrefsButton() {
  return (
    <button
      onClick={() =>
        window.dispatchEvent(new Event('bpm:open-cookie-banner'))
      }
      className="hover:text-gray-300"
    >
      Cookie-voorkeuren
    </button>
  );
}
