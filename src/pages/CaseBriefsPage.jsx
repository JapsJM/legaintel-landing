import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  Sparkles, FileText, Loader2, ArrowLeft, Search, Printer, Info, ShieldAlert, Calendar, Filter, Copy, PlusCircle, CheckCircle,
  ChevronLeft, ChevronRight, Play
} from 'lucide-react';

// Dynamic API Host Resolver


export default function CaseBriefsPage() {
  const navigate = useNavigate();
  
  // Navigation Tabs State: 'private' (My Uploads) vs 'public' (Scraped Precedents)
  const [activeTab, setActiveTab] = useState('private');

  // Shared Global States
  const [loading, setLoading] = useState(true);
  const [briefLoading, setBriefLoading] = useState(false);
  const [briefError, setBriefError] = useState(null);
  const [briefData, setBriefData] = useState(null);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [selectedFilename, setSelectedFilename] = useState('');
  
  // Tab 1: Private Uploads States
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Tab 2: Public Precedents States
  const [publicPrecedents, setPublicPrecedents] = useState([]);
  const [publicTotalCount, setPublicTotalCount] = useState(0);
  const [publicPage, setPublicPage] = useState(1);
  const [publicLimit] = useState(15);
  const [courtFilter, setCourtFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Workspace Actions
  const [linkingId, setLinkingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [citationCopied, setCitationCopied] = useState(false);

  const categories = ['Criminal', 'Civil', 'Financial', 'Constitutional', 'Corporate', 'Taxation', 'Other'];

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Sync Private Documents List on Mount
  const fetchPrivateDocs = async () => {
    setLoading(true);
    setBriefError(null);
    try {
      const res = await api.get('/documents/list', getHeaders());
      const docs = res.data.documents || res.data || [];
      setUploadedDocs(docs);
      if (docs.length > 0 && activeTab === 'private' && !selectedDocId) {
        setSelectedDocId(docs[0].document_id);
        setSelectedFilename(docs[0].filename);
        handleFetchCaseBrief(docs[0].document_id);
      }
    } catch (err) {
      console.error("Failed to sync private documents:", err);
      setBriefError("Failed to sync your document registry. Ensure you have active uploads.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Public Scraped Precedents Catalog
  const fetchPublicPrecedents = async () => {
    setLoading(true);
    setBriefError(null);
    try {
      const res = await api.get('/documents/public', {
        params: {
          page: publicPage,
          limit: publicLimit,
          court_id: courtFilter || undefined,
          category: categoryFilter || undefined,
          start_date: startDate || undefined,
          end_date: endDate || undefined
        },
        ...getHeaders()
      });
      setPublicPrecedents(res.data.results || []);
      setPublicTotalCount(res.data.total || 0);

      if (res.data.results && res.data.results.length > 0 && activeTab === 'public') {
        const firstPublic = res.data.results[0];
        setSelectedDocId(firstPublic.id);
        setSelectedFilename(firstPublic.filename);
        setBriefData(firstPublic.brief);
      }
    } catch (err) {
      if (err.response && err.response.status === 402) {
        setBriefError("Adding judgments to workspace requires a Pro or Enterprise subscription.");
      } else {
        setBriefError("Failed to load public precedents.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial Sync
  useEffect(() => {
    fetchPrivateDocs();
  }, []);

  // Sync on Tab Switch or Public Filter Change
  useEffect(() => {
    setBriefData(null);
    setBriefError(null);
    setSelectedDocId('');
    setSelectedFilename('');
    
    if (activeTab === 'private') {
      fetchPrivateDocs();
    } else {
      fetchPublicPrecedents();
    }
  }, [activeTab, publicPage, courtFilter, categoryFilter, startDate, endDate]);

  // Fetch Private Brief Data
  const handleFetchCaseBrief = async (docId) => {
    if (!docId) return;
    setBriefLoading(true);
    setBriefError(null);
    setBriefData(null);
    try {
      const res = await api.get(`/briefs/${docId}`, getHeaders());
      setBriefData(res.data.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setBriefError("No cached brief exists for this document. Would you like to generate one?");
      } else {
        setBriefError(err.response?.data?.error || "Failed to fetch structured brief.");
      }
    } finally {
      setBriefLoading(false);
    }
  };

  // Trigger Private/Public Brief Generation on the fly (Self-Healing)
  const handleTriggerBriefGeneration = async () => {
    if (!selectedDocId) return;
    setBriefLoading(true);
    setBriefError(null);
    try {
      const res = await api.post(`/briefs/${selectedDocId}/regenerate`, {}, getHeaders());
      setBriefData(res.data.data);
      
      // Update public list dynamically if we are in public tab
      if (activeTab === 'public') {
        setPublicPrecedents(prev => prev.map(p => 
          p.id === selectedDocId ? { ...p, brief: res.data.data } : p
        ));
      }
    } catch (err) {
      setBriefError(err.response?.data?.error || "Failed to complete structured extraction.");
    } finally {
      setBriefLoading(false);
    }
  };

  // Add Public Case to User's Private Workspace (Deep Dive)
  const handleLinkToWorkspace = async (docId) => {
    setLinkingId(docId);
    setSuccessMsg(null);
    setBriefError(null);
    try {
      const res = await api.post(`/documents/${docId}/link`, {}, getHeaders());
      setSuccessMsg(res.data.message);
      
      // Update public items to show added check
      setPublicPrecedents(prev => prev.map(p => 
        p.id === docId ? { ...p, is_deep_dived: true } : p
      ));
    } catch (err) {
      setBriefError(err.response?.data?.error || "Failed to add precedent to your workspace.");
    } finally {
      setLinkingId(null);
    }
  };

  // Clipboard Citation Utility
  const handleCopyCitation = () => {
    const caseName = briefData?.case_title || selectedFilename;
    const court = briefData?.court || (activeTab === 'public' ? "Supreme Court of India" : "Private Document");
    const citation = `${caseName}, ${court} — Re: ${briefData?.statutes || 'Statute Focus'}`;
    
    navigator.clipboard.writeText(citation);
    setCitationCopied(true);
    setTimeout(() => setCitationCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredPrivateDocs = uploadedDocs.filter(doc => 
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(publicTotalCount / publicLimit);

  // ── DEFENSIVE BACKWARD COMPATIBILITY MAP ──
  // Shared by both private briefs and public precedents
  const briefMap = briefData?.ten_point_brief || briefData?.twenty_point_brief || briefData || {};

  const p1_case_identity = briefMap["1_case_identity_and_bench"] || briefMap["1_case_title"] || briefData?.case_title;
  const p2_subject_area  = briefMap["2_subject_area_and_class"]  || briefMap["3_court_and_jurisdiction"] || briefData?.court;
  const p3_statutes      = briefMap["3_statutory_provisions_in_focus"] || briefMap["7_statutes_involved"] || briefData?.statutes;
  const p4_question_law  = briefMap["4_question_of_law_issue"]   || briefMap["9_core_legal_issues"];
  const p5_factual_matrix = briefMap["5_factual_matrix_brief"]   || briefMap["10_factual_matrix"];
  const p6_appellant     = briefMap["6_appellants_contentions"]  || briefMap["11_appellant_arguments"];
  const p7_respondent    = briefMap["7_respondents_defense"]     || briefMap["12_respondent_arguments"];
  const p8_ratio         = briefMap["8_ratio_decidendi_core_rule"] || briefMap["16_ratio_decidendi"];
  const p9_holding       = briefMap["9_holding_and_final_order"] || briefMap["18_final_holding_order"];
  const p10_advisory     = briefMap["10_strategic_litigation_advisory"] || briefMap["20_strategic_litigation_advisory"];

  // Detect if the loaded brief is missing crucial data (due to previous rate limits or failed generation)
  const isBriefEmpty = !briefData || (!p3_statutes && !p4_question_law && !p8_ratio);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans selection:bg-[#c5a059] selection:text-black flex flex-col print:bg-white print:text-black">
      
      {/* Sovereign Header */}
      <header className="h-16 border-b border-white/5 bg-[#0a0c10] px-8 flex items-center justify-between sticky top-0 z-40 print:hidden shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="p-1.5 text-slate-400 hover:text-white transition-colors border border-white/5 rounded hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2"> Case Brief Workspace
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Sovereign 10-Point VIP Analysis Canvas</p>
          </div>
        </div>

        {selectedDocId && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyCitation}
              className={`px-3 py-1.5 border rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${citationCopied ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-white/10 hover:border-white/20 text-slate-300 hover:text-[#c5a059]'}`}
            >
              {citationCopied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {citationCopied ? "Citation Copied" : "Copy Citation"}
            </button>

            {activeTab === 'private' ? (
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-widest text-[#c5a059] transition-all rounded-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Brief
              </button>
            ) : (
              <button
                onClick={() => handleLinkToWorkspace(selectedDocId)}
                disabled={linkingId === selectedDocId || publicPrecedents.find(p => p.id === selectedDocId)?.is_deep_dived}
                className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${publicPrecedents.find(p => p.id === selectedDocId)?.is_deep_dived ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#c5a059] hover:bg-[#b38f48] text-black disabled:opacity-50'}`}
              >
                {linkingId === selectedDocId ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : publicPrecedents.find(p => p.id === selectedDocId)?.is_deep_dived ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : (
                  <PlusCircle className="w-3.5 h-3.5" />
                )}
                {publicPrecedents.find(p => p.id === selectedDocId)?.is_deep_dived ? "Added to Workspace" : "Add to Workspace"}
              </button>
            )}
          </div>
        )}
      </header>

      {/* Main Grid Split */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SHARED UNIFIED SIDEBAR (Left Column) */}
        <aside className="w-[340px] border-r border-white/5 bg-[#0a0c10] flex flex-col shrink-0 print:hidden">
          
          {/* Tab Selection Headers */}
          <div className="grid grid-cols-2 h-12 border-b border-white/5 text-center text-xs font-bold uppercase tracking-wider shrink-0">
            <button
              onClick={() => setActiveTab('private')}
              className={`border-r border-white/5 transition-all flex items-center justify-center gap-1.5 ${activeTab === 'private' ? 'text-[#c5a059] bg-[#050505] border-b-2 border-b-[#c5a059]' : 'text-slate-400 hover:text-white bg-black/20'}`}
            >
              <FileText className="w-3.5 h-3.5" />
              My Briefs
            </button>
            <button
              onClick={() => setActiveTab('public')}
              className={`transition-all flex items-center justify-center gap-1.5 ${activeTab === 'public' ? 'text-[#c5a059] bg-[#050505] border-b-2 border-b-[#c5a059]' : 'text-slate-400 hover:text-white bg-black/20'}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Public Catalog
            </button>
          </div>

          {/* TAB 1: Private Document Search */}
          {activeTab === 'private' ? (
            <div className="p-4 border-b border-white/5 shrink-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search judgments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded px-8 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#c5a059] font-sans"
                />
              </div>
            </div>
          ) : (
            /* TAB 2: Public Precedent Filters */
            <div className="p-4 border-b border-white/5 space-y-3 shrink-0">
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={courtFilter}
                  onChange={(e) => setCourtFilter(e.target.value)}
                  className="bg-[#050505] border border-white/10 rounded-sm py-1.5 px-2 text-[10px] font-bold uppercase tracking-wider text-[#c5a059] focus:outline-none focus:border-[#c5a059]"
                >
                  <option value="">All Courts</option>
                  <option value="SCI">SCI</option>
                  <option value="GHC">GHC</option>
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-[#050505] border border-white/10 rounded-sm py-1.5 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-300 focus:outline-none focus:border-[#c5a059]"
                >
                  <option value="">Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Date Filters inside sidebar */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-sm py-1 px-1.5 text-[9px] text-slate-300 focus:outline-none focus:border-[#c5a059]"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-sm py-1 px-1.5 text-[9px] text-slate-300 focus:outline-none focus:border-[#c5a059]"
                />
              </div>
            </div>
          )}

          {/* List Section */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-[#c5a059]" />
              </div>
            ) : activeTab === 'private' ? (
              /* Render Private List */
              filteredPrivateDocs.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-500">No private files found.</div>
              ) : (
                filteredPrivateDocs.map(doc => (
                  <button
                    key={doc.document_id}
                    onClick={() => {
                      setSelectedDocId(doc.document_id);
                      setSelectedFilename(doc.filename);
                      handleFetchCaseBrief(doc.document_id);
                    }}
                    className={`w-full text-left p-3 rounded-sm border transition-all flex items-start gap-2.5 ${selectedDocId === doc.document_id ? 'border-[#c5a059]/30 bg-[#c5a059]/5' : 'border-white/5 bg-[#050505] hover:border-white/10'}`}
                  >
                    <FileText className={`w-4 h-4 shrink-0 mt-0.5 ${selectedDocId === doc.document_id ? 'text-[#c5a059]' : 'text-slate-500'}`} />
                    <span className="text-xs text-slate-300 truncate font-sans">{doc.filename}</span>
                  </button>
                ))
              )
            ) : (
              /* Render Public Precedents List */
              publicPrecedents.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-500">No matching public precedents.</div>
              ) : (
                publicPrecedents.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedDocId(item.id);
                      setSelectedFilename(item.filename);
                      setBriefData(item.brief);
                    }}
                    className={`w-full text-left p-3 rounded-sm border transition-all flex flex-col gap-1.5 ${selectedDocId === item.id ? 'border-[#c5a059]/30 bg-[#c5a059]/5' : 'border-white/5 bg-[#050505] hover:border-white/10'}`}
                  >
                    <div className="flex items-center justify-between w-full text-[9px] font-bold text-slate-500">
                      <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 text-slate-300 rounded">{item.court_id}</span>
                      <span>{new Date(item.activated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <span className="text-xs text-slate-300 truncate font-sans font-bold">{item.brief?.title || item.filename}</span>
                    <span className="text-[10px] text-[#c5a059] font-bold">{item.category}</span>
                  </button>
                ))
              )
            )}
          </div>

          {/* Public Pagination Bar */}
          {activeTab === 'public' && totalPages > 1 && (
            <div className="h-12 border-t border-white/5 px-3 flex items-center justify-between bg-black/40 shrink-0">
              <button
                onClick={() => setPublicPage(p => Math.max(1, p - 1))}
                disabled={publicPage === 1}
                className="p-1 rounded border border-white/5 text-slate-400 disabled:opacity-20 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Page {publicPage} of {totalPages}
              </span>
              <button
                onClick={() => setPublicPage(p => Math.min(totalPages, p + 1))}
                disabled={publicPage === totalPages}
                className="p-1 rounded border border-white/5 text-slate-400 disabled:opacity-20 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </aside>

        {/* SHARED RIGHT EXECUTIVE CANVAS PANEL */}
        <main className="flex-grow overflow-y-auto p-8 bg-[#050505] print:p-0 print:bg-white">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {briefLoading && (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#c5a059]" />
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Performing 10-Point VIP Analysis...</p>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                {successMsg}
              </div>
            )}

            {briefError && !briefLoading && (
              <div className="p-8 border border-red-950/45 bg-red-950/10 rounded-sm text-center max-w-xl mx-auto space-y-6 print:hidden">
                <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest">Analysis Boundary Checked</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{briefError}</p>
                </div>
                {briefError.includes("No cached brief") && (
                  <button
                    onClick={handleTriggerBriefGeneration}
                    className="px-6 py-2.5 bg-[#c5a059] hover:bg-[#b38f48] text-black text-xs font-bold uppercase tracking-widest rounded-sm transition-all shadow-lg shadow-black/30"
                  >
                    Generate Structured Brief
                  </button>
                )}
              </div>
            )}

            {selectedDocId && !briefLoading && (
              <article className="space-y-8 print:space-y-6">
                
                {/* Visual Title Header (Renders dynamically based on selections) */}
                <div className="border-b border-white/5 pb-6 print:border-black/10">
                  <div className="flex items-center justify-between mb-4 print:hidden">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c5a059] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" /> {activeTab === 'private' ? 'My Private Brief' : 'Scraped Public Precedent'}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Executive Continuous Canvas
                    </span>
                  </div>

                  <h1 className="text-xl md:text-3xl font-bold font-sans text-white print:text-black leading-tight tracking-tight">
                    {briefData?.case_title || selectedFilename}
                  </h1>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-xs font-sans text-slate-400 print:text-slate-600">
                    <div><span className="font-bold uppercase tracking-wider text-slate-500">Bench:</span> {briefData?.bench || 'N/A'}</div>
                    <div className="hidden md:block">|</div>
                    <div><span className="font-bold uppercase tracking-wider text-slate-500">Jurisdiction:</span> {briefData?.court || (activeTab === 'public' ? 'Supreme Court of India' : 'N/A')}</div>
                    <div className="hidden md:block">|</div>
                    <div><span className="font-bold uppercase tracking-wider text-slate-500">Date:</span> {briefData?.date_of_judgment || 'N/A'}</div>
                  </div>
                </div>

                {/* Self-Healing Button (Active for both private and public items) */}
                {isBriefEmpty && (
                  <div className="p-6 border border-[#c5a059]/30 bg-[#c5a059]/5 rounded-sm flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-[#c5a059] uppercase tracking-widest">Self-Healing Brief Trigger</h4>
                      <p className="text-xs text-slate-300 font-sans">This precedent was saved as a skeletal draft due to API limits. Regenerate now to unlock all 10 VIP points.</p>
                    </div>
                    <button
                      onClick={handleTriggerBriefGeneration}
                      className="px-5 py-2 rounded bg-[#c5a059] hover:bg-[#b38f48] text-black text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 shrink-0 transition-all shadow"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Build 10 VIP Points
                    </button>
                  </div>
                )}

                {/* Continuous Split Column Grid (Zero Accordion Fatigue) */}
                {!isBriefEmpty && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* LEFT COLUMN: CONTEXTUAL FRAMEWORKS */}
                    <div className="space-y-6">
                      
                      {/* Point 1: Case Identity */}
                      {p1_case_identity && (
                        <div className="space-y-2">
                          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059] print:text-black">
                            1. Case Identity & Bench
                          </h3>
                          <div className="p-5 bg-white/[0.01] border border-white/5 rounded-sm font-sans text-sm leading-relaxed text-slate-300 print:text-black print:border-black/10">
                            {p1_case_identity}
                          </div>
                        </div>
                      )}

                      {/* Point 2: Subject Area */}
                      {p2_subject_area && (
                        <div className="space-y-2">
                          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059] print:text-black">
                            2. Subject Area & Classification
                          </h3>
                          <div className="p-5 bg-white/[0.01] border border-white/5 rounded-sm font-sans text-sm leading-relaxed text-slate-300 print:text-black print:border-black/10">
                            {p2_subject_area}
                          </div>
                        </div>
                      )}

                      {/* Point 3: Statutory Provisions */}
                      {p3_statutes && (
                        <div className="space-y-2">
                          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059] print:text-black">
                            3. Statutory Focus
                          </h3>
                          <div className="p-5 bg-white/[0.01] border border-white/5 rounded-sm font-sans text-sm leading-relaxed text-slate-300 print:text-black print:border-black/10">
                            {p3_statutes}
                          </div>
                        </div>
                      )}

                      {/* Point 5: Factual Matrix */}
                      {p5_factual_matrix && (
                        <div className="space-y-2">
                          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059] print:text-black">
                            5. Factual Matrix
                          </h3>
                          <div className="p-5 bg-white/[0.01] border border-white/5 rounded-sm font-sans text-sm leading-relaxed text-slate-300 print:text-black print:border-black/10">
                            {p5_factual_matrix}
                          </div>
                        </div>
                      )}

                      {/* Point 6 & 7: Arguments Battle */}
                      {(p6_appellant || p7_respondent) && (
                        <div className="space-y-2">
                          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059] print:text-black">
                            6 & 7. Arguments Advanced
                          </h3>
                          <div className="p-5 bg-white/[0.01] border border-white/5 rounded-sm font-sans text-sm leading-relaxed text-slate-300 space-y-4 print:text-black print:border-black/10">
                            {p6_appellant && (
                              <div>
                                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">Appellant / Petitioner:</span>
                                <p className="mt-1.5">{p6_appellant}</p>
                              </div>
                            )}
                            {p7_respondent && (
                              <div className="border-t border-white/5 pt-4 print:border-black/10">
                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Respondent / State:</span>
                                <p className="mt-1.5">{p7_respondent}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                    </div>

                    {/* RIGHT COLUMN: JUDICIAL ANALYSIS & OUTCOMES */}
                    <div className="space-y-6">
                      
                      {/* Point 4: Question of Law */}
                      {p4_question_law && (
                        <div className="space-y-2">
                          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059] print:text-black">
                            4. Question of Law (Issue)
                          </h3>
                          <div className="p-5 bg-[#c5a059]/[0.02] border border-[#c5a059]/10 rounded-sm font-sans text-sm leading-relaxed text-[#c5a059] font-bold italic print:text-black print:border-black/10">
                            {p4_question_law}
                          </div>
                        </div>
                      )}

                      {/* Point 8: Ratio Decidendi */}
                      {p8_ratio && (
                        <div className="space-y-2">
                          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059] print:text-black">
                            8. Ratio Decidendi (Core Principle)
                          </h3>
                          <div className="p-5 bg-white/[0.01] border border-white/5 rounded-sm font-sans text-sm leading-relaxed text-slate-300 print:text-black print:border-black/10">
                            {p8_ratio}
                          </div>
                        </div>
                      )}

                      {/* Point 9: Holding & Final Order */}
                      {p9_holding && (
                        <div className="space-y-2">
                          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059] print:text-black">
                            9. Holding & Final Order
                          </h3>
                          <div className="p-5 bg-white/[0.01] border border-white/5 rounded-sm font-sans text-sm leading-relaxed text-slate-300 font-bold print:text-black print:border-black/10">
                            {p9_holding}
                          </div>
                        </div>
                      )}

                      {/* Point 10: Strategic Litigation Advisory */}
                      {p10_advisory && (
                        <div className="space-y-2 font-sans">
                          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#c5a059] print:text-black">
                            10. Strategic Advisory
                        </h3>
                          <div className="p-5 bg-[#c5a059]/[0.03] border border-[#c5a059]/10 rounded-sm font-sans text-sm leading-relaxed text-slate-300 print:text-black print:border-black/10">
                            {p10_advisory}
                          </div>
                        </div>
                      )}

                    </div>

                  </div>
                )}
              </article>
            )}

            {!selectedDocId && !briefLoading && !briefError && (
              <div className="flex flex-col items-center justify-center py-32 text-center border border-white/5 bg-[#0a0c10]/20 rounded-sm">
                <div className="w-16 h-16 rounded-sm bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center mb-6">
                  <FileText className="w-8 h-8 text-[#c5a059]" />
                </div>
                <p className="text-slate-100 text-lg font-bold font-sans mb-1">No Precedent Selected</p>
                <p className="text-slate-400 text-xs font-sans max-w-xs leading-relaxed">
                  Select a category tab above, then choose a precedent to view its continuous Executive Canvas.
                </p>
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
}