/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Award, 
  ShieldCheck, 
  Scale, 
  Compass, 
  CheckCircle, 
  Building2, 
  Coins, 
  Sparkles, 
  CheckSquare, 
  HelpCircle,
  Phone,
  Bookmark
} from 'lucide-react';

interface SchemeGuideProps {
  onClose: () => void;
  initialTab?: 'central' | 'rajasthan';
  initialIndex?: number;
}

const CENTRAL_SCHEMES = [
  {
    title: 'PMEGP (Prime Minister Employment Generation Programme)',
    category: 'Self-Employment / New Startup',
    concession: '15% to 35% Capital margin money subsidy on project cost.',
    interestconcession: 'Normal bank interest rates apply, but core capital is highly subsidized.',
    limit: 'Up to ₹50 Lakhs for manufacturing; ₹20 Lakhs for service units.',
    docs: 'Detailed Project Report (DPR), Caste Certificate, Rural population certificate from Gram Panchayat, 8th pass certificate.',
    who: 'Proposed prospective entrepreneurs setting up brand-new micro enterprises.',
    procedure: 'Apply online on KVIC portal, select sponsoring agency (DIC/KVIC/KVIB), submit DPR, bank sanctions loan and claims margin money.'
  },
  {
    title: 'PMFME Scheme (Pradhan Mantri Formalisation of Micro Food Processing)',
    category: 'Agro & Food Processing',
    concession: 'Direct capital grant equal to 35% of eligible project outlays.',
    interestconcession: 'Eligible for 3% interest subvention under Agri Infrastructure Fund (AIF) integration.',
    limit: 'Capped at a maximum absolute value of ₹10 Lakhs.',
    docs: 'Udyam Certificate, FSSAI registration papers, machinery citations & quotation invoice, land deed / lease logs.',
    who: 'Micro food processing operators, flour/rice mills, cold storage setups, FPOs and Self-Help Groups.',
    procedure: 'Register on MoFPI PMFME portal, fill application with DPR and machinery quotes, District Resource Person (DRP) assists in bank liaison.'
  },
  {
    title: 'CGTMSE Security-Free Institutional Loans',
    category: 'Credit Guarantee / No Mortgage',
    concession: 'Eliminates the requirement of third-party collateral or property mortgage.',
    interestconcession: 'Preferential interest rate with concessions up to 1% to 1.5% from member banks.',
    limit: 'Guarantee coverage for terms loans & cash credits up to ₹5 Crores.',
    docs: 'Active Udyam Aadhaar, business credit proposal, audited balance sheet, 3-year bank projections.',
    who: 'New and existing micro/small units requiring institutional funding without mortgage collaterals.',
    procedure: 'Apply for loan at a CGTMSE Member Lending Institution (PSU banks, SIDBI) requesting zero-collateral coverage; bank handles back-end insurance approval.'
  },
  {
    title: 'Textile Upgradation (Amended TUFS / State Textile Policy)',
    category: 'Textiles & Garments',
    concession: '10% to 15% capital investment subsidy on purchase of benchmarked state-of-the-art machinery.',
    interestconcession: 'Up to 5% interest subvention on specified bank loans.',
    limit: 'Capped relative to multi-crore textile investments.',
    docs: 'Udyam certificate, machinery invoices, textile production license, chartered engineer certificate.',
    who: 'Existing/new weaving, spinning, and garment fabrication mills.',
    procedure: 'Apply on the i-TUFS portal within 1 year of machinery sanction; physical inspection matches benchmarked energy & output standards.'
  }
];

