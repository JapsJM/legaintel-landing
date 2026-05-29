import React, { useState } from 'react';
import { Search, BookOpen, AlertCircle, BarChart3, FileText, ChevronRight, ArrowLeft } from 'lucide-react';
import { getJudgeAnalytics } from '../services/analyticsService';
import { Link, useNavigate } from 'react-router-dom';

const Analytics = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await getJudgeAnalytics(searchQuery);
      setData(result);
    } catch (err) {
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-6 lg:p-10">
      
      {/* GO BACK BUTTON */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-500 hover:text-[#c5a059] transition-colors mb-8 text-xs font-bold uppercase tracking-widest"
      >
        <ArrowLeft size={16} />
        Back to Workspace
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-white flex items-center gap-3">
          <BarChart3 className="text-[#c5a059]" size={32} />
          Judicial Analytics
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          AI-driven pattern predictions and historical ruling tendencies mapped directly to your case files.
        </p>
      </div>

      {/* Search Bar - Rebranded to Graph Search */}
      <form onSubmit={handleSearch} className="max-w-2xl mb-10 relative">
        <input
          type="text"
          placeholder="Search Judicial Graph (e.g., Chandrachud, Section 302, etc.)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#0a0c10] border border-white/10 text-white rounded-sm py-4 pl-12 pr-32 focus:outline-none focus:border-[#c5a059] transition-all"
        />
        <Search className="absolute left-4 top-4 text-slate-500" size={20} />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-2 top-2 bottom-2 bg-[#c5a059] hover:bg-[#b38f48] text-black font-bold uppercase tracking-wider text-xs px-6 rounded-sm transition-colors disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      {/* Error State */}
      {error && (
        <div className="max-w-2xl bg-red-900/20 border border-red-800/50 text-red-400 p-4 rounded-sm flex items-center gap-3 mb-8">
          <AlertCircle size={20} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Results Dashboard */}
      {data && !loading && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Top Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0a0c10] border border-white/5 p-6 rounded-sm">
              <div className="flex items-center gap-3 text-slate-400 mb-2">
                <h3 className="text-xs font-bold uppercase tracking-widest">Primary Entity</h3>
              </div>
              <p className="text-xl font-serif font-bold text-white truncate mt-2">{data.judge_name}</p>
              <p className="text-xs text-slate-500 mt-2">Found in {data.total_cases_analyzed} source documents</p>
            </div>

            <div className="bg-[#0a0c10] border border-white/5 p-6 rounded-sm md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Historical Win/Loss Ratio</h3>
                <span className="text-sm font-bold text-[#c5a059]">{data.win_loss_ratio.allowed_percentage}% Allowed</span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden flex">
                <div 
                  className="bg-[#c5a059] h-full transition-all duration-1000" 
                  style={{ width: `${data.win_loss_ratio.allowed_percentage}%` }}
                ></div>
                <div 
                  className="bg-slate-700 h-full transition-all duration-1000" 
                  style={{ width: `${data.win_loss_ratio.dismissed_percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-3">
                <span>Allowed ({data.win_loss_ratio.raw_counts.allowed})</span>
                <span>Dismissed ({data.win_loss_ratio.raw_counts.dismissed})</span>
              </div>
            </div>
          </div>

          {/* Source Judgments & Precedent Chain */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-[#c5a059]" />
              Source Judgments & Precedent Chain
            </h3>
            
            <div className="space-y-4">
              {data.source_judgments.length > 0 ? (
                data.source_judgments.map((judgment, idx) => (
                  <div key={idx} className="bg-[#0a0c10] border border-white/5 rounded-sm p-5 hover:border-white/10 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-slate-500" />
                        <span className="text-sm font-mono text-slate-300">{judgment.document_id}</span>
                      </div>
                      <Link to="/documents" className="text-xs text-[#c5a059] hover:text-white flex items-center gap-1 transition-colors">
                        View Document <ChevronRight size={14} />
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Specific Rulings</h4>
                        {judgment.rulings.length > 0 ? (
                          <ul className="space-y-1">
                            {judgment.rulings.map((rule, i) => (
                              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="text-[#c5a059] mt-1">•</span> {rule}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-slate-600 italic">No explicit rulings extracted.</p>
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cited Precedents</h4>
                        {judgment.citations.length > 0 ? (
                          <ul className="space-y-1">
                            {judgment.citations.map((cite, i) => (
                              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="text-slate-500 mt-1">→</span> {cite}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-slate-600 italic">No citations extracted.</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-[#0a0c10] border border-white/5 p-8 text-center rounded-sm">
                  <p className="text-slate-500">No specific judgments found for this entity in your authorized files.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Analytics;