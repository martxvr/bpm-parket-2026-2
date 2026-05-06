'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { companyConfig } from '@/lib/company';
import { cn } from '@/lib/cn';

const SERVICES = [
  { href: '/pvc-vloeren', label: 'PVC vloeren', desc: 'Look en voelt als hout' },
  { href: '/traditioneel-parket', label: 'Traditioneel parket', desc: 'Met band & bies' },
  { href: '/multiplanken', label: 'Multiplanken', desc: 'Eikenhouten planken' },
  { href: '/laminaat', label: 'Laminaat', desc: 'Snel en betaalbaar' },
  { href: '/traprenovatie', label: 'Traprenovatie', desc: 'Nieuwe trap zonder slopen' },
  { href: '/schuren-onderhoud', label: 'Schuren & onderhoud', desc: 'Bestaand parket' },
];

const NAV = [
  { href: '/projecten', label: 'Projecten' },
  { href: '/showroom', label: 'Showroom' },
  { href: '/over-ons', label: 'Over ons' },
  { href: '/contact', label: 'Contact' },
];

export type NavbarBrand = {
  slug: string;
  name: string;
  logo_url: string | null;
  description: string | null;
};

function cleanDescription(text: string | null): string {
  if (!text) return '';
  return text.replace(/[*_`#>]/g, '').trim();
}

export function Navbar({ brands = [] }: { brands?: NavbarBrand[] }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [brandsMegaOpen, setBrandsMegaOpen] = useState(false);

  const hasBrands = brands.length > 0;

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-brand-cream)]/90 backdrop-blur border-b border-black/5">
      <Container className="flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt={companyConfig.name} width={120} height={40} priority />
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm">
          <button
            onMouseEnter={() => {
              setMegaOpen(true);
              setBrandsMegaOpen(false);
            }}
            onClick={() => {
              setMegaOpen((s) => !s);
              setBrandsMegaOpen(false);
            }}
            className="hover:text-[var(--color-brand-primary)]"
          >
            Diensten
          </button>
          {hasBrands && (
            <button
              onMouseEnter={() => {
                setBrandsMegaOpen(true);
                setMegaOpen(false);
              }}
              onClick={() => {
                setBrandsMegaOpen((s) => !s);
                setMegaOpen(false);
              }}
              className="hover:text-[var(--color-brand-primary)]"
            >
              Merken
            </button>
          )}
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'hover:text-[var(--color-brand-primary)]',
                pathname === l.href && 'text-[var(--color-brand-primary)]',
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href={`tel:${companyConfig.contact.phone.replace(/\s/g, '')}`}
            className="text-sm flex items-center gap-2 hover:text-[var(--color-brand-primary)]"
          >
            <Phone className="h-4 w-4" />
            {companyConfig.contact.phone}
          </a>
          <Button href="/offerte" size="sm">Offerte aanvragen</Button>
        </div>

        <button
          className="lg:hidden p-2"
          onClick={() => setMobileOpen((s) => !s)}
          aria-label={mobileOpen ? 'Menu sluiten' : 'Menu openen'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {megaOpen && (
        <div
          onMouseLeave={() => setMegaOpen(false)}
          className="absolute inset-x-0 bg-white shadow-lg border-b border-black/5"
        >
          <Container className="py-8">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {SERVICES.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  onClick={() => setMegaOpen(false)}
                  className="block rounded-lg p-4 hover:bg-[var(--color-brand-cream)]"
                >
                  <span className="font-medium">{s.label}</span>
                  <span className="block text-xs text-black/60 mt-1">{s.desc}</span>
                </Link>
              ))}
            </div>
          </Container>
        </div>
      )}

      {brandsMegaOpen && hasBrands && (
        <div
          onMouseLeave={() => setBrandsMegaOpen(false)}
          className="absolute inset-x-0 bg-white shadow-lg border-b border-black/5"
        >
          <Container className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {brands.map((b) => (
                <Link
                  key={b.slug}
                  href={`/merken/${b.slug}`}
                  onClick={() => setBrandsMegaOpen(false)}
                  className="flex items-start gap-4 rounded-lg p-4 hover:bg-[var(--color-brand-cream)]"
                >
                  <div className="flex-shrink-0 w-24 h-10 relative">
                    {b.logo_url ? (
                      <Image
                        src={b.logo_url}
                        alt={b.name}
                        fill
                        sizes="96px"
                        className="object-contain object-left"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block font-medium">{b.name}</span>
                    <span className="block text-xs text-black/60 mt-1 line-clamp-2">
                      {cleanDescription(b.description)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/merken"
                onClick={() => setBrandsMegaOpen(false)}
                className="inline-block text-sm font-medium text-[var(--color-brand-primary)] hover:underline"
              >
                Alle merken bekijken →
              </Link>
            </div>
          </Container>
        </div>
      )}

      {mobileOpen && (
        <div className="lg:hidden border-t border-black/5">
          <Container className="py-4 space-y-1">
            <details className="group">
              <summary className="flex justify-between items-center py-2 cursor-pointer text-sm">
                Diensten
                <span className="group-open:rotate-180 transition">▾</span>
              </summary>
              <div className="pl-4 space-y-1 mt-1">
                {SERVICES.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-sm text-black/70 hover:text-black"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </details>
            {hasBrands && (
              <details className="group">
                <summary className="flex justify-between items-center py-2 cursor-pointer text-sm">
                  Merken
                  <span className="group-open:rotate-180 transition">▾</span>
                </summary>
                <div className="pl-4 space-y-1 mt-1">
                  {brands.map((b) => (
                    <Link
                      key={b.slug}
                      href={`/merken/${b.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="block py-2 text-sm text-black/70 hover:text-black"
                    >
                      {b.name}
                    </Link>
                  ))}
                  <Link
                    href="/merken"
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-sm font-medium text-[var(--color-brand-primary)] hover:underline"
                  >
                    Alle merken
                  </Link>
                </div>
              </details>
            )}
            {NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm hover:text-[var(--color-brand-primary)]"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-black/5 mt-3">
              <Button href="/offerte" size="md" className="w-full">
                Offerte aanvragen
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
