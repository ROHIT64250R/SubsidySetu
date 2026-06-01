/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Smartphone,
  MessageCircle,
  Instagram,
  Search,
  HelpCircle,
  Sparkles,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  onShowHelp: () => void;
  onOpenChat: () => void;
  onSelectService?: (serviceName: string) => void;
  currentView?: 'home' | 'blog';
  onNavigate?: (view: 'home' | 'blog') => void;
}

export default function Header({ onShowHelp, onOpenChat, onSelectService, currentView = 'home', onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const handleNavClick = (view: 'home' | 'blog', sectionId?: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onNavigate) {
      onNavigate(view);
    }
    if (view === 'home') {
      if (sectionId) {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full z-45 sticky top-0 shadow-xl select-none" id="main-nav-header">
      {/* Upper info ribbon matching client screenshot style */}
      <div className="bg-[#0f172a] text-slate-300 border-b border-slate-800 text-[11px] py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          {/* Physical Address */}
          <div className="flex items-center gap-2 cursor-pointer hover:text-white transition">
            <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span className="font-bold tracking-normal text-[11px] sm:text-xs">
              B-1, C-2 KRISHNA ENCLAVE, LATA NAGAR (NEAR BURGER FARM), KALWAR ROAD, JHOTWARA, JAIPUR
            </span>
          </div>

          {/* Contact Numbers and Social Bar */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex flex-wrap items-center gap-4 font-mono">
              <a href="tel:+918741009775" className="flex items-center gap-1 hover:text-amber-400 transition">
                <Phone className="h-3.5 w-3.5 text-blue-400" />
                <span>+91 8741009775</span>
              </a>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <a href="tel:+918619464250" className="flex items-center gap-1 hover:text-amber-400 transition">
                <Phone className="h-3.5 w-3.5 text-amber-500" />
                <span>+91 8619464250</span>
              </a>
            </div>

            {/* Social Icons band matching client setup */}
            <div className="flex items-center gap-3 border-l border-slate-700 pl-4">
              <a 
                href="https://wa.me/918741009775" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-400 hover:text-green-500 transition-colors flex items-center gap-1"
                title="Contact us on WhatsApp"
                id="header-whatsapp-link"
              >
                <MessageCircle className="h-3.5 w-3.5" />
              </a>
              <a 
                href="https://www.instagram.com/completesolution0_/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-400 hover:text-pink-500 transition-colors"
                id="header-instagram-link"
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation belt */}
      <div className="bg-white border-b border-slate-200 text-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-20">
          
          {/* Cohesive Brand Logo with Badge */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 p-2 py-2.5 px-4 rounded-xl border border-blue-500/20 shadow-md flex items-center shrink-0">
              <div className="flex flex-col items-center">
                <span className="text-sm font-black font-mono tracking-widest text-amber-500 leading-none">SUBSIDY</span>
                <span className="text-[9px] font-bold tracking-widest text-white italic leading-none uppercase">setu</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-1.5">
                <span className="font-sans text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-1.5 py-0.5 rounded font-extrabold tracking-widest uppercase">
                  ACTIVE AGENT
                </span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Government Subsidy Advisors</p>
            </div>
          </div>

          {/* Central Directory Menu - Navigation list matching client query exactly */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-widest text-slate-600">
            <a
              href="#"
              onClick={(e) => handleNavClick('home', undefined, e)}
              className={`py-1 transition-all ${
                currentView === 'home'
                  ? 'text-[#1e3a8a] border-b-2 border-amber-500 font-extrabold'
                  : 'hover:text-amber-500 text-slate-600'
              }`}
            >
              Home
            </a>
            <a
              href="#about-section_hub"
              onClick={(e) => handleNavClick('home', 'about-section_hub', e)}
              className="hover:text-amber-500 transition"
            >
              About
            </a>
            <div 
              className="relative py-1"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <a
                href="#services-section_hub"
                onClick={(e) => handleNavClick('home', 'services-section_hub', e)}
                className="hover:text-amber-500 transition flex items-center gap-1 cursor-pointer"
              >
                <span>Services</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </a>

              {/* Hover Dropdown Menu matching client snapshot */}
              {servicesDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-left animate-fadeIn"
                  id="services-hover-dropdown"
                >
                  <div className="py-1">
                    {[
                      "Industrial Subsidy Scheme In Rajasthan",
                      "Vishwakarma Yuva Laghu Udyog Protsahan Yojana",
                      "Backward And Regional Upliftment Programme For Youth(BRUPY Yojana)",
                      "Loan & Finance Consultant In Rajasthan",
                      "PMEGP"
                    ].map((srv, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          setServicesDropdownOpen(false);
                          if (onNavigate) {
                            onNavigate('home');
                          }
                          if (onSelectService) {
                            onSelectService(srv);
                          }
                        }}
                        className="w-full text-left block px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition border-b border-slate-100 last:border-0 font-sans font-semibold text-xs leading-normal normal-case tracking-normal"
                      >
                        {srv}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <a
              href="#blog-section_hub"
              onClick={(e) => handleNavClick('blog', undefined, e)}
              className={`py-1 transition-all ${
                currentView === 'blog'
                  ? 'text-[#1e3a8a] border-b-2 border-amber-500 font-extrabold'
                  : 'hover:text-amber-500 text-slate-600'
              }`}
            >
              Blog
            </a>
            <a
              href="#reviews-section_hub"
              onClick={(e) => handleNavClick('home', 'reviews-section_hub', e)}
              className="hover:text-amber-500 transition"
            >
              Reviews
            </a>
            <a
              href="#contact-section_hub"
              onClick={(e) => handleNavClick('home', 'contact-section_hub', e)}
              className="hover:text-amber-500 transition"
            >
              Contact
            </a>
          </nav>

          {/* Functional widgets (Help and Consultation Actions) */}
          <div className="hidden sm:flex items-center space-x-3.5">
            <button
              onClick={onShowHelp}
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 duration-150 p-2.5 px-4 rounded-xl border border-slate-200 transition flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider"
              id="header-directory-trigger"
            >
              <HelpCircle className="h-4.5 w-4.5 text-blue-600" />
              <span>Gazette Guide</span>
            </button>

            <button
              onClick={onOpenChat}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition duration-300 text-xs uppercase tracking-widest flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-500/10"
              id="header-consultation-trigger"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Consult CA AI</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onOpenChat}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 p-2 rounded-lg text-xs"
              title="Speak with AI Nodal Desk"
            >
              <Sparkles className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
              id="mobile-nav-toggle-btn"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-205 px-5 py-6 space-y-4 text-left">
          <div className="flex flex-col space-y-3.5 text-xs font-bold uppercase tracking-widest text-slate-700">
            <a
              href="#"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleNavClick('home', undefined, e);
              }}
              className="text-blue-800 hover:text-amber-500 transition py-1"
            >
              Home
            </a>
            <a
              href="#about-section_hub"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleNavClick('home', 'about-section_hub', e);
              }}
              className="hover:text-amber-500 transition py-1"
            >
              About
            </a>
            <div>
              <button
                type="button"
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="w-full text-left flex items-center justify-between hover:text-amber-500 transition py-1 text-xs font-bold uppercase tracking-widest text-slate-700"
              >
                <span>Services</span>
                <ChevronDown className={`h-3 w-3 text-slate-500 transform transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileServicesOpen && (
                <div className="pl-3 mt-2 border-l border-slate-200 flex flex-col space-y-2.5">
                  {[
                    "Industrial Subsidy Scheme In Rajasthan",
                    "Vishwakarma Yuva Laghu Udyog Protsahan Yojana",
                    "Backward And Regional Upliftment Programme For Youth(BRUPY Yojana)",
                    "Loan & Finance Consultant In Rajasthan",
                    "PMEGP"
                  ].map((srv, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        setMobileServicesOpen(false);
                        setMobileMenuOpen(false);
                        if (onNavigate) {
                          onNavigate('home');
                        }
                        if (onSelectService) {
                          onSelectService(srv);
                        }
                      }}
                      className="text-left text-xs text-slate-600 hover:text-blue-800 transition py-1 font-semibold leading-normal normal-case tracking-normal"
                    >
                      • {srv}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <a
              href="#blog-section_hub"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleNavClick('blog', undefined, e);
              }}
              className="hover:text-amber-500 transition py-1"
            >
              Blog
            </a>
            <a
              href="#reviews-section_hub"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleNavClick('home', 'reviews-section_hub', e);
              }}
              className="hover:text-amber-500 transition py-1"
            >
              Reviews
            </a>
            <a
              href="#contact-section_hub"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleNavClick('home', 'contact-section_hub', e);
              }}
              className="hover:text-amber-500 transition py-1"
            >
              Contact
            </a>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onShowHelp();
              }}
              className="w-full text-center bg-slate-50 border border-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <HelpCircle className="h-4 w-4 text-blue-600" />
              <span>Gazette Guide</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChat();
              }}
              className="w-full text-center bg-amber-500 text-slate-950 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Consult CA AI</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
