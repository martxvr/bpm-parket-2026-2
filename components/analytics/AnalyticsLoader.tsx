'use client';

import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID;

export function AnalyticsLoader() {
  if (!GA_ID && !GADS_ID) return null;
  const primary = GA_ID ?? GADS_ID;

  // Inline init is static (interpolates env vars, no user input). Consent
  // Mode v2 (default-denied state set in ConsentInit) gates actual data
  // collection until consent is granted.
  const initHtml = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${GA_ID ? `gtag('config', '${GA_ID}', { send_page_view: true });` : ''}
${GADS_ID ? `gtag('config', '${GADS_ID}');` : ''}
`;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${primary}`}
        strategy="afterInteractive"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: initHtml }}
      />
    </>
  );
}
