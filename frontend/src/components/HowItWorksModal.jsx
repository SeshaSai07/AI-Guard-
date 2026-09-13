import React from 'react';
import { X, HelpCircle, Calculator } from 'lucide-react';

export default function HowItWorksModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-sans">How the Safety Score Works</h2>
              <p className="text-xs text-slate-500 font-medium">Explainable AI hybrid scoring methodology & risk boundaries</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs text-slate-700 max-h-[75vh] overflow-y-auto leading-relaxed">
          
          {/* Formula */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase font-mono flex items-center space-x-1.5">
              <Calculator className="w-4 h-4 text-indigo-600" />
              <span>Hybrid Safety Formula</span>
            </h3>
            <p className="text-slate-600">
              AI Gaurd computes a <strong>0–100 Safety Score</strong> where higher scores denote safer postings. 
              The score combines machine learning text probability with rule-based scam evidence:
            </p>
            <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-[11px] text-indigo-700 font-semibold shadow-sm">
              Safety Score = Base ML Safety - Sum(Rule Penalties) + Sum(Trust Boosts)
            </div>
          </div>

          {/* Risk Bands */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 font-mono uppercase">Score Risk Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl">
                <span className="font-bold text-emerald-800 block font-mono">80 – 100: Low Risk</span>
                <span className="text-[11px] text-slate-600">Listing matches legitimate corporate structure patterns.</span>
              </div>
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl">
                <span className="font-bold text-amber-800 block font-mono">60 – 79: Moderate Risk</span>
                <span className="text-[11px] text-slate-600">Minor vague or generic details; verify employer independently.</span>
              </div>
              <div className="p-3 bg-orange-50/80 border border-orange-200 rounded-xl">
                <span className="font-bold text-orange-800 block font-mono">40 – 59: High Caution</span>
                <span className="text-[11px] text-slate-600">Multiple red flags or contact anomalies detected.</span>
              </div>
              <div className="p-3 bg-rose-50/80 border border-rose-200 rounded-xl">
                <span className="font-bold text-rose-800 block font-mono">0 – 39: Very High Risk</span>
                <span className="text-[11px] text-slate-600">Critical scam indicators present (upfront fee, wire transfer).</span>
              </div>
            </div>
          </div>

          {/* Advisory Disclaimer */}
          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-1">
            <span className="font-bold text-amber-800 font-mono text-[11px] uppercase block">
              ⚠️ Important Advisory Disclaimer
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              AI Gaurd provides decision support and risk estimates. Models and rules flag suspicious patterns based on available text data but cannot guarantee complete factual truth. Always verify hiring organizations independently through official corporate channels before sharing sensitive information.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
