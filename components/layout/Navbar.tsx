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

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-brand-cream)]/90 backdrop-blur border-b border-black/5">
      <Container className="flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt={companyConfig.name} width={120} height={40} priority />
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm">
          <button
            onMouseEnter={() => setMegaOpen(true)}
            onClick={() => setMegaOpen((s) => !s)}
            className="hover:text-[var(--color-brand-primary)]"
          >
            Diensten
          </button>
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
