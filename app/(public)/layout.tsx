import { NavbarServer } from '@/components/layout/NavbarServer';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { Chatbot } from '@/components/chatbot/Chatbot';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnnouncementBar />
      <NavbarServer />
      <main>{children}</main>
      <Footer />
      <Chatbot />
      <CookieBanner />
    </>
  );
}
