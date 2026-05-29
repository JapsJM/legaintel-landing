import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Search, Calendar, Filter, Copy, PlusCircle, CheckCircle, 
  ChevronLeft, ChevronRight, Loader2, Info 
} from 'lucide-react';

// Dynamic API Host Resolver


export default function PrecedentsBrowser() {
  const [loading, setLoading] = useState(false);
  const [linkingId, setLinkingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [citationCopied, setCitationCopied] = useState(false);

  // Pagination & Lists State
  const [precedents, setPrecedents] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);

  // Filter States
  const [courtFilter, setCourtFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const categories = ['Criminal', 'Civil', 'Financial', 'Constitutional', 'Corporate', 'Taxation', 'Other'];

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Fetch Public Scraped Catalog
  const fetchPublicPrecedents = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.get('/documents/public', {
        params: {
          page,
          limit,
          court_id: courtFilter || undefined,
          category: categoryFilter || undefined,
          start_date: startDate || undefined,
          end_date: endDate || undefined
        },
        ...getHeaders()
      });
      setPrecedents(res.data.results || []);
      setTotalCount(res.data.total || 0);

      // Auto-select first case if present and none selected
      if (res.data.results && res.data.results.length > 0 && !selectedCase) {
        setSelectedCase(res.data.results[0]);
      }
    } catch (err) {
      if (err.response && err.response.status === 402) {
        setErrorMsg("This page is reserved for Pro and Enterprise subscribers. Please upgrade your tier in your profile.");
      } else {
        setErrorMsg("Failed to load public precedents.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Trigger search on parameter changes
  useEffect(() => {
    fetchPublicPrecedents();
  }, [page, courtFilter, categoryFilter, startDate, endDate]);

  // Copy Legal Citation Clipboard Utility
  const handleCopyCitation = (brief) => {
    if (!brief) return;
    const caseName = brief.title || selectedCase.filename;
    const court = selectedCase.court_id === "SCI" ? "Supreme Court of India" : "Gujarat High Court";
    const date = brief.bench_or_judges ? "" : ` (${new Date(selectedCase.activated_at).getFullYear()})`;
    const citationText = `${caseName}, ${court}${date} — Re: ${brief.statutes || 'Statute Focus'}`;
    
    navigator.clipboard.writeText(citationText);
    setCitationCopied(true);
    setTimeout(() => setCitationCopied(false), 2000);
  };

  // Deep Dive / Add to Workspace Linker
  const handleLinkToWorkspace = async (docId) => {
    setLinkingId(docId);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const res = await api.post(`/documents/${docId}/link`, {}, getHeaders());
      setSuccessMsg(res.data.message);
      
      // Update local state to show case is linked
      setPrecedents(prev => prev.map(p => 
        p.id === docId ? { ...p, is_deep_dived: true } : p
      ));
      if (selectedCase && selectedCase.id === docId) {
        setSelectedCase(prev => ({ ...prev, is_deep_dived: true }));
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Failed to add document to workspace.");
    } finally {
      setLinkingId(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="flex h-[calc(100vh-80px)] -m-10 overflow-hidden bg-[#050505] text-slate-200">
      
      {/* LEFT COLUMN: FILTER PANEL & PAGINATED CASE LIST */}
      <div className="w-[420px] border-r border-white/5 bg-[#0a0c10] flex flex-col shrink-0">
        
        {/* Dynamic Filter Section */}
        <div className="p-5 border-b border-white/5 space-y-4">
          <div className="flex items-center gap-2 text-[#c5a059]">
            <Filter className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Precedent Filters</h3>
          </div>

          {/* Court Jurisdiction Picker */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Jurisdiction</label>
            <div className="relative">
              <select
                value={courtFilter}
                onChange={(e) => { setCourtFilter(e.target.value); setPage(1); }}
                className="w-full bg-[#050505] border border-white/10 rounded-sm py-2 pl-9 pr-3 text-xs text-slate-200 focus:outline-none focus:border-[#c5a059]"
              >
                <option value="">All Courts (SCI & GHC)</option>
                <option value="SCI">Supreme Court of India (SCI)</option>
                <option value="GHC">Gujarat High Court (GHC)</option>
              </select>
            </div>
          </div>

          {/* Practice Area Checkbox Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Practice Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              className="w-full bg-[#050505] border border-white/10 rounded-sm py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-[#c5a059]"
            >
              <option value="">All Subject Areas</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Date Range Picking Panel */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">From Date</label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 w-3 h-3 text-slate-500" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                  className="w-full bg-[#050505] border border-white/10 rounded-sm py-2 pl-7 pr-1 text-[11px] text-slate-300 focus:outline-none focus:border-[#c5a059]"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">To Date</label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 w-3 h-3 text-slate-500" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                  className="w-full bg-[#050505] border border-white/10 rounded-sm py-2 pl-7 pr-1 text-[11px] text-slate-300 focus:outline-none focus:border-[#c5a059]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Public Precedents List */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {loading ? (
            <div className="p-8 flex justify-center items-center gap-2 text-slate-400 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-[#c5a059]" /> Loading precedents...
            </div>
          ) : precedents.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs space-y-2">
              <p>No matching judgments found.</p>
            </div>
          ) : (
            precedents.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedCase(item)}
                className={`p-4 cursor-pointer transition-all hover:bg-white/[0.02] ${selectedCase?.id === item.id ? 'bg-white/[0.03] border-l-2 border-[#c5a059]' : ''}`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                    {item.court_id}
                  </span>
                  <span className="text-[9px] font-bold text-slate-500">
                    {new Date(item.activated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 line-clamp-2 hover:text-[#c5a059] transition-colors">
                  {item.brief?.title || item.filename}
                </h4>
                <div className="flex items-center justify-between mt-2.5 text-[10px] text-slate-400">
                  <span className="text-[#c5a059] font-bold">{item.category}</span>
                  <span>{formatFileSize(item.file_size)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Toolbar */}
        {totalPages > 1 && (
          <div className="h-14 border-t border-white/5 px-4 flex items-center justify-between bg-black/40 shrink-0">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded border border-white/5 bg-white/[0.02] text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded border border-white/5 bg-white/[0.02] text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: THE CONTINUOUS EXECUTIVE CANVAS */}
      <div className="flex-1 flex flex-col bg-[#050505] min-w-0 overflow-y-auto">
        {selectedCase ? (
          <div className="p-8 max-w-5xl mx-auto w-full space-y-6">
            
            {/* Context Gated Banner Responses */}
            {successMsg && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="p-3 bg-red-950/20 border border-red-900/30 rounded text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            {/* Document Header Panel */}
            <div className="border-b border-white/5 pb-6 flex items-start justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 bg-[#c5a059]/10 border border-[#c5a059]/20 text-[#c5a059] uppercase tracking-widest rounded-sm">
                    {selectedCase.court_id} Official Judgment
                  </span>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    {selectedCase.category} Law Case
                  </span>
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight leading-relaxed">
                  {selectedCase.brief?.title || selectedCase.filename}
                </h1>
              </div>

              {/* Interaction Panel */}
              <div className="flex items-center gap-3 shrink-0 pt-2">
                <button
                  onClick={() => handleCopyCitation(selectedCase.brief)}
                  className={`px-3 py-2 border rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${citationCopied ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-white/10 hover:border-white/20 text-slate-300 hover:text-[#c5a059]'}`}
                >
                  {citationCopied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {citationCopied ? "Citation Copied" : "Copy Citation"}
                </button>

                <button
                  onClick={() => handleLinkToWorkspace(selectedCase.id)}
                  disabled={linkingId === selectedCase.id || selectedCase.is_deep_dived}
                  className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${selectedCase.is_deep_dived ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#c5a059] hover:bg-[#b38f48] text-black disabled:opacity-50'}`}
                >
                  {linkingId === selectedCase.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : selectedCase.is_deep_dived ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                  ) : (
                    <PlusCircle className="w-3.5 h-3.5" />
                  )}
                  {selectedCase.is_deep_dived ? "Added for Deep Dive" : "Add to Workspace"}
                </button>
              </div>
            </div>

            {/* Continuous Two-Column Executive Brief Grid */}
            {selectedCase.brief ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                
                {/* LEFT GRID: CASE META & BACKGROUND CONTEXT */}
                <div className="space-y-6">
                  
                  {/* Point 1: Case Identity */}
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059]">
                      1. Case Identity & Bench
                    </h3>
                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded font-sans text-xs leading-relaxed text-slate-300">
                      <p className="font-bold text-white mb-1">{selectedCase.brief.title}</p>
                      {selectedCase.brief.bench_or_judges && (
                        <p className="italic text-slate-400">Bench: {selectedCase.brief.bench_or_judges}</p>
                      )}
                    </div>
                  </div>

                  {/* Point 2 & 3: Subject & Statutes */}
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059]">
                      2 & 3. Legislative Scope & Provisions
                    </h3>
                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded font-sans text-xs leading-relaxed text-slate-300 space-y-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Subject Area:</span>
                        <span className="text-white font-bold">{selectedCase.brief.category || selectedCase.category}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Statutes Cited:</span>
                        <span className="text-slate-200 block font-bold mt-0.5">{selectedCase.brief.statutes || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Point 5: Factual Matrix */}
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059]">
                      5. Factual Matrix
                    </h3>
                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded font-sans text-xs leading-relaxed text-slate-300">
                      {selectedCase.brief.facts || selectedCase.brief.factual_matrix || 'Factual context of the dispute is processed.'}
                    </div>
                  </div>

                  {/* Point 6 & 7: Arguments Battle */}
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059]">
                      6 & 7. Arguments Advanced
                    </h3>
                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded font-sans text-xs leading-relaxed text-slate-300 space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">Petitioner / Appellant:</span>
                        <p className="mt-1">{selectedCase.brief.arguments_appellant || selectedCase.brief.arguments_defense || 'Defense contentions are analyzed.'}</p>
                      </div>
                      <div className="border-t border-white/5 pt-3">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Respondent / State:</span>
                        <p className="mt-1">{selectedCase.brief.arguments_respondent || selectedCase.brief.arguments_prosecution || 'Prosecution contentions are analyzed.'}</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* RIGHT GRID: JUDICIAL FINDINGS & STRATEGIC ADVISORY */}
                <div className="space-y-6">
                  
                  {/* Point 4: Question of Law */}
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059]">
                      4. The Question of Law (Issue)
                    </h3>
                    <div className="p-4 bg-[#c5a059]/[0.02] border border-[#c5a059]/10 rounded font-sans text-xs leading-relaxed text-[#c5a059] font-bold italic">
                      {selectedCase.brief.issue || 'The primary legal issue is analyzed.'}
                    </div>
                  </div>

                  {/* Point 8: Ratio Decidendi */}
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059]">
                      8. Ratio Decidendi (Core Principle)
                    </h3>
                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded font-sans text-xs leading-relaxed text-slate-300">
                      {selectedCase.brief.ratio_decidendi || 'The binding legal rationale established by the court.'}
                    </div>
                  </div>

                  {/* Point 9: Holding & Final Order */}
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059]">
                      9. Holding & Final Order
                    </h3>
                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded font-sans text-xs leading-relaxed text-slate-300 font-bold">
                      {selectedCase.brief.holding || 'The final decision is noted.'}
                    </div>
                  </div>

                  {/* Point 10: Strategic Litigation Impact */}
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059]">
                      10. Strategic Litigation Advisory
                    </h3>
                    <div className="p-4 bg-white/[0.02] border border-white/10 rounded font-sans text-xs leading-relaxed text-slate-300">
                      <p className="text-white mb-2 font-bold uppercase tracking-wider text-[10px]">How to rely or distinguish this:</p>
                      {selectedCase.brief.litigation_advisory || selectedCase.brief.strategic_impact || 'No litigation guidance available for this case.'}
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 text-xs bg-white/[0.01] border border-white/5 rounded space-y-3">
                <Info className="w-6 h-6 mx-auto text-[#c5a059]" />
                <p>10-point continuous summary is currently being mapped by the AI worker.</p>
              </div>
            )}

          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-slate-500 text-sm space-y-4">
            <p className="text-xs uppercase tracking-widest text-slate-400">Select a case from the catalog to view its Executive Canvas.</p>
          </div>
        )}
      </div>

    </div>
  );
}