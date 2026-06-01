/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BusinessProfile, IndustryType, EntityType, StateType } from '../types';
import {
  Building2,
  Coins,
  MapPin,
  CircleHelp,
  Briefcase,
  Layers,
  User,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface EligibilityFormProps {
  onEvaluate: (profile: BusinessProfile) => void;
  isLoading: boolean;
  initialProfile?: BusinessProfile;
}

const INDUSTRIES: { value: IndustryType; label: string; desc: string }[] = [
  { value: 'manufacturing', label: 'Manufacturing & Engineering', desc: 'Factories, machinery, parts, fabrication' },
  { value: 'food_processing', label: 'Food Processing & Agro', desc: 'Flour mills, cold stores, packed products, dairy' },
  { value: 'renewable_solar', label: 'Renewable Power & Solar', desc: 'Green energy integration, solar power plants' },
  { value: 'textiles', label: 'Textiles & Garments', desc: 'Spinning, weaving, tailoring units' },
  { value: 'it_tech', label: 'IT Services & Tech Startups', desc: 'Software development, consulting, hardware services' },
  { value: 'services', label: 'General Services & Logistics', desc: 'Hospitals, hotels, warehouses, retail infrastructure' },
  { value: 'agriculture', label: 'Primary Agriculture Allied', desc: 'Farm mechanization, fisheries, organic composting' },
];

const ENTITIES: { value: EntityType; label: string }[] = [
  { value: 'proprietorship', label: 'Proprietorship' },
  { value: 'partnership', label: 'Partnership Firm' },
  { value: 'llp', label: 'Limited Liability Partnership (LLP)' },
  { value: 'pvt_ltd', label: 'Private Limited Company' },
  { value: 'cooperative', label: 'Cooperative Society / FPO' },
];

const STATES: StateType[] = [
  'Maharashtra',
  'Gujarat',
  'Uttar Pradesh',
  'Tamil Nadu',
  'Karnataka',
  'Rajasthan',
  'Madhya Pradesh',
  'Haryana',
  'West Bengal',
  'Other',
];

export default function EligibilityForm({ onEvaluate, isLoading, initialProfile }: EligibilityFormProps) {
  const [profile, setProfile] = useState<BusinessProfile>(
    initialProfile || {
      companyName: '',
      industryType: 'manufacturing',
      investment: 25,
      turnover: 50,
      state: 'Rajasthan',
      entityType: 'pvt_ltd',
      locationArea: 'urban',
      socialCategory: 'general',
      gender: 'male',
      operationalStage: 'new',
      hasUdyam: true,
      powerRequiredKw: 15,
    }
  );

  const [activeTab, setActiveTab] = useState<'profile' | 'financials' | 'owner'>('profile');

  const handleChange = (key: keyof BusinessProfile, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEvaluate(profile);
  };

  const formatLakhsToCrores = (lakhs: number) => {
    if (lakhs >= 100) {
      const cr = lakhs / 100;
      return `₹${cr.toFixed(2)} Crore`;
    }
    return `₹${lakhs} Lakhs`;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-slate-800 transition-all duration-300 hover:border-slate-300/50">
      {/* Visual Banner */}
      <div className="bg-[#1e3a8a] px-6 py-5 text-white flex items-center justify-between border-b border-slate-200">
        <div>
          <h2 className="font-display font-black text-xs tracking-wider uppercase text-white">Subsidy Screener & Eligibility Radar</h2>
          <p className="text-[10px] text-blue-250 mt-1 uppercase font-mono tracking-wider">Provide credentials to search active Central & State incentives</p>
        </div>
        <div className="bg-amber-400/15 border border-amber-400/30 text-amber-400 px-2.5 py-1 rounded-lg text-[9px] uppercase font-bold tracking-widest font-mono">
          FY 2026-27 Active
        </div>
      </div>

      {/* Internal Tabs for wizard navigation */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'profile'
              ? 'border-amber-500 text-amber-600 bg-white font-black'
              : 'border-transparent text-slate-500 hover:text-slate-850 hover:bg-slate-100/60'
          }`}
          id="tab-btn-profile"
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>1. Business Profile</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('financials')}
          className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'financials'
              ? 'border-amber-500 text-amber-600 bg-white font-black'
              : 'border-transparent text-slate-500 hover:text-slate-850 hover:bg-slate-100/60'
          }`}
          id="tab-btn-financials"
        >
          <Coins className="h-3.5 w-3.5" />
          <span>2. Financial Scale</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('owner')}
          className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'owner'
              ? 'border-amber-500 text-amber-600 bg-white font-black'
              : 'border-transparent text-slate-500 hover:text-slate-850 hover:bg-slate-100/60'
          }`}
          id="tab-btn-owner"
        >
          <User className="h-3.5 w-3.5" />
          <span>3. Promoter Bio</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* TAB 1: PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            {/* Business Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                Company or Project Name
              </label>
              <input
                type="text"
                value={profile.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="e.g., Satyam Agro Food Processors"
                className="w-full text-sm text-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition"
                required
                id="input-company-name"
              />
            </div>

            {/* Industrial Sector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                Industry Sector Classification
              </label>
              <select
                value={profile.industryType}
                onChange={(e) => handleChange('industryType', e.target.value as IndustryType)}
                className="w-full text-sm text-slate-800 px-4 py-2.5 rounded-xl bg-white border border-slate-200 outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition"
                id="select-industry"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind.value} value={ind.value}>
                    {ind.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                {INDUSTRIES.find((x) => x.value === profile.industryType)?.desc}
              </p>
            </div>

            {/* Stage and Entity Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-slate-400" />
                  Operational Stage
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange('operationalStage', 'new')}
                    className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                      profile.operationalStage === 'new'
                        ? 'border-blue-700 bg-blue-50 text-blue-800 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                    id="btn-stage-new"
                  >
                    New proposed Unit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('operationalStage', 'existing')}
                    className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                      profile.operationalStage === 'existing'
                        ? 'border-blue-700 bg-blue-50 text-blue-800 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                    id="btn-stage-existing"
                  >
                    Existing / Expansion
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  Entity Constitution
                </label>
                <select
                  value={profile.entityType}
                  onChange={(e) => handleChange('entityType', e.target.value as EntityType)}
                  className="w-full text-sm text-slate-800 px-4 py-2.5 rounded-xl bg-white border border-slate-200 outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition"
                  id="select-entity"
                >
                  {ENTITIES.map((ent) => (
                    <option key={ent.value} value={ent.value}>
                      {ent.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* State and Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  State Location
                </label>
                <select
                  value={profile.state}
                  onChange={(e) => handleChange('state', e.target.value as StateType)}
                  className="w-full text-sm text-slate-800 px-4 py-2.5 rounded-xl bg-white border border-slate-200 outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition"
                  id="select-state"
                >
                  {STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">Triggers local state SGST & stamp duty rules.</p>
              </div>
  
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  Classification Area
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange('locationArea', 'urban')}
                    className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                      profile.locationArea === 'urban'
                        ? 'border-blue-700 bg-blue-50 text-blue-800 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                    id="btn-area-urban"
                  >
                    Urban (Municipal)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('locationArea', 'rural')}
                    className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                      profile.locationArea === 'rural'
                        ? 'border-blue-700 bg-blue-50 text-blue-800 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                    id="btn-area-rural"
                  >
                    Rural (Gram Panchayat)
                  </button>
                </div>
                <p className="text-[10px] text-emerald-600 font-medium mt-1">
                  {profile.locationArea === 'rural' && '✓ Rural triggers PMEGP premium rates (+10% extra benefit).'}
                </p>
              </div>
            </div>

            {/* Custom Power input if applicable */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-slate-400" />
                  Estimated Connected Energy Grid Load (kW)
                </span>
                <span className="text-[10px] text-blue-600 font-semibold">For Solar analysis</span>
              </label>
              <input
                type="number"
                value={profile.powerRequiredKw || ''}
                onChange={(e) => handleChange('powerRequiredKw', parseInt(e.target.value) || 0)}
                placeholder="e.g., 25"
                min="0"
                className="w-full text-sm text-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition"
                id="input-power"
              />
            </div>
          </div>
        )}

        {/* TAB 2: FINANCIAL SCALE */}
        {activeTab === 'financials' && (
          <div className="space-y-5">
            {/* Investment Box with custom visual slider */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Coins className="h-4 w-4 text-blue-700" />
                  Plant & Machinery Investment
                </label>
                <span className="text-sm font-bold text-blue-700 bg-white border border-blue-100 px-2.5 py-1 rounded-lg">
                  {formatLakhsToCrores(profile.investment)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">Capital value of machinery (excl. basic land cost) in INR Lakhs.</p>
              <input
                type="range"
                min="5"
                max="1000"
                step="5"
                value={profile.investment}
                onChange={(e) => handleChange('investment', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
                id="slider-investment"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1.5">
                <span>₹5L</span>
                <span>₹50L (Micro limit)</span>
                <span>₹5Cr (Small limit)</span>
                <span>₹10Cr (Max)</span>
              </div>
            </div>

            {/* Turnover with visual slider */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Coins className="h-4 w-4 text-blue-700" />
                  Estimated Annual Turnover
                </label>
                <span className="text-sm font-bold text-blue-700 bg-white border border-blue-100 px-2.5 py-1 rounded-lg">
                  {formatLakhsToCrores(profile.turnover)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">Target annual receipts / top-line revenue in INR Lakhs.</p>
              <input
                type="range"
                min="5"
                max="5000"
                step="10"
                value={profile.turnover}
                onChange={(e) => handleChange('turnover', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
                id="slider-turnover"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1.5">
                <span>₹5L</span>
                <span>₹2.5Cr</span>
                <span>₹25Cr (Small limit)</span>
                <span>₹50Cr (Max)</span>
              </div>
            </div>

            {/* Udyam MSME Toggle Card */}
            <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <div className="flex space-x-3 items-start">
                <CheckCircle2 className="h-5 w-5 text-blue-700 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">Udyam Registration Status</h4>
                  <p className="text-[11px] text-blue-700/80 mt-0.5">Most capital subsidies mandate active MSME Udyam Aadhaar numbers.</p>
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => handleChange('hasUdyam', !profile.hasUdyam)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    profile.hasUdyam ? 'bg-blue-700' : 'bg-slate-200'
                  }`}
                  id="toggle-udyam"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      profile.hasUdyam ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Helper Alert */}
            <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-100 text-amber-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">MSME Classification Alert</span>
                Based on current figures, your company falls in the{' '}
                <strong className="underline">
                  {profile.investment <= 100 && profile.turnover <= 500
                    ? 'Micro-Enterprise'
                    : profile.investment <= 1000 && profile.turnover <= 5000
                    ? 'Small-Enterprise'
                    : 'Medium-Enterprise'}
                </strong>{' '}
                category of MSMEs under the latest Ministry notification.
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: promoter profiling */}
        {activeTab === 'owner' && (
          <div className="space-y-4">
            {/* Social Classification */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-400" />
                Promoter Social category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['general', 'obc', 'sc', 'st', 'minority'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleChange('socialCategory', cat)}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all truncate text-left flex justify-between items-center ${
                      profile.socialCategory === cat
                        ? 'border-blue-700 bg-blue-50 text-blue-800 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                    id={`btn-social-${cat}`}
                  >
                    <span>{cat === 'general' ? 'General Class' : cat.toUpperCase()}</span>
                    {profile.socialCategory === cat && (
                      <span className="w-2 h-2 rounded-full bg-blue-700"></span>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Special classes unlock higher PMEGP subsidy slabs (e.g. up to 35%).</p>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-400" />
                Gender of Sponsoring Owner
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other/Co' },
                ].map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => handleChange('gender', g.value)}
                    className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                      profile.gender === g.value
                        ? 'border-blue-700 bg-blue-50 text-blue-800 font-semibold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                    id={`btn-gender-${g.value}`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
              {profile.gender === 'female' && (
                <p className="text-[10px] text-emerald-600 font-medium mt-1">
                  ✓ Women-led setups are classified as special category under central policies.
                </p>
              )}
            </div>

            {/* Summary details */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs text-slate-600 space-y-2">
              <h5 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">Evaluation Context summary</h5>
              <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
                <div>Plant Location: <strong className="text-slate-800 uppercase">{profile.locationArea}</strong></div>
                <div>Category: <strong className="text-slate-800 uppercase">{profile.socialCategory}</strong></div>
                <div>Operational Type: <strong className="text-slate-800 uppercase">{profile.operationalStage}</strong></div>
                <div>Industry: <strong className="text-slate-800 uppercase">{profile.industryType.replace('_', ' ')}</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* Universal submit action */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="hidden sm:block text-xs text-slate-500">
            {activeTab === 'profile' && 'Proceed to Financials tab setup →'}
            {activeTab === 'financials' && 'Proceed to Owner profile bio tab →'}
            {activeTab === 'owner' && 'Click Screen Subsidies below'}
          </div>
          <div className="flex space-x-2 w-full sm:w-auto">
            {activeTab !== 'profile' && (
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'owner' ? 'financials' : 'profile')}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition text-sm font-medium"
                id="btn-form-prev"
              >
                Previous
              </button>
            )}
            
            {activeTab !== 'owner' ? (
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'profile' ? 'financials' : 'owner')}
                className="flex-grow sm:flex-initial bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl transition text-sm font-medium"
                id="btn-form-next"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="flex-grow sm:flex-initial bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl transition text-sm font-bold disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg shadow-blue-200"
                id="btn-form-submit"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin"></span>
                    <span>AI Auditing...</span>
                  </>
                ) : (
                  <span>Screen Subsidies</span>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
