import React from 'react';
import { Cpu, Shield, Zap, TrendingUp } from 'lucide-react';

export default function RiskBreakdown({ breakdown = {} }) {
  const mlBase = breakdown.ml_base_safety || 90.0;
  const penalties = breakdown.rule_penalties || 0.0;
  const boosts = breakdown.trust_boosts || 0.0;
  const counts = breakdown.indicator_counts || { critical: 0, high: 0, medium: 0, low: 0, trust: 0 };

  return (
    <div className="white-card rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <Zap className="w-4 h-4 text-indigo-600" />
          <span>Safety Score Formula Breakdown</span>
        </h3>
        <span className="text-xs font-mono text-slate-500">Hybrid Scoring Engine</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* ML Model Base Score */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
          <div className="flex items-center justify-center space-x-1 text-slate-600 text-xs mb-1 font-medium">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span>ML Baseline</span>
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono">
            {mlBase}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">TF-IDF Vector</span>
        </div>

        {/* Rule Penalties */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
          <div className="flex items-center justify-center space-x-1 text-slate-600 text-xs mb-1 font-medium">
            <Shield className="w-3.5 h-3.5 text-rose-600" />
            <span>Rule Penalty</span>
          </div>
          <div className={`text-lg font-bold font-mono ${penalties > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
            -{penalties}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Deductions</span>
        </div>

        {/* Trust Boost */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
          <div className="flex items-center justify-center space-x-1 text-slate-600 text-xs mb-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Trust Boost</span>
          </div>
          <div className={`text-lg font-bold font-mono ${boosts > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
            +{boosts}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Verified Features</span>
        </div>
      </div>

      {/* Signal Distribution Grid */}
      <div className="pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-500 font-mono uppercase font-bold tracking-wider block mb-2">
          Signal Counts by Severity:
        </span>
        
        <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
          <div className="bg-rose-50 border border-rose-200 p-2 rounded-xl text-rose-800">
            <span className="block text-xs font-bold">{counts.critical || 0}</span>
            <span className="text-[9px] text-rose-600 font-medium">Critical</span>
          </div>
          <div className="bg-orange-50 border border-orange-200 p-2 rounded-xl text-orange-800">
            <span className="block text-xs font-bold">{counts.high || 0}</span>
            <span className="text-[9px] text-orange-600 font-medium">High</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-2 rounded-xl text-amber-800">
            <span className="block text-xs font-bold">{counts.medium || 0}</span>
            <span className="text-[9px] text-amber-600 font-medium">Medium</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-2 rounded-xl text-blue-800">
            <span className="block text-xs font-bold">{counts.low || 0}</span>
            <span className="text-[9px] text-blue-600 font-medium">Low</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-xl text-emerald-800">
            <span className="block text-xs font-bold">{counts.trust || 0}</span>
            <span className="text-[9px] text-emerald-600 font-medium">Trust</span>
          </div>
        </div>
      </div>
    </div>
  );
}
