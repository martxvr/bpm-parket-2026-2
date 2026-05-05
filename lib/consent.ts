const STORAGE_KEY = 'bpm_consent_v2';
const COOKIE_NAME = 'bpm_consent_v2';
const COOKIE_MAX_AGE_DAYS = 395; // ~13 months

export type ConsentCategories = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

export type StoredConsent = {
  version: 2;
  categories: ConsentCategories;
  timestamp: number;
};

const DEFAULT_DENIED: ConsentCategories = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

export function getConsent(): StoredConsent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (parsed.version !== 2) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setConsent(
  categories: Partial<Omit<ConsentCategories, 'necessary'>>,
): void {
  if (typeof window === 'undefined') return;
  const stored: StoredConsent = {
    version: 2,
    categories: { ...DEFAULT_DENIED, ...categories, necessary: true },
    timestamp: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_MAX_AGE_DAYS);
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(stored.categories),
  )};path=/;expires=${expires.toUTCString()};SameSite=Lax`;

  dispatchGtagUpdate(stored.categories);
  window.dispatchEvent(
    new CustomEvent('bpm:consent-changed', { detail: stored.categories }),
  );
}

export function acceptAll(): void {
  setConsent({ functional: true, analytics: true, marketing: true });
}

export function rejectAll(): void {
  setConsent({ functional: false, analytics: false, marketing: false });
}

function dispatchGtagUpdate(c: ConsentCategories): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('consent', 'update', {
    analytics_storage: c.analytics ? 'granted' : 'denied',
    ad_storage: c.marketing ? 'granted' : 'denied',
    ad_user_data: c.marketing ? 'granted' : 'denied',
    ad_personalization: c.marketing ? 'granted' : 'denied',
    functionality_storage: c.functional ? 'granted' : 'denied',
    personalization_storage: c.functional ? 'granted' : 'denied',
    security_storage: 'granted',
  });
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
