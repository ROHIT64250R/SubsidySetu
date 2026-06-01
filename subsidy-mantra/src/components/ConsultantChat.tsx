/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, BusinessProfile } from '../types';
import {
  Send,
  Sparkles,
  RefreshCw,
  Building2,
  Trash2,
  HelpCircle,
  HelpCircleIcon
} from 'lucide-react';

interface ConsultantChatProps {
  messages: ChatMessage[];
  profile: BusinessProfile | null;
  onSendMessage: (text: string) => void;
  onClearHistory: () => void;
  isLoading: boolean;
}

const STATIC_SUGGESTIONS = [
  'What is the standard processing time for a PMEGP application?',
  'Explain how SGST Reimbursement works for manufacturing units under state policy.',
  'Can I set up a Rooftop Solar system and claim capital subsidy?',
  'What happens if my business does not have an active MSME Udyam Aadhaar?',
];

export default function ConsultantChat({
  messages,
  profile,
  onSendMessage,
  onClearHistory,
  isLoading,
}: ConsultantChatProps) {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleSuggestionClick = (text: string) => {
    if (isLoading) return;
    onSendMessage(text);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md shadow-slate-100 flex flex-col h-[580px] overflow-hidden">
      {"/* Consultant identity header */"}
      <div className="bg-slate-900 p-4 shrink-0 flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <span className="w-10 h-10 rounded-xl bg-blue-700 text-white font-bold flex items-center justify-center font-display shadow-md shadow-blue-900/40">
              S
            </span>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="font-semibold text-sm font-display text-white">Setu CA AI Advisor</h3>
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                Active
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Indian Business Grants Consultant</p>
          </div>
        </div>

        {/* Clear Action button */}
        {messages.length > 1 && (
          <button
            onClick={onClearHistory}
            className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-slate-800 transition-colors"
            title="Clear Chat History"
            id="btn-clear-chat"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        )}
      </div>

      {/* Profile Awareness indicator */}
      {profile && (
        <div className="bg-blue-50/60 border-b border-blue-100/50 px-4 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-[10px] text-blue-800">
            <Building2 className="h-3.5 w-3.5 text-blue-700" />
            <span className="truncate">
              Consulting for: <strong>{profile.companyName || 'Proposed Unit'}</strong> (₹{profile.investment}L Investment)
            </span>
          </div>
          <span className="bg-blue-100 text-blue-800 text-[8px] font-bold px-1.5 py-0.5 rounded font-mono uppercase">
            Context Fed
          </span>
        </div>
      )}

      {/* Messages Scroll Box */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 h-full">
            <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-600">
              <Sparkles className="h-6 w-6 animate-pulse-ring text-blue-500" />
            </div>
            <div>
              <h4 className="font-display font-bold text-slate-900 text-sm">Instant Subsidy Consult</h4>
              <p className="text-xs text-slate-500 mt-1.5 max-w-xs leading-normal mx-auto">
                Ask specific questions regarding subsidies, loan waivers, state policies, eligible machines, or legal documentation guidelines.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
              id={`chat-msg-${idx}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs ${
                  isUser
                    ? 'bg-blue-700 text-white rounded-br-none'
                    : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-150'
                } leading-relaxed`}
              >
                {!isUser && <span className="font-bold text-[9px] block text-blue-850 uppercase mb-1">Setu AI</span>}
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span
                  className={`text-[8px] block mt-1.5 text-right font-mono ${
                    isUser ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 border border-slate-150 rounded-2xl rounded-bl-none p-3.5 text-xs max-w-[80%]">
              <span className="font-bold text-[9px] block text-blue-800/80 uppercase mb-1">Setu AI</span>
              <div className="flex items-center space-x-1.5 py-1">
                <span className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Bubbles (shown when state is empty or as helper footer) */}
      <div className="px-4 py-2 shrink-0 border-t border-slate-100 bg-slate-50/50 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
        {STATIC_SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSuggestionClick(s)}
            className="bg-white border border-slate-200 hover:border-blue-400 text-slate-600 hover:text-blue-800 text-[10px] px-3 py-1.5 rounded-full transition-all shrink-0 font-medium"
            title={s}
            id={`chat-suggestion-${idx}`}
          >
            {s.length > 36 ? s.substring(0, 36) + '...' : s}
          </button>
        ))}
      </div>

      {/* Input Box Footer */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-150 flex gap-2 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isLoading ? 'AI Advisor is thinking...' : 'Describe your project (e.g. Set up a rice mill, need subsidy)...'}
          className="flex-1 text-xs px-4 py-3 rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 outline-none placeholder-slate-400 text-slate-800"
          disabled={isLoading}
          id="chat-input-text"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-xl transition disabled:opacity-40 flex items-center justify-center shrink-0 shadow-xs"
          id="btn-chat-send"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
