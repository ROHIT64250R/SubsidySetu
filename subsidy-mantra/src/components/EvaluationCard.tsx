/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EvaluationResult, SubsidyScheme } from '../types';
import {
  Sparkles,
  TrendingUp,
  FileCheck2,
  CalendarDays,
  Bookmark,
  Share2,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  AlertCircle
} from 'lucide-react';

interface EvaluationCardProps {
  result: EvaluationResult;
  onSave: (nameString: string) => void;
  onChatScheme: (schemeName: string) => void;
}

// Simple parser to render Gemini AI markdown text elegantly without third-party libraries
function SimpleMD({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split('\n');

  return (
    <div className="space-y-3.5 text-slate-700 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2"></div>;

        // Header 3: ### Title
        if (trimmed.startsWith('###')) {
          const content = trimmed.replace('###', '').trim();
          return (
            <h4 key={idx} className="font-display font-bold text-slate-900 text-base mt-4 pt-2 flex items-center border-b border-blue-50 pb-1 text-blue-950">
              {content}
            </h4>
          );
        }

        // Header 2: ## Title
        if (trimAndTest(trimmed, '##')) {
          const content = trimmed.replace('##', '').trim();
          return (
            <h3 key={idx} className="font-display font-bold text-slate-900 text-base mt-5 flex items-center gap-1 text-blue-950">
              <Sparkles className="h-4 w-4 text-amber-500" />
              {content}
            </h3>
          );
        }

        // Header 1: # Title
        if (trimAndTest(trimmed, '#')) {
          const content = trimmed.replace('#', '').trim();
          return (
            <h2 key={idx} className="font-display font-extrabold text-slate-900 text-lg mt-6 text-blue-950">
              {content}
            </h2>
          );
        }

        // Bullets: - item or * item
        if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
          const listContent = trimmed.substring(1).trim();
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-2 mt-1.5 hover:text-slate-900 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span>
              <span>{renderBoldInline(listContent)}</span>
            </div>
          );
        }

        // Numbered list: e.g. "1. Item"
        if (/^\d+\./.test(trimmed)) {
          const numMatch = trimmed.match(/^(\d+)\./);
          const num = numMatch ? numMatch[1] : '1';
          const listContent = trimmed.replace(/^\d+\./, '').trim();
          return (
            <div key={idx} className="flex items-start gap-3 pl-2 mt-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-[10px] text-blue-700 font-bold font-mono mt-0.5 shrink-0">
                {num}
              </span>
              <span>{renderBoldInline(listContent)}</span>
            </div>
          );
        }

        return <p key={idx}>{renderBoldInline(trimmed)}</p>;
      })}
    </div>
  );
}

function trimAndTest(text: string, prefix: string) {
  return text.startsWith(prefix) && !text.startsWith(prefix + '#');
}

// Inline parser for bold words **word**
function renderBoldInline(text: string) {
  if (!text.includes('**')) return text;
  const parts = text.split('**');
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="font-semibold text-slate-950">{part}</strong>;
    }
    return part;
  });
}

