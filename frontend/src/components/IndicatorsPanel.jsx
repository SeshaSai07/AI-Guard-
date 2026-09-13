import React, { useState } from 'react';
import { AlertOctagon, AlertTriangle, AlertCircle, Info, ChevronDown, ChevronUp, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function IndicatorsPanel({ indicators = [], trustSignals = [], recommendations = [] }) {
  const [activeTab, setActiveTab] = useState('warnings');
  const [expandedIndex, setExpandedIndex] = useState(null);

  const severityBadges = {
    critical: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: AlertOctagon,
      label: 'Critical Risk'
    },
    high: {
      bg: 'bg-orange-50 text-orange-700 border-orange-200',
      icon: AlertTriangle,
      label: 'High Severity'
    },
    medium: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: AlertCircle,
      label: 'Medium Risk'
    },
    low: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Info,
      label: 'Low Notice'
    }
  };

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="white-card rounded-2xl p-6 border border-slate-200 shadow-sm">
      
      {/* Header & Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
        <div className="flex items-center space-x-2.5">
          <h3 className="text-base font-bold text-slate-900">Detection Evidence & Signals</h3>
          <span className="text-xs bg-slate-100 text-slate-700 font-mono font-semibold px-2.5 py-0.5 rounded-full border border-slate-200">
            {indicators.length} Warnings
          </span>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('warnings')}
            className={`px-3.5 py-1 text-xs font-bold rounded-lg transition ${
              activeTab === 'warnings' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Warnings ({indicators.length})
          </button>
          <button
            onClick={() => setActiveTab('trust')}
            className={`px-3.5 py-1 text-xs font-bold rounded-lg transition ${
              activeTab === 'trust' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Trust Factors ({trustSignals.length})
          </button>
        </div>
      </div>

      {/* WARNINGS TAB */}
      {activeTab === 'warnings' && (
        <div className="space-y-3">
          {indicators.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-emerald-50/50 rounded-2xl border border-emerald-100">
              <ShieldCheck className="w-10 h-10 text-emerald-600 mb-2" />
              <h4 className="text-sm font-bold text-slate-900">Zero Scam Indicators Triggered</h4>
              <p className="text-xs text-slate-600 max-w-sm mt-1">
                No high-risk scam patterns or suspicious keywords were detected in this posting.
              </p>
            </div>
          ) : (
            indicators.map((ind, idx) => {
              const badge = severityBadges[ind.severity] || severityBadges.low;
              const IconComp = badge.icon;
              const isExpanded = expandedIndex === idx;

              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden transition shadow-sm"
                >
                  <div
                    onClick={() => toggleExpand(idx)}
                    className="flex items-center justify-between p-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl border ${badge.bg}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{ind.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{ind.explanation}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${badge.bg}`}>
                        {ind.severity}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded evidence details */}
                  {isExpanded && (
                    <div className="px-5 pb-4 pt-1 border-t border-slate-100 bg-slate-50/60 text-xs space-y-2.5">
                      <div>
                        <span className="text-slate-500 font-mono text-[11px] font-semibold">Reasoning & Risk Explanation:</span>
                        <p className="text-slate-700 mt-0.5 leading-relaxed">{ind.explanation}</p>
                      </div>

                      {ind.evidence && (
                        <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 shadow-sm">
                          <span className="text-slate-400 block mb-0.5 text-[10px] uppercase font-bold tracking-wider">Detected Evidence Excerpt:</span>
                          "{ind.evidence}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TRUST FACTORS TAB */}
      {activeTab === 'trust' && (
        <div className="space-y-3">
          {trustSignals.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 font-medium">
              No positive trust signals were detected in this post metadata.
            </div>
          ) : (
            trustSignals.map((ts, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">{ts.title}</h4>
                  <p className="text-xs text-slate-700 mt-0.5">{ts.explanation}</p>
                  {ts.evidence && (
                    <span className="inline-block mt-1 font-mono text-[11px] text-emerald-700 font-medium">
                      Evidence: {ts.evidence}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Recommended Verification Actions */}
      {recommendations.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-200">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-3">
            Recommended Verification Actions
          </h4>
          <ul className="space-y-2 text-xs text-slate-700">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
