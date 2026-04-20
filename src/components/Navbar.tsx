"use client"

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import XIcon from '@/components/ui/x-icon';
import DownChevron from '@/components/ui/down-chevron';
import RightChevron from '@/components/ui/right-chevron';
import ArrowNarrowRightIcon from '@/components/ui/arrow-narrow-right-icon';
import Button from './Button';
import { companyConfig } from '@/config';
import { categories, getProductTypesForCategory } from '@/data/brands';

const Navbar = ({ bedrijfsgegevens }: { bedrijfsgegevens?: any }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navLinks = [
    { name: 'Over ons', href: '/over-ons' },
    { name: 'Showroom', href: '/showroom' },
    { name: 'Projecten', href: '/projecten' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsMegaOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsMegaOpen(false);
    }, 250);
  };

  // Close mega menu on route change
  useEffect(() => {
    setIsMegaOpen(false);
    setIsOpen(false);
  }, [pathname]);

  // Close on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMegaOpen(false);
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const companyName = bedrijfsgegevens?.companyName || companyConfig.name;

  return (
    <nav className="sticky top-0 z-50 bg-brand-dark/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 lg:h-24 relative">

          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center group md:static absolute left-1/2 -translate-x-1/2 md:translate-x-0 z-10 transition-all duration-300"
          >
            <div className="h-8 sm:h-16 w-auto flex items-center justify-center">
              <img
                src="/logo.png"
                alt={companyName}
                className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">

            <Link
              href="/"
              className={`text-sm font-medium transition-colors duration-200 ${pathname === '/' ? 'text-brand-primary' : 'text-white/80 hover:text-white'}`}
            >
              Home
            </Link>

            {/* Diensten Mega Menu Trigger */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              ref={megaRef}
            >
              <button
                className={`flex items-center text-sm font-medium transition-colors duration-200 py-8 ${pathname.startsWith('/producten') ? 'text-brand-primary' : 'text-white/80 hover:text-white'}`}
              >
                Diensten
                <DownChevron size={14} className={`ml-1 transition-transform duration-300 ${isMegaOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${pathname === link.href ? 'text-brand-primary' : 'text-white/80 hover:text-white'}`}
              >
                {link.name}
              </Link>
            ))}

            <Button size="sm" variant="primary" withIcon onClick={() => router.push('/offerte')}>
              Offerte
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center z-50 ml-auto">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              aria-label={isOpen ? "Menu sluiten" : "Menu openen"} 
              className="text-white hover:text-brand-primary focus:outline-none p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
            >
              {isOpen ? <XIcon size={28} /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MEGA MENU — Desktop
         ══════════════════════════════════════════════ */}
      <div
        className={`hidden lg:block absolute left-0 right-0 top-full z-40 transition-all duration-300 origin-top ${
          isMegaOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="bg-brand-dark/98 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
            {/* Category Columns */}
            <div className="grid grid-cols-6 gap-8">
              {categories.map((category) => (
                <div key={category.slug} className="space-y-4">
                  {/* Category Header */}
                  <Link
                    href={`/producten/${category.slug}`}
                    className="group flex items-center gap-2"
                  >
                    <h3 className="text-sm font-bold text-white group-hover:text-brand-primary transition-colors">
                      {category.name}
                    </h3>
                    <ArrowNarrowRightIcon size={12} className="text-white/30 group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
                  </Link>
                  <div className="h-px bg-gradient-to-r from-brand-primary/40 to-transparent" />
                  
                  {/* Brand Links or Type Links */}
                  <div className="space-y-1">
                    {(() => {
                      // Gordijnen + Raamdecoratie: show types (user clicks type → sees brands)
                      const isTypeCategory = category.slug === 'gordijnen' || category.slug === 'raamdecoratie'
                      const types = isTypeCategory ? getProductTypesForCategory(category.slug) : []

                      if (isTypeCategory && types.length > 0) {
                        return types.map((type) => (
                          <Link
                            key={type.slug}
                            href={`/producten/${category.slug}/type/${type.slug}`}
                            className="block text-sm text-white/50 hover:text-brand-primary hover:pl-1 transition-all duration-200 py-1"
                          >
                            {type.name}
                          </Link>
                        ))
                      }

                      if (category.brands.length > 0) {
                        return (
                          <>
                            {category.brands.map((brand) => (
                              <Link
                                key={brand.slug}
                                href={`/producten/${category.slug}/${brand.slug}`}
                                className="block text-sm text-white/50 hover:text-brand-primary hover:pl-1 transition-all duration-200 py-1"
                              >
                                {brand.name}
                              </Link>
                            ))}
                          </>
                        )
                      }

                      return (
                        <Link
                          href={`/producten/${category.slug}`}
                          className="block text-sm text-white/50 hover:text-brand-primary transition-colors py-1"
                        >
                          Bekijk assortiment →
                        </Link>
                      )
                    })()}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom bar */}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <p className="text-xs text-white/30">
                Wij werken uitsluitend met premium merken voor de beste kwaliteit
              </p>
              <Link
                href="/showroom"
                className="text-xs font-medium text-brand-primary hover:text-white transition-colors flex items-center gap-1"
              >
                Bezoek onze showroom <ArrowNarrowRightIcon size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MOBILE MENU
         ══════════════════════════════════════════════ */}
      {isOpen && (
        <div className="lg:hidden bg-brand-dark border-b border-white/10 animate-fade-in-up max-h-[80vh] overflow-y-auto" style={{ animationDuration: '0.3s' }}>
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium ${pathname === '/' ? 'bg-white/10 text-brand-primary' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
            >
              Home
            </Link>

            {/* Mobile Diensten Section */}
            <div>
              <button
                onClick={() => setMobileExpandedCategory(mobileExpandedCategory === '__diensten__' ? null : '__diensten__')}
                className={`flex items-center justify-between w-full text-left px-4 py-3 rounded-xl text-base font-medium ${pathname.startsWith('/producten') ? 'bg-white/10 text-brand-primary' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
              >
                Diensten
                <DownChevron size={20} className={`transition-transform duration-200 ${mobileExpandedCategory === '__diensten__' ? 'rotate-180' : ''}`} />
              </button>
              
              {mobileExpandedCategory === '__diensten__' && (
                <div className="pl-2 mt-1 space-y-0.5">
                  {categories.map((category) => {
                    const isTypeCategory = category.slug === 'gordijnen' || category.slug === 'raamdecoratie'
                    const types = isTypeCategory ? getProductTypesForCategory(category.slug) : []
                    const showTypes = isTypeCategory && types.length > 0
                    const hasSubItems = showTypes || category.brands.length > 0
                    return (
                    <div key={category.slug}>
                      {/* Category name as expandable or direct link */}
                      {hasSubItems ? (
                        <>
                          <button
                            onClick={() => setMobileExpandedCategory(
                              mobileExpandedCategory === category.slug ? '__diensten__' : category.slug
                            )}
                            className={`flex items-center justify-between w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold ${
                              pathname.includes(category.slug) ? 'text-brand-primary' : 'text-white/60 hover:text-white'
                            }`}
                          >
                            {category.name}
                            <RightChevron size={16} className={`transition-transform duration-200 ${mobileExpandedCategory === category.slug ? 'rotate-90' : ''}`} />
                          </button>

                          {mobileExpandedCategory === category.slug && (
                            <div className="pl-4 space-y-0.5 mb-2">
                              <Link
                                href={`/producten/${category.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-2 rounded-lg text-xs font-medium text-brand-primary/80"
                              >
                                Alle {category.name} →
                              </Link>
                              {showTypes ? (
                                types.map((type) => (
                                  <Link
                                    key={type.slug}
                                    href={`/producten/${category.slug}/type/${type.slug}`}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white"
                                  >
                                    {type.name}
                                  </Link>
                                ))
                              ) : (
                                category.brands.map((brand) => (
                                  <Link
                                    key={brand.slug}
                                    href={`/producten/${category.slug}/${brand.slug}`}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white"
                                  >
                                    {brand.name}
                                  </Link>
                                ))
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          href={`/producten/${category.slug}`}
                          onClick={() => setIsOpen(false)}
                          className={`block px-4 py-2.5 rounded-lg text-sm font-semibold ${
                            pathname.includes(category.slug) ? 'text-brand-primary' : 'text-white/60 hover:text-white'
                          }`}
                        >
                          {category.name}
                        </Link>
                      )}
                    </div>
                    )
                  })}
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium ${pathname === link.href ? 'bg-white/10 text-brand-primary' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 px-4">
              <Button fullWidth onClick={() => { router.push('/offerte'); setIsOpen(false); }}>
                Offerte Aanvragen
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav >
  );
};

export default Navbar;