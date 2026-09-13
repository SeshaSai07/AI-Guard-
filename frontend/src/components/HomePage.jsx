import React, { useState } from 'react';
import { ShieldCheck, Search, ArrowRight, Sparkles, CheckCircle2, ShieldAlert, Cpu, Lock, Layers, Zap } from 'lucide-react';

export default function HomePage({ onQuickAnalyze, onNavigateTab }) {
  const [quickText, setQuickText] = useState('');

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!quickText.trim()) return;
    onQuickAnalyze(quickText);
  };

  const samplePresets = [
    {
      title: 'Senior Cloud Architect',
      company: 'Stripe Inc.',
      risk: 'low',
      badge: 'Legitimate Role (Low Risk)',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      text: 'We are looking for a Senior Cloud Architect to join our Core Infrastructure engineering team. 6+ years experience in AWS/GCP, Kubernetes, and Go. Competitive base salary $180,000 - $220,000, 401k match, full medical coverage.'
    },
    {
      title: 'Virtual Administrative Assistant',
      company: 'Stealth Logistics Startup',
      risk: 'high',
      badge: 'Telegram Scam (High Risk)',
      badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
      text: 'URGENT WORK FROM HOME OPPORTUNITY! EARN $45/HR NO EXPERIENCE REQUIRED! Contact hiring manager on Telegram messenger (@DavidMillerHR) to conduct text interview immediately.'
    },
    {
      title: 'Financial Transaction Coordinator',
      company: 'Confidential Global Trade',
      risk: 'very_high',
      badge: 'Wire Scam (Obvious Fraud)',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      text: 'Earn $5000/month working 1 hr/day! Deposit cashier checks into your personal bank account, keep 10% commission, and wire remaining balance via Western Union or Bitcoin gift cards.'
    }
  ];

  return (
    <div className="space-y-16 py-4 max-w-[1440px] mx-auto">
      
      {/* HERO SECTION - Dual-Side Balanced Layout (Left Content, Right Scanner Card) */}
      <section className="white-card rounded-3xl p-8 lg:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-[500px] h-[500px] bg-indigo-50/60 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-[500px] h-[500px] bg-teal-50/60 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Side (7 columns): Hero Headline, Value Proposition, Feature Bullets */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Enterprise-Grade Career Security & Scam Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Identify Fake Job Postings with Explainable AI Safety
            </h1>

            <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
              <strong>AI Gaurd</strong> safeguards job seekers by evaluating listings against scikit-learn TF-IDF machine learning models and 12 explainable scam detection rules to calculate an accurate <strong>0–100 Safety Score</strong>.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center space-x-2.5 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Upfront Payment & Fee Detection</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Telegram / WhatsApp Interview Flags</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Check-Cashing & Wire Transfer Schemes</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Early Sensitive Data Request Warnings</span>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={() => onNavigateTab('analyze')}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md shadow-indigo-200 transition"
              >
                <Search className="w-4 h-4" />
                <span>Open Advanced Job Checker</span>
              </button>

              <button
                onClick={() => onNavigateTab('dashboard')}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 transition"
              >
                <span>View Analytics Dashboard</span>
              </button>
            </div>

          </div>

          {/* Right Side (5 columns): Quick Scanner Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-50/90 border border-slate-200/90 p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-slate-900 font-sans flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <span>Quick Job Safety Scanner</span>
                </span>
                <span className="text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Live Scanner
                </span>
              </div>

              <form onSubmit={handleQuickSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Paste Job Description Text
                  </label>
                  <textarea
                    rows={6}
                    value={quickText}
                    onChange={(e) => setQuickText(e.target.value)}
                    placeholder="Paste job posting text, requirements, recruiter contact, or interview instructions here..."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 font-mono leading-relaxed transition shadow-2xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!quickText.trim()}
                  className={`w-full py-3.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition shadow-md ${
                    !quickText.trim()
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Run Instant Diagnostic Scan</span>
                </button>
              </form>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-200/60">
                <span className="flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Private & Confidential</span>
                </span>
                <span>TF-IDF + 12 Rules</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* BENCHMARK TEST PRESETS SECTION */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-sans">Featured Test Case Benchmarks</h2>
            <p className="text-xs text-slate-600">Click any preset job example below to run instant diagnostic analysis</p>
          </div>

          <button
            onClick={() => onNavigateTab('analyze')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
          >
            <span>Open Advanced Checker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {samplePresets.map((preset, idx) => (
            <div
              key={idx}
              onClick={() => onQuickAnalyze(preset.text, { job_title: preset.title, company_name: preset.company })}
              className="white-card p-6 rounded-3xl border border-slate-200 hover:border-indigo-400 cursor-pointer group flex flex-col justify-between shadow-sm hover:shadow-md transition"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${preset.badgeClass}`}>
                    {preset.badge}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">{preset.title}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{preset.company}</p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100 font-mono">
                  "{preset.text}"
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-bold">
                <span>Click to analyze listing</span>
                <span>Run Diagnostic →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3-STEP EXPLAINABLE WORKFLOW SECTION */}
      <section className="white-card p-8 lg:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xl font-bold text-slate-900 font-sans">How AI Gaurd Protects Job Seekers</h2>
          <p className="text-xs text-slate-600">Explainable dual-engine analysis combining ML probabilities with rule detection</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
          
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
              <span className="font-extrabold text-base">1</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Paste Job Specs & Metadata</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter any job posting text along with structured details like salary, recruiter contact email, or application URL.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-sm">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Run Dual ML & Rule Engines</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              scikit-learn TF-IDF classifier predicts fraud probability while 12 rule detectors scan for payment demands and Telegram interviews.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Get Calibrated Safety Score</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive a 0–100 Safety Score with categorized evidence quotes, risk explanations, and practical verification steps.
            </p>
          </div>

        </div>
      </section>

      {/* KEY SCAM SIGNALS DETECTED GRID */}
      <section className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-xl font-bold text-slate-900 font-sans">Key Scam Signals Automatically Detected</h2>
          <p className="text-xs text-slate-600">Our engine screens postings against known career fraud patterns</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1.5">
            <span className="text-rose-600 text-xl">💰</span>
            <h4 className="text-xs font-bold text-slate-900">Upfront Fees</h4>
            <p className="text-[11px] text-slate-500">Equipment/starter kit fees</p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1.5">
            <span className="text-rose-600 text-xl">🏦</span>
            <h4 className="text-xs font-bold text-slate-900">Check Cashing</h4>
            <p className="text-[11px] text-slate-500">Deposit check & wire funds</p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1.5">
            <span className="text-orange-600 text-xl">📱</span>
            <h4 className="text-xs font-bold text-slate-900">Telegram Chats</h4>
            <p className="text-[11px] text-slate-500">Anonymous text interviews</p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1.5">
            <span className="text-amber-600 text-xl">🆔</span>
            <h4 className="text-xs font-bold text-slate-900">Early SSN Requests</h4>
            <p className="text-[11px] text-slate-500">Requesting SSN before offer</p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1.5">
            <span className="text-amber-600 text-xl">✉️</span>
            <h4 className="text-xs font-bold text-slate-900">Generic Email</h4>
            <p className="text-[11px] text-slate-500">Gmail/Yahoo recruitment email</p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1.5">
            <span className="text-indigo-600 text-xl">⚡</span>
            <h4 className="text-xs font-bold text-slate-900">High Urgency</h4>
            <p className="text-[11px] text-slate-500">"Act immediately" phrasing</p>
          </div>
        </div>
      </section>

    </div>
  );
}
