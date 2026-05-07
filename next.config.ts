import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';

// React + Turbopack reconstruct error-overlay callstacks via runtime code
// evaluation in dev only. Production never needs the relaxed directive.
const scriptSrcDev = "'unsafe-eval'";
const scriptSrcExtras = isDev ? ` ${scriptSrcDev}` : '';

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${scriptSrcExtras} https://www.googletagmanager.com https://www.google-analytics.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://www.google-analytics.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.supabase.co https://api.anthropic.com https://www.google-analytics.com https://*.upstash.io",
  "frame-ancestors 'none'",
  "frame-src https://maps.google.com https://www.google.com",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  { key: 'Content-Security-Policy', value: csp },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
