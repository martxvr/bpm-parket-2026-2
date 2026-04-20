import { getSettings } from '@/lib/admin-data'
import InstellingenClient from './InstellingenClient'

export default async function InstellingenPage() {
    const [bedrijfsgegevens, chatbotSettings, promoPopup, seoSettings, announcementBar, sitePassword] = await Promise.all([
        getSettings('bedrijfsgegevens'),
        getSettings('chatbot_settings'),
        getSettings('promo_popup'),
        getSettings('seo_settings'),
        getSettings('announcement_bar'),
        getSettings('site_password'),
    ])

    return (
        <InstellingenClient
            bedrijfsgegevens={bedrijfsgegevens}
            chatbotSettings={chatbotSettings}
            promoPopup={promoPopup}
            seoSettings={seoSettings}
            announcementBar={announcementBar}
            sitePassword={sitePassword}
        />
    )
}
