import React, { useState } from 'react';
import { Search, Filter, Trash2, Eye, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HistoryTable({ analyses = [], onViewDetails, onDeleteAnalysis }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredAnalyses = analyses.filter((item) => {
    const matchesSearch =
      (item.job_title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.location || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = riskFilter === 'all' || item.risk_level === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const totalPages = Math.ceil(filteredAnalyses.length / itemsPerPage) || 1;
  const paginatedData = filteredAnalyses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const riskBadges = {
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    moderate: 'bg-amber-50 text-amber-700 border-amber-200',
    high: 'bg-orange-50 text-orange-700 border-orange-200',
    very_high: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  return (
    <div className="white-card rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 max-w-[1400px] mx-auto">
      
      {/* Header & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Job Scan History Log</h2>
          <p className="text-xs text-slate-500">Searchable history log of all past diagnostic job analyses</p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search title, company, location..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={riskFilter}
              onChange={(e) => {
                setRiskFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Risk Categories</option>
              <option value="low">Low Risk (80-100)</option>
              <option value="moderate">Moderate Risk (60-79)</option>
              <option value="high">High Caution (40-59)</option>
              <option value="very_high">Very High Risk (0-39)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Table Data */}
      {paginatedData.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
          <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">No matching job scan records found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Job Position & Company</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Safety Score</th>
                <th className="py-3 px-3">Risk Level</th>
                <th className="py-3 px-3">Model Version</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.map((item) => (
                <tr key={item.analysis_id} className="hover:bg-slate-50/80 transition">
                  
                  <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900">{item.job_title}</div>
                    <div className="text-[11px] text-slate-500">{item.company_name}</div>
                  </td>

                  <td className="py-3.5 px-3 text-slate-600">{item.location}</td>

                  <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                    {item.safety_score} / 100
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`inline-block text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${riskBadges[item.risk_level] || riskBadges.low}`}>
                      {item.risk_level.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">
                    {item.model_version}
                  </td>

                  <td className="py-3.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => onViewDetails(item)}
                      className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-indigo-600 hover:bg-slate-200 transition"
                      title="Inspect Full Report"
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
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs font-mono text-slate-500">
        <div>
          Page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong> ({filteredAnalyses.length} items)
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 disabled:opacity-40 hover:bg-slate-200 text-slate-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 disabled:opacity-40 hover:bg-slate-200 text-slate-700"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
