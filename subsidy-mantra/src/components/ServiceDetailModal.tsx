/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Building, 
  Sparkles, 
  TrendingUp, 
  Coins, 
  ShieldCheck, 
  Phone, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  Info,
  Layers,
  Award,
  BookOpen,
  Send
} from 'lucide-react';

interface ServiceDetailModalProps {
  serviceName: string;
  onClose: () => void;
  onOpenChat?: () => void;
}

const SERVICES_DATA = [
  {
    id: 'industrial-rajasthan',
    title: 'Industrial Subsidy Scheme In Rajasthan',
    shorthand: 'RIPS 2024 / State GST concessions',
    icon: Building,
    themeColor: 'blue',
    badge: 'RIPS 2024 Flagship',
    intro: 'The Rajasthan Investment Promotion Scheme (RIPS 2024) is the grand flagship policy of the Rajasthan State Government. It is designed to maximize capital savings and provide long-term sustainable reliefs on commercial taxation for prospective manufacturers setting up factories anywhere in Rajasthan.',
    subsidies: [
      { label: 'Capital Machine Subsidy', value: 'Up to 35% reimbursement on benchmarked machinery purchases.' },
      { label: 'State GST (SGST) Refund', value: 'Up to 75% reimbursement of SGST deposited for 7 consecutive years.' },
      { label: 'Interest Waiver', value: '5% interest subvention per annum on term credits (increases to 7% for Special Categories).' },
      { label: 'Additional Direct Exemptions', value: '100% Exemption on Electricity Duty, Stamp Duty, Land Tax, and Mandi Tax for 7 years.' }
    ],
    eligibility: [
      'Newly proposed MSME manufacturing units in Rajasthan.',
      'Existing units engaging in formal expansion or machinery diversification (minimum 25% incremental asset value).',
      'The company must hold an active Udyam Registration and Rajasthan industrial land-allotment/lease clearance.',
      'Not falling in the Negative List of industries (e.g. tobacco, liquor, highly hazardous chemical setups).'
    ],
    documents: [
      'Comprehensive Detailed Project Report (DPR)',
      'Bank Loan Sanction Letter with Term Loan repayment schedule',
      'Active MSME Udyam Registration Certificate',
      'Land allotment letter / registered lease deed logs',
      'No Objection Certificate (NOC) from State Pollution Control Board',
      'Chartered Engineer certified machinery layout & quotation invoices',
      'CA Audit Statement verifying capital investment in fixed assets'
    ],
    procedure: [
      { step: '1', title: 'Single Window Setup', desc: 'Secure an active Raj-SSO ID and apply for a provisional Entitlement Certificate on the Rajasthan Single Window Portal before starting physical production.' },
      { step: '2', title: 'Asset Investment & Audit', desc: 'Settle the plant site, install specified energy-efficient/benchmarked machines, and compile CA Asset certificates.' },
      { step: '3', title: 'Physical Field Inspection', desc: 'DIC (District Industries Centre) team maps coordinates & validates physical machine operation matches matching specifications.' },
      { step: '4', title: 'Certificate Release & Claims', desc: 'DIC issues the official RIPS Entitlement certificate. Submit the annual tax/GST bills to activate direct cashback transfers.' }
    ],
    expertTip: 'Always register under the Single Window portal BEFORE starting any physical site installation or commercial production. Backdated investments are highly scrutinized and might lose out on the 100% Stamp Duty exemption benefits!'
  },
  {
    id: 'vishwakarma-yojana',
    title: 'Vishwakarma Yuva Laghu Udyog Protsahan Yojana',
    shorthand: 'Youth Startups & Toolkit matching',
    icon: Sparkles,
    themeColor: 'amber',
    badge: 'Youth & Self-Employment',
    intro: 'This specialized scheme is formulated by the Governor & state agencies to foster innovative, local micro-enterprises. It directly addresses young, energetic local residents of Rajasthan, encouraging them to establish workshops, small-scale machinery setups, and high-efficiency tooling centers locally, thereby eliminating the need to migrate to major metro hubs.',
    subsidies: [
      { label: 'Direct Machinery Grant', value: '25% outright capital subsidy on the verified cost of production machinery.' },
      { label: 'Free Work Tool Allocation', value: 'Flat grant of ₹5,000 for purchasing state-of-the-art diagnostic hand tools.' },
      { label: 'Cooperative Credit Discount', value: 'Up to 8% state interest discount waiver on micro-loans obtained via cooperative banks.' },
      { label: 'Mortgage & Collateral Exemption', value: 'No physical asset or property mortgage is demanded for cooperative loans up to limit.' }
    ],
    eligibility: [
      'Promoter must be a Bonafide Domicile holder of Rajasthan.',
      'Age limit must be strictly between 18 to 40 years at the date of submit.',
      'Total estimated project cost must not exceed ₹5.00 Lakhs.',
      'Targeted toward micro-manufacturing workshops, artisan operations, composite agro units, and precision engineering counters.'
    ],
    documents: [
      'Bonafide Rajasthan Domicile Certificate',
      'Age credentials (10th Board Certificate or Birth certificate)',
      'Interactive micro-project cost sheet (mock business bill)',
      'Aadhaar Card and SSO ID sync logs',
      'Pro-forma quotation invoice for requested machinery from certified vendors'
    ],
    procedure: [
      { step: '1', title: 'SSO Portal App', desc: 'Log on to the Raj-SSO Portal, navigate to the RSLDC/DIC Vishwakarma Yojana interface, and populate the application form.' },
      { step: '2', title: 'DIC Approval', desc: 'The General Manager of your local DIC screens the tool specifications and clears the application within 14 working days.' },
      { step: '3', title: 'Fund & Tool Credit', desc: 'Cooperative funds are disbursed directly to your bank account, and the machinery subsidy is credited directly to the authorized machine supplier.' }
    ],
    expertTip: 'Ensure your machinery quotations are from GST-registered dealers with active state tax numbers. It guarantees rapid clearance without any DIC technical queries.'
  },
  {
    id: 'brupy-yojana',
    title: 'Backward And Regional Upliftment Programme For Youth (BRUPY Yojana)',
    shorthand: 'Rural & Remote Area enterprise funding',
    icon: TrendingUp,
    themeColor: 'emerald',
    badge: 'Regional Development',
    intro: 'BRUPY Yojana targets the socio-economic empowerment of youths in designated backward regions, remote border subdivisions, and tribal pockets across Rajasthan. By injecting capital margin support and bank credit guarantees directly into these rural sectors, it drives the creation of sustainable cottage, fabrication, and agro-processing businesses.',
    subsidies: [
      { label: 'Rural Margin Money Grant', value: 'Up to 25% soft capital margin subsidy of the total approved project cost.' },
      { label: 'Low Personal Contribution', value: 'Promoters personal equity margin requirement reduced to a humble 5%.' },
      { label: 'Direct Interest Relief', value: '6% to 8% compound annual interest waiver on designated commercial bank loans.' },
      { label: 'Secured Collateral-Free Cover', value: '100% credit guarantee protection under State Cooperative networks (no mortgage required).' }
    ],
    eligibility: [
      'Must reside permanently inside notified backward subdivisions / remote tehsils of Rajasthan.',
      'Valid SC/ST, minority, or rural category certificates (offers enhanced benefits).',
      'Applies to proposed new setups in the manufacturing or service sectors.',
      'Max project limit up to ₹25 Lakhs.'
    ],
    documents: [
      'Bonafide Resident Certificate verified by local Tehsildar',
      'Category certification (if claiming SC/ST or special backward benefits)',
      'Brief technical feasibility business outline',
      'Gram Panchayat Land usage NOC or physical site coordinates',
      'Bank savings statements and PAN documentation'
    ],
    procedure: [
      { step: '1', title: 'Regional DIC Filing', desc: 'Submit the proposal booklet to the local district DIC coordinator for local demographic mapping and feasibility assessment.' },
      { step: '2', title: 'Subdivisional Allocation', desc: 'The screening panel endorses the rural grant margin, sending direct clearance orders to the nominated regional public sector bank.' },
      { step: '3', title: 'Direct Credit Release', desc: 'The cooperative or state bank triggers the loan release. The 25% state margin is safely placed as a back-end interest-free lock-in deposit.' }
    ],
    expertTip: 'If your unit is located within a rural cluster, obtain a clear population certificate from the local Gram Panchayat Secretary. This simple document is the master key to claiming the highest margin money tier without administrative friction!'
  },
  {
    id: 'loan-advisory',
    title: 'Loan & Finance Consultant In Rajasthan',
    shorthand: 'Machinery loans & statutory DPR compilation',
    icon: Coins,
    themeColor: 'indigo',
    badge: 'Professional Consultancy',
    intro: 'Securing a bank term loan and syncing state subsidies demands robust financial accounting, realistic cash-flow projections, and prompt compliance clearance. We act as your specialized Chartered Financial Advisory Desk, bridging the gap between your on-ground industrial site requirements and rigid institutional lending parameters.',
    subsidies: [
      { label: 'DPR & CMA Mastery', value: 'Bankable Detailed Project Reports outlining CMA data matching modern credit-worthiness indexes.' },
      { label: 'CGTMSE Security-Free Mapping', value: 'Structure loans up to ₹5 Crores under central CGTMSE protection to eliminate personal mortgages.' },
      { label: 'SIDBI Nodal Liaisons', value: 'Direct pathways to long-term low-interest industrial term capital under tech-upgradation policies.' },
      { label: 'Refinance Rate Audit', value: 'Identify cheaper commercial bank alternatives and interest subvention opportunities.' }
    ],
    eligibility: [
      'New industrial promoters requiring term machinery credits or liquid working capital lines.',
      'Existing factories planning plant automation, building development, or solar roof installations.',
      'Minimum commercial enterprise project value of ₹10 Lakhs (no maximum cap).',
      'Requires a clean clean CIBIL score (preferably 700+) with no active defaults on business credit.'
    ],
    documents: [
      '3 Years Audited Financial Balance Sheets (for existing units)',
      'Detailed site land conversion layout (90A order or RIICO lease deeds)',
      'Valid machinery quotes matching verified vendor performance credentials',
      '6 Months active bank transaction statements',
      'Entity KYC (Partnership, LLP or Pvt Ltd registration certificates)'
    ],
    procedure: [
      { step: '1', title: 'Technical Intake Session', desc: 'Our chief consultant, Yogesh Sharma, assesses your physical machinery quote values and structures potential borrowing capacities.' },
      { step: '2', title: 'CMA Data Assembly', desc: 'Our qualified CA desk prepares the statutory DPR compilation with realistic balance sheet projections and debt-service indicators (DSCR).' },
      { step: '3', title: 'Bank Presentation & Liaison', desc: 'We represent your loan file at nationalized banks, SIDBI, or cooperative institutions to defend cash flow algorithms.' },
      { step: '4', title: 'Credit & Grant Synchronization', desc: 'Once credit is sanctioned, we index the files on MSME subsidy portals to ensure interest waivers auto-activate immediately.' }
    ],
    expertTip: 'Never inflate machinery quotations! Commercial bank credit cells compare invoices against standard manufacturer market rates. Keep invoices realistic, and let SubsidySetu build a solid cash flow case to ensure a swift approvals!'
  },
  {
    id: 'pmegp-central',
    title: 'PMEGP (Prime Minister\'s Employment Generation Programme)',
    shorthand: 'Prime Minister\'s Employment Generation',
    icon: ShieldCheck,
    themeColor: 'purple',
    badge: 'Central Govt Flagship',
    intro: 'PMEGP is a highly successful central government flagship credit-linked subsidy scheme administered by the Ministry of MSME through KVIC (Khadi and Village Industries Commission). It provides massive financial cushions in the form of capital margin money cashback, designed to stimulate self-employment in rural and urban sectors alike.',
    subsidies: [
      { label: 'Urban Capital Subsidy', value: '15% for General category; 25% for Special Categories (Women, OBC, SC/ST, Minorities).' },
      { label: 'Rural Capital Subsidy', value: '25% for General category; 35% for Special Categories (OBC, SC/ST, Women, rural residents).' },
      { label: 'Promoter Equity', value: 'General category contributes just 10% cash; Special categories contribute only 5% of project cost.' },
      { label: 'Limit Scope', value: 'Up to ₹50 Lakhs limit for manufacturing projects; Up to ₹20 Lakhs limit for service businesses.' }
    ],
    eligibility: [
      'Any individual promoter above 18 years of age.',
      'No minimum educational requirement for projects below ₹10 Lakhs (Manufacturing) or ₹5 Lakhs (Service). Must hold an 8th Class Pass certificate for projects exceeding these thresholds.',
      'Only applicable for brand-new manufacturing or service startup proposals.',
      'Self-Help Groups, co-operative societies, and registered charitable trusts are also fully eligible.'
    ],
    documents: [
      'Detailed Project Report (DPR) formatted to KVIC metrics',
      'Aadhaar Card with active mobile number linked',
      'Educational certificate proof (8th Class pass or higher)',
      'Rural/Gram Panchayat population certificate (highly critical for rural 35% tier)',
      'Caste certificate issued by competent authority (OBC, SC, ST etc)'
    ],
    procedure: [
      { step: '1', title: 'Online Portal Submit', desc: 'Fill the official PMEGP online application on the KVIC e-portal. Carefully select sponsoring agency (e.g. DIC or KVIC) based on region.' },
      { step: '2', title: 'Agency Screening', desc: 'The District level Task Force Committee (DLTFC) screens credentials, interviews the applicant, and forwards the file to the active partner bank.' },
      { step: '3', title: 'Disbursement & Training', desc: 'Bank sanctions the term loan and credit limits. Applicant undertakes a mandatory EDP (Entrepreneurship Development Programme) e-learning course.' },
      { step: '4', title: 'Margin Money Release', desc: 'KVIC deposits the margin money in your bank account, which is locked in for 3 years, after which it adjusts against your loan balance.' }
    ],
    expertTip: 'A Gram Panchayat rural certificate is mandatory to claim the upper 35% margin subsidy, even if your local region appears rural. Make sure to procure it beforehand from your Sarpanch or Gram Sevak!'
  }
];

