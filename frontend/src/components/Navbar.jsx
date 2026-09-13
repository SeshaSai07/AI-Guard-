import React from 'react';
import { Shield, Cpu, HelpCircle, Home, LayoutDashboard, Search, History } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenModelStatus, onOpenHowItWorks, healthStatus }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-200">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">
                  AI <span className="text-indigo-600">Gaurd</span>
                </span>
                <span className="text-[10px] font-mono font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded tracking-wider">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Fake Job Posting Detection Platform</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'home'
                  ? 'bg-slate-100 text-indigo-700 border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('analyze')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                activeTab === 'analyze'
                  ? 'bg-indigo-600 text-white shadow-indigo-200'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Analyze Job</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-slate-100 text-indigo-700 border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-slate-100 text-indigo-700 border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <History className="w-4 h-4" />
              <span>History</span>
            </button>

          </nav>

          {/* Right Action Items & Health Badge */}
          <div className="flex items-center space-x-3">
            
            {/* Operational Health Badge */}
            <div className="hidden lg:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium">
              <span className={`w-2 h-2 rounded-full ${healthStatus === 'healthy' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span className="text-slate-700 font-mono text-[11px]">
                {healthStatus === 'healthy' ? 'API Operational' : 'Connecting...'}
              </span>
            </div>

            <button
              onClick={onOpenModelStatus}
              title="View Model Metrics & Architecture"
              className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-200/80 transition"
            >
              <Cpu className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenHowItWorks}
              title="How Safety Score works"
              className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-200/80 transition"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
