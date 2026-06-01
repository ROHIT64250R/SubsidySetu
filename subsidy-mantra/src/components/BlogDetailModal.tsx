/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Calendar, Clock, BookOpen, AlertCircle, Sparkles, HelpCircle, ArrowRight, ShieldCheck, FileCheck, CheckSquare } from 'lucide-react';

interface BlogDetailModalProps {
  postId: string;
  onClose: () => void;
  onOpenChat?: () => void;
}

export const ARTICLES_DATA: Record<string, {
  title: string;
  category: string;
  date: string;
  readTime: string;
  color: string;
  intro: string;
  sections: { title: string; content: string; bullets?: string[] }[];
  faqs: { q: string; a: string }[];
  checklistTitle?: string;
  checklistItems?: string[];
  finalTakeaway: string;
}> = {
  'rips-2024': {
    title: 'Demystifying Rajasthan RIPS 2024 Interest Subvention & SGST Rebates',
    category: 'POLICY GAZETTE FY 2026-27',
    date: 'MAY 15, 2026',
    readTime: '6 Min Read',
    color: 'amber',
    intro: 'The Rajasthan Investment Promotion Scheme (RIPS 2024) forms the bedrock of industrial growth in Rajasthan. Under the flagship guidelines, manufacturing and service MSMEs can claim high-percentage capital refunds and interest subventions. This post breaks down the technical eligibility, calculations, and exact filing parameters under the state gazette.',
    sections: [
      {
        title: '1. The Core Incentive Pillars',
        content: 'RIPS 2024 provides 3 main financial concessions for newly registered industrial enterprises. Proper timing of the SSO portal submit keeps claims safe from being classified as backdated investments:',
        bullets: [
          'State GST (SGST) Refund: Up to 75% reimbursement of net SGST paid through cash ledger for a span of 7 consecutive years.',
          'Interest Subvention: Flat 5% reduction per annum on industrial term loans from commercial banks. Special Categories (Women, SC/ST, and rural border setups) enjoy up to 7% subvention.',
          'Electricity Duty & Stamp Fee: 100% upfront exemption on Electricity Duty, Mandi Tax, and Land Conversion stamp fee during factory establishment.'
        ]
      },
      {
        title: '2. Understanding Non-Eligibility (The Negative List)',
        content: 'Not all operations qualify for RIPS 2024 concessions. Under standard regulatory terms, the Commissionerate of Industries restricts hazardous chemical processors, tobacco products, secondary plastic recycling without modern high-efficiency machinery, and standard flour mills without advanced fortifiers. Ensure your Udyam niche classification falls outside this negative list prior to booking land leases.'
      },
      {
        title: '3. Calculating Your Net SGST Reimbursement',
        content: 'A common misconception is that the 75% refund applies to gross GST. It is strictly limited to the Net SGST deposited via the electronic cash ledger (GST PMT-05) after adjusting Input Tax Credit (ITC). Keep structured tax ledgers ready for annual CA physical validation reports.'
      }
    ],
    faqs: [
      {
        q: 'Can we claim PMEGP subsidy and RIPS 2024 subvention concurrently?',
        a: 'No. Double dipping is restricted. A unit must choose either Central PMEGP capital cashback or State interest wave-offs. However, you can claim RIPS electricity duty waivers alongside central machinery grants in many divisions!'
      },
      {
        q: 'What is the absolute deadline to submit the provisional SSO application?',
        a: 'The application must register on the Single Window portal BEFORE starting physical construction or commercial pilot production. Retrospective files are highly scrutinized.'
      }
    ],
    checklistTitle: 'Essential Certificates Needed for RIPS 2024 Filing:',
    checklistItems: [
      'Provisional SSO ID and verified single window application proof',
      'RIICO Land Allotment order / Registered lease deed papers',
      'CA certified machinery purchase bill grid ledger',
      'Bank term loan sanction letter along with repayment schedules',
      'Rajasthan Pollution Control Board NOC (Consent to Establish/Operate)'
    ],
    finalTakeaway: 'Always align with an experienced consultant to verify machinery HSN codes under recognized energy-efficient standards. It acts as the master key to secure rapid approvals without technical query loops.'
  },
  'cold-chain': {
    title: 'State Capital Subsidy Roadmap for Agro-Processing, Cold Storages & Rice Mills',
    category: 'AGRO INDUSTRIES POLICY',
    date: 'APR 20, 2026',
    readTime: '8 Min Read',
    color: 'blue',
    intro: 'Agro and food processing units form a prioritized segment under both MoFPI (Central Ministry) and the Rajasthan Agricultural Produce Policy. Cold chain installations, sorting centers, and mills can access capital grants up to ₹50 Lakhs. Here is the operational roadmap to process your subsidy files without office delays.',
    sections: [
      {
        title: '1. Key Subsidy Slabs and Project Constraints',
        content: 'The Agricultural Board categorizes eligible setups to prevent misuse of public grants. Verified rates are structural:',
        bullets: [
          'Eligible Capital Subsidy: Direct 25% to 35% capital grant on plant building and recognized cold room machinery.',
          'Location Surcharges: Units located in tribal divisions or rural border subdivisions gain an incremental 5% cushion.',
          'Solar Integration: Installing a rooftop captive solar grid for your cold room triggers additional capital relief up to ₹10 Lakhs.'
        ]
      },
      {
        title: '2. The Critical Machinery Layout Standards',
        content: 'Agricultural boards mandate certified high-efficiency diagnostics. Standard localized panel builds without certified performance ratings are rejected. Ensure your machinery quotations define modern refrigeration limits, automated temperature logging, and food-grade stainless steel surfaces.'
      }
    ],
    faqs: [
      {
        q: 'How long are the government subsidy disbursal times?',
        a: 'Normally 4 to 6 months post successful physical audit by the Agricultural Marketing Board team in Jaipur. Having clean bank tracking for machinery invoices speeds this up.'
      },
      {
        q: 'Does we require NA (non-agricultural) converted land plots?',
        a: 'Yes. Standard farm land must undergo a formal 90-A conversion order before construction starts, else the state department will reject the subsidy portfolio.'
      }
    ],
    checklistTitle: 'Required Documentation for Food Processing Grants:',
    checklistItems: [
      'Detailed Project Report (DPR) formatted with agro-technical cash flows',
      'Certified land conversion order (Form 90-A) issued by active Tehsildar',
      'Valid FSSAI license / registration draft',
      'Completed CA-certified promoter equity contribution certificate',
      'Electricity load sanction bill indicating required industrial kW power'
    ],
    finalTakeaway: 'Ensure the machinery supplier has an active GST number. The department directly validates invoice records with matching national GST portal uploads before clearing any direct grants!'
  },
  'cgtmse-solar': {
    title: 'How CGTMSE is Fueling Mortgage-Free Term Credit for Solar Roofs & Plant Expansion',
    category: 'CREDIT SECURITY INCENTIVES',
    date: 'MAR 29, 2026',
    readTime: '5 Min Read',
    color: 'purple',
    intro: 'For many MSME promoters, providing land or personal property mortgages is a massive roadblock. The Central Government Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE) completely resolves this. Eligible loans up to ₹5 Crores can obtain full state guarantee coverage, allowing you to secure machinery or green solar roofs.',
    sections: [
      {
        title: '1. The Magic of Mortgage-Free Lending',
        content: 'Under classic frameworks, banks demand 100% to 150% collateral security. Under active CGTMSE guidelines:',
        bullets: [
          'Collateral Exemption: No land, building or personal residential mortgage is needed for credits up to ₹5 Crores.',
          'Trust Cover: The CGTMSE trust guarantees up to 85% of default exposure to the lending bank, minimizing risk.',
          'Trust Premium: A small annual guarantee fee (0.37% to 1.50%) is charged, which can often be packaged inside the term loan itself.'
        ]
      },
      {
        title: '2. Aligning CGTMSE with Solar Rooftops',
        content: 'Installing a rooftop solar panel significantly reduces factory operating costs. SIDBI and other nationalized banks provide quick-sanction CGTMSE term credit specifically for solar setups. Eligible businesses can slash current power expense by 40% while paying off the loan without collateral stress.'
      }
    ],
    faqs: [
      {
        q: 'Can LLPs or Partnership Firms use CGTMSE covers?',
        a: 'Yes! LLPs, Private Limited entities, Partnerships, and single Proprietorships with an active Udyam Certificate are fully eligible.'
      },
      {
        q: 'Is there a minimum CIBIL score requirement?',
        a: 'Generally, banks look for a clear business score (preferably 700+). Any active bank defaults on past credits or personal accounts will block CGTMSE allocations.'
      }
    ],
    checklistTitle: 'Mandatory Checklist for CGTMSE File Building:',
    checklistItems: [
      '3-Year Audited Financial Balance Sheets (ITR transcripts)',
      'Quotations for requested Solar System / Expansion machinery from certified EPC contracts',
      'Dynamic CMA (Credit Monitoring Arrangement) projection sheet',
      'Udyam Registration Certificate sync log',
      'Active electricity board NOC and structural rooftop load stability cert'
    ],
    finalTakeaway: 'The key to securing CGTMSE from nationalized banks is a robust, realistic CMA projection sheet. Banks look at Debt Service Coverage Ratio (DSCR) closely to verify structural repayment capacity.'
  }
};

export default function BlogDetailModal({ postId, onClose, onOpenChat }: BlogDetailModalProps) {
  const currentPost = ARTICLES_DATA[postId];

  if (!currentPost) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6" id="blog-root-detail-modal">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-slate-850">
        
        {/* UPPER TITLE BAR */}
        <div className="bg-[#1e3a8a] p-4.5 sm:p-5 px-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 text-left">
            <div className="p-2 bg-white/15 rounded-xl border border-white/20">
              <BookOpen className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[9px] font-mono font-bold tracking-widest text-amber-300 uppercase block">
                {currentPost.category}
              </span>
              <h3 className="font-display font-black text-xs sm:text-sm tracking-tight uppercase text-white">
                SubsidySetu • Policy Knowledge Base
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white50 hover:text-white p-2 rounded-xl hover:bg-white/10 transition"
            id="close-blog-modal-btn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* WORKSPACE AREA */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-left" id="blog-content-panel">
          
          {/* Main Title Header */}
          <div className="border-b border-slate-100 pb-5 space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {currentPost.date}
              </span>
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                {currentPost.readTime}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-display font-black text-slate-900 leading-tight">
              {currentPost.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-sans italic bg-slate-50 p-4 rounded-xl border border-slate-150">
              "{currentPost.intro}"
            </p>
          </div>

          {/* Dynamic Article Sections */}
          <div className="space-y-6">
            {currentPost.sections.map((sect, sIdx) => (
              <div key={sIdx} className="space-y-2.5">
                <h4 className="font-display font-extrabold text-slate-950 text-sm sm:text-base">
                  {sect.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {sect.content}
                </p>
                {sect.bullets && (
                  <ul className="space-y-2 pl-4 mt-2">
                    {sect.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="list-disc text-xs sm:text-sm text-slate-650 leading-relaxed">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Checklists */}
          {currentPost.checklistTitle && (
            <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl space-y-3">
              <h4 className="text-xs font-mono font-extrabold text-amber-850 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="h-4 w-4 text-amber-600 animate-pulse" />
                {currentPost.checklistTitle}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentPost.checklistItems?.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-705">
                    <CheckSquare className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Article Detailed FAQs */}
          <div className="border-t border-slate-200 pt-6 space-y-4">
            <h4 className="font-display font-black text-slate-900 text-sm sm:text-base uppercase tracking-tight flex items-center gap-1.5">
              <HelpCircle className="h-4.5 w-4.5 text-[#1e3a8a]" />
              Frequently Asked Compliance Questions (FAQs)
            </h4>
            <div className="space-y-4">
              {currentPost.faqs.map((faq, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-1 text-left">
                  <span className="text-[10px] font-mono font-extrabold text-[#1e3a8a] uppercase tracking-wider block">Question Match:</span>
                  <strong className="text-xs sm:text-sm text-slate-900 leading-snug block">{faq.q}</strong>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1.5 border-t border-slate-200 mt-1.5">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Expert Takeaway Statement */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl flex gap-3 text-left">
            <span className="text-2xl pt-0.5 select-none font-mono text-amber-400">💡</span>
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono font-extrabold text-amber-400 uppercase tracking-widest block">
                Chief Consultant Yogesh Sharma Verdict:
              </span>
              <p className="text-slate-350 text-xs leading-relaxed italic">
                "{currentPost.finalTakeaway}"
              </p>
            </div>
          </div>

        </div>

        {/* LOWER INTERACTIVE CALL CTA */}
        <div className="bg-slate-100 p-4 px-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-900">Want Professional Compliance Verification?</h4>
            <p className="text-[10px] text-slate-500">Call Yogesh Sharma Helpline directly at: <strong className="text-slate-800">+91 8741009775</strong></p>
          </div>
          <div className="flex gap-2">
            {onOpenChat && (
              <button
                onClick={() => {
                  onClose();
                  onOpenChat();
                }}
                className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-xl uppercase tracking-wider transition shadow-sm"
              >
                🚀 Connect on CA Chat
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition"
            >
              Close Article
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