const RAJASTHAN_SCHEMES = [
  {
    title: 'RIPS 2024 (Rajasthan Investment Promotion Scheme)',
    category: 'Rajasthan Flagship Investment Policy',
    concession: 'Up to 35% Capital Subsidy on machinery OR Investment Subsidy of up to 75% State GST (SGST) refund for 7 years.',
    interestconcession: '5% interest subvention per annum for 5 years on term loans (interest subsidy increased to 7% for Women, SC/ST, and rural units).',
    limit: 'Up to ₹2.5 Crores for standard MSME; Up to ₹25 Crores for mega-scale setups.',
    docs: 'DPR, Bank loan sanction copy, Udyam Aadhaar, Land lease/purchase registry, Pollution Control Board NOC, CA asset certificate.',
    who: 'Newly proposed or existing MSMEs planning diversification/expansion within Rajasthan.',
    procedure: 'Apply on Rajasthan Single Window Portal (SSO ID) for RIPS Entitlement Certificate PRIOR to commencing commercial production. File annual subsidy claims online.',
    exemptions: '100% Exemption on Electricity Duty, Stamp Duty, Land Tax, and Mandi Tax for 7 years.'
  },
  {
    title: 'Rajasthan Trade & Export Promotion Policy',
    category: 'Trade, Freight & Warehousing Support',
    concession: 'Logistics Transport support: Up to 25% reimbursement on sea/air freight costs for landlocked state exporters. Market help of up to ₹2 Lakhs per exhibition.',
    interestconcession: '5% Interest subvention on bank term loans for trading & warehouse establishments.',
    limit: '₹15 Lakhs maximum logistics refund support per unit per year.',
    docs: 'Importer-Exporter Code (IEC), original freight bills of lading, export proof registration, warehouse electricity bills.',
    who: 'Wholesale traders, warehousing parks, logistics firms, and exporters of handicraft, stone, and garments.',
    procedure: 'Approach the DIC (District Industries Centre) with proof of export billing, transport invoice, and custom clearing certificates within 180 days of dispatch.'
  },
  {
    title: 'Vishwakarma Yuva Protsahan Yojana',
    category: 'Youth Micro Enterprise Startup Support',
    concession: '25% direct capital/machinery subsidy for youth-led business startups. Plus, a flat ₹5,000 free modern toolkit grant copy.',
    interestconcession: 'Interest-free or heavily subsidized loans with up to 8% state interest discount waiver on cooperative finance.',
    limit: 'Max project outlays of ₹5.00 Lakhs.',
    docs: 'Rajasthan Domicile certificate, Age proof (18 to 40 years), brief toolkit purchase quote, Aadhaar/SSO ID.',
    who: 'Young micro-entrepreneurs, craftsmen, and technical youths in Rajasthan setting up new workshops.',
    procedure: 'Log in on Raj-SSO Portal, apply under RSLDC/DIC Vishwakarma Yojana, select desired tools or micro fabrication machine, DIC credits the state grant to the machinery supplier.'
  },
  {
    title: 'Rajasthan Nari Shakti Yojana (Mahila Nidhi Support)',
    category: 'Female Entrepreneur Empowerment',
    concession: 'Up to 25% margin money / capital grant support on institutional project outlays.',
    interestconcession: 'Generous 8% interest subvention discount on business startup loans through Rajasthan Mahila Nidhi.',
    limit: 'Maximum loan limit of ₹40.00 Lakhs.',
    docs: 'Bonafide domicile of female promoter, Aadhaar, Partnership deed (proving 51%+ female equity ownership), Udyam MSME certificate.',
    who: 'Women entrepreneurs, female self-help groups, and majority female-owned partnerships/LLPs.',
    procedure: 'Apply through Rajeevika portal or nearest Rajasthan Cooperative Bank desk; profile is screened, and loan is released with automatic incorporated 8% interest discount.'
  },
  {
    title: 'Dalit Adiwasi Udyam Protsahan Yojana (Ambedkar Yojana)',
    category: 'Affirmative State Economic Plan (2022-26)',
    concession: 'Up to 25% margin money and capital grant (capped at ₹25.00 Lakhs). All loans are 100% collateral-free under Rajasthan cooperative credit guarantee.',
    interestconcession: 'Unprecedented 9% interest subsidy on loans up to ₹25 Lakhs; 7% interest subvention on loans up to ₹5 Crore; 6% on loans up to ₹10 Crore.',
    limit: 'Margin grant up to ₹25 Lakhs; Interest subvention extended up to ₹10 Crore loan value.',
    docs: 'Government Caste Certificate (SC/ST), Rajasthan domicile certificate, Detailed Project Report (DPR), Udyam Aadhaar.',
    who: 'SC or ST community entrepreneurs setting up manufacturing, service, or assembly units within Rajasthan.',
    procedure: 'File application on রাজSSO portal under Commissionerate of Industries; DIC validates caste credentials, sanctions the 25% margin money and initiates the 9% interest benefit directly.'
  }
];

export default function SchemeGuide({ onClose, initialTab = 'rajasthan', initialIndex = 0 }: SchemeGuideProps) {
  const [activeTab, setActiveTab] = useState<'central' | 'rajasthan'>(initialTab);
  const [activeSchemeIndex, setActiveSchemeIndex] = useState(initialIndex);

  const currentSchemesList = activeTab === 'rajasthan' ? RAJASTHAN_SCHEMES : CENTRAL_SCHEMES;
  const currentScheme = (currentSchemesList[activeSchemeIndex] || currentSchemesList[0]) as typeof RAJASTHAN_SCHEMES[0] & { exemptions?: string };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 rounded-3xl border border-slate-800 max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-blue-900/35">
        
        {/* Modal Header */}
        <div className="bg-slate-950 p-5 px-6 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shrink-0 border border-amber-400/30">
              <Scale className="h-5.5 w-5.5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm tracking-tight uppercase text-white">SubsidySetu Directory & Gazette</h3>
              <p className="text-[10px] text-slate-400 font-mono">Central Gazette & Rajasthan State Active Schemes (FY 2026-27)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
            id="btn-close-guide"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 shrink-0">
          <button
            onClick={() => {
              setActiveTab('rajasthan');
              setActiveSchemeIndex(0);
            }}
            className={`flex-1 py-4 text-xs font-bold tracking-wider transition-all uppercase border-b-2 flex items-center justify-center space-x-2 ${
              activeTab === 'rajasthan'
                ? 'border-amber-500 text-amber-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
            }`}
            id="btn-tab-rajasthan"
          >
            <span className="text-sm">🐫</span>
            <span>Rajasthan State Scheme Dashboard</span>
          </button>
          
          <button
            onClick={() => {
              setActiveTab('central');
              setActiveSchemeIndex(0);
            }}
            className={`flex-1 py-4 text-xs font-bold tracking-wider transition-all uppercase border-b-2 flex items-center justify-center space-x-2 ${
              activeTab === 'central'
                ? 'border-blue-500 text-blue-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'
            }`}
            id="btn-tab-central"
          >
            <span className="text-sm">🏛️</span>
            <span>Central Government Policies</span>
          </button>
        </div>

        {/* Modal Body / Widescreen Split Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* LEFT PANEL: Scheme Cards list (approx 5 cols) */}
          <div className="lg:col-span-5 border-r border-slate-800 bg-slate-950/20 overflow-y-auto p-4 space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block px-1 py-1">
              Select Policy Scheme Checklist ({currentSchemesList.length})
            </span>

            {currentSchemesList.map((scheme, idx) => {
              const isSelected = activeSchemeIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveSchemeIndex(idx)}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none text-left group relative ${
                    isSelected
                      ? 'bg-slate-800/90 border-amber-500/80 shadow-md shadow-amber-500/5 translate-x-1'
                      : 'bg-slate-900/40 border-slate-800 hover:border-blue-500/60 hover:bg-slate-800/40'
                  }`}
                  id={`side-scheme-tab-${idx}`}
                >
                  {/* Saffron or Blue border highlight line when selected */}
                  {isSelected && (
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-amber-500 rounded-l-2xl"></div>
                  )}

                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[9px] font-mono font-bold text-slate-400 tracking-wider uppercase">
                      {scheme.category}
                    </span>
                    <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded font-mono ${
                      activeTab === 'rajasthan' 
                        ? 'bg-amber-950/60 text-amber-400 border border-amber-800/30' 
                        : 'bg-blue-950/60 text-blue-400 border border-blue-800/30'
                    }`}>
                      ACTIVE
                    </span>
                  </div>

                  
                  <h4 className={`text-xs font-bold font-display mt-2 transition duration-200 ${
                    isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  }`}>
                    {scheme.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-1">
                    {scheme.concession}
                  </p>
                </div>
              );
            })}

            {/* Helpline quick widget inside list column */}
            <div className="pt-4 mt-2">
              <div className="bg-slate-950/50 border border-slate-800/60 p-4 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                  <Phone className="h-3 w-3 text-emerald-400 animate-pulse" />
                  <span>Physical Filing Support</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Need custom Chartered Accountant review for DPR proposals? 
                </p>
                <a
                  href="tel:8741009775"
                  className="block text-center bg-slate-900 border border-slate-800 text-white hover:text-emerald-400 hover:border-emerald-500 hover:bg-emerald-950/20 text-xs font-bold py-2 rounded-xl transition duration-300 shadow-md"
                  id="modal-quick-call-cta"
                >
                  Call +91 8741009775
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Dynamic detailed breakdown of selected scheme (8 cols) */}
          <div className="lg:col-span-7 bg-slate-900 overflow-y-auto p-6 md:p-8 space-y-6">
            
            {/* Active Scheme Header */}
            <div className="border-b border-slate-800 pb-5 space-y-2.5">
              <span className="bg-linear-to-r from-amber-500/20 to-blue-500/20 text-slate-300 border border-slate-705 p-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-widest font-mono">
                🔍 Active Policy Gazette Review
              </span>
              <h2 className="text-lg sm:text-xl font-display font-extrabold text-white leading-snug">
                {currentScheme.title}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                {currentScheme.category} category guidelines registered in the state finance and investment department.
              </p>
            </div>

            {/* Quick Slices details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Subsidy grant concession */}
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all duration-300 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-1 bg-gradient-to-l from-emerald-500 to-transparent"></div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                  💰 Subsidy / Grant Concession
                </span>
                <p className="text-xs text-white font-semibold leading-relaxed">
                  {currentScheme.concession}
                </p>
              </div>

              {/* Interest Waiver / Concession */}
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all duration-300 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-1 bg-gradient-to-l from-blue-500 to-transparent"></div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-1">
                  📈 Interest Waiver Benefit
                </span>
                <p className="text-xs text-white font-semibold leading-relaxed">
                  {currentScheme.interestconcession}
                </p>
              </div>



              {/* Specific tax exemption features */}
              {currentScheme.exemptions && (
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 hover:border-purple-500/30 transition-all duration-300 shadow-sm col-span-1 md:col-span-2 relative overflow-hidden group">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block mb-1.5">
                    ⚡ Tax Exemptions & State reliefs (RIPS Bonus)
                  </span>
                  <p className="text-xs text-white font-medium leading-relaxed">
                    {currentScheme.exemptions}
                  </p>
                </div>
              )}
            </div>

            {/* Target Audience / Who matches */}
            <div className="bg-slate-950/30 p-4 rounded-2xl border border-slate-800/80 space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                👥 Target Audience Eligibility
              </span>
              <p className="text-xs text-slate-300 leading-relaxed pr-2">
                {currentScheme.who}
              </p>
            </div>

            {/* Critical checklist */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <CheckSquare className="h-3.5 w-3.5 text-amber-500" />
                Mandatory Documentation Checklist
              </span>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {currentScheme.docs}
              </div>
            </div>

            {/* Procedure guide */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <Compass className="h-3.5 w-3.5 text-blue-400" />
                Filing Procedure Timeline
              </span>
              <p className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/60 text-xs text-slate-300 leading-relaxed">
                {currentScheme.procedure}
              </p>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 p-4 px-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
          <div className="flex items-center space-x-2 text-[10px] text-slate-400 tracking-wider">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
            <span>Secure Gazette Sync Active • SubsidySetu</span>
          </div>
          <button
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-450 text-slate-950 text-xs font-black px-8 py-3 rounded-xl transition duration-150 tracking-wider shadow-md uppercase"
            id="btn-close-guide-footer"
          >
            Acknowledge Guidelines
          </button>
        </div>
      </div>
    </div>
  );
}
