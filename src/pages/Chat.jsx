import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ConversationSidebar from '../components/ConversationSidebar';
import MessageThread from '../components/MessageThread';
import ChatInput from '../components/ChatInput';
import { useChatSocket } from '../hooks/useChatSocket';
import { listConversations, getConversation, deleteConversation } from '../services/chat';
import {Archive, Tag, Eye, EyeOff, Sparkles, X, Loader2, Play,
  ArrowLeftRight, Search, ChevronDown
} from 'lucide-react';

// Dynamic API Host Resolver: Forces Port 5000 locally, resolves relatively in production
const API_HOST = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : (import.meta.env.VITE_API_URL || '');

export default function Chat() {
  const { user } = useAuth();

  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState(null);
  
  // Jurisdictional court filter
  const [activeCourtId, setActiveCourtId] = useState(''); // Empty string means 'All Courts'

  // --- EXTENSION: Chat Management States (Archiving & Categorization) ---
  const [showArchived, setShowArchived] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sessionCategory, setSessionCategory] = useState('General');

  // Categories list suitable for high-end advocate workspaces
  const categoriesList = ['General', 'Constitutional', 'Criminal', 'Corporate', 'Civil', 'Taxation'];

  // ── EXTENSION: Statutory Bridge Sliding Panel States ──────────
  const [showBridge, setShowBridge] = useState(false);
  const [bridgeInputText, setBridgeInputText] = useState('');
  const [bridgeAnnotatedText, setBridgeAnnotatedText] = useState('');
  const [bridgeCitations, setBridgeCitations] = useState([]);
  const [bridgeLoading, setBridgeLoading] = useState(false);

  // ── Quick Lookup States ────────────────────────────────────
  const [bridgeMode, setBridgeMode] = useState('text'); // 'text' | 'lookup'
  const [lookupAct, setLookupAct] = useState('IPC');
  const [lookupSection, setLookupSection] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupNotFound, setLookupNotFound] = useState(false);

  useEffect(() => {
    listConversations().then(setSessions).catch(() => setSessions([]));
  }, []);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const { sendQuery } = useChatSocket({
    onThinking: () => {
      setThinking(true);
    },
    onToken: (data) => {
      setThinking(false);
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last && last.role === 'assistant' && last.isStreaming) {
          return [
            ...prev.slice(0, -1),
            { ...last, content: last.content + data.token }
          ];
        } else {
          return [
            ...prev,
            { role: 'assistant', content: data.token, isStreaming: true }
          ];
        }
      });
    },
    onResult: (data) => {
      setThinking(false);
      if (!activeSessionId) {
        setActiveSessionId(data.session_id);
      }
      setMessages(prev => {
        const filtered = prev.filter(m => !m.isStreaming);
        return [
          ...filtered,
          {
            role: 'assistant',
            content: data.answer,
            sources: data.sources || [],
            confidence: data.confidence,
            query_type: data.query_type,
            provenance: data.provenance
          }
        ];
      });
      listConversations().then(setSessions).catch(() => {});
    },
    onError: (errMsg) => {
      setThinking(false);
      setError(errMsg);
    }
  });

  const handleSelectSession = async (sessionId) => {
    if (sessionId === activeSessionId) return;
    setActiveSessionId(sessionId);
    try {
      const session = await getConversation(sessionId);
      setMessages(session.messages || []);
      setSessionCategory(session.category || 'General');
    } catch {
      setError('Failed to load conversation');
    }
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setError(null);
    setSessionCategory('General');
  };

  const handleDelete = async (sessionId) => {
    try {
      await deleteConversation(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
        setMessages([]);
      }
    } catch {
      setError('Failed to delete conversation');
    }
  };

  const handleArchiveToggle = async () => {
    if (!activeSessionId) return;
    try {
      const activeSession = sessions.find(s => s.id === activeSessionId);
      const currentlyArchived = activeSession ? activeSession.is_archived : false;
      
      await axios.post(`${API_HOST}/api/conversations/${activeSessionId}/archive`, {
        is_archived: !currentlyArchived
      }, getHeaders());

      setSessions(prev => prev.map(s => 
        s.id === activeSessionId ? { ...s, is_archived: !currentlyArchived } : s
      ));
      
      if (!showArchived) {
        handleNewChat();
      }
    } catch {
      setError('Failed to update archive status');
    }
  };

  const handleUpdateCategory = async (cat) => {
    if (!activeSessionId) return;
    setSessionCategory(cat);
    try {
      await axios.post(`${API_HOST}/api/conversations/${activeSessionId}/category`, {
        category: cat
      }, getHeaders());

      setSessions(prev => prev.map(s => 
        s.id === activeSessionId ? { ...s, category: cat } : s
      ));
    } catch {
      setError('Failed to categorize conversation');
    }
  };

  const handleCustomSend = (message) => {
    setError(null);
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setThinking(true);
    
    sendQuery(message, activeSessionId, activeCourtId);
  };

  // ── EXTENSION: Statutory Bridge Actions ──────────────────────────────────

  const handleMapTextWithBridge = async () => {
    if (!bridgeInputText.trim()) return;
    setBridgeLoading(true);
    try {
      const res = await axios.post(`${API_HOST}/api/transition/map-text`, {
        text: bridgeInputText
      }, getHeaders());

      setBridgeAnnotatedText(res.data.annotated_text);
      setBridgeCitations(res.data.citations_found || []);
    } catch (err) {
      console.error(err);
    } finally {
      setBridgeLoading(false);
    }
  };

  const handleQuickLookup = async () => {
    if (!lookupSection.trim()) return;
    setBridgeLoading(true);
    setLookupResult(null);
    setLookupNotFound(false);
    try {
      const res = await axios.get(`${API_HOST}/api/transition/lookup`, {
        ...getHeaders(),
        params: { act: lookupAct, section: lookupSection.trim(), direction: 'auto' }
      });
      setLookupResult(res.data.data);
    } catch (err) {
      if (err.response?.status === 404) setLookupNotFound(true);
      else console.error(err);
    } finally {
      setBridgeLoading(false);
    }
  };

  const getTransitionBadgeColor = (status) => {
    switch (status) {
      case 'IDENTICAL': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'MODIFIED': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'CRITICAL_RECONSIDERATION': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesArchive = showArchived ? session.is_archived === true : !session.is_archived;
    const matchesCategory = activeCategory === 'All' || session.category === activeCategory;
    return matchesArchive && matchesCategory;
  });

  return (
    <div className="flex h-[calc(100vh-80px)] -m-10 overflow-hidden bg-[#050505]">
      
      {/* LEFT SIDEBAR */}
      <div className="w-72 border-r border-white/5 bg-[#0a0c10] shrink-0 flex flex-col">
        <div className="p-4 border-b border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Filter Workspace</span>
            <button 
              onClick={() => setShowArchived(!showArchived)}
              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#c5a059] hover:text-white transition-colors"
            >
              {showArchived ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              {showArchived ? 'Active Files' : 'Archived'}
            </button>
          </div>

          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full bg-[#050505] border border-white/5 text-[11px] font-bold uppercase tracking-wider text-slate-200 py-1.5 px-2 rounded-sm focus:outline-none focus:border-[#c5a059]"
          >
            <option value="All">All Categories</option>
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex-grow overflow-y-auto">
          <ConversationSidebar
            sessions={filteredSessions}
            activeId={activeSessionId}
            onSelect={handleSelectSession}
            onNew={handleNewChat}
            onDeleted={handleDelete}
          />
        </div>
      </div>

      {/* CENTER CHAT WORKSPACE */}
      <div className="flex-1 flex flex-col bg-[#050505] min-w-0 font-sans relative">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">Research Workspace</h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick-Access Desk Toggle Button */}
            <button
              onClick={() => setShowBridge(!showBridge)}
              className={`flex items-center gap-1.5 px-3 py-1.5 border border-white/10 rounded text-[11px] font-bold uppercase tracking-wider transition-all ${showBridge ? 'bg-[#c5a059] text-black border-[#c5a059]' : 'text-slate-300 hover:text-[#c5a059]'}`}
            >
              <Tag className="w-3.5 h-3.5" />
              Statutory Bridge
            </button>

            {activeSessionId && (
              <div className="flex items-center gap-3 pl-3 border-l border-white/5">
                <div className="flex items-center gap-2">
                  <select
                    value={sessionCategory}
                    onChange={(e) => handleUpdateCategory(e.target.value)}
                    className="bg-black border border-white/10 rounded px-2 py-1 text-[11px] font-sans font-bold uppercase tracking-wider text-slate-300 focus:outline-none focus:border-[#c5a059]"
                  >
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleArchiveToggle}
                  title="Toggle conversation archive state"
                  className="p-1.5 border border-white/10 hover:border-white/20 text-slate-300 hover:text-[#c5a059] transition-colors rounded"
                >
                  <Archive className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 pl-3 border-l border-white/5">
              <select
                value={activeCourtId}
                onChange={(e) => setActiveCourtId(e.target.value)}
                className="bg-black border border-white/10 rounded px-2.5 py-1 text-[11px] font-sans font-bold uppercase tracking-wider text-[#c5a059] focus:outline-none focus:border-[#c5a059]"
              >
                <option value="">All Jurisdictions</option>
                <option value="SCI">Supreme Court of India (SCI)</option>
                <option value="GHC">Gujarat High Court (GHC)</option>
              </select>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            {error && (
              <div className="mb-4 p-3 bg-red-950/20 border border-red-900/30 rounded text-xs text-red-300">
                {error}
              </div>
            )}
            <MessageThread messages={messages} thinking={thinking} />
          </div>
        </div>

        <div className="border-t border-white/5 p-6 bg-[#050505]">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSend={handleCustomSend} disabled={thinking} />
          </div>
        </div>
      </div>

      {/* ── EXTENSION: SLIDING RIGHT STATUTORY BRIDGE DESK PANEL ────────── */}
      {showBridge && (
        <div className="w-96 border-l border-white/5 bg-[#0a0c10] shrink-0 flex flex-col z-10 animate-in slide-in-from-right duration-200">

          {/* Desk Header */}
          <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c5a059]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">Statutory Bridge Desk</h3>
            </div>
            <button onClick={() => setShowBridge(false)} className="text-slate-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="flex border-b border-white/5 bg-black/10">
            <button
              onClick={() => setBridgeMode('lookup')}
              className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all ${bridgeMode === 'lookup' ? 'text-[#c5a059] border-b-2 border-[#c5a059]' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Search className="w-3 h-3" /> Quick Lookup
            </button>
            <button
              onClick={() => setBridgeMode('text')}
              className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all ${bridgeMode === 'text' ? 'text-[#c5a059] border-b-2 border-[#c5a059]' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <ArrowLeftRight className="w-3 h-3" /> Text Modernizer
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-5 space-y-5">

            {/* ── QUICK LOOKUP MODE ── */}
            {bridgeMode === 'lookup' && (
              <div className="space-y-4">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Enter any section from IPC, CrPC, IEA, BNS, BNSS, or BSA — get the mapped equivalent instantly.
                </p>

                {/* Act Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Select Act</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['IPC', 'CrPC', 'IEA', 'BNS', 'BNSS', 'BSA'].map(act => (
                      <button
                        key={act}
                        onClick={() => { setLookupAct(act); setLookupResult(null); setLookupNotFound(false); }}
                        className={`py-1.5 rounded text-[10px] font-bold uppercase tracking-widest border transition-all ${
                          lookupAct === act
                            ? 'bg-[#c5a059] text-black border-[#c5a059]'
                            : ['BNS','BNSS','BSA'].includes(act)
                              ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                              : 'border-white/10 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        {act}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-slate-500 pt-0.5">
                    {['BNS','BNSS','BSA'].includes(lookupAct)
                      ? `Reverse lookup — ${lookupAct} → ${lookupAct === 'BNS' ? 'IPC' : lookupAct === 'BNSS' ? 'CrPC' : 'IEA'}`
                      : `Forward lookup — ${lookupAct} → ${lookupAct === 'IPC' ? 'BNS' : lookupAct === 'CrPC' ? 'BNSS' : 'BSA'}`
                    }
                  </p>
                </div>

                {/* Section Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Section Number</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={lookupSection}
                      onChange={(e) => { setLookupSection(e.target.value); setLookupResult(null); setLookupNotFound(false); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleQuickLookup()}
                      placeholder="e.g. 302, 438, 103(1)"
                      className="flex-1 bg-[#050505] border border-white/10 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#c5a059] font-mono"
                    />
                    <button
                      onClick={handleQuickLookup}
                      disabled={bridgeLoading || !lookupSection.trim()}
                      className="px-3 py-2 rounded bg-[#c5a059] hover:bg-[#b38f48] text-black disabled:opacity-50 transition-all"
                    >
                      {bridgeLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Result Card */}
                {lookupResult && (
                  <div className="p-4 bg-[#050505] border border-[#c5a059]/20 rounded space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#c5a059]">
                        {lookupResult.old_act} § {lookupResult.old_section}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded border font-bold uppercase tracking-widest ${getTransitionBadgeColor(lookupResult.transition_type)}`}>
                        {lookupResult.transition_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 py-1">
                      <span className="text-[10px] text-slate-400 font-mono">{lookupResult.old_act} {lookupResult.old_section}</span>
                      <ArrowLeftRight className="w-3 h-3 text-[#c5a059] shrink-0" />
                      <span className="text-[10px] text-white font-bold font-mono">{lookupResult.new_act} {lookupResult.new_section}</span>
                    </div>
                    <div className="space-y-1 border-t border-white/5 pt-2">
                      <p className="text-[11px] font-bold text-slate-200">{lookupResult.new_title}</p>
                      {lookupResult.old_title && (
                        <p className="text-[10px] text-slate-500">Formerly: {lookupResult.old_title}</p>
                      )}
                    </div>
                    {lookupResult.legislative_changes && (
                      <p className="text-[10px] text-slate-400 leading-relaxed italic border-t border-white/5 pt-2">
                        {lookupResult.legislative_changes}
                      </p>
                    )}
                  </div>
                )}

                {lookupNotFound && (
                  <div className="p-3 bg-red-500/5 border border-red-500/20 rounded text-center">
                    <p className="text-[11px] text-red-400">No mapping found for {lookupAct} § {lookupSection}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Section may not be in database yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* ── TEXT MODERNIZER MODE ── */}
            {bridgeMode === 'text' && (
              <div className="space-y-4">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Paste raw legal drafts or legacy judgments to automatically scan and modernize older IPC, CrPC, or IEA citations.
                </p>
                <textarea
                  value={bridgeInputText}
                  onChange={(e) => setBridgeInputText(e.target.value)}
                  placeholder="Paste legal text here... (e.g. 'accused committed murder as per Section 302 of the IPC')"
                  className="w-full h-32 bg-[#050505] border border-white/10 rounded p-3 text-xs text-slate-200 focus:outline-none focus:border-[#c5a059] font-sans resize-none"
                />
                <button
                  onClick={handleMapTextWithBridge}
                  disabled={bridgeLoading || !bridgeInputText.trim()}
                  className="w-full py-2.5 rounded bg-[#c5a059] hover:bg-[#b38f48] text-black text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                >
                  {bridgeLoading ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" />Parsing...</>
                  ) : (
                    <><Play className="w-3 h-3 fill-current" />Modernize Citations</>
                  )}
                </button>

                {bridgeAnnotatedText && (
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059]">Annotated Legal Draft</h4>
                    <div className="p-3 bg-[#050505] border border-white/5 rounded text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                      {bridgeAnnotatedText}
                    </div>
                    {bridgeCitations.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Legislative Deltas</h4>
                        {bridgeCitations.map((cit, idx) => (
                          <div key={idx} className="p-3 bg-[#050505] border border-white/5 rounded space-y-2 font-sans">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#c5a059]">{cit.old_act} Sec. {cit.old_section}</span>
                              <span className={`text-[9px] px-2 py-0.5 rounded border font-bold uppercase tracking-widest ${getTransitionBadgeColor(cit.transition_type)}`}>
                                {cit.transition_type}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300">
                              Now mapped to <span className="font-bold text-white">{cit.new_act} Section {cit.new_section}</span> ({cit.new_title}).
                            </p>
                            <p className="text-[10px] text-slate-400 leading-relaxed italic">{cit.legislative_changes}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}