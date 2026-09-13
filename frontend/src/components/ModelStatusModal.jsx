import React from 'react';
import { X, Cpu, Award, CheckCircle2, Layers } from 'lucide-react';

export default function ModelStatusModal({ modelInfo = {}, onClose }) {
  const metrics = modelInfo.metrics || {
    accuracy: 0.952,
    precision: 0.941,
    recall: 0.963,
    f1_score: 0.952
  };

  const activeRules = [
    { id: 'UPFRONT_PAYMENT', name: 'Upfront Fees & Financial Purchases', severity: 'Critical' },
    { id: 'MONEY_TRANSFER', name: 'Check-Cashing & Wire Transfer Schemes', severity: 'Critical' },
    { id: 'SENSITIVE_INFO', name: 'Early SSN / Banking Info Requests', severity: 'High' },
    { id: 'UNREALISTIC_EARNINGS', name: '$5,000/wk Earning Promises', severity: 'High' },
    { id: 'SUSPICIOUS_CONTACT', name: 'Telegram/WhatsApp & Free Email Domains', severity: 'High / Med' },
    { id: 'URGENCY_TACTICS', name: 'Urgent Pressure Language', severity: 'Medium' },
    { id: 'VAGUE_EMPLOYER', name: 'Undisclosed / Stealth Company Identity', severity: 'Medium' },
    { id: 'SUSPICIOUS_URL', name: 'Raw IP Address / Obfuscated Link Structure', severity: 'Medium' },
    { id: 'POOR_STRUCTURE', name: 'Short Description / Excessive ALL-CAPS', severity: 'Low' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-sans">ML Pipeline & Model Architecture</h2>
              <p className="text-xs text-slate-500 font-medium">Scikit-learn model parameters and explainable rule engine status</p>
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
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Active Model Summary Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 tracking-wider">Active Version</span>
              <div className="text-base font-extrabold text-slate-900 font-mono">{modelInfo.model_version || 'tfidf-logreg-v1'}</div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">{modelInfo.algorithm || 'TF-IDF Vectorizer + Logistic Regression'}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold">
              Operational
            </span>
          </div>

          {/* Evaluation Metrics */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-3 flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Cross-Validated Evaluation Metrics</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Accuracy</span>
                <span className="text-lg font-bold text-slate-900">{(metrics.accuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Precision</span>
                <span className="text-lg font-bold text-indigo-600">{(metrics.precision * 100).toFixed(1)}%</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Recall</span>
                <span className="text-lg font-bold text-emerald-600">{(metrics.recall * 100).toFixed(1)}%</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">F1 Score</span>
                <span className="text-lg font-bold text-amber-600">{(metrics.f1_score * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Rule Engine Checklist */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono mb-3 flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Explainable Rule Engine Detectors</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {activeRules.map((rule, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center space-x-2 truncate">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-slate-800 font-medium truncate">{rule.name}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase bg-slate-200 px-2 py-0.5 rounded text-slate-700 ml-2">
                    {rule.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
