import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import Button from './Button';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Showroom', id: 'showroom' },
    { name: 'Projecten', id: 'projects' },
    { name: 'Contact', id: 'contact' },
  ];

  const productLinks = [
    { name: 'PVC en Laminaat', id: 'producten-pvc' },
    { name: 'Parket en Multiplanken', id: 'producten-parket' },
    { name: 'Legservice', id: 'producten-legservice' },
    { name: 'Trap renovatie', id: 'producten-trap' },
    { name: 'Buitenparket', id: 'producten-buitenparket' },
    { name: 'Interieurwerken', id: 'producten-interieur' },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
    setIsProductsOpen(false);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setIsProductsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsProductsOpen(false);
    }, 200);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-brand-light transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => handleNav('home')}>
            <div className="h-20 w-auto flex items-center justify-center">
              <img src="/2023-10-02_12_09_56-BPM_Parket___Parket__PVC__Houten_Vloeren_en_nog_6_andere_pagina_s_-_Werk_-_Micro-removebg-preview.png" alt="BPM Parket" className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-10 items-center">
            {/* Regular Links before Products */}
            <button
              onClick={() => handleNav('home')}
              className={`text-sm font-medium transition-colors ${currentPage === 'home' ? 'text-brand-red' : 'text-brand-dark hover:text-brand-red'}`}
            >
              Home
            </button>

            {/* Products Dropdown */}
            <div
              className="relative py-8"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center text-sm font-medium transition-colors ${currentPage.startsWith('producten-') ? 'text-brand-red' : 'text-brand-dark hover:text-brand-red'}`}
              >
                Producten
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isProductsOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute top-full left-0 w-64 bg-white border border-brand-light rounded-2xl shadow-xl py-3 transform transition-all duration-200 origin-top-left ${isProductsOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
              >
                {productLinks.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleNav(product.id)}
                    className="block w-full text-left px-6 py-2.5 text-sm text-brand-dark hover:bg-gray-50 hover:text-brand-red transition-colors"
                  >
                    {product.name}
                  </button>
                ))}
              </div>
            </div>

            {navLinks.filter(l => l.id !== 'home').map((link) => (
              <button
                key={link.name}
                onClick={() => handleNav(link.id)}
                className={`text-sm font-medium transition-colors ${currentPage === link.id ? 'text-brand-red' : 'text-brand-dark hover:text-brand-red'}`}
              >
                {link.name}
              </button>
            ))}
            <Button size="sm" variant="primary" withIcon onClick={() => handleNav('quote')}>
              Offerte
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-black focus:outline-none p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
          <div className="px-4 pt-2 pb-6 space-y-2">
            <button
              onClick={() => handleNav('home')}
              className={`block w-full text-left px-4 py-3 rounded-2xl text-base font-medium ${currentPage === 'home' ? 'bg-gray-100 text-black' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}
            >
              Home
            </button>

            {/* Mobile Products Section */}
            <div>
              <button
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className={`flex items-center justify-between w-full text-left px-4 py-3 rounded-2xl text-base font-medium ${currentPage.startsWith('producten-') ? 'bg-gray-100 text-black' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}
              >
                Producten
                <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isProductsOpen ? 'rotate-180' : ''}`} />
              </button>
              {isProductsOpen && (
                <div className="pl-4 mt-2 space-y-1">
                  {productLinks.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleNav(product.id)}
                      className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${currentPage === product.id ? 'text-brand-red' : 'text-gray-500'}`}
                    >
                      {product.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {navLinks.filter(l => l.id !== 'home').map((link) => (
              <button
                key={link.name}
                onClick={() => handleNav(link.id)}
                className={`block w-full text-left px-4 py-3 rounded-2xl text-base font-medium ${currentPage === link.id ? 'bg-gray-100 text-black' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}
              >
                {link.name}
              </button>
            ))}
            <div className="pt-4 px-4">
              <Button fullWidth onClick={() => handleNav('quote')}>Offerte Aanvragen</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;