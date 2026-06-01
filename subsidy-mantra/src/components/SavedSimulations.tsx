/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EvaluationResult } from '../types';
import {
  FileText,
  Trash2,
  CalendarDays,
  Coins,
  ArrowUpRight,
  MapPin,
  ClipboardCheck,
  Building,
  GraduationCap
} from 'lucide-react';

interface SavedSimulationsProps {
  cases: { id: string; name: string; result: EvaluationResult }[];
  onSelect: (result: EvaluationResult) => void;
  onDelete: (id: string) => void;
}

export default function SavedSimulations({ cases, onSelect, onDelete }: SavedSimulationsProps) {
  if (cases.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-205 p-6 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-450 mb-3 border border-slate-150">
          <FileText className="h-5 w-5 text-slate-400" />
        </div>
        <h4 className="font-display font-medium text-slate-800 text-xs uppercase tracking-wider">No cases saved yet</h4>
        <p className="text-[11px] text-slate-500 max-w-xs mt-1">
          Perform a screener search and click 'Save Simulation Case' in the results pane to record cases here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl transition hover:border-slate-350/50">
      <div className="bg-[#1e3a8a] p-4 px-5 border-b border-blue-900">
        <h4 className="font-display font-bold text-white text-xs uppercase tracking-widest flex items-center justify-between">
          <span>Active Client Simulations ({cases.length})</span>
          <span className="text-[10px] text-amber-400 font-mono font-bold">Case Board Active</span>
        </h4>
      </div>

      <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto bg-slate-50/50">
        {cases.map((cs) => {
          const { profile, totalEstimatedBenefit, overallScore, timestamp } = cs.result;

          return (
            <div
              key={cs.id}
              className="p-4 hover:bg-slate-100 transition flex items-center justify-between group"
              id={`case-item-${cs.id}`}
            >
              <div className="flex-1 pr-3 cursor-pointer" onClick={() => onSelect(cs.result)}>
                <div className="flex items-center space-x-2">
                  <span className="font-display font-bold text-xs text-slate-800 group-hover:text-amber-600 transition">
                    {cs.name}
                  </span>
                  <span className="bg-blue-50 text-blue-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-blue-200 uppercase font-mono">
                    {profile.industryType.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-[10px] text-slate-500 mt-1.5 gap-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    {profile.state} ({profile.locationArea})
                  </span>
                  <span>•</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                    <Coins className="h-3 w-3 text-emerald-500 font-medium" />
                    {overallScore}% Match Rating
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => onSelect(cs.result)}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 p-2 rounded-lg text-xs font-semibold transition flex items-center gap-1 shadow-sm"
                  title="Load case parameters"
                  id={`btn-load-case-${cs.id}`}
                >
                  <ArrowUpRight className="h-3.5 w-3.5 text-amber-600" />
                </button>

                <button
                  onClick={() => onDelete(cs.id)}
                  className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition"
                  title="Remove case file"
                  id={`btn-delete-case-${cs.id}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
