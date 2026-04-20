import { Roboto } from 'next/font/google'
import RootLayoutContent from './RootLayoutContent'
import './globals.css'
import { getBedrijfsgegevens, getPromoPopup, getDynamicPolicies, getChatbotSettings, getAnnouncementBar, getSitePassword } from '@/lib/site-data'
import { Metadata } from 'next'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto',
})

const BASE_URL = 'https://bpmparket.nl'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'BPM Parket | Traditioneel Parket sinds 1992 — Geldrop',
    template: '%s | BPM Parket',
  },
  description: 'Uw specialist in parket, PVC, laminaat, traprenovatie, buitenparket en interieurwerken. Al ruim 30 jaar vakmanschap uit Geldrop.',
  keywords: [
    'parket', 'traditioneel parket', 'parket leggen', 'multiplanken',
    'pvc vloer', 'laminaat', 'traprenovatie', 'buitenparket',
    'interieurwerken', 'legservice', 'Geldrop', 'Eindhoven', 'Brabant'
  ],
  authors: [{ name: 'BPM Parket' }],
  creator: 'BPM Parket',
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: BASE_URL,
    siteName: 'BPM Parket',
    title: 'BPM Parket | Traditioneel Parket sinds 1992 — Geldrop',
    description: 'Uw specialist in parket, PVC, laminaat, traprenovatie, buitenparket en interieurwerken.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BPM Parket',
    description: 'Specialist in traditioneel parket, PVC/laminaat, traprenovatie en interieurwerken — Geldrop.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [bedrijfsgegevens, promoPopup, policies, chatbotSettings, announcementBar, sitePassword] = await Promise.all([
    getBedrijfsgegevens(),
    getPromoPopup(),
    getDynamicPolicies(),
    getChatbotSettings(),
    getAnnouncementBar(),
    getSitePassword(),
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: bedrijfsgegevens?.name || 'BPM Parket',
    description: 'Specialist in traditioneel parket, PVC/laminaat, traprenovatie, buitenparket, legservice en interieurwerken in Geldrop en omgeving.',
    url: BASE_URL,
    telephone: bedrijfsgegevens?.phone || '06-53499361',
    email: bedrijfsgegevens?.email || 'info@bpmparket.nl',
    address: {
      '@type': 'PostalAddress',
      streetAddress: bedrijfsgegevens?.address || 'De Hooge Akker 19',
      addressLocality: bedrijfsgegevens?.city || 'Geldrop',
      postalCode: bedrijfsgegevens?.postcode || '5661 NG',
      addressCountry: 'NL',
    },
    areaServed: 'Noord-Brabant, Nederland',
    priceRange: '€€',
  }

  return (
    <html lang="nl" className={roboto.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased font-sans">
        <RootLayoutContent bedrijfsgegevens={bedrijfsgegevens} promoPopup={promoPopup} policies={policies} chatbotEnabled={chatbotSettings?.enabled !== false} announcementBar={announcementBar} sitePassword={sitePassword}>{children}</RootLayoutContent>
      </body>
    </html>
  )
}