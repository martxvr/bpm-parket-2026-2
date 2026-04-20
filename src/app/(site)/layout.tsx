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

const BASE_URL = 'https://pvcvloerenachterhoek.nl'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'PVC Vloeren Achterhoek | Doetinchem',
    template: '%s | PVC Vloeren Achterhoek',
  },
  description: 'Uw specialist in PVC-vloeren, traprenovatie, vloerbedekking, raamdecoratie en gordijnen in Doetinchem en de Achterhoek. 20+ jaar ervaring. Gratis advies en offerte.',
  keywords: ['pvc vloeren', 'traprenovatie', 'vloerbedekking', 'raamdecoratie', 'gordijnen', 'Doetinchem', 'Achterhoek', 'vloeren leggen', 'pvc vloeren Doetinchem', 'trap renoveren'],
  authors: [{ name: 'PVC Vloeren Achterhoek' }],
  creator: 'PVC Vloeren Achterhoek',
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: BASE_URL,
    siteName: 'PVC Vloeren Achterhoek',
    title: 'PVC Vloeren Achterhoek | Doetinchem',
    description: 'Uw specialist in PVC-vloeren, traprenovatie, vloerbedekking, raamdecoratie en gordijnen in Doetinchem en de Achterhoek.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PVC Vloeren Achterhoek',
    description: 'Specialist in PVC-vloeren, traprenovatie, vloerbedekking, raamdecoratie en gordijnen — Doetinchem & omgeving.',
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
    name: bedrijfsgegevens?.name || 'PVC Vloeren Achterhoek',
    description: 'Specialist in PVC-vloeren, traprenovatie, vloerbedekking, raamdecoratie en gordijnen in Doetinchem en de Achterhoek.',
    url: BASE_URL,
    telephone: bedrijfsgegevens?.phone || '',
    email: bedrijfsgegevens?.email || '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: bedrijfsgegevens?.address || '',
      addressLocality: bedrijfsgegevens?.city || 'Doetinchem',
      postalCode: bedrijfsgegevens?.postcode || '',
      addressCountry: 'NL',
    },
    areaServed: 'Achterhoek, Gelderland, Nederland',
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