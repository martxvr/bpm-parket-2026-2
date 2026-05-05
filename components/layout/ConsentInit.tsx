import Script from 'next/script';

const INIT = `
window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500
});
try {
  var raw = localStorage.getItem('bpm_consent_v2');
  if (raw) {
    var stored = JSON.parse(raw);
    if (stored && stored.version === 2 && stored.categories) {
      gtag('consent', 'update', {
        analytics_storage: stored.categories.analytics ? 'granted' : 'denied',
        ad_storage: stored.categories.marketing ? 'granted' : 'denied',
        ad_user_data: stored.categories.marketing ? 'granted' : 'denied',
        ad_personalization: stored.categories.marketing ? 'granted' : 'denied',
        functionality_storage: stored.categories.functional ? 'granted' : 'denied',
        personalization_storage: stored.categories.functional ? 'granted' : 'denied'
      });
    }
  }
} catch (e) {}
`;

export function ConsentInit() {
  // INIT is fully static (no user input). Sets Consent Mode v2 default-denied
  // before any analytics tag loads — required by Google's CMP spec.
  return (
    <Script
      id="consent-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: INIT }}
    />
  );
}