export default function ServiceDetailModal({ serviceName, onClose, onOpenChat }: ServiceDetailModalProps) {
  // Find which service match was requested
  const matchedIndex = SERVICES_DATA.findIndex(s => 
    s.title.toLowerCase().includes(serviceName.toLowerCase()) || 
    serviceName.toLowerCase().includes(s.title.toLowerCase()) ||
    s.id.toLowerCase().includes(serviceName.toLowerCase()) ||
    serviceName.toLowerCase().includes(s.id.toLowerCase())
  );

  const [activeIdx, setActiveIdx] = useState(matchedIndex !== -1 ? matchedIndex : 0);
  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'docs' | 'steps'>('overview');

  const currentSrv = SERVICES_DATA[activeIdx];
  const IconComponent = currentSrv.icon;

  const [contactForm, setContactForm] = useState({ name: '', phone: '', city: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone) {
      alert('Please fill out Name and Cell Number');
      return;
    }
    setFormSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none" id="service-root-detail-modal">
      <div className="bg-slate-900 rounded-3xl border border-slate-800 max-w-6xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl shadow-blue-990/40">
        
        {/* UPPER TITLE BAR */}
        <div className="bg-slate-950 p-4 sm:p-5 px-6 border-b border-slate-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl flex items-center justify-center bg-blue-500/10 border border-blue-500/20`}>
              <Layers className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm tracking-tight uppercase text-white">SubsidySetu • Advisory Desk</h3>
              <p className="text-[10px] text-slate-400 font-mono">Central Policies & Rajasthan State Nodal Portfolios (FY 2026-27)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
            id="close-service-modal-btn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* WORKSPACE DIVIDOR: Sidebar Left + Details Panel Right */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* CLIENT SIDEBAR: Directory of 5 Premium Services */}
          <div className="lg:col-span-4 border-r border-slate-800 bg-slate-950/20 overflow-y-auto p-4 space-y-2.5">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block px-1 py-1">
              SubsidySetu Services ({SERVICES_DATA.length})
            </span>

            {SERVICES_DATA.map((srv, idx) => {
              const IsSrvSelected = idx === activeIdx;
              const SrvIcon = srv.icon;
              return (
                <div
                  key={srv.id}
                  onClick={() => {
                    setActiveIdx(idx);
                    setActiveTab('overview');
                  }}
                  className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer text-left group relative flex items-center gap-3.5 ${
                    IsSrvSelected
                      ? 'bg-slate-800/90 border-amber-500/80 shadow-md translate-x-1'
                      : 'bg-slate-900/40 border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/30'
                  }`}
                  id={`sidebar-srv-tab-${srv.id}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition duration-300 ${
                    IsSrvSelected 
                      ? 'bg-amber-500 text-slate-950 border-amber-400' 
                      : 'bg-slate-800 text-slate-400 border-slate-700/60 group-hover:bg-slate-700 group-hover:text-white'
                  }`}>
                    <SrvIcon className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[8.5px] font-mono font-bold block text-slate-400 uppercase tracking-wider">
                      {srv.badge}
                    </span>
                    <h4 className={`text-xs font-bold font-display leading-tight truncate mt-0.5 ${
                      IsSrvSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
                    }`}>
                      {srv.title}
                    </h4>
                  </div>
                  {IsSrvSelected && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  )}
                </div>
              );
            })}

            {/* QUICK CA HELP CALLOUT */}
            <div className="pt-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2.5">
                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                  <Phone className="h-3 w-3 text-emerald-400 animate-pulse" />
                  OFFLINE OFFICE HELP
                </span>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Our professional corporate office is situated in Jaipur. Come sit with CA Yogesh Sharma for face-to-face evaluation.
                </p>
                <div className="space-y-1 text-xs font-bold text-white font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <a href="tel:+918741009775" className="block hover:text-emerald-400 transition">📞 +91 8741009775</a>
                  <a href="tel:+918619464250" className="block hover:text-amber-400 transition mt-1">📞 +91 8619464250</a>
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC CONTENTS AREA (Right Side) */}
          <div className="lg:col-span-8 bg-slate-900 overflow-y-auto p-5 sm:p-7 space-y-6 flex flex-col justify-between" id="service-dynamic-right-panel">
            
            <div className="space-y-5">
              
              {/* BRAND HEADER */}
              <div className="border-b border-slate-800 pb-4 space-y-2.5 text-left">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded text-[8.5px] font-extrabold tracking-widest font-mono uppercase">
                    {currentSrv.badge}
                  </span>
                  <span className="text-slate-500 text-[10px] font-mono">ID: {currentSrv.id}</span>
                </div>
                <h1 className="text-lg sm:text-2xl font-display font-black text-white leading-tight uppercase tracking-tight">
                  {currentSrv.title}
                </h1>
                <p className="text-xs text-slate-400 font-semibold tracking-wide">
                  {currentSrv.shorthand}
                </p>
              </div>

              {/* SECTION SUB-TABS NAVIGATION (Overview, Eligibility, Documents, Filing Steps) */}
              <div className="flex border-b border-slate-800 gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'overview'
                      ? 'border-amber-500 text-amber-500'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Info className="h-3.5 w-3.5" />
                  <span>Overview & Benefits</span>
                </button>
                <button
                  onClick={() => setActiveTab('eligibility')}
                  className={`pb-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'eligibility'
                      ? 'border-amber-500 text-amber-500'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Award className="h-3.5 w-3.5" />
                  <span>Eligibility Grid</span>
                </button>
                <button
                  onClick={() => setActiveTab('docs')}
                  className={`pb-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'docs'
                      ? 'border-amber-500 text-amber-500'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Documents checklist</span>
                </button>
                <button
                  onClick={() => setActiveTab('steps')}
                  className={`pb-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'steps'
                      ? 'border-amber-500 text-amber-500'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Filing Steps</span>
                </button>
              </div>

              {/* TAB CONTAINER CONTENT */}
              <div className="text-left py-1">
                
                {activeTab === 'overview' && (
                  <div className="space-y-5 animate-fadeIn">
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                      {currentSrv.intro}
                    </p>

                    <div className="space-y-2.5">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                        📈 Core Subsidy & Financial Concessions Breakdown:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {currentSrv.subsidies.map((sub, sIdx) => (
                          <div key={sIdx} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 hover:border-amber-500/20 transition group">
                            <span className="text-[10px] font-mono0 font-bold block text-amber-500 uppercase tracking-wider">{sub.label}</span>
                            <p className="text-xs text-white font-semibold mt-1 leading-normal">{sub.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'eligibility' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3.5">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                        ✔ ACTIVE ELIGIBILITY COMPLIANCE METRICS
                      </span>
                      <ul className="space-y-2.5">
                        {currentSrv.eligibility.map((el, eIdx) => (
                          <li key={eIdx} className="flex gap-2.5 text-xs text-slate-300 items-start">
                            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{el}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'docs' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
                      <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest block">
                        📁 MANDATORY DOCUMENTATION ARCHIVE REQUIRED
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {currentSrv.documents.map((doc, dIdx) => (
                          <div key={dIdx} className="flex items-center gap-2.5 p-2 px-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 text-xs">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0"></span>
                            <span className="truncate leading-normal" title={doc}>{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'steps' && (
                  <div className="space-y-4 animate-fadeIn text-left">
                    <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest block mb-2 px-1">
                      🧭 END-TO-END FILING PROGRESSION TIMELINE
                    </span>
                    <div className="relative border-l-2 border-slate-800 ml-4 space-y-6 py-2">
                      {currentSrv.procedure.map((p, pIdx) => (
                        <div key={pIdx} className="relative pl-7 group">
                          {/* Dot step code */}
                          <div className="absolute -left-3.5 top-0 w-7 h-7 bg-slate-950 text-amber-500 group-hover:text-amber-450 border-2 border-slate-800 rounded-full flex items-center justify-center text-xs font-black font-mono transition shadow-lg shrink-0">
                            {p.step}
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-white uppercase tracking-tight font-display">{p.title}</h4>
                            <p className="text-[11.5px] text-slate-400 leading-relaxed pr-2">{p.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* EXPERT ADVICE BANNER */}
              <div className="bg-amber-600/5 border border-amber-500/20 p-4 rounded-2xl flex gap-3 text-left">
                <span className="text-2xl pt-0.5 select-none font-mono">💡</span>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono font-extrabold text-amber-500 uppercase tracking-widest block">
                    Chief Advisor Yogesh Sharma Expert Advice:
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed italic">
                    "{currentSrv.expertTip}"
                  </p>
                </div>
              </div>

            </div>

            {/* LOWER FORM COLLATERAL: Instant Callback Request */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 mt-6 text-left">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800 mb-4">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-tight">Need Online Representation?</h4>
                  <p className="text-[11px] text-slate-400">File your project under RIPS 2024, PMEGP or prepare CA audit reports securely.</p>
                </div>
                {onOpenChat && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenChat();
                    }}
                    className="text-[10px] font-mono font-bold bg-blue-600/10 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg uppercase tracking-wider transition"
                  >
                    🚀 Trigger CA Chat
                  </button>
                )}
              </div>

              {formSubmitted ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <span className="text-xs text-white font-semibold">Callback request logged. Advisor Yogesh Sharma (Direct Helpline: +91 8741009775) will connect shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-1">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={contactForm.name}
                      onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-xl px-3 py-2.5 focus:border-amber-500 outline-none transition font-sans"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <input
                      type="tel"
                      placeholder="Cell Number"
                      value={contactForm.phone}
                      onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-xl px-3 py-2.5 focus:border-amber-500 outline-none transition font-mono"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <input
                      type="text"
                      placeholder="City (Jaipur etc)"
                      value={contactForm.city}
                      onChange={e => setContactForm({ ...contactForm, city: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-xl px-3 py-2.5 focus:border-amber-500 outline-none transition font-sans"
                    />
                  </div>
                  <button
                    type="submit"
                    className="sm:col-span-1 bg-amber-500 hover:bg-amber-650 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <Send className="h-3 w-3" />
                    <span>Request Callback</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
