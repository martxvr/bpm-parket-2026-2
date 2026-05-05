import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { StructuredData } from '@/components/marketing/StructuredData';
import { ConsentInit } from '@/components/layout/ConsentInit';
import { AnalyticsLoader } from '@/components/analytics/AnalyticsLoader';
import { localBusinessSchema } from '@/lib/seo';
import './globals.css';

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans-loaded',
  display: 'swap',
});

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-display-loaded',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'BPM Parket', template: '%s | BPM Parket' },
  description:
    'Specialist in traditioneel parket, PVC vloeren en traprenovatie in Geldrop.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${sans.variable} ${display.variable}`}>
      <ConsentInit />
      <body className="antialiased">
        <StructuredData schema={localBusinessSchema()} />
        <AnalyticsLoader />
        {children}
      </body>
    </html>
  );
}
