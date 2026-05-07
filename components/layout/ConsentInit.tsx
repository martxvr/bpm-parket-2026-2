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

// Sets Consent Mode v2 default-denied before any analytics tag loads — required
// by Google's CMP spec. Rendered as a plain inline <script> inside <head> so
// it executes synchronously before <body>; next/script was being placed
// outside the document tree which broke hydration. INIT is a file-local
// constant so this is not an XSS vector.
export function ConsentInit() {
  return (
    <script
      id="consent-init"
      dangerouslySetInnerHTML={{ __html: INIT }}
    />
  );
}
