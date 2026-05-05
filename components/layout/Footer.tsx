import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { CookiePrefsButton } from '@/components/layout/CookiePrefsButton';
import { companyConfig } from '@/lib/company';

const SERVICE_LINKS = [
  { href: '/pvc-vloeren', label: 'PVC vloeren' },
  { href: '/traditioneel-parket', label: 'Traditioneel parket' },
  { href: '/multiplanken', label: 'Multiplanken' },
  { href: '/laminaat', label: 'Laminaat' },
  { href: '/traprenovatie', label: 'Traprenovatie' },
  { href: '/schuren-onderhoud', label: 'Schuren & onderhoud' },
];

const INFO_LINKS = [
  { href: '/over-ons', label: 'Over ons' },
  { href: '/projecten', label: 'Projecten' },
  { href: '/showroom', label: 'Showroom' },
  { href: '/contact', label: 'Contact' },
];

const POLICY_LINKS = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/algemene-voorwaarden', label: 'Algemene voorwaarden' },
  { href: '/cookies', label: 'Cookies' },
];

export function Footer() {
  return (
    <footer className="bg-[var(--color-brand-charcoal)] text-white/80 mt-24">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <Image
              src="/logo.png"
              alt={companyConfig.name}
              width={140}
              height={48}
              className="mb-4 invert opacity-90"
            />
            <p className="text-sm leading-relaxed">
              Specialist in traditioneel parket, PVC vloeren, laminaat en
              traprenovatie. Gevestigd in Geldrop.
            </p>
            <div className="flex gap-3 mt-4">
              <Link href={companyConfig.socials.facebook} aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href={companyConfig.socials.instagram} aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href={companyConfig.socials.linkedin} aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-medium mb-3">Diensten</h3>
            <ul className="space-y-2 text-sm">
              {SERVICE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-3">Bedrijf</h3>
            <ul className="space-y-2 text-sm">
              {INFO_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-3">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href={`tel:${companyConfig.contact.phone.replace(/\s/g, '')}`}>
                  {companyConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${companyConfig.contact.email}`}>
                  {companyConfig.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>
                  {companyConfig.contact.address}
                  <br />
                  {companyConfig.contact.zipCity}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-xs text-white/50">
          <span>© {new Date().getFullYear()} {companyConfig.legalName}. Alle rechten voorbehouden.</span>
          <ul className="flex flex-wrap gap-4">
            {POLICY_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">{l.label}</Link>
              </li>
            ))}
            <li>
              <CookiePrefsButton />
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
