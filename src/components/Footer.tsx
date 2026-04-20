"use client"

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import ArrowNarrowRightIcon from '@/components/ui/arrow-narrow-right-icon';
import MailFilledIcon from '@/components/ui/mail-filled-icon';
import MapPinIcon from '@/components/ui/map-pin-icon';
import TelephoneIcon from '@/components/ui/telephone-icon';
import { companyConfig } from '@/config';
import { Policy } from '@/types';

// Extend so we can accept bedrijfsgegevens from server component
interface FooterProps {
  bedrijfsgegevens?: any;
  policies?: Policy[];
}

const Footer: React.FC<FooterProps> = ({ bedrijfsgegevens, policies = [] }) => {
  const router = useRouter();


  const address = bedrijfsgegevens?.address || companyConfig.contact.address;
  const zipCity = bedrijfsgegevens?.postcode && bedrijfsgegevens?.city
    ? `${bedrijfsgegevens.postcode} ${bedrijfsgegevens.city}`
    : companyConfig.contact.zipCity;
  const companyName = bedrijfsgegevens?.name || companyConfig.legalName;
  const companyPhone = bedrijfsgegevens?.phone || companyConfig.contact.phone;
  const companyEmail = bedrijfsgegevens?.email || companyConfig.contact.email;

  return (
    <footer className="bg-brand-dark text-white pt-24 pb-12 mt-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Top Section: CTA & Brand */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-20 border-b border-white/10 pb-16">
          <div className="max-w-xl mb-12 lg:mb-0">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Vakmanschap <span className="text-brand-primary">tot in detail.</span>
            </h2>
            <Link href="/" className="flex items-center group w-fit">
              <img
                src="/footer-logo.png"
                alt="BPM Parket Logo"
                className="h-32 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          <div className="flex flex-col items-start lg:items-end">
            <button
              onClick={() => router.push('/offerte')}
              className="group flex items-center bg-brand-primary text-white px-8 py-4 rounded-[5px] text-lg font-bold hover:bg-brand-secondary transition-all duration-300"
            >
              Start Project
              <ArrowNarrowRightIcon size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="mt-4 text-gray-400 text-sm">Vrijblijvende offerte binnen 24 uur.</p>
          </div>
        </div>

        {/* Middle Section: Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-20">

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Menu</h3>
            <ul className="space-y-4 text-lg font-medium text-gray-300">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/over-ons" className="hover:text-white transition-colors">Over ons</Link></li>
              <li><Link href="/projecten" className="hover:text-white transition-colors">Portfolio</Link></li>
              <li><Link href="/offerte" className="hover:text-white transition-colors">Offerte Aanvragen</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Diensten</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/producten/parket-en-multiplanken" className="hover:text-white transition-colors">Parket en Multiplanken</Link></li>
              <li><Link href="/producten/pvc-en-laminaat" className="hover:text-white transition-colors">PVC en Laminaat</Link></li>
              <li><Link href="/producten/legservice" className="hover:text-white transition-colors">Legservice</Link></li>
              <li><Link href="/producten/traprenovatie" className="hover:text-white transition-colors">Traprenovatie</Link></li>
              <li><Link href="/producten/buitenparket" className="hover:text-white transition-colors">Buitenparket</Link></li>
              <li><Link href="/producten/interieurwerken" className="hover:text-white transition-colors">Interieurwerken</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Contact Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPinIcon size={20} className="text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="text-white font-medium">Hoofdkantoor</p>
                    <p className="text-gray-400 text-sm">{address}<br />{zipCity}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <TelephoneIcon size={20} className="text-gray-500 mr-3" />
                  <a href={`tel:${companyPhone}`} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {companyPhone}
                  </a>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MailFilledIcon size={20} className="text-gray-500 mr-3" />
                  <a href={`mailto:${companyEmail}`} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {companyEmail}
                  </a>
                </div>
                <div className="flex space-x-4 pt-2">
                  <a href={companyConfig.socials.facebook} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-black transition-all">
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a href={companyConfig.socials.instagram} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-black transition-all">
                    <Instagram className="h-4 w-4" />
                  </a>
                  {companyConfig.socials.linkedin && (
                    <a href={companyConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-black transition-all">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-8 text-xs text-brand-text">
          <p>&copy; {new Date().getFullYear()} {companyName}</p>
          <div className="flex flex-wrap space-x-6 mt-4 md:mt-0">
            {policies && policies.map(p => (
              <Link key={p.id} href={`/beleid/${p.id}`} className="hover:text-gray-300">
                {p.title}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;