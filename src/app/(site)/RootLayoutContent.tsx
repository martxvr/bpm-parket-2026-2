"use client"

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Chatbot from '@/components/Chatbot'
import PromoPopup from '@/components/PromoPopup'
import AnnouncementBar from '@/components/AnnouncementBar'
import SitePasswordGate from '@/components/SitePasswordGate'

export default function RootLayoutContent({
    children,
    bedrijfsgegevens,
    promoPopup,
    policies,
    chatbotEnabled,
    announcementBar,
    sitePassword,
}: {
    children: React.ReactNode,
    bedrijfsgegevens?: any,
    promoPopup?: { enabled: boolean; title: string; body: string; display_style?: string } | null,
    policies?: import('@/types').Policy[],
    chatbotEnabled?: boolean,
    announcementBar?: { enabled: boolean; texts?: string[]; text?: string; bgColor?: string } | null,
    sitePassword?: { enabled: boolean; password: string; backgroundImage?: string } | null,
}) {
    const pathname = usePathname()
    const isAdminOrLogin = pathname?.startsWith('/admin') || pathname === '/login'

    // Backwards compat: old data had a single `text` field
    const announcementTexts = announcementBar?.texts?.length
        ? announcementBar.texts
        : announcementBar?.text ? [announcementBar.text] : []

    // If site password is enabled, wrap everything in the gate
    if (!isAdminOrLogin && sitePassword?.enabled && sitePassword?.password) {
        return (
            <SitePasswordGate backgroundImage={sitePassword.backgroundImage}>
                <div className="flex flex-col min-h-screen bg-white text-gray-900">
                    {announcementBar?.enabled && announcementTexts.length > 0 && (
                        <AnnouncementBar texts={announcementTexts} bgColor={announcementBar.bgColor} />
                    )}
                    <Navbar bedrijfsgegevens={bedrijfsgegevens} />
                    <main className="flex-grow">{children}</main>
                    <Footer bedrijfsgegevens={bedrijfsgegevens} policies={policies} />
                    {chatbotEnabled && <Chatbot />}
                    {promoPopup && (
                        <PromoPopup enabled={promoPopup.enabled} title={promoPopup.title} body={promoPopup.body} display_style={promoPopup.display_style as any} />
                    )}
                </div>
            </SitePasswordGate>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-900">
            {!isAdminOrLogin && announcementBar?.enabled && announcementTexts.length > 0 && (
                <AnnouncementBar texts={announcementTexts} bgColor={announcementBar.bgColor} />
            )}
            {!isAdminOrLogin && <Navbar bedrijfsgegevens={bedrijfsgegevens} />}

            <main className="flex-grow">
                {children}
            </main>

            {!isAdminOrLogin && <Footer bedrijfsgegevens={bedrijfsgegevens} policies={policies} />}
            {!isAdminOrLogin && chatbotEnabled && <Chatbot />}
            {!isAdminOrLogin && promoPopup && (
                <PromoPopup
                    enabled={promoPopup.enabled}
                    title={promoPopup.title}
                    body={promoPopup.body}
                    display_style={promoPopup.display_style as any}
                />
            )}
        </div>
    )
}
