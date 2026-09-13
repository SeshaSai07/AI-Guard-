import React, { useState } from 'react';
import { X, Download, Copy, Check, ShieldCheck, FileText } from 'lucide-react';
import SafetyScoreGauge from './SafetyScoreGauge';
import IndicatorsPanel from './IndicatorsPanel';
import RiskBreakdown from './RiskBreakdown';

export default function AnalysisDetailModal({ item, onClose }) {
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState('summary');

  if (!item) return null;

  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(item, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(item, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai_gaurd_analysis_${item.analysis_id || 'export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50/80">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-900 font-sans">{item.job_title}</h2>
              <span className="text-[10px] font-mono font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded">
                ID: {item.analysis_id ? item.analysis_id.substring(0, 8) : 'Scan'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {item.company_name} • {item.location} • Scanned {item.created_at ? new Date(item.created_at).toLocaleString() : 'Recently'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={copyJSON}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-semibold flex items-center space-x-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={downloadJSON}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-mono font-semibold flex items-center space-x-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/40 px-6 pt-3 space-x-5">
          <button
            onClick={() => setActiveView('summary')}
            className={`pb-2.5 text-xs font-bold border-b-2 flex items-center space-x-1.5 transition ${
              activeView === 'summary'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Safety Report</span>
          </button>

          <button
            onClick={() => setActiveView('raw_text')}
            className={`pb-2.5 text-xs font-bold border-b-2 flex items-center space-x-1.5 transition ${
              activeView === 'raw_text'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Raw Job Posting Text</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          
          {activeView === 'summary' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Score Gauge & Breakdown */}
              <div className="md:col-span-1 space-y-5">
                <SafetyScoreGauge
                  score={item.safety_score}
                  riskLevel={item.risk_level}
                  confidence={item.confidence}
                  fraudProbability={item.fraud_probability}
                />

                <RiskBreakdown breakdown={item.score_breakdown || {}} />
              </div>

              {/* Evidence & Trust Factors */}
              <div className="md:col-span-2">
                <IndicatorsPanel
                  indicators={item.indicators || []}
                  trustSignals={item.trust_signals || []}
                  recommendations={item.recommendations || []}
                />
              </div>

            </div>
          )}

          {activeView === 'raw_text' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Sanitized Inspection Input:</span>
                <span>Model Version: {item.model_version}</span>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs text-slate-900 leading-relaxed whitespace-pre-wrap">
                {item.raw_text}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
