import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, AlertCircle } from 'lucide-react';

export default function SafetyScoreGauge({ score = 85, riskLevel = 'low', confidence = 'high', fraudProbability = 0.15 }) {
  const riskConfigs = {
    low: {
      label: 'Low Risk',
      sublabel: 'Generally Safer Listing',
      color: '#059669',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: ShieldCheck,
      gradient: ['#10b981', '#059669']
    },
    moderate: {
      label: 'Moderate Risk',
      sublabel: 'Proceed With Standard Verification',
      color: '#d97706',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: AlertCircle,
      gradient: ['#f59e0b', '#d97706']
    },
    high: {
      label: 'High Caution',
      sublabel: 'Suspicious Indicators Detected',
      color: '#ea580c',
      badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
      icon: AlertTriangle,
      gradient: ['#f97316', '#ea580c']
    },
    very_high: {
      label: 'Very High Risk',
      sublabel: 'High Probability of Fraud / Scam',
      color: '#dc2626',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: ShieldAlert,
      gradient: ['#f43f5e', '#dc2626']
    }
  };

  const config = riskConfigs[riskLevel] || riskConfigs.low;
  const IconComponent = config.icon;

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="white-card rounded-2xl p-6 border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background radial glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ backgroundColor: config.color }}
      />

      <div className="relative flex items-center justify-center w-52 h-52">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          <defs>
            <linearGradient id="scoreGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={config.gradient[0]} />
              <stop offset="100%" stopColor={config.gradient[1]} />
            </linearGradient>
          </defs>
          
          {/* Background Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-slate-100"
            strokeWidth="12"
            fill="transparent"
          />

          {/* Animated Value Arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="url(#scoreGradientLight)"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Central Score Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
            {score}
          </span>
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-mono font-semibold mt-0.5">
            Safety Score
          </span>
          <span className="text-[10px] text-slate-400 font-mono mt-0.5">
            / 100 Max
          </span>
        </div>
      </div>

      {/* Risk Badge & Subtitle */}
      <div className="mt-4 flex flex-col items-center space-y-2 text-center">
        <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-bold ${config.badgeBg}`}>
          <IconComponent className="w-4 h-4" />
          <span>{config.label}</span>
        </div>
        
        <p className="text-xs text-slate-600 font-medium">{config.sublabel}</p>

        {/* Metadata Footer */}
        <div className="flex items-center space-x-4 text-[11px] text-slate-500 font-mono pt-3 border-t border-slate-100 w-full justify-center">
          <div>
            Fraud Prob: <span className="text-slate-800 font-bold">{Math.round(fraudProbability * 100)}%</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
          <div>
            Confidence: <span className="text-slate-800 font-bold capitalize">{confidence}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
