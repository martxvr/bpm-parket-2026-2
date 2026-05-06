'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import { companyConfig } from '@/lib/company';

const NAVBAR_HEIGHT_PX = 96; // matches h-24 on the nav element

type NavLink = { name: string; href: string };

const NAV_LINKS: NavLink[] = [
  { name: 'Home', href: '/' },
  { name: 'Over Ons', href: '/over-ons' },
  { name: 'Showroom', href: '/showroom' },
  { name: 'Projecten', href: '/projecten' },
  { name: 'Contact', href: '/contact' },
];

const PRODUCT_LINKS = [
  { name: 'PVC en Laminaat', href: '/pvc-vloeren', desc: 'Stijlvol, duurzaam en onderhoudsvriendelijk' },
  { name: 'Parket en Multiplanken', href: '/traditioneel-parket', desc: 'Traditioneel vakmanschap in massief hout' },
  { name: 'Legservice', href: '/schuren-onderhoud', desc: 'Professionele plaatsing door onze specialisten' },
  { name: 'Trap renovatie', href: '/traprenovatie', desc: 'Nieuwe uitstraling, vaak binnen één dag' },
  { name: 'Buitenparket', href: '/schuren-onderhoud', desc: 'Robuuste houten vloeren voor buiten' },
  { name: 'Interieurwerken', href: '/schuren-onderhoud', desc: 'Maatwerk meubels en interieurafwerking' },
];

export type NavbarBrand = {
  slug: string;
  name: string;
  logo_url: string | null;
  description: string | null;
};

export function Navbar({ brands = [] }: { brands?: NavbarBrand[] }) {
  // brands prop preserved for API compatibility with NavbarServer; unused for now
  void brands;

  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const productActive = PRODUCT_LINKS.some((p) => isActive(p.href));

  const handleMouseEnter = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setIsProductsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsProductsOpen(false);
    }, 200);
  };

  const closeAll = () => {
    setIsOpen(false);
    setIsProductsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-brand-light transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link href="/" onClick={closeAll} className="flex-shrink-0 flex items-center cursor-pointer group">
            <div className="h-20 w-auto flex items-center justify-center">
              <Image
                src="/logo.png"
                alt={companyConfig.name}
                width={160}
                height={80}
                priority
                className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-10 items-center">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-brand-red' : 'text-brand-dark hover:text-brand-red'
              }`}
            >
              Home
            </Link>

            {/* Products Dropdown (Diensten mega menu) */}
            <div
              className="relative py-8"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center text-sm font-medium transition-colors ${
                  productActive ? 'text-brand-red' : 'text-brand-dark hover:text-brand-red'
                }`}
              >
                Producten
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                    isProductsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Mega Menu */}
              <div
                className={`fixed left-0 w-screen bg-white border-b border-gray-100 shadow-2xl transform transition-all duration-200 origin-top ${
                  isProductsOpen
                    ? 'opacity-100 scale-y-100 translate-y-0'
                    : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
                }`}
                style={{ top: `${NAVBAR_HEIGHT_PX}px` }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                  <div className="grid grid-cols-3 gap-8">
                    {/* Column 1 */}
                    <div className="space-y-1">
                      {PRODUCT_LINKS.slice(0, 3).map((product) => (
                        <Link
                          key={product.href + product.name}
                          href={product.href}
                          onClick={closeAll}
                          className="block w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          <p className="font-semibold text-brand-dark group-hover:text-brand-red transition-colors">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{product.desc}</p>
                        </Link>
                      ))}
                    </div>
                    {/* Column 2 */}
                    <div className="space-y-1">
                      {PRODUCT_LINKS.slice(3).map((product) => (
                        <Link
                          key={product.href + product.name}
                          href={product.href}
                          onClick={closeAll}
                          className="block w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          <p className="font-semibold text-brand-dark group-hover:text-brand-red transition-colors">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{product.desc}</p>
                        </Link>
                      ))}
                    </div>
                    {/* Featured card */}
                    <div className="bg-black rounded-2xl p-8 flex flex-col justify-between min-h-[200px] relative overflow-hidden">
                      <div className="absolute inset-0 opacity-20">
                        <Image
                          src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600"
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="relative z-10">
                        <p className="text-xs font-bold tracking-widest text-brand-red uppercase mb-2">
                          Specialisaties
                        </p>
                        <h3 className="text-xl font-bold text-white leading-snug">
                          Alle producten &amp; diensten van BPM Parket
                        </h3>
                      </div>
                      <Link
                        href="/traditioneel-parket"
                        onClick={closeAll}
                        className="relative z-10 mt-6 bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors w-fit"
                      >
                        Bekijk alle producten
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Merken — Phase 2 addition: regular link, NOT a mega menu */}
            <Link
              href="/merken"
              className={`text-sm font-medium transition-colors ${
                isActive('/merken') ? 'text-brand-red' : 'text-brand-dark hover:text-brand-red'
              }`}
            >
              Merken
            </Link>

            {NAV_LINKS.filter((l) => l.href !== '/').map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href) ? 'text-brand-red' : 'text-brand-dark hover:text-brand-red'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/offerte"
              className="group inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 bg-brand-red text-white hover:bg-brand-red/90 border border-transparent px-5 py-2 text-sm"
            >
              Offerte
              <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Menu sluiten' : 'Menu openen'}
              className="text-gray-500 hover:text-black focus:outline-none p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="md:hidden bg-white border-b border-gray-100"
          style={{ animationDuration: '0.3s' }}
        >
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link
              href="/"
              onClick={closeAll}
              className={`block w-full text-left px-4 py-3 rounded-2xl text-base font-medium ${
                isActive('/') ? 'bg-gray-100 text-black' : 'text-gray-500 hover:text-black hover:bg-gray-50'
              }`}
            >
              Home
            </Link>

            {/* Mobile Products Section */}
            <div>
              <button
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className={`flex items-center justify-between w-full text-left px-4 py-3 rounded-2xl text-base font-medium ${
                  productActive ? 'bg-gray-100 text-black' : 'text-gray-500 hover:text-black hover:bg-gray-50'
                }`}
              >
                Producten
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isProductsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isProductsOpen && (
                <div className="pl-4 mt-2 space-y-1">
                  {PRODUCT_LINKS.map((product) => (
                    <Link
                      key={product.href + product.name}
                      href={product.href}
                      onClick={closeAll}
                      className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                        isActive(product.href) ? 'text-brand-red' : 'text-gray-500'
                      }`}
                    >
                      {product.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Merken — Phase 2 addition (mobile) */}
            <Link
              href="/merken"
              onClick={closeAll}
              className={`block w-full text-left px-4 py-3 rounded-2xl text-base font-medium ${
                isActive('/merken') ? 'bg-gray-100 text-black' : 'text-gray-500 hover:text-black hover:bg-gray-50'
              }`}
            >
              Merken
            </Link>

            {NAV_LINKS.filter((l) => l.href !== '/').map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeAll}
                className={`block w-full text-left px-4 py-3 rounded-2xl text-base font-medium ${
                  isActive(link.href) ? 'bg-gray-100 text-black' : 'text-gray-500 hover:text-black hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 px-4">
              <Link
                href="/offerte"
                onClick={closeAll}
                className="group inline-flex w-full items-center justify-center rounded-full font-medium transition-all duration-300 bg-brand-red text-white hover:bg-brand-red/90 border border-transparent px-7 py-3 text-sm"
              >
                Offerte Aanvragen
                <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
