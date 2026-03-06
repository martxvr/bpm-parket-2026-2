import React, { useEffect, useState } from 'react';
import { Facebook, Instagram, Linkedin, Hammer, ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { companyConfig } from '../config';
import { getPolicies } from '../services/mockDatabase';
import { Policy } from '../types';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [policies, setPolicies] = useState<Policy[]>([]);

  useEffect(() => {
    getPolicies().then(setPolicies);
  }, []);

  return (
    <footer className="bg-black text-white pt-24 pb-12 mt-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Top Section: CTA & Brand */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-20 border-b border-white/10 pb-16">
          <div className="max-w-xl mb-12 lg:mb-0">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Uw interieur, <span className="text-brand-sand">ons vakmanschap.</span>
            </h2>
            <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('home')}>
              <img src="/2023-10-02_12_09_56-BPM_Parket___Parket__PVC__Houten_Vloeren_en_nog_6_andere_pagina_s_-_Werk_-_Micro-removebg-preview.png" alt="BPM Parket Logo" className="h-24 w-auto object-contain bg-white pb-4 rounded-xl transition-transform duration-300 group-hover:scale-105" />
            </div>
          </div>

          <div className="flex flex-col items-start lg:items-end">
            <button
              onClick={() => onNavigate('quote')}
              className="group flex items-center bg-white text-black px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-200 transition-all duration-300"
            >
              Start Project
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="mt-4 text-gray-400 text-sm">Vrijblijvende offerte binnen 24 uur.</p>
          </div>
        </div>

        {/* Middle Section: Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-20">

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Menu</h3>
            <ul className="space-y-4 text-lg font-medium text-gray-300">
              <li><button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">Home</button></li>
              <li><button onClick={() => onNavigate('projects')} className="hover:text-white transition-colors">Portfolio</button></li>
              <li><button onClick={() => onNavigate('quote')} className="hover:text-white transition-colors">Offerte Aanvragen</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">Contact</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Diensten</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">Traditioneel Parket</li>
              <li className="hover:text-white transition-colors cursor-pointer">PVC & Laminaat</li>
              <li className="hover:text-white transition-colors cursor-pointer">Traprenovatie</li>
              <li className="hover:text-white transition-colors cursor-pointer">Parket Schuren & Onderhoud</li>
              <li className="hover:text-white transition-colors cursor-pointer">Vloerafwerking (Olie/Lak)</li>
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
                  <p className="text-gray-400 text-sm hover:text-white transition-colors">{companyConfig.contact.phone}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-500 mr-3" />
                  <p className="text-gray-400 text-sm hover:text-white transition-colors">{companyConfig.contact.email}</p>
                </div>
                <div className="flex space-x-4 pt-2">
                  <a href={companyConfig.socials.facebook} className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-black transition-all"><Facebook className="h-4 w-4" /></a>
                  <a href={companyConfig.socials.instagram} className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-black transition-all"><Instagram className="h-4 w-4" /></a>
                  <a href={companyConfig.socials.linkedin} className="bg-white/10 p-2 rounded-full hover:bg-white hover:text-black transition-all"><Linkedin className="h-4 w-4" /></a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-8 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} {companyConfig.legalName}</p>
          <div className="flex flex-wrap space-x-6 mt-4 md:mt-0">
            <button onClick={() => onNavigate('admin')} className="hover:text-gray-300">Admin Login</button>
            {policies.map(p => (
              <button key={p.id} onClick={() => onNavigate(`policy-${p.id}`)} className="hover:text-gray-300">
                {p.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;