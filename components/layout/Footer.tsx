import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin, ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { CookiePrefsButton } from '@/components/layout/CookiePrefsButton';
import { companyConfig } from '@/lib/company';

const POLICY_LINKS = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/algemene-voorwaarden', label: 'Algemene voorwaarden' },
  { href: '/cookies', label: 'Cookies' },
];

export function Footer() {
  return (
    <footer className="bg-black text-white pt-24 pb-12 mt-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Top Section: CTA & Brand */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-20 border-b border-white/10 pb-16">
          <div className="max-w-xl mb-12 lg:mb-0">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Uw interieur, <span className="text-brand-sand">ons vakmanschap.</span>
            </h2>
            <Link href="/" className="flex items-center group w-fit">
              <Image
                src="/logo.png"
                alt={`${companyConfig.name} Logo`}
                width={200}
                height={96}
                className="h-24 w-auto object-contain bg-white pb-4 rounded-xl transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          <div className="flex flex-col items-start lg:items-end">
            <Link
              href="/offerte"
              className="group flex items-center bg-white text-black px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-200 transition-all duration-300"
            >
              Start Project
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="mt-4 text-gray-400 text-sm">Vrijblijvende offerte binnen 24 uur.</p>
          </div>
        </div>

        {/* Middle Section: Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-20">

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Menu</h3>
            <ul className="space-y-4 text-lg font-medium text-gray-300">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/projecten" className="hover:text-white transition-colors">Portfolio</Link></li>
              <li><Link href="/offerte" className="hover:text-white transition-colors">Offerte Aanvragen</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Diensten</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/traditioneel-parket" className="hover:text-white transition-colors">Traditioneel Parket</Link></li>
              <li><Link href="/pvc-vloeren" className="hover:text-white transition-colors">PVC &amp; Laminaat</Link></li>
              <li><Link href="/traprenovatie" className="hover:text-white transition-colors">Traprenovatie</Link></li>
              <li><Link href="/schuren-onderhoud" className="hover:text-white transition-colors">Parket Schuren &amp; Onderhoud</Link></li>
              <li><Link href="/schuren-onderhoud" className="hover:text-white transition-colors">Vloerafwerking (Olie/Lak)</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Contact Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-500 mr-3 mt-1" />
                  <div>
                    <p className="text-white font-medium">Hoofdkantoor</p>
                    <p className="text-gray-400 text-sm">{companyConfig.contact.address}<br />{companyConfig.contact.zipCity}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-500 mr-3" />
                  <a href={`tel:${companyConfig.contact.phone.replace(/\s/g, '')}`} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {companyConfig.contact.phone}
                  </a>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-500 mr-3" />
                  <a href={`mailto:${companyConfig.contact.email}`} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {companyConfig.contact.email}
                  </a>
                </div>
                <div className="flex space-x-4 pt-2">
                  <a href={companyConfig.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-black transition-all">
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a href={companyConfig.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-black transition-all">
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a href={companyConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-black transition-all">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-8 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} {companyConfig.legalName}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 mt-4 md:mt-0">
            <li>
              <Link href="/admin" className="hover:text-gray-300">Admin Login</Link>
            </li>
            {POLICY_LINKS.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="hover:text-gray-300">
                  {p.label}
                </Link>
              </li>
            ))}
            <li>
              <CookiePrefsButton />
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
