import React from 'react';
import { ShieldCheck, ShieldAlert, Activity, Award, ArrowUpRight, Clock, Trash2, Eye } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis } from 'recharts';

export default function DashboardOverview({ stats = {}, onNavigateAnalyze, onViewDetails, onDeleteAnalysis }) {
  const total = stats.total_analyses || 0;
  const highRisk = stats.high_risk_count || 0;
  const avgScore = stats.average_safety_score || 0;
  const recent = stats.recent_analyses || [];
  const riskDist = stats.risk_distribution || [];
  const scoreHistory = stats.score_history || [];

  const COLORS = ['#059669', '#d97706', '#ea580c', '#dc2626'];

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      
      {/* Top KPI Cards Grid - Optimized for 1440px desktop view (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        
        {/* Total Analyses Card */}
        <div className="white-card p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 font-mono uppercase tracking-wider block">
              Total Scans
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1 font-sans">{total}</div>
            <span className="text-xs text-slate-500 mt-1 block">Job listings analyzed</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* High Risk Count Card */}
        <div className="white-card p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 font-mono uppercase tracking-wider block">
              High Risk Flagged
            </span>
            <div className="text-3xl font-extrabold text-rose-600 mt-1 font-sans">{highRisk}</div>
            <span className="text-xs text-slate-500 mt-1 block font-medium">
              {total > 0 ? `${Math.round((highRisk / total) * 100)}% of total scans` : '0% of total'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        {/* Avg Safety Score Card */}
        <div className="white-card p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 font-mono uppercase tracking-wider block">
              Avg Safety Score
            </span>
            <div className="text-3xl font-extrabold text-emerald-600 mt-1 font-sans">{avgScore} <span className="text-xs font-normal text-slate-400">/ 100</span></div>
            <span className="text-xs text-slate-500 mt-1 block">Calibrated safety index</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Model Accuracy Card */}
        <div className="white-card p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 font-mono uppercase tracking-wider block">
              ML Model F1 Score
            </span>
            <div className="text-3xl font-extrabold text-indigo-600 mt-1 font-sans">95.2%</div>
            <span className="text-xs text-slate-500 mt-1 block">TF-IDF + LogReg pipeline</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Award className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risk Level Distribution Pie Chart */}
        <div className="white-card p-6 rounded-3xl border border-slate-200 shadow-sm lg:col-span-1 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Risk Level Distribution
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Categorical Breakdown</span>
          </div>

          <div className="h-56 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-3 border-t border-slate-100">
            {riskDist.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-600 truncate">{item.name}: <strong className="text-slate-900">{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Score Trend Line Chart */}
        <div className="white-card p-6 rounded-3xl border border-slate-200 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Recent Safety Score Timeline
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Score History Trend</span>
          </div>

          <div className="h-64 w-full">
            {scoreHistory.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 font-mono">
                No score history recorded yet. Run your first job analysis!
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreHistory}>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ fill: '#4f46e5', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Recent Activity Feed */}
      <div className="white-card p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Recent Analysis Scans</h3>
          </div>

          <button
            onClick={onNavigateAnalyze}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1"
          >
            <span>Scan New Job Listing</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-xs text-slate-500 font-medium">No job postings analyzed yet.</p>
            <button
              onClick={onNavigateAnalyze}
              className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow transition"
            >
              Analyze Your First Job
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="py-3.5 px-4">Position & Employer</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Safety Score</th>
                  <th className="py-3.5 px-4">Risk Level</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map((item) => {
                  const riskBadges = {
                    low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    moderate: 'bg-amber-50 text-amber-700 border-amber-200',
                    high: 'bg-orange-50 text-orange-700 border-orange-200',
                    very_high: 'bg-rose-50 text-rose-700 border-rose-200'
                  };

                  return (
                    <tr key={item.analysis_id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{item.job_title}</div>
                        <div className="text-[11px] text-slate-500">{item.company_name}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{item.location}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-900">{item.safety_score} / 100</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${riskBadges[item.risk_level] || riskBadges.low}`}>
                          {item.risk_level.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => onViewDetails(item)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-indigo-600 hover:bg-slate-200 transition"
                          title="View Full Report"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteAnalysis(item.analysis_id)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:text-rose-600 hover:bg-slate-200 transition"
                          title="Delete Entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
