import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import DashboardOverview from './components/DashboardOverview';
import AnalyzeJobForm from './components/AnalyzeJobForm';
import HistoryTable from './components/HistoryTable';
import SafetyScoreGauge from './components/SafetyScoreGauge';
import IndicatorsPanel from './components/IndicatorsPanel';
import RiskBreakdown from './components/RiskBreakdown';
import AnalysisDetailModal from './components/AnalysisDetailModal';
import ModelStatusModal from './components/ModelStatusModal';
import HowItWorksModal from './components/HowItWorksModal';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'analyze', 'dashboard', 'history'
  const [healthStatus, setHealthStatus] = useState('unknown');
  const [modelInfo, setModelInfo] = useState({});
  const [stats, setStats] = useState({});
  const [analyses, setAnalyses] = useState([]);
  
  // Active Scan State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);

  // Modals
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [showModelModal, setShowModelModal] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);

  useEffect(() => {
    fetchHealth();
    fetchModelInfo();
    fetchStats();
    fetchAnalyses();
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/health`);
      if (res.ok) {
        const data = await res.json();
        setHealthStatus(data.status);
      } else {
        setHealthStatus('error');
      }
    } catch {
      setHealthStatus('error');
    }
  };

  const fetchModelInfo = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/model/info`);
      if (res.ok) {
        const data = await res.json();
        setModelInfo(data);
      }
    } catch (e) {
      console.error('Failed to fetch model info', e);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/dashboard/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error('Failed to fetch stats', e);
    }
  };

  const fetchAnalyses = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/analyses`);
      if (res.ok) {
        const data = await res.json();
        setAnalyses(data);
      }
    } catch (e) {
      console.error('Failed to fetch analyses', e);
    }
  };

  const handleAnalyzeJob = async (formData) => {
    setIsAnalyzing(true);
    setCurrentAnalysis(null);

    try {
      const res = await fetch(`${API_BASE}/api/v1/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`Analysis Error: ${err.error || 'Failed to process job posting'}`);
        return;
      }

      const result = await res.json();
      setCurrentAnalysis(result);
      setActiveTab('analyze');
      
      fetchStats();
      fetchAnalyses();
    } catch (e) {
      alert(`Network error during analysis: ${e.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuickAnalyze = (text, metadata = {}) => {
    const payload = {
      job_description: text,
      job_title: metadata.job_title || '',
      company_name: metadata.company_name || '',
      location: metadata.location || '',
      employment_type: metadata.employment_type || 'Full-time',
      salary_range: metadata.salary_range || '',
      contact_email: metadata.contact_email || '',
      application_url: metadata.application_url || ''
    };
    handleAnalyzeJob(payload);
  };

  const handleDeleteAnalysis = async (analysisId) => {
    if (!window.confirm('Are you sure you want to delete this analysis entry?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/v1/analyses/${analysisId}`, { method: 'DELETE' });
      if (res.ok) {
        if (currentAnalysis && currentAnalysis.analysis_id === analysisId) {
          setCurrentAnalysis(null);
        }
        if (selectedDetailItem && selectedDetailItem.analysis_id === analysisId) {
          setSelectedDetailItem(null);
        }
        fetchStats();
        fetchAnalyses();
      }
    } catch (e) {
      alert(`Failed to delete record: ${e.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenModelStatus={() => setShowModelModal(true)}
        onOpenHowItWorks={() => setShowHowItWorksModal(true)}
        healthStatus={healthStatus}
      />

      {/* Main Container - Optimized for 1440px desktop view by default */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 sm:px-8 lg:px-12 py-8">
        
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <HomePage
            onQuickAnalyze={handleQuickAnalyze}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <DashboardOverview
            stats={stats}
            onNavigateAnalyze={() => setActiveTab('analyze')}
            onViewDetails={(item) => setSelectedDetailItem(item)}
            onDeleteAnalysis={handleDeleteAnalysis}
          />
        )}

        {/* ANALYZE JOB TAB */}
        {activeTab === 'analyze' && (
          <div className="space-y-8">
            
            {/* Input Form */}
            <AnalyzeJobForm onAnalyze={handleAnalyzeJob} isLoading={isAnalyzing} />

            {/* Diagnostic Results View */}
            {currentAnalysis && (
              <div className="space-y-6 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 font-sans flex items-center space-x-2">
                      <span>Analysis Diagnostic Report</span>
                      <span className="text-xs font-mono font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                        {currentAnalysis.model_version}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {currentAnalysis.job_title || 'Position'} at {currentAnalysis.company_name || 'Unspecified Employer'}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedDetailItem(currentAnalysis)}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold text-indigo-600 border border-slate-200 shadow-sm transition"
                  >
                    Inspect Full JSON Report
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Gauge & Score breakdown */}
                  <div className="md:col-span-1 space-y-5">
                    <SafetyScoreGauge
                      score={currentAnalysis.safety_score}
                      riskLevel={currentAnalysis.risk_level}
                      confidence={currentAnalysis.confidence}
                      fraudProbability={currentAnalysis.fraud_probability}
                    />

                    <RiskBreakdown breakdown={currentAnalysis.score_breakdown || {}} />
                  </div>

                  {/* Evidence & Trust Factors */}
                  <div className="md:col-span-2">
                    <IndicatorsPanel
                      indicators={currentAnalysis.indicators || []}
                      trustSignals={currentAnalysis.trust_signals || []}
                      recommendations={currentAnalysis.recommendations || []}
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <HistoryTable
            analyses={analyses}
            onViewDetails={(item) => setSelectedDetailItem(item)}
            onDeleteAnalysis={handleDeleteAnalysis}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 space-y-2">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
          <p className="max-w-3xl mx-auto">
            🛡️ <strong>AI Gaurd</strong> — Human-Centered Decision Support for Fake Job Detection.
            Always independently verify hiring managers, corporate domains, and job offers before providing credentials.
          </p>
          <p className="font-mono text-[11px] text-slate-400 mt-2">
            Built with React + Vite & Python Flask REST API
          </p>
        </div>
      </footer>

      {/* Modals */}
      {selectedDetailItem && (
        <AnalysisDetailModal item={selectedDetailItem} onClose={() => setSelectedDetailItem(null)} />
      )}

      {showModelModal && (
        <ModelStatusModal modelInfo={modelInfo} onClose={() => setShowModelModal(false)} />
      )}

      {showHowItWorksModal && (
        <HowItWorksModal onClose={() => setShowHowItWorksModal(false)} />
      )}

    </div>
  );
}
