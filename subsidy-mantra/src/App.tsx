/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import EligibilityForm from './components/EligibilityForm';
import EvaluationCard from './components/EvaluationCard';
import ConsultantChat from './components/ConsultantChat';
import SavedSimulations from './components/SavedSimulations';
import SchemeGuide from './components/SchemeGuide';
import IndustrySlideshow from './components/IndustrySlideshow';
import ServiceDetailModal from './components/ServiceDetailModal';
import BlogDetailModal, { ARTICLES_DATA } from './components/BlogDetailModal';
import { BusinessProfile, EvaluationResult, ChatMessage } from './types';
import { evaluateBusinessSubsidies } from './evaluator';
import {
  Sparkles,
  ClipboardList,
  Compass,
  Building,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  AlertCircle,
  Phone,
  MapPin,
  User,
  Globe,
  ArrowUpRight,
  Star,
  BookOpen,
  Clock,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Send,
  Mail,
  TrendingUp,
  Coins
} from 'lucide-react';

export default function App() {
  // 1. Core Profile & Calculation state
  const [currentProfile, setCurrentProfile] = useState<BusinessProfile>({
    companyName: 'Proposed Industrial Setup',
    industryType: 'food_processing',
    investment: 50, // in INR Lakhs
    turnover: 150, // in INR Lakhs
    state: 'Rajasthan',
    entityType: 'partnership',
    locationArea: 'rural',
    socialCategory: 'general',
    gender: 'male',
    operationalStage: 'new',
    hasUdyam: true,
    powerRequiredKw: 45,
  });

  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [isLoadingResult, setIsLoadingResult] = useState(false);

  // 2. Navigation tabs for results column
  const [activeSecondaryTab, setActiveSecondaryTab] = useState<'results' | 'chat'>('results');
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState<'central' | 'rajasthan'>('rajasthan');
  const [modalInitialIndex, setModalInitialIndex] = useState(0);

  const handleOpenGuideWithScheme = (tab: 'central' | 'rajasthan', index: number) => {
    setModalInitialTab(tab);
    setModalInitialIndex(index);
    setShowGuideModal(true);
  };

  // 3. Conversation states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  // 4. Case simulations board
  const [savedCases, setSavedCases] = useState<{ id: string; name: string; result: EvaluationResult }[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedBlogPostId, setSelectedBlogPostId] = useState<string | null>(null);

  // 5. Standalone Viewport States
  const [currentView, setCurrentView] = useState<'home' | 'blog'>('home');
  const [blogSearchQuery, setBlogSearchQuery] = useState('');
  const [selectedBlogTab, setSelectedBlogTab] = useState<'all' | 'rips' | 'agro' | 'credit'>('all');
  const [activeBlogPostId, setActiveBlogPostId] = useState<string | null>(null);

  // On mount: Load saved simulations from localStorage, run initial screener matching
  useEffect(() => {
    try {
      const saved = localStorage.getItem('subsidymantra_cases');
      if (saved) {
        setSavedCases(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading localStorage cases:', e);
    }

    // Trigger initial screener evaluation
    handleScreenSubsidies(currentProfile, true);
  }, []);

  // Screen Subsidies API call
  const handleScreenSubsidies = async (profileToScreen: BusinessProfile, isInitial = false) => {
    setIsLoadingResult(true);
    setCurrentProfile(profileToScreen);

    // Provide immediate client-side calculated matching for instant feedback in UI
    const localResult = evaluateBusinessSubsidies(profileToScreen);
    setEvaluationResult(localResult);

    // Call full-stack server endpoint to decorate calculated match results with high-fidelity Gemini strategic advice
    try {
      const response = await fetch('/api/subsidy/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileToScreen),
      });

      if (response.ok) {
        const fullResult = (await response.json()) as EvaluationResult;
        setEvaluationResult(fullResult);

        // Seed or refresh chatbot introduction context
        if (isInitial || chatMessages.length === 0) {
          const firstMatched = fullResult.schemes?.[0]?.name || 'PMEGP Support';
          setChatMessages([
            {
              role: 'model',
              text: `Greetings from SubsidySetu! 

I have analyzed **${profileToScreen.companyName || 'your enterprise'}** based in **${profileToScreen.state}**. 
Your overall Eligibility Radar shows matched potential programs with estimated financial benefits of **₹${fullResult.totalEstimatedBenefit} Lakhs**.

The highest-value scheme is: **${firstMatched}**.

How can I help you regarding compliance, eligibility limits, or prepare documentation today?`,
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      } else {
        console.warn('API strategy endpoint error, relying on deterministic fallback.');
      }
    } catch (err) {
      console.error('API connection failed, offline mode calculations used:', err);
    } finally {
      setIsLoadingResult(false);
    }
  };

  // Conversational advisor API handler
  const handleSendChatMessage = async (text: string) => {
    const newUserMessage: ChatMessage = {
      role: 'user',
      text: text,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [...chatMessages, newUserMessage];
    setChatMessages(updatedHistory);
    setIsLoadingChat(true);

    try {
      const response = await fetch('/api/subsidy/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory,
          profile: currentProfile,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'model',
            text: data.text || 'I analyzed your query. Let me know if there is anything else I can clarify.',
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        throw new Error('Chat API returned error.');
      }
    } catch (err: any) {
      console.error('Chat consult error:', err);
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: `I apologize, but I am facing temporary issues reaching my database regarding government updates. Please ensure your local API credentials are set or try again in a moment.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  // Chat shortcuts from scheme drawers
  const handleQuerySchemeAI = (schemeName: string) => {
    setActiveSecondaryTab('chat');
    handleSendChatMessage(`Provide me a brief CA analysis of our profile's eligibility under the ${schemeName} scheme.`);
  };

  const handleClearChatHistory = () => {
    setChatMessages([
      {
        role: 'model',
        text: `Consult history has been cleared. What specific Indian government financial assistance, state incentive guidelines, or paper filings can I assist with now?`,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  // Local Case library management
  const handleSaveCaseSimulation = (name: string) => {
    if (!evaluationResult) return;
    const newCase = {
      id: Date.now().toString(),
      name: name,
      result: evaluationResult,
    };
    const updated = [...savedCases, newCase];
    setSavedCases(updated);
    localStorage.setItem('subsidymantra_cases', JSON.stringify(updated));
  };

  const handleDeleteCaseSimulation = (id: string) => {
    const updated = savedCases.filter((c) => c.id !== id);
    setSavedCases(updated);
    localStorage.setItem('subsidymantra_cases', JSON.stringify(updated));
  };

  const handleSelectCaseSimulation = (res: EvaluationResult) => {
    setEvaluationResult(res);
    setCurrentProfile(res.profile);
    setActiveSecondaryTab('results');
  };

  const handleSelectIndustryFromSlide = (val: string) => {
    const updatedProfile = { ...currentProfile, industryType: val };
    handleScreenSubsidies(updatedProfile, false);
    
    // Smooth scroll back to form
    const formElement = document.getElementById('tab-btn-profile');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans tracking-normal relative overflow-hidden">
      {/* Statutory Header */}
      <Header
        onShowHelp={() => handleOpenGuideWithScheme('rajasthan', 0)}
        onOpenChat={() => {
          // If we navigate to chat from elsewhere, make sure we are on home first
          setCurrentView('home');
          setTimeout(() => {
            setActiveSecondaryTab('chat');
            const element = document.getElementById('column-right-layout');
            element?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onSelectService={(serviceName) => {
          setCurrentView('home');
          setSelectedService(serviceName);
        }}
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          if (view === 'blog') {
            setActiveBlogPostId(null);
          }
        }}
      />

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {currentView === 'home' ? (
          <>
            {/* Intro banner */}
            <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-50/20 relative overflow-hidden border border-slate-800">
          {/* Saffron and Green corner design touches adding statutory elegance without slop */}
          <div className="absolute top-0 right-0 w-32 h-1.5 bg-gradient-to-r from-amber-500 to-amber-600"></div>
          <div className="absolute bottom-0 right-0 w-32 h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-semibold text-blue-300 uppercase tracking-widest block font-mono">
                India MSME subsidy architecture & legal guidelines
              </span>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-white leading-tight">
                Unlock Sizable Government Grants & Interest Subventions Instantly
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Model your industrial plant setup, plant investment, state geography, and promoter details to audit active legal matches. Optimize filing roadmaps with a simulated Advisor.
              </p>
            </div>

            {/* High-Impact Stat pillars showing verified statutory policy limits under Indian MSME guidelines */}
            <div className="lg:col-span-5 grid grid-cols-3 gap-3">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10 hover:bg-white/10 transition-colors">
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 block font-display">₹50 Lakhs</span>
                <span className="text-[9px] text-slate-300 uppercase font-semibold block mt-1 tracking-wider">PMEGP Grant Cap</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10 hover:bg-white/10 transition-colors">
                <span className="text-xl sm:text-2xl font-extrabold text-blue-300 block font-display">7% p.a.</span>
                <span className="text-[9px] text-slate-300 uppercase font-semibold block mt-1 tracking-wider">Max RIPS Subvention</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10 hover:bg-white/10 transition-colors">
                <span className="text-xl sm:text-2xl font-extrabold text-amber-500 block font-display">75% GST</span>
                <span className="text-[9px] text-slate-300 uppercase font-semibold block mt-1 tracking-wider">State Rebate Limit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Industries Slideshow Section */}
        <IndustrySlideshow onSelectIndustry={handleSelectIndustryFromSlide} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL COLUMN (5 cols on lg): Input Form & Saved library */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <EligibilityForm
              onEvaluate={(prof) => handleScreenSubsidies(prof, false)}
              isLoading={isLoadingResult}
              initialProfile={currentProfile}
            />

            <SavedSimulations
              cases={savedCases}
              onSelect={handleSelectCaseSimulation}
              onDelete={handleDeleteCaseSimulation}
            />

            {/* Extra verification card to balance the height and fill any remaining gap */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 text-white space-y-4 shadow-xl">
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase flex items-center gap-1">
                ⭐ STATUTORY PHYSICAL AUDIT REGISTER
              </span>
              <h4 className="font-display font-bold text-xs text-slate-100 uppercase tracking-tight">
                Liaison & Site Inspection Checkpoints
              </h4>
              <div className="space-y-2.5 text-[11px] text-slate-400 font-mono">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2 last:border-0">
                  <span className="text-amber-500 font-bold">01.</span>
                  <span>Registered Land Conveyance & Title deeds</span>
                </div>
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2 last:border-0">
                  <span className="text-amber-500 font-bold">02.</span>
                  <span>Physical original invoices of machinery</span>
                </div>
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2 last:border-0">
                  <span className="text-amber-500 font-bold">03.</span>
                  <span>Approved Nodal Factory layout blueprint</span>
                </div>
                <div className="flex items-center gap-2 pb-1 last:border-0">
                  <span className="text-amber-500 font-bold">04.</span>
                  <span>Electricity duty exemption clearance status</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 bg-white/5 p-2 px-3 rounded-lg font-sans">
                Notice: All financial files are cross-verified at Jaipur Commissioners Office before local bank filing. Keep ledgers audited.
              </div>
            </div>
          </div>

          {/* RIGHT PANEL COLUMN (7 cols on lg): Multi-Tab Results & Chat Container */}
          <div className="lg:col-span-7 space-y-6" id="column-right-layout">
            
            {/* Viewport tab headers */}
            <div className="bg-white rounded-xl border border-slate-200 p-1.5 flex gap-2">
              <button
                onClick={() => setActiveSecondaryTab('results')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-2 ${
                  activeSecondaryTab === 'results'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
                id="right-tab-btn-results"
              >
                <ClipboardList className="h-4 w-4" />
                <span>🔍 Screen Match Results</span>
              </button>

              <button
                onClick={() => setActiveSecondaryTab('chat')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-2 ${
                  activeSecondaryTab === 'chat'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
                id="right-tab-btn-chat"
              >
                <Sparkles className="h-4 w-4" />
                <span>💬 Ask CA AI Advisor</span>
              </button>
            </div>

            {/* Render selected viewport */}
            {activeSecondaryTab === 'results' ? (
              evaluationResult && (
                <EvaluationCard
                  result={evaluationResult}
                  onSave={handleSaveCaseSimulation}
                  onChatScheme={handleQuerySchemeAI}
                />
              )
            ) : (
              <ConsultantChat
                messages={chatMessages}
                profile={currentProfile}
                onSendMessage={handleSendChatMessage}
                onClearHistory={handleClearChatHistory}
                isLoading={isLoadingChat}
              />
            )}
          </div>
        </div>

        {/* Gazette Scheme Highlight Hub (Horizontal Landscape Grid) */}
        <div className="bg-gradient-to-br from-[#0c1e45] via-[#0b162f] to-[#070d1a] border border-blue-900/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl" id="gazette-highlight-hub">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 px-1">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-amber-400 block">
                ⭐ ACTIVE GOVERNMENT POLICY DIRECTORY
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight">
                Rajasthan & Central Scheme Gazette Highlights
              </h3>
              <p className="text-xs text-white font-bold">
                Hover to explore active concessions. Contact chief consultant Yogesh Sharma for professional filing support.
              </p>
            </div>
            <button
              onClick={() => handleOpenGuideWithScheme('rajasthan', 0)}
              className="text-xs font-bold text-amber-400 hover:text-amber-350 transition-colors flex items-center gap-1.5 shrink-0 bg-white/5 border border-white/10 hover:bg-white/10 p-2.5 text-rose-50 px-4 rounded-xl shadow-xs"
            >
              <span>View Full Directory</span>
              <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {/* RIPS 2024 */}
            <div
              onClick={() => handleOpenGuideWithScheme('rajasthan', 0)}
              className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-5 rounded-2xl cursor-pointer group hover:bg-slate-850 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1 transition duration-300 ease-out text-left flex flex-col justify-between h-[210px] relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest font-mono">🐫 Rajasthan State</span>
                  <span className="text-slate-500 group-hover:text-amber-500 transition duration-300">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm text-white group-hover:text-amber-400 transition duration-200">
                  RIPS 2024 Policy
                </h4>
                <p className="text-[11px] text-slate-300 leading-normal line-clamp-3">
                  Up to 35% Capital Subsidy or 75% State GST refund. 5% to 7% per annum interest discount for active MSMEs.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[10px]">
                <span className="text-slate-400 font-mono">State Policy Concession:</span>
                <strong className="text-emerald-400 font-mono uppercase">Matched</strong>
              </div>
            </div>

            {/* Ambedkar Yojana */}
            <div
              onClick={() => handleOpenGuideWithScheme('rajasthan', 2)}
              className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-5 rounded-2xl cursor-pointer group hover:bg-slate-850 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition duration-300 ease-out text-left flex flex-col justify-between h-[210px] relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest font-mono">🐫 Rajasthan State</span>
                  <span className="text-slate-500 group-hover:text-blue-500 transition duration-300">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm text-white group-hover:text-blue-400 transition duration-200">
                  Ambedkar Udyam Yojana
                </h4>
                <p className="text-[11px] text-slate-300 leading-normal line-clamp-3">
                  Up to 25% margin grant money. Collateral-free credit. Unprecedented 9% maximum interest subsidy on loans.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[10px]">
                <span className="text-slate-400 font-mono">Social Category Support:</span>
                <strong className="text-emerald-400 font-mono uppercase">Matched</strong>
              </div>
            </div>

            {/* Nari Shakti */}
            <div
              onClick={() => handleOpenGuideWithScheme('rajasthan', 1)}
              className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-5 rounded-2xl cursor-pointer group hover:bg-slate-850 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1 transition duration-300 ease-out text-left flex flex-col justify-between h-[210px] relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest font-mono">👩 Female Empowerment</span>
                  <span className="text-slate-500 group-hover:text-purple-500 transition duration-300">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm text-white group-hover:text-purple-400 transition duration-200">
                  Nari Shakti Yojana
                </h4>
                <p className="text-[11px] text-slate-300 leading-normal line-clamp-3">
                  Up to 25% margin money support. Generous 8% interest subvention discount through Rajasthan Mahila Nidhi setup.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[10px]">
                <span className="text-slate-400 font-mono">Gender Inclusivity Support:</span>
                <strong className="text-emerald-400 font-mono uppercase">Matched</strong>
              </div>
            </div>

            {/* Vishwakarma Youth toolkit */}
            <div
              onClick={() => handleOpenGuideWithScheme('rajasthan', 3)}
              className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-5 rounded-2xl cursor-pointer group hover:bg-slate-850 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 transition duration-300 ease-out text-left flex flex-col justify-between h-[210px] relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest font-mono">🛠️ Youth Startup</span>
                  <span className="text-slate-500 group-hover:text-emerald-500 transition duration-300">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm text-white group-hover:text-emerald-400 transition duration-200">
                  Vishwakarma Yuva Yojana
                </h4>
                <p className="text-[11px] text-slate-300 leading-normal line-clamp-3">
                  25% direct machinery subsidy, flat ₹5,000 free modern toolkit allocation + 8% state interest discount.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[10px]">
                <span className="text-slate-400 font-mono">Youth Startup Toolkit:</span>
                <strong className="text-emerald-400 font-mono uppercase">Matched</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================== ABOUT SECTION ==================================== */}
        <section
          id="about-section_hub"
          className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 text-left space-y-10 scroll-mt-20 shadow-sm"
        >
          {/* Section Heading & Subtitle */}
          <div className="max-w-4xl space-y-3">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#1e3a8a] uppercase flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-blue-700 animate-pulse" />
              Who is SubsidySetu Advice Desk
            </span>
            <h3 className="text-xl sm:text-3xl font-display font-black text-slate-900 uppercase tracking-tight">
              Pioneering India's MSME Financial Compliance & Nodal Liaisons
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We coordinate physically with the Commissionerate of Industries, District Industries Centres (DIC), RIICO zonal departments, and leading Nationalised banks in Rajasthan and beyond. Our direct advisory led by former bank credit appraisers and chartered accountants ensures that your industrial, cold storage, textile or solar setups obtain maximum eligible cashbacks under clear legal guidelines.
            </p>
          </div>

          {/* Core Specialization Modules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3.5 hover:border-amber-450 hover:bg-slate-50/40 transition">
              <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl flex items-center justify-center font-bold text-xs font-mono">
                01
              </div>
              <h4 className="font-display font-black text-sm text-slate-850 uppercase tracking-tight">Authentic DPR Structuring</h4>
              <p className="text-xs text-slate-550 leading-relaxed text-slate-600">
                Our CA desk formulates realistic, bank-compliant Detailed Project Reports (DPR). This includes structuring precise CMA credit-worthiness reports, cash flow projections, split expense layouts and debt service coverage ratios (DSCR) that get instant banker approvals.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3.5 hover:border-blue-450 hover:bg-slate-50/40 transition">
              <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xs font-mono">
                02
              </div>
              <h4 className="font-display font-black text-sm text-slate-850 uppercase tracking-tight">Physical Audit Certification</h4>
              <p className="text-xs text-slate-550 leading-relaxed text-slate-600">
                To prevent state level rejections, we conduct physical pre-audits of your machine layout quotes, local power connections, land conversion papers (90-A orders), and pollution certs. We match your files with RIPS 2024 tax rebate grids before DIC inspectors visit.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3.5 hover:border-emerald-450 hover:bg-slate-50/40 transition">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xs font-mono">
                03
              </div>
              <h4 className="font-display font-black text-sm text-slate-850 uppercase tracking-tight">End-to-End Online Liaison</h4>
              <p className="text-xs text-slate-550 leading-relaxed text-slate-600">
                We manage complete digital tracking across nodal portals like Raj-SSO, KVIC PMEGP system, and state-level single windows. In addition, we prepare compliance replies to any administrative objections (re-queries) raised by DIC or nodal supervisors.
              </p>
            </div>
          </div>

          {/* Operational Pipeline Timeline Table */}
          <div className="border border-slate-200 bg-slate-50/50 rounded-2xl p-5 sm:p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-amber-500" />
              PHYSICAL COMPLIANCE & CONSULTING OPERATING FRAMEWORK
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                { step: 'Stage 1', name: 'Document Audit', desc: 'Conduct exhaustive feasibility audits matching physical documents (land registry, PAN logs).' },
                { step: 'Stage 2', name: 'DPR & CMA Writeup', desc: 'Consulting CAs draft standard project cost sheets, vendor quotes, & realistic balance sheets.' },
                { step: 'Stage 3', name: 'Nodal Filing', desc: 'File provisional applications under RIPS atau PMEGP portal using authorized state credentials.' },
                { step: 'Stage 4', name: 'Field Inspection', desc: 'Coordinate physical location checks with visiting government DIC inspectors to verify machinery.' },
                { step: 'Stage 5', name: 'Claim Cashback', desc: 'Issue Entitlement Certificates & track bank lock-in margin money transfers securely.' }
              ].map((stage, idx) => (
                <div key={idx} className="bg-white p-4.5 rounded-xl border border-slate-200 hover:shadow-xs transition flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wider block w-max mb-2">
                      {stage.step}
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 leading-snug">{stage.name}</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{stage.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Factual Statutory Scheme Specifications Panel */}
          <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-900 grid grid-cols-1 md:grid-cols-4 gap-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
            
            <div className="space-y-1.5 text-center md:text-left">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">Vishwakarma Yuva Protsahan Yojana</span>
              <h4 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white block" style={{ fontFamily: "'Times New Roman', Times, serif" }}>₹2.0 Crores</h4>
              <p className="text-xs text-slate-400">Exhaustive investment or loan subsidy credit support for promoting self-employment and skills under state schemes.</p>
            </div>

            <div className="space-y-1.5 text-center md:text-left border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest block">PMEGP Grant Ceiling</span>
              <h4 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white block">Up to 35%</h4>
              <p className="text-xs text-slate-400">Margin money capital subsidies registered directly through the central KVIC Nodal Portals.</p>
            </div>

            <div className="space-y-1.5 text-center md:text-left border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">Ambedkar Yojana Benefit</span>
              <h4 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-emerald-400 block">9.0% p.a.</h4>
              <p className="text-xs text-slate-400">Peak state interest subvention rebate provided securely for SC & ST community industrial operators.</p>
            </div>

            <div className="space-y-1.5 text-center md:text-left border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center">
              <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest block mb-1">State Nodal Liaison</span>
              <p className="text-xs text-slate-300 font-bold leading-relaxed">
                📍 Jaipur, Rajasthan
              </p>
              <p className="text-[10px] text-slate-500">
                Direct coordination office adjacent to District Industries Centre (DIC) divisions.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================== SERVICES SECTION ==================================== */}
        <section
          id="services-section_hub"
          className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 text-left space-y-8 scroll-mt-20 shadow-md shadow-slate-100"
        >
          <div className="max-w-3xl space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#1e3a8a] uppercase flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-700" />
              Comprehensive Advisory Service Portfolios
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-black text-slate-900 uppercase tracking-tight">
              Our Focused Subsidy & Industrial Consultancy Services
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We guide MSMEs and industrial units in securing maximum eligible refunds under statutory frameworks. Explore our fully comprehensive landscape directory.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Service 1 */}
            <div 
              onClick={() => setSelectedService("Industrial Subsidy Scheme In Rajasthan")}
              className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-blue-300 hover:shadow-md hover:scale-[1.005] hover:-translate-y-0.5 transition-all duration-300 group flex flex-col md:flex-row items-start gap-5 text-left cursor-pointer active:scale-95"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition duration-300 shrink-0">
                <Building className="h-5 w-5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-display font-bold text-sm sm:text-base text-slate-905 group-hover:text-[#1e3a8a] transition">
                    Industrial Subsidy Scheme In Rajasthan
                  </h4>
                  <span className="text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 px-2.5 py-0.5 rounded border border-amber-500/35 uppercase tracking-wider self-start">
                    RIPS 2024 / State GST concessions
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fast-track your capital subsidy files for up to 35% benefit or demand 75% SGST refund under active industrial incentives. Includes absolute coverage of RIPS policy guidelines, custom DPR filing, and physical verification support in Jaipur subdivisions.
                </p>
                <div className="pt-1.5 flex items-center gap-1.5 text-xs font-bold text-[#1e3a8a] group-hover:underline">
                  <span>View scheme details & documentation checklist</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            {/* Service 2 */}
            <div 
              onClick={() => setSelectedService("Vishwakarma Yuva Laghu Udyog Protsahan Yojana")}
              className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-blue-300 hover:shadow-md hover:scale-[1.005] hover:-translate-y-0.5 transition-all duration-300 group flex flex-col md:flex-row items-start gap-5 text-left cursor-pointer active:scale-95"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition duration-300 shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-display font-bold text-sm sm:text-base text-slate-905 group-hover:text-[#1e3a8a] transition">
                    Vishwakarma Yuva Laghu Udyog Protsahan Yojana
                  </h4>
                  <span className="text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 px-2.5 py-0.5 rounded border border-amber-500/35 uppercase tracking-wider self-start">
                    Youth Startups & Toolkit matching
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Obtain 25% direct machinery allocation grants plus interest discount loans for newly incorporated micro-enterprises. Designed specifically for young directors expanding their industrial plant footprints inside Rajasthan border subdivisions.
                </p>
                <div className="pt-1.5 flex items-center gap-1.5 text-xs font-bold text-[#1e3a8a] group-hover:underline">
                  <span>View scheme details & documentation checklist</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            {/* Service 3 */}
            <div 
              onClick={() => setSelectedService("Backward And Regional Upliftment Programme For Youth(BRUPY Yojana)")}
              className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-blue-300 hover:shadow-md hover:scale-[1.005] hover:-translate-y-0.5 transition-all duration-300 group flex flex-col md:flex-row items-start gap-5 text-left cursor-pointer active:scale-95"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition duration-300 shrink-0">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-display font-bold text-sm sm:text-base text-slate-905 group-hover:text-[#1e3a8a] transition">
                    Backward And Regional Upliftment Programme For Youth(BRUPY Yojana)
                  </h4>
                  <span className="text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 px-2.5 py-0.5 rounded border border-amber-500/35 uppercase tracking-wider self-start">
                    Rural & Remote Area enterprise funding
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dedicated margin money and physical credit guarantees targeting industrial setups in backward subdivisions of Rajasthan. Let our experts optimize land acquisition papers and subvention files for swift central nodal releases.
                </p>
                <div className="pt-1.5 flex items-center gap-1.5 text-xs font-bold text-[#1e3a8a] group-hover:underline">
                  <span>View scheme details & documentation checklist</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            {/* Service 4 */}
            <div 
              onClick={() => setSelectedService("Loan & Finance Consultant In Rajasthan")}
              className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-blue-300 hover:shadow-md hover:scale-[1.005] hover:-translate-y-0.5 transition-all duration-300 group flex flex-col md:flex-row items-start gap-5 text-left cursor-pointer active:scale-95"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition duration-300 shrink-0">
                <Coins className="h-5 w-5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-display font-bold text-sm sm:text-base text-slate-905 group-hover:text-[#1e3a8a] transition">
                    Loan & Finance Consultant In Rajasthan
                  </h4>
                  <span className="text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 px-2.5 py-0.5 rounded border border-amber-500/35 uppercase tracking-wider self-start">
                    Machinery loans & statutory DPR compilation
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Chartered accountant support to prepare bankable financial reports, term credits, and coordinate physical reviews. We guide micro-borrowers to align standard balance sheets with CGTMSE guarantee schemes in high confidence.
                </p>
                <div className="pt-1.5 flex items-center gap-1.5 text-xs font-bold text-[#1e3a8a] group-hover:underline">
                  <span>View scheme details & documentation checklist</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            {/* Service 5 */}
            <div 
              onClick={() => setSelectedService("PMEGP")}
              className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-blue-300 hover:shadow-md hover:scale-[1.005] hover:-translate-y-0.5 transition-all duration-300 group flex flex-col md:flex-row items-start gap-5 text-left cursor-pointer active:scale-95"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition duration-300 shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-display font-bold text-sm sm:text-base text-slate-905 group-hover:text-[#1e3a8a] transition">
                    PMEGP
                  </h4>
                  <span className="text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 px-2.5 py-0.5 rounded border border-amber-500/35 uppercase tracking-wider self-start">
                    Prime Minister's Employment Generation
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Submit manufacturing projects up to ₹50 Lakhs with legitimate direct KVIC nodal releases of up to 35% funding. Real-time physical guidance on preparing bankable machinery checklists, land conversion papers, and local audit clearances.
                </p>
                <div className="pt-1.5 flex items-center gap-1.5 text-xs font-bold text-[#1e3a8a] group-hover:underline">
                  <span>View scheme details & documentation checklist</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </div>

            {/* Service 6 CTA */}
            <div 
              onClick={() => {
                document.getElementById('contact-section_hub')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="bg-gradient-to-r from-[#1e3a8a] via-blue-900 to-slate-950 text-white p-6 rounded-2xl hover:brightness-110 transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer gap-4 shadow-md shadow-blue-900/10 hover:-translate-y-0.5"
            >
              <div className="space-y-1">
                <h4 className="font-display font-bold text-base text-amber-400">
                  Ready to Activate Your Statutory Subsidy Audit?
                </h4>
                <p className="text-xs text-blue-100 leading-relaxed max-w-xl">
                  Get a comprehensive project report alignment audit in under 3 minutes with our professional live CA desk consultation. Let us cross-check your machinery list safely.
                </p>
              </div>
              <div className="text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 font-mono bg-white/10 hover:bg-white/15 px-4 py-2.5 rounded-xl border border-white/10 transition shrink-0">
                <span>Start Free Audit</span>
                <span>→</span>
              </div>
            </div>
        </section>

        {/* ==================================== BLOG SECTION ==================================== */}
        <section
          id="blog-section_hub"
          className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 text-left space-y-8 scroll-mt-20 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200 pb-5">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#1e3a8a] uppercase flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-blue-700 animate-pulse" />
                Gazette Policy Insights & Notifications
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-black text-slate-900 uppercase tracking-tight">
                Latest Regulatory Columns & Bulletins
              </h3>
              <p className="text-xs text-slate-600">
                Keep up with the newest amendments issued by central ministries and the Government of Rajasthan. Click on any column to open the comprehensive detailed brief!
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-200/55 px-3 py-1 rounded-sm uppercase tracking-wider font-extrabold">3 Active Columns</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Post 1 */}
            <article 
              onClick={() => { setCurrentView('blog'); setActiveBlogPostId('rips-2024'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col justify-between h-[290px] shadow-sm hover:shadow-md hover:border-amber-400 group cursor-pointer active:scale-[0.98] transition-all duration-300"
              id="article-card-rips"
            >
              <div className="p-5.5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-amber-600 font-mono font-bold uppercase">
                    <Calendar className="h-3 w-3" />
                    <span>MAY 15, 2026</span>
                  </div>
                  <span className="text-[9px] bg-amber-50 text-amber-800 font-semibold px-2 py-0.5 rounded font-mono border border-amber-100 uppercase scale-90">RIPS</span>
                </div>
                <h4 className="font-display font-black text-sm sm:text-base text-slate-900 group-hover:text-blue-700 transition line-clamp-2 leading-snug">
                  Demystifying Rajasthan RIPS 2024 Interest Subvention & SGST Rebates
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  A deep dive into how manufacturing units can leverage the 5%–7% loan concessions and 75% Net SGST cashbacks under the newly authorized state policy gazette.
                </p>
              </div>
              <div className="p-5 pt-0 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> 6 Min Read
                </span>
                <span className="text-blue-700 font-bold group-hover:translate-x-1 transition-all">Read Column ➔</span>
              </div>
            </article>

            {/* Post 2 */}
            <article 
              onClick={() => { setCurrentView('blog'); setActiveBlogPostId('cold-chain'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col justify-between h-[290px] shadow-sm hover:shadow-md hover:border-blue-400 group cursor-pointer active:scale-[0.98] transition-all duration-300"
              id="article-card-cold"
            >
              <div className="p-5.5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-blue-650 font-mono font-bold uppercase">
                    <Calendar className="h-3 w-3" />
                    <span>APR 20, 2026</span>
                  </div>
                  <span className="text-[9px] bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 rounded font-mono border border-blue-100 uppercase scale-90">Agro Policy</span>
                </div>
                <h4 className="font-display font-black text-sm sm:text-base text-slate-900 group-hover:text-blue-700 transition line-clamp-2 leading-snug">
                  State Capital Subsidy Roadmap for Agro-Processing, Cold Storages & Rice Mills
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  Comprehensive validation of files, supplier machinery layouts, and land conversion papers needed for up to ₹50 Lakhs marketing board grants.
                </p>
              </div>
              <div className="p-5 pt-0 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> 8 Min Read
                </span>
                <span className="text-blue-700 font-bold group-hover:translate-x-1 transition-all">Read Column ➔</span>
              </div>
            </article>

            {/* Post 3 */}
            <article 
              onClick={() => { setCurrentView('blog'); setActiveBlogPostId('cgtmse-solar'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col justify-between h-[290px] shadow-sm hover:shadow-md hover:border-purple-400 group cursor-pointer active:scale-[0.98] transition-all duration-300"
              id="article-card-cgtmse"
            >
              <div className="p-5.5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-purple-600 font-mono font-bold uppercase">
                    <Calendar className="h-3 w-3" />
                    <span>MAR 29, 2026</span>
                  </div>
                  <span className="text-[9px] bg-purple-50 text-purple-800 font-semibold px-2 py-0.5 rounded font-mono border border-purple-100 uppercase scale-90">Mortgage Cover</span>
                </div>
                <h4 className="font-display font-black text-sm sm:text-base text-slate-900 group-hover:text-blue-700 transition line-clamp-2 leading-snug">
                  How CGTMSE is Fueling Mortgage-Free Term Credit for Solar Roofs & Plant Expansion
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  Understand how your enterprise can obtain credit guarantees of up to ₹5 Crores without delivering external land mortgage security to banks.
                </p>
              </div>
              <div className="p-5 pt-0 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> 5 Min Read
                </span>
                <span className="text-blue-700 font-bold group-hover:translate-x-1 transition-all">Read Column ➔</span>
              </div>
            </article>
          </div>
        </section>

        {/* ==================================== REVIEWS SECTION ==================================== */}
        <section
          id="reviews-section_hub"
          className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 text-left space-y-8 scroll-mt-20 shadow-sm"
        >
          <div className="max-w-3xl space-y-1">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#1e3a8a] uppercase flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              Verified Industrial Success Stories & Star Ratings
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-black text-slate-900 uppercase tracking-tight">
              Testimonials From Industrial Promoters & Directors
            </h3>
            <p className="text-xs text-slate-600">
              Hear from active manufacturers who leveraged modern capital policies safely under our professional chartered consultancy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Review 5 Star */}
            <blockquote className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-3 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 italic leading-relaxed">
                  "Finding RIPS 2024 compliance routes for our textile spinning plant seemed incredibly complex. Mr. Yogesh Sharma restructured our machinery term loan file with absolute precision. We successfully obtained electricity waivers in Jaipur!"
                </p>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <strong className="text-xs text-slate-850 block">Aditya Maheshwari</strong>
                <span className="text-[9px] text-[#1e3a8a] uppercase font-bold font-mono">Director, Maheshwari Spintex (Sanganer)</span>
              </div>
            </blockquote>

            {/* Review 5 Star */}
            <blockquote className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-3 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 italic leading-relaxed">
                  "We applied for our food packing unit subsidy under the PMFME scheme. SubsidySetu handled everything from our DPR preparation to DIC physical coordinate interface. Truly professional and reliable chartered compliance guides."
                </p>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <strong className="text-xs text-slate-850 block">Smt. Meera Shekhawat</strong>
                <span className="text-[9px] text-[#1e3a8a] uppercase font-bold font-mono">Proprietor, Mewar Agro Foods & Packages</span>
              </div>
            </blockquote>

            {/* Review 4 Star */}
            <blockquote className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-3 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                  <Star className="h-3.5 w-3.5 text-slate-300" />
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 italic leading-relaxed">
                  "Extremely satisfied with our ceramic plant audit. The bank subsidy release was coordinated with absolute mastery. It took slightly longer due to regional bank clearances, but we got the full interest subvention files matched!"
                </p>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <strong className="text-xs text-slate-850 block">Rajesh Kumawat</strong>
                <span className="text-[9px] text-[#1e3a8a] uppercase font-bold font-mono">Managing Director, Kumawat Ceramics (Sikar)</span>
              </div>
            </blockquote>

            {/* Review 3 Star */}
            <blockquote className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-3 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(3)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                  {[...Array(2)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 text-slate-300 animate-pulse" />
                  ))}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 italic leading-relaxed">
                  "Applied for solar tube-well grants in Sanganer. Though local government procedural clearances were extremely slow, the team at SubsidySetu guided us persistently until KVIC funds finalized."
                </p>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <strong className="text-xs text-slate-850 block">Mahendra Singh</strong>
                <span className="text-[9px] text-[#1e3a8a] uppercase font-bold font-mono">Proprietor, Krishna Cold Storages</span>
              </div>
            </blockquote>
          </div>
        </section>
          </>
        ) : (
          <div className="space-y-8 animate-fadeIn" id="standalone-blog-view">
            {/* Header / Breadcrumb */}
            <div className="bg-[#1e1e2d] text-white rounded-3xl p-6 sm:p-8 border border-slate-850 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                <button 
                  onClick={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition"
                >
                  Home
                </button>
                <span>/</span>
                <span className="text-white font-semibold">Policy Publications Hub</span>
              </div>
              <div className="max-w-3xl space-y-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                  SubsidySetu Official Gazette Archives
                </span>
                <h2 className="text-xl sm:text-3xl font-display font-black uppercase tracking-tight text-white">
                  Central & State Regulatory Columns
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-left">
                  Keeping up with standard notifications, compliance requirements, and machine layout check audits direct from former bank credit appraisers and chartered accountants.
                </p>
              </div>

              {/* Filters & Search */}
              <div className="pt-5 flex flex-col md:flex-row gap-4 items-center justify-between border-t border-slate-800">
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  {[
                    { id: 'all', label: 'All Columns' },
                    { id: 'rips', label: 'RIPS 2024' },
                    { id: 'agro', label: 'Agro Policies' },
                    { id: 'credit', label: 'Credit Guarantees' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setSelectedBlogTab(tab.id as any);
                        setActiveBlogPostId(null);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedBlogTab === tab.id
                          ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    value={blogSearchQuery}
                    onChange={(e) => {
                      setBlogSearchQuery(e.target.value);
                      setActiveBlogPostId(null);
                    }}
                    placeholder="Search columns..."
                    className="w-full bg-white/5 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {activeBlogPostId && ARTICLES_DATA[activeBlogPostId] ? (() => {
              const selectedArticle = ARTICLES_DATA[activeBlogPostId];
              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left animate-fadeIn">
                  {/* Column Left: Reading body */}
                  <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
                    <button
                      onClick={() => setActiveBlogPostId(null)}
                      className="text-xs font-bold text-blue-700 hover:text-amber-600 transition flex items-center gap-1.5"
                    >
                      <span>←</span>
                      <span>Back to Publications Feed</span>
                    </button>

                    <div className="space-y-4">
                      <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-3 py-1 rounded uppercase">
                        {selectedArticle.category}
                      </span>
                      <h1 className="font-display font-black text-xl sm:text-2xl text-slate-900 leading-tight">
                        {selectedArticle.title}
                      </h1>
                      <div className="flex items-center gap-4 text-[11px] text-slate-500 border-b border-slate-100 pb-4 font-mono uppercase font-bold">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-blue-700" /> {selectedArticle.date}</span>
                        <span>|</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-blue-700" /> {selectedArticle.readTime}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-850 leading-relaxed bg-slate-50 p-4 border-l-4 border-amber-500 rounded-r-xl">
                      {selectedArticle.intro}
                    </p>

                    <div className="space-y-6">
                      {selectedArticle.sections.map((sec, sIdx) => (
                        <div key={sIdx} className="space-y-3">
                          <h3 className="font-display font-black text-xs sm:text-sm text-slate-950 uppercase border-b border-slate-100 pb-1.5">
                            {sec.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {sec.content}
                          </p>
                          {sec.bullets && (
                            <ul className="space-y-2 mt-2 pl-4 border-l-2 border-slate-100">
                              {sec.bullets.map((b, bIdx) => (
                                <li key={bIdx} className="text-xs sm:text-sm text-slate-605 flex items-start gap-2">
                                  <span className="text-amber-500 font-extrabold">•</span>
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Checklist portion */}
                    {selectedArticle.checklistTitle && (
                      <div className="bg-slate-950 text-white rounded-2xl p-5 sm:p-6 space-y-4">
                        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                          🎁 {selectedArticle.checklistTitle}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-left">
                          {selectedArticle.checklistItems?.map((item, key) => (
                            <div key={key} className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition">
                              <span className="text-emerald-400 font-bold block shrink-0">✔</span>
                              <span className="text-slate-300 block">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* FAQ portion */}
                    <div className="space-y-4">
                      <h3 className="font-display font-black text-xs sm:text-sm text-slate-950 uppercase">
                        Frequently Asked Questions (Filing & Compliance)
                      </h3>
                      <div className="space-y-3">
                        {selectedArticle.faqs.map((faq, fIdx) => (
                          <div key={fIdx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-left">
                            <strong className="block text-slate-905 pb-1 font-semibold">Q: {faq.q}</strong>
                            <p className="text-slate-600 leading-relaxed text-xs">{faq.a}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 text-xs text-slate-750">
                      <strong className="block text-amber-850 pb-1 font-display uppercase tracking-wider">Strategic Consultant Takeaway:</strong>
                      {selectedArticle.finalTakeaway}
                    </div>
                  </div>

                  {/* Column Right: Expert Advisory Details Card */}
                  <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                    <div className="bg-gradient-to-br from-[#1e3a8a] via-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-6 border border-slate-850 space-y-5">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-[#f59e0b] uppercase block">
                        📞 DIRECT STATE FILE LIAISON
                      </span>
                      <div className="space-y-1">
                        <h4 className="font-display font-black text-sm uppercase tracking-tight text-white">Yogesh Sharma</h4>
                        <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block font-mono">Chief MSME Consultant</span>
                      </div>
                      <p className="text-[11.5px] text-slate-300 leading-relaxed">
                        Need help preparing CA-certified project reports or drafting CMA finance sheets for this scheme? Reach out immediately.
                      </p>
                      <div className="space-y-3.5 text-xs">
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                          <span className="text-amber-400 font-bold block w-10">TEL:</span>
                          <a href="tel:8741009775" className="font-bold text-white hover:text-amber-400 transition">+91 87410 09775</a>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-amber-400 font-bold block w-10">MAIL:</span>
                          <a href="mailto:taxca2@gmail.com" className="font-bold text-white hover:text-amber-400 transition">taxca2@gmail.com</a>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          document.getElementById('contact-section_hub')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                        className="w-full text-center bg-amber-500 hover:bg-amber-600 font-bold text-slate-950 py-3 rounded-xl text-xs uppercase tracking-widest transition"
                      >
                        Process Scheme Now
                      </button>
                    </div>

                    {/* Navigation Links inside article column to see other publications */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4">
                      <h4 className="font-display font-black text-xs text-slate-900 uppercase">Other Regulatory Columns</h4>
                      <div className="space-y-3">
                        {Object.entries(ARTICLES_DATA)
                          .filter(([id]) => id !== activeBlogPostId)
                          .map(([id, post]) => (
                            <div
                              key={id}
                              onClick={() => {
                                setActiveBlogPostId(id);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-amber-400 cursor-pointer transition text-xs"
                            >
                              <span className="text-[9px] font-semibold text-amber-600 block uppercase font-mono">{post.date}</span>
                              <span className="font-bold text-slate-800 hover:text-blue-700 transition line-clamp-2 mt-0.5 leading-snug">{post.title}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })() : (() => {
              const filteredArticles = Object.entries(ARTICLES_DATA).filter(([id, article]) => {
                // 1. Tab filter
                if (selectedBlogTab === 'rips' && id !== 'rips-2024') return false;
                if (selectedBlogTab === 'agro' && id !== 'cold-chain') return false;
                if (selectedBlogTab === 'credit' && id !== 'cgtmse-solar') return false;

                // 2. Search query filter
                if (blogSearchQuery) {
                  const q = blogSearchQuery.toLowerCase();
                  const titleMatch = article.title.toLowerCase().includes(q);
                  const introMatch = article.intro.toLowerCase().includes(q);
                  return titleMatch || introMatch;
                }

                return true;
              });

              return (
                <div className="space-y-6">
                  {filteredArticles.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500">
                      <p className="font-bold text-slate-700">No columns matches found</p>
                      <p className="text-xs text-slate-400 mt-1">Try testing other keywords like RIPS, Solar or Agro.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {filteredArticles.map(([id, post]) => (
                        <article 
                          key={id}
                          onClick={() => {
                            setActiveBlogPostId(id);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col justify-between h-[300px] shadow-sm hover:shadow-md hover:border-amber-400 group cursor-pointer active:scale-[0.98] transition-all duration-300"
                        >
                          <div className="p-6 space-y-4 text-left">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold text-amber-600 font-mono block uppercase">{post.date}</span>
                              <span className="text-[9px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono border border-slate-200 uppercase">{post.readTime}</span>
                            </div>
                            <h4 className="font-display font-black text-sm text-slate-900 group-hover:text-blue-700 transition line-clamp-2 leading-snug">
                              {post.title}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                              {post.intro}
                            </p>
                          </div>
                          <div className="p-5 pt-0 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                            <span className="text-slate-500 uppercase font-black text-[9px] tracking-wider">{post.category}</span>
                            <span className="text-blue-700 font-bold group-hover:translate-x-1 transition-all">Read Column ➔</span>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* ==================================== CONTACT SECTION ==================================== */}
        <section
          id="contact-section_hub"
          className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 text-left scroll-mt-20 overflow-hidden relative shadow-md shadow-slate-100"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -z-10" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-sm sm:text-base font-black tracking-wider text-blue-800 uppercase block">
                📞 DIRECT NODAL CONSULTATIVE DESK
              </span>
              <h3 className="text-xl sm:text-3xl font-display font-black text-slate-900 uppercase tracking-tight">
                Start Your Statutory Subsidy Audit Right Now
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Fill this parameter checklist or approach our corporate branch in Gopalpura, Jaipur. Let our specialist CA desk analyze your DPR machinery list before bank term filing.
              </p>
              
              <div className="space-y-3 pt-2 text-xs text-slate-655">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block font-medium text-slate-550">National Helpline Support Desk</span>
                    <strong className="text-slate-900">+91 89490 59447</strong>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block font-medium text-slate-550">Compliance Electronic Mailbox</span>
                    <strong className="text-slate-900">taxca2@gmail.com</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs">
              <form onSubmit={(e) => { e.preventDefault(); alert('Query submitted. Nodal coordinator Yogesh Sharma will contact you shortly.'); }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Yogesh Kumar"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Cell Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 94140 XXXXX"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Project Layout City / district</label>
                  <input
                     type="text"
                     required
                     placeholder="e.g. Jaipur, Jodhpur, Kota"
                     className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Machinery Setup & Capital Details</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe your food mill machines, solar kW needs or textile looms..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition duration-300 shadow-md shadow-blue-105"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Request Call Back</span>
                </button>
              </form>
            </div>
          </div>
        </section>

      </main>

      {/* Guide Booklet Modal Overlay */}
      {showGuideModal && (
        <SchemeGuide
          onClose={() => setShowGuideModal(false)}
          initialTab={modalInitialTab}
          initialIndex={modalInitialIndex}
        />
      )}

      {/* Dynamic Service Detail Modal Overlay */}
      {selectedService && (
        <ServiceDetailModal
          serviceName={selectedService}
          onClose={() => setSelectedService(null)}
          onOpenChat={() => {
            setActiveSecondaryTab('chat');
            const element = document.getElementById('column-right-layout');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* Dynamic Blog Post Detail Modal Overlay */}
      {selectedBlogPostId && (
        <BlogDetailModal
          postId={selectedBlogPostId}
          onClose={() => setSelectedBlogPostId(null)}
          onOpenChat={() => {
            setActiveSecondaryTab('chat');
            const element = document.getElementById('column-right-layout');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* Corporate footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 mt-16 shrink-0" id="corporate-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Column 1: Brand details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-md">
                  <div className="w-4 h-4 border-2 border-white rotate-45"></div>
                </div>
                <span className="text-xl font-extrabold tracking-tight text-white italic underline decoration-blue-500 underline-offset-4">
                  SubsidySetu
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empowering Indian MSME industrial setups, cold storages, rice mills, solar parks and textile plants to access legitimate capital incentives of up to 35% safely.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => handleOpenGuideWithScheme('rajasthan', 0)}
                  className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-all shadow-md shadow-blue-900/40"
                  id="footer-guide-link"
                >
                  <ClipboardList className="h-3.5 w-3.5" />
                  <span>Open Active Guide</span>
                </button>
              </div>
            </div>

            {/* Column 2: Meet the Founder */}
            <div className="space-y-4">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2">
                <User className="h-4 w-4 text-blue-400" />
                <span>Founder Profile</span>
              </h4>
              <div className="space-y-2">
                <span className="text-sm font-semibold text-white block">Yogesh Sharma</span>
                <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">Founder & Chief Consultant</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Leading authority specializing in industrial policy structures, detailed project reports (DPR), bankable proposals, and central/state subsidy matching guidelines.
                </p>
              </div>
            </div>

            {/* Column 3: Contact Helpline */}
            <div className="space-y-4">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <span>Support & Helpline</span>
              </h4>
              <div className="space-y-3">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Connect directly with our policy advisory desk for physical filing coordination or eligibility review.
                </p>
                <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-xl space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-mono">Direct CA Hotline 1</span>
                    <a 
                      href="tel:8741009775" 
                      className="text-white hover:text-blue-400 text-sm font-bold block transition"
                      id="footer-phone-cta-1"
                    >
                      +91 8741009775
                    </a>
                  </div>
                  <div className="border-t border-slate-800/80 pt-1.5">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-mono">Direct CA Hotline 2</span>
                    <a 
                      href="tel:8619464250" 
                      className="text-white hover:text-blue-400 text-sm font-bold block transition"
                      id="footer-phone-cta-2"
                    >
                      +91 8619464250
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 4: Corporate Headquarters */}
            <div className="space-y-4">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span>Corporate Office</span>
              </h4>
              <div className="space-y-2 text-xs text-slate-400">
                <strong className="text-slate-200 block">Jaipur Office HQ:</strong>
                <p className="leading-relaxed text-xs text-slate-400">
                  B-1, C-2 Krishna Enclave,<br />
                  Lata Nagar (Near Burger Farm),<br />
                  Kalwar Road, Jhotwara,<br />
                  Jaipur, Rajasthan - 302012
                </p>
               <div className="mt-3 overflow-hidden rounded-xl border border-slate-800 w-full bg-slate-950" id="footer-google-map-container">
  <iframe
    title="SubsidySetu Google Map"
    src="https://maps.google.com/maps?q=B-1%2C%20C-2%20Krishna%20Enclave%2C%20Lata%20Nagar%2C%20Near%20Burger%20Farm%2C%20Kalwar%20Road%2C%20Jhotwara%2C%20Jaipur%20Rajasthan%20302012&t=&z=16&ie=UTF8&iwloc=&output=embed"
    width="100%"
    height="250"
    style={{ border: 0 }}
    allowFullScreen={false}
    loading="lazy"
    referrerPolicy="no-referrer"
  />
</div>
