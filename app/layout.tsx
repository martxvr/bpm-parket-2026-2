import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { StructuredData } from '@/components/marketing/StructuredData';
import { ConsentInit } from '@/components/layout/ConsentInit';
import { AnalyticsLoader } from '@/components/analytics/AnalyticsLoader';
import { localBusinessSchema } from '@/lib/seo';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'BPM Parket | Parket, PVC & Houten Vloeren', template: '%s | BPM Parket' },
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
    <html lang="nl" className={outfit.variable}>
      <ConsentInit />
      <body className="antialiased">
        <StructuredData schema={localBusinessSchema()} />
        <AnalyticsLoader />
        {children}
      </body>
    </html>
  );
}
