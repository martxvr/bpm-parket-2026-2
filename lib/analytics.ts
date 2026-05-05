'use client';

type ConversionEvent =
  | { name: 'lead_submit'; source: string }
  | { name: 'appointment_booked'; source: 'chatbot' | 'website' }
  | { name: 'phone_click' }
  | { name: 'whatsapp_click' };

/**
 * Fires a Google Ads conversion + GA4 event. No-op if gtag isn't loaded.
 * Consent Mode v2 (default-denied state) gates actual data collection
 * until the user grants the relevant categories.
 */
export function trackConversion(event: ConversionEvent): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }
  const { name, ...params } = event;
  window.gtag('event', name, params);
}
