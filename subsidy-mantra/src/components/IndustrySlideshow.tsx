/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import foodImg from '../assets/images/food_processing_setup_1780296534874.png';
import solarImg from '../assets/images/solar_factory_roof_1780296553621.png';
import textileImg from '../assets/images/textiles_spinning_machinery_1780296572046.png';
import engineeringImg from '../assets/images/heavy_engineering_workshop_1780296592903.png';
import { ChevronLeft, ChevronRight, Eye, ShieldCheck, Factory } from 'lucide-react';

interface SlideItem {
  id: string;
  image: string;
  title: string;
  description: string;
  industryVal: string;
  tag: string;
  benefits: string;
}

interface IndustrySlideshowProps {
  onSelectIndustry: (val: string) => void;
}

export default function IndustrySlideshow({ onSelectIndustry }: IndustrySlideshowProps) {
  const slides: SlideItem[] = [
    {
      id: 'food',
      image: foodImg,
      title: 'Food Processing & Cold Storage Facilities',
      description: 'Support for modern flour mills, organic packaging, and solar cold chain units.',
      industryVal: 'food_processing',
      tag: 'PMFME & Agro Schemes',
      benefits: '35% capital subsidy benefits + State electricity duty exemptions for 7 years.'
    },
    {
      id: 'solar',
      image: foodImg
      title: 'Commercial Solar & Power Integration Plants',
      description: 'Accelerated tax depreciation with optimized grid setups for factory roof projects.',
      industryVal: 'renewable_solar',
      tag: 'MNRE Rooftop Policy',
      benefits: 'Accelerated 40% tax depreciation allowance + Net-metering local DISCOM concessions.'
    },
    {
      id: 'textile',
      image: '/src/assets/images/textiles_spinning_machinery_1780296572046.png',
      title: 'Automated Textile & Spinning Machinery',
      description: 'High-speed weaving, spinning mills, and composite garment processing lines.',
      industryVal: 'textiles',
      tag: 'CLCSS & State TUF Alternatives',
      benefits: '15% upfront capital subsidy + Stamp duty concessions up to 100% on machinery land.'
    },
    {
      id: 'engineering',
      image: '/src/assets/images/heavy_engineering_workshop_1780296592903.png',
      title: 'Heavy Engineering & Metal Fabrication',
      description: 'CNC workshops, laser cutting plants, automated toolings, and structured forgings.',
      industryVal: 'manufacturing',
      tag: 'CGTMSE & RIPS Support',
      benefits: 'Collateral-free CGTMSE bank credit protection up to ₹5 Crore limit.'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide effect every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800 p-5 md:p-6 space-y-4" id="services-section_hub">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#ffb01f] uppercase flex items-center gap-1.5">
            <Factory className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
            Active Industrial Sectors Showcase
          </span>
          <h3 className="text-xl font-display font-extrabold text-white leading-tight">
            Real Physical Setup & Machinery Environments
          </h3>
          <p className="text-xs text-slate-400">
            Swipe or use controls to review verified industrial configurations eligible for direct state filing support.
          </p>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex items-center space-x-1.5 self-end sm:self-center">
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition duration-150"
            title="Previous Setup"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition duration-150"
            title="Next Setup"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Carousel stage */}
      <div className="relative h-[250px] sm:h-[350px] rounded-2xl overflow-hidden group shadow-lg border border-slate-850">
        {/* Background Image with Ken Burns effect class */}
        <img
          src={slides[currentIndex].image}
          alt={slides[currentIndex].title}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 scale-[1.01] group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        
        {/* Deep stylized gradient overlay for cinematic readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />

        {/* Content details overlay */}
        <div className="absolute bottom-0 inset-x-0 p-5 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2 max-w-xl text-left">
            <span className="bg-[#ffb01f]/90 text-slate-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
              {slides[currentIndex].tag}
            </span>
            <h4 className="text-base sm:text-xl font-display font-black text-white tracking-tight drop-shadow-sm leading-snug">
              {slides[currentIndex].title}
            </h4>
            <p className="text-xs text-slate-200 line-clamp-2 md:line-clamp-none font-medium leading-relaxed drop-shadow-sm">
              {slides[currentIndex].description}
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold pt-1">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span className="leading-tight drop-shadow-sm font-sans">{slides[currentIndex].benefits}</span>
            </div>
          </div>

          {/* Quick Select Trigger Button */}
          <button
            onClick={() => onSelectIndustry(slides[currentIndex].industryVal)}
            className="bg-white hover:bg-amber-400 hover:text-slate-950 text-slate-900 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider shrink-0 transition duration-300 flex items-center justify-center space-x-1.5 shadow-xl hover:-translate-y-0.5 group/btn"
          >
            <Eye className="h-3.5 w-3.5 transition duration-200 group-hover/btn:scale-110" />
            <span>Select Industry</span>
          </button>
        </div>

        {/* Indicator dots navigation */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1.5 py-1 px-2.5 rounded-full z-10 border border-white/5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-[#ffb01f] w-3.5' : 'bg-slate-500 hover:bg-slate-300'
              }`}
              title={`Jump to setup ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
