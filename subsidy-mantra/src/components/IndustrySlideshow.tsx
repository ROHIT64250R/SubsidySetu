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
      image: solarImg,
      title: 'Commercial Solar & Power Integration Plants',
      description: 'Accelerated tax depreciation with optimized grid setups for factory roof projects.',
      industryVal: 'renewable_solar',
      tag: 'MNRE Rooftop Policy',
      benefits: 'Accelerated 40% tax depreciation allowance + Net-metering local DISCOM concessions.'
    },
    {
      id: 'textile',
      image: textileImg,
      title: 'Automated Textile & Spinning Machinery',
      description: 'High-speed weaving, spinning mills, and composite garment processing lines.',
      industryVal: 'textiles',
      tag: 'CLCSS & State TUF Alternatives',
      benefits: '15% upfront capital subsidy + Stamp duty concessions up to 100% on machinery land.'
    },
    {
      id: 'engineering',
      image: engineeringImg,
      title: 'Heavy Engineering & Metal Fabrication',
      description: 'CNC workshops, laser cutting plants, automated toolings, and structured forgings.',
      industryVal: 'manufacturing',
      tag: 'CGTMSE & RIPS Support',
      benefits: 'Collateral-free CGTMSE bank credit protection up to ₹5 Crore limit.'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
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
    <section className="bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800 p-5 md:p-6 space-y-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#ffb01f] uppercase flex items-center gap-1.5">
            <Factory className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
            Active Industrial Sectors Showcase
          </span>

          <h3 className="text-xl font-extrabold text-white">
            Real Physical Setup & Machinery Environments
          </h3>

          <p className="text-xs text-slate-400">
            Swipe or use controls to review verified industrial setups.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800"
          >
            <ChevronLeft className="h-4 w-4 text-slate-400" />
          </button>

          <button
            onClick={handleNext}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800"
          >
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Slider */}
      <div className="relative h-[250px] sm:h-[350px] rounded-2xl overflow-hidden">

        <img
          src={slides[currentIndex].image}
          alt={slides[currentIndex].title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 inset-x-0 p-5 md:p-8 flex flex-col gap-3">

          <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded-full w-fit">
            {slides[currentIndex].tag}
          </span>

          <h4 className="text-white font-bold text-lg">
            {slides[currentIndex].title}
          </h4>

          <p className="text-slate-200 text-xs">
            {slides[currentIndex].description}
          </p>

          <p className="text-emerald-400 text-xs">
            {slides[currentIndex].benefits}
          </p>

          <button
            onClick={() => onSelectIndustry(slides[currentIndex].industryVal)}
            className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold w-fit flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Select Industry
          </button>
        </div>

        {/* Dots */}
        <div className="absolute top-3 right-3 flex gap-1">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 w-2 rounded-full ${
                idx === currentIndex ? 'bg-yellow-400 w-4' : 'bg-gray-500'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