export default function EvaluationCard({ result, onSave, onChatScheme }: EvaluationCardProps) {
  const { overallScore, totalEstimatedBenefit, schemes, aiSummary } = result;
  const [expandedScheme, setExpandedScheme] = useState<string | null>(schemes?.[0]?.id || null);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [scenarioName, setScenarioName] = useState('');
  const [isSavedLocal, setIsSavedLocal] = useState(false);

  const toggleScheme = (id: string) => {
    setExpandedScheme(expandedScheme === id ? null : id);
  };

  const handleDocCheck = (schemeId: string, docIndex: number) => {
    const key = `${schemeId}-${docIndex}`;
    setCheckedDocs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLocalSave = (e: React.FormEvent) => {
    e.preventDefault();
    const nameToSave = scenarioName.trim() || `${result.profile.companyName || 'Lead'} (${result.profile.state})`;
    onSave(nameToSave);
    setIsSavedLocal(true);
    setTimeout(() => setIsSavedLocal(false), 3000);
  };

  // Score description colors
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 stroke-emerald-500';
    if (score >= 60) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-500 stroke-rose-500';
  };

  return (
    <div className="space-y-6">
      {/* 1. Score & Benefit Executive Ribbon */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-slate-800 grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-lg shadow-slate-100">
        {/* Total Schemes Eligibility Summary Card */}
        <div className="md:col-span-4 flex flex-col justify-center text-center md:text-left md:border-r md:border-slate-200 md:pr-6 py-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center md:justify-start gap-1">
            <TrendingUp className="h-4.5 w-4.5 text-emerald-500" />
            Eligibility Evaluation Active
          </span>
          <div className="mt-2 text-xl sm:text-2xl font-black text-emerald-600 tracking-tight font-display uppercase">
            {schemes.length > 0 ? 'Eligible Schemes Found' : 'Requirements Met'}
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            Multiple central & state concessions matched based on your business profile parameters.
          </p>
        </div>

        {/* Circular Eligibility Gauge */}
        <div className="md:col-span-4 flex items-center justify-center gap-4 md:border-r md:border-slate-200 md:px-4 py-2">
          <div className="relative w-18 h-18">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="2.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`${getScoreColor(overallScore)}`}
                strokeWidth="3"
                strokeDasharray={`${overallScore}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-extrabold text-slate-850 font-mono">{overallScore}%</span>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Setu Score</h4>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">
              {overallScore >= 80 ? 'High Likelihood' : overallScore >= 60 ? 'Moderate Chances' : 'Needs Optimization'}
            </p>
            <span className="text-[10px] text-slate-400">Eligibility Probability Rating</span>
          </div>
        </div>

        {/* Action Form: Save this simulation */}
        <div className="md:col-span-4 py-2">
          <form onSubmit={handleLocalSave} className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Save Simulation Case
            </label>
            <div className="relative flex rounded-xl overflow-hidden bg-slate-50 border border-slate-200">
              <input
                type="text"
                placeholder="Name (e.g. Pune Factory)"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="w-full bg-transparent px-3 py-1.5 text-xs text-slate-900 outline-hidden placeholder-slate-400"
                id="input-save-case-name"
              />
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white px-3 text-xs font-bold transition flex items-center gap-1 shrink-0"
                id="btn-save-case-action"
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span>{isSavedLocal ? 'Saved ✓' : 'Save'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-450 font-mono">Stores in client dashboard shelf locally.</p>
          </form>
        </div>
      </div>

      {/* Spacious Horizontal Landscape Layout containing AI board & Accordion list taking 100% full width for landscape look! */}
      <div className="space-y-6">
        
        {/* Top: AI Strategic Board as a wide horizontal dashboard panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md shadow-slate-100 overflow-hidden">
          {/* Strategy header banner */}
          <div className="bg-[#1e3a8a] px-5 py-4 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2.5">
              <Sparkles className="h-5 w-5 text-amber-400 shrink-0" />
              <div>
                <h3 className="font-display font-semibold text-sm">AI Subsidies Strategist Card</h3>
                <p className="text-[10px] text-blue-250">Advisory recommendations customized to your scale</p>
              </div>
            </div>
            <span className="text-[10px] bg-amber-400/15 text-amber-400 px-2.5 py-0.5 rounded border border-amber-400/30 uppercase font-mono tracking-wider font-bold">
              Automated Analysis
            </span>
          </div>

          <div className="p-5 bg-white text-slate-800 text-xs">
            {aiSummary ? (
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-sans">
                <SimpleMD text={aiSummary} />
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3.5">
                <span className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Sparkles className="h-6 w-6 animate-pulse" />
                </span>
                <div>
                  <h4 className="font-display font-bold text-slate-850 text-sm">Reviewing Project Slabs</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Our chartered-accountant agent takes 2-3 seconds to review structural rules. Match schemes using the left sizer to generate.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Disclaimer footnote */}
          <div className="border-t border-slate-150 bg-slate-50/50 p-4 text-[10px] text-slate-505 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
            <span>
              <strong>Consulting Disclaimer:</strong> Estimated numbers computed under current FY policies as guidelines only. Actual sanctions depend on bank credit scores and physical audits by KVIC/DIC inspectors. Keep bills and GST ledgers ready.
            </span>
          </div>
        </div>

        {/* Bottom: Matched Subsidy Schemes in absolute spacious landscape accordions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-base text-slate-900 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-700" />
              Matched Subsidy Schemes ({schemes.length})
            </h3>
            <span className="text-[11px] text-slate-550 font-medium">Click to manage documents & claims roadmap</span>
          </div>

          {schemes.length === 0 ? (
            <div className="bg-white p-8 rounded-xl text-center text-slate-550 text-xs border border-slate-200">
              <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              No matched schemes found. Try adjusting investment scale values slightly to trigger general criteria.
            </div>
          ) : (
            schemes.map((scheme, i) => {
              const isExpanded = expandedScheme === scheme.id;
              const completedDocsCount = scheme.documentChecklist.filter(
                (_, idx) => checkedDocs[`${scheme.id}-${idx}`]
              ).length;
              const totalDocs = scheme.documentChecklist.length;

              return (
                <div
                  key={scheme.id}
                  className={`bg-white rounded-xl border transition-all ${
                    isExpanded
                      ? 'border-blue-700 ring-2 ring-blue-500/5 shadow-md shadow-blue-50'
                      : 'border-slate-200 hover:border-slate-350'
                  } overflow-hidden`}
                  id={`scheme-card-${scheme.id}`}
                >
                  {/* Scheme Header row */}
                  <div
                    onClick={() => toggleScheme(scheme.id)}
                    className="p-5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider font-mono">
                          {scheme.authority}
                        </span>
                        <span className="bg-emerald-50 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                          {scheme.eligibilityStatus === 'eligible' ? 'Evaluated Match' : 'Conditional Match'}
                        </span>
                      </div>
                      <h4 className="font-display font-semibold text-slate-900 text-sm sm:text-base mt-2">
                        {scheme.name}
                      </h4>
                      <p className="text-xs text-slate-505 mt-1.5 line-clamp-1">{scheme.description}</p>
                    </div>

                    <div className="flex items-center space-x-4 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Status</span>
                        <strong className="text-emerald-600 font-display text-sm font-bold uppercase">
                          Eligible Match
                        </strong>
                      </div>
                      <div className="p-1 px-1.5 rounded-lg border border-slate-100 text-slate-400 group-hover:text-slate-800 transition">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Scheme Details Tray */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/50 p-5 sm:p-6 space-y-6">
                      
                      {/* Top Horizontal Landscape Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* LEFT COLUMN: Benefits Audit & Calculations */}
                        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 text-xs shadow-xs space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                            <h5 className="font-bold text-slate-850 uppercase text-[10px] tracking-widest flex items-center gap-1.5 font-mono">
                              <Sparkles className="h-3.5 w-3.5 text-blue-700 animate-pulse" />
                              Benefits Definition & Calculations
                            </h5>
                            <span className="bg-emerald-50 text-emerald-700 font-mono font-bold text-[9px] px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1">
                              <span>Verified Allowance</span>
                            </span>
                          </div>
                          
                          <div className="space-y-3 text-slate-650">
                            <div>
                              <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider block">Maximum Calculated Benefit Cap</span>
                              <strong className="text-slate-900 text-base sm:text-lg font-display font-black block mt-0.5">
                                {scheme.maxBenefit}
                              </strong>
                            </div>
                            
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-1">
                              <span className="text-slate-500 font-mono text-[9px] uppercase tracking-wider block">Statutory Rebate Formula Algortihm</span>
                              <code className="block mt-1 bg-slate-100 text-slate-900 px-2 py-1.5 rounded text-[10px] font-mono border border-slate-205">
                                {scheme.benefitFormula}
                              </code>
                            </div>

                            <div className="pt-2">
                              <span className="text-slate-500 font-mono text-[9px] uppercase tracking-wider block mb-2 font-bold">Why you matches this policy criteria:</span>
                              <div className="space-y-1.5 pl-1">
                                {scheme.matchingReasons.map((reason, idx) => (
                                  <div key={idx} className="flex items-start gap-2 text-slate-700 leading-relaxed text-[11px]">
                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0 mt-1.5"></span>
                                    <span>{reason}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT COLUMN: Interactive Document Tracker with Real-Time Progress Bar */}
                        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 text-xs text-slate-800 shadow-xs space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                            <h5 className="font-bold text-slate-850 uppercase text-[10px] tracking-widest flex items-center gap-1.5 font-mono">
                              <FileCheck2 className="h-3.5 w-3.5 text-blue-700" />
                              Required Documents Audit Tracker
                            </h5>
                            <span className="bg-blue-50 font-bold px-2 py-0.5 rounded-md text-[10px] text-blue-800 font-mono border border-blue-100 shrink-0">
                              {completedDocsCount}/{totalDocs} Prepared
                            </span>
                          </div>

                          {/* Progress bar visual indicator */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest">
                              <span>Ready meter</span>
                              <span>{Math.round((completedDocsCount / totalDocs) * 100)}% Complete</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                              <div 
                                className="h-full bg-emerald-500 transition-all duration-500" 
                                style={{ width: `${(completedDocsCount / totalDocs) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <p className="text-[10px] text-slate-400">Select and document files you currently possess to check audit fitness:</p>
                          
                          <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                            {scheme.documentChecklist.map((doc, idx) => {
                              const isChecked = checkedDocs[`${scheme.id}-${idx}`];
                              return (
                                <label
                                  key={idx}
                                  className={`flex items-start gap-2.5 p-2 px-3 rounded-xl border cursor-pointer select-none transition ${
                                    isChecked
                                      ? 'bg-emerald-50/25 border-emerald-300 text-slate-900 font-medium'
                                      : 'bg-white border-slate-150 hover:bg-slate-50 text-slate-600'
                                  }`}
                                  id={`label-${scheme.id}-doc-${idx}`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={!!isChecked}
                                    onChange={() => handleDocCheck(scheme.id, idx)}
                                    className="rounded border-slate-300 text-emerald-650 focus:ring-emerald-500 mt-0.5 shrink-0"
                                    id={`check-${scheme.id}-doc-${idx}`}
                                  />
                                  <span className={`text-[11px] leading-tight ${isChecked ? 'line-through text-slate-400' : ''}`}>
                                    {doc}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                      </div>

                      {/* Application Procedure Flowchart */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                        <h5 className="font-bold text-slate-850 text-[10px] uppercase tracking-widest flex items-center gap-2 mb-4 font-mono">
                          <CalendarDays className="h-4 w-4 text-blue-700 animate-pulse" />
                          Recommended Filing Procedure Roadmap (End-To-End)
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
                          {scheme.applyProcedure.map((proc, idx) => (
                            <div key={idx} className="relative bg-slate-50 p-4 rounded-xl border border-slate-150 text-xs hover:border-blue-400 transition-all group flex flex-col justify-between">
                              <div>
                                <span className="text-[9px] font-black text-blue-800 font-mono tracking-widest uppercase block mb-1">
                                  Step 0{idx + 1}
                                </span>
                                <p className="text-slate-650 leading-relaxed pt-1 text-[11px] font-medium break-all whitespace-normal">{proc}</p>
                              </div>
                              <span className="hidden sm:inline absolute -right-3.5 top-1/2 -translate-y-1/2 text-slate-300 z-10 group-last:hidden">
                                ➔
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Consultation Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-4 bg-slate-50/80 p-3.5 rounded-xl border">
                        <div className="flex items-start gap-2 max-w-lg">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0"></div>
                          <p className="text-[10px] text-slate-505 leading-relaxed text-left">
                            <strong>Note:</strong> Need a state nodal representative or Chartered compliance engineer? Start an online chat to auto-generate the statutory validation file or call Yogesh Sharma desk directly.
                          </p>
                        </div>
                        <button
                          onClick={() => onChatScheme(scheme.name)}
                          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 shadow-md shrink-0 border border-transparent-300"
                          id={`btn-chat-advisor-${scheme.id}`}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Consult AI about {scheme.id.toUpperCase()}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
