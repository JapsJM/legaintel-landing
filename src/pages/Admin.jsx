import { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, ShieldCheck, Database, Search, ChevronLeft, ChevronRight, MessageSquareOff, Settings, Save } from 'lucide-react';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [quotaConfig, setQuotaConfig] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [savingConfig, setSavingConfig] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastPreview, setBroadcastPreview] = useState(null);
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchFeedback();
    fetchQuotaConfig();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load statistics", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users', {
        params: { page, search, per_page: 5 }
      });
      setUsers(res.data.users);
      setTotalUsers(res.data.total);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedback = async () => {
    try {
      const res = await api.get('/admin/feedback/negative');
      setFeedback(res.data);
    } catch (err) {
      console.error("Failed to load feedback", err);
    }
  };

  const fetchQuotaConfig = async () => {
    try {
      const res = await api.get('/admin/config/quotas');
      setQuotaConfig(res.data);
    } catch (err) {
      console.error("Failed to load quota config", err);
    }
  };

  const handleUpdateUser = async (userId, field, value) => {
    setUpdatingUserId(userId);
    try {
      await api.put(`/admin/users/${userId}`, { [field]: value });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, [field]: value } : u));
      fetchStats(); 
    } catch (err) {
      alert("Failed to apply administrative update: " + (err.response?.data?.error || err.message));
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleSaveQuotaConfig = async () => {
    setSavingConfig(true);
    try {
      await api.put('/admin/config/quotas', quotaConfig);
      alert("Quota configuration updated successfully. Changes are now live.");
    } catch (err) {
      alert("Failed to save quota config: " + (err.response?.data?.error || err.message));
    } finally {
      setSavingConfig(false);
    }
  };

  const handleTierLimitChange = (tier, field, value) => {
    setQuotaConfig(prev => ({
      ...prev,
      tier_limits: {
        ...prev.tier_limits,
        [tier]: {
          ...prev.tier_limits[tier],
          [field]: parseInt(value) || 0
        }
      }
    }));
  };

  const handleFeatureToggle = (tier, feature) => {
    setQuotaConfig(prev => ({
      ...prev,
      tier_limits: {
        ...prev.tier_limits,
        [tier]: {
          ...prev.tier_limits[tier],
          features: {
            ...prev.tier_limits[tier].features,
            [feature]: !prev.tier_limits[tier].features[feature]
          }
        }
      }
    }));
  };

  const totalPages = Math.ceil(totalUsers / 5);

  const handleBroadcastPreview = async () => {
    if (!broadcastMsg.trim()) return;
    setBroadcasting(true);
    try {
      const res = await api.post('/admin/broadcast', { message: broadcastMsg, preview: true }, {
        headers: { 'X-Admin-Secret': import.meta.env.VITE_ADMIN_SECRET || 'legaintel-internal-2026' }
      });
      setBroadcastPreview(res.data);
    } catch (err) {
      setBroadcastResult({ error: err.response?.data?.error || 'Preview failed' });
    } finally { setBroadcasting(false); }
  };

  const handleBroadcastSend = async () => {
    if (!broadcastPreview) return;
    setBroadcasting(true);
    try {
      const res = await api.post('/admin/broadcast', { message: broadcastMsg }, {
        headers: { 'X-Admin-Secret': import.meta.env.VITE_ADMIN_SECRET || 'legaintel-internal-2026' }
      });
      setBroadcastResult(res.data);
      setBroadcastPreview(null);
      setBroadcastMsg('');
    } catch (err) {
      setBroadcastResult({ error: err.response?.data?.error || 'Broadcast failed' });
    } finally { setBroadcasting(false); }
  };

  return (
    <div className="space-y-10 pb-12 font-sans">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-semibold text-slate-100 font-sans">Administrative Console</h1>
        <p className="text-sm text-slate-500 mt-1 font-sans">SaaS Chassis governance, analytics, and RAG alignment.</p>
      </div>

      {/* Analytics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 bg-[#0a0c10] border border-white/5 rounded-sm">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Users</p>
            <p className="text-2xl font-semibold text-white font-serif mt-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#c5a059]" /> {stats.users.total}
            </p>
          </div>
          <div className="p-5 bg-[#0a0c10] border border-white/5 rounded-sm">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Advocates Registered</p>
            <p className="text-2xl font-semibold text-white font-[#c5a059] font-serif mt-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#c5a059]" /> {stats.users.advocates}
            </p>
          </div>
          <div className="p-5 bg-[#0a0c10] border border-white/5 rounded-sm">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Queries Today</p>
            <p className="text-2xl font-semibold text-emerald-400 font-serif mt-2">
              {stats.usage.active_queries_today}
            </p>
          </div>
          <div className="p-5 bg-[#0a0c10] border border-white/5 rounded-sm">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total RAG Queries</p>
            <p className="text-2xl font-semibold text-white font-serif mt-2 flex items-center gap-2">
              <Database className="w-5 h-5 text-[#c5a059]" /> {stats.usage.total_queries_lifetime}
            </p>
          </div>
        </div>
      )}

      {/* Dynamic Quota & Tier Configuration */}
      {quotaConfig && (
        <div className="bg-[#0a0c10] border border-white/5 rounded-sm p-6 space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#c5a059]" />
                Dynamic Quota & Tier Configuration
              </h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">
                Adjust AI Credit limits and feature locks in real-time
              </p>
            </div>
            <button
              onClick={handleSaveQuotaConfig}
              disabled={savingConfig}
              className="flex items-center gap-2 px-4 py-2 bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/20 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-[#c5a059]/20 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {savingConfig ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['free', 'pro', 'enterprise'].map((tier) => (
              <div key={tier} className="p-4 bg-black/40 border border-white/5 rounded-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#c5a059] border-b border-white/5 pb-2">
                  {tier} Tier
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Daily AI Credits</label>
                    <input
                      type="number"
                      value={quotaConfig.tier_limits[tier].daily_credits}
                      onChange={(e) => handleTierLimitChange(tier, 'daily_credits', e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-sm px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Max Documents</label>
                    <input
                      type="number"
                      value={quotaConfig.tier_limits[tier].max_documents}
                      onChange={(e) => handleTierLimitChange(tier, 'max_documents', e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-sm px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 space-y-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Feature Locks</p>
                  {Object.entries(quotaConfig.tier_limits[tier].features).map(([feature, isEnabled]) => (
                    <label key={feature} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => handleFeatureToggle(tier, feature)}
                        className="w-3 h-3 accent-[#c5a059] bg-black border-white/10 rounded-sm cursor-pointer"
                      />
                      <span className={`text-[11px] font-sans ${isEnabled ? 'text-slate-300' : 'text-slate-600 group-hover:text-slate-400'}`}>
                        {feature.replace('_', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Management Section */}
      <div className="bg-[#0a0c10] border border-white/5 rounded-sm p-6 space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">User Governance</h2>
          
          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search username or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="block w-full pl-9 pr-4 py-2 border border-white/10 rounded-sm bg-black/40 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#c5a059]/50 transition-all"
            />
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <th className="pb-3">User Details</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Subscription Tier</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-slate-600">Loading Directory...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-slate-600">No users found.</td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.01]">
                    <td className="py-4">
                      <p className="font-bold text-slate-200">{u.username}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{u.email}</p>
                    </td>
                    <td className="py-4">
                      <select
                        value={u.role}
                        disabled={updatingUserId === u.id}
                        onChange={(e) => handleUpdateUser(u.id, 'role', e.target.value)}
                        className="bg-black border border-white/10 rounded-sm px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-[#c5a059]"
                      >
                        <option value="student">Student</option>
                        <option value="advocate_hc">Advocate (High Court)</option>
                        <option value="advocate_sc">Advocate (Supreme Court)</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-4">
                      <select
                        value={u.tier}
                        disabled={updatingUserId === u.id}
                        onChange={(e) => handleUpdateUser(u.id, 'tier', e.target.value)}
                        className="bg-black border border-white/10 rounded-sm px-2 py-1 text-xs text-[#c5a059] font-semibold focus:outline-none focus:border-[#c5a059]"
                      >
                        <option value="free">Free Tier</option>
                        <option value="pro">Pro Tier</option>
                        <option value="enterprise">Enterprise Tier</option>
                      </select>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => handleUpdateUser(u.id, 'is_active', !u.is_active)}
                        disabled={updatingUserId === u.id}
                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition ${
                          u.is_active 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                            : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                        }`}
                      >
                        {u.is_active ? 'Active' : 'Suspended'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-sm transition disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-sm transition disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Negative Feedback Debugger Section */}
      <div className="bg-[#0a0c10] border border-white/5 rounded-sm p-6 space-y-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">Negative Feedback Debugger</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Last 20 downvoted AI answers matched with preceding user query</p>
        </div>

        {feedback.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-white/[0.01] rounded border border-white/5">
            <MessageSquareOff className="w-8 h-8 text-slate-600 mb-3" />
            <p className="text-slate-400 text-xs font-sans">No negative feedback recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {feedback.map((f, i) => (
              <div key={i} className="p-4 bg-black/40 border border-white/5 rounded-sm space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold tracking-wider uppercase text-slate-500 border-b border-white/5 pb-2">
                  <span>User ID: {f.user_id}</span>
                  <span>{new Date(f.timestamp).toLocaleString()}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-sans"><span className="text-[#c5a059] font-bold">Query:</span> {f.query}</p>
                  <div className="p-3 bg-white/[0.01] rounded border border-white/5">
                    <p className="text-[11px] font-sans leading-relaxed text-slate-400"><span className="text-red-400 font-bold">AI Answer:</span> {f.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Telegram Broadcast Panel */}
      <div className="bg-[#0a0c10] border border-white/5 rounded-sm p-6 space-y-5">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#229ED9"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/></svg>
            Telegram Broadcast
          </h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Send a message to all active @LegAIntel_bot subscribers</p>
        </div>

        <textarea
          value={broadcastMsg}
          onChange={e => { setBroadcastMsg(e.target.value); setBroadcastPreview(null); setBroadcastResult(null); }}
          placeholder="Write your broadcast message here... (max 4096 chars)"
          rows={5}
          className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-3 text-sm text-slate-200 font-sans focus:outline-none focus:border-[#c5a059]/50 resize-none placeholder-slate-600"
        />

        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-600 font-mono">{broadcastMsg.length}/4096</span>
          <div className="flex gap-3">
            {!broadcastPreview ? (
              <button onClick={handleBroadcastPreview} disabled={broadcasting || !broadcastMsg.trim()}
                className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest rounded-sm transition disabled:opacity-40">
                {broadcasting ? 'Checking...' : 'Preview'}
              </button>
            ) : (
              <button onClick={handleBroadcastSend} disabled={broadcasting}
                className="px-5 py-2 bg-[#229ED9] hover:bg-[#1a8fc7] text-white text-xs font-bold uppercase tracking-widest rounded-sm transition disabled:opacity-40">
                {broadcasting ? 'Sending...' : `Send to ${broadcastPreview.subscriber_count} subscribers`}
              </button>
            )}
          </div>
        </div>

        {broadcastPreview && (
          <div className="p-4 bg-[#229ED9]/5 border border-[#229ED9]/20 rounded-sm">
            <p className="text-[10px] text-[#229ED9] uppercase tracking-widest font-bold mb-2">Preview — {broadcastPreview.subscriber_count} active subscribers</p>
            <p className="text-sm text-slate-300 font-sans whitespace-pre-wrap">{broadcastPreview.message}</p>
          </div>
        )}

        {broadcastResult && (
          <div className={`p-4 rounded-sm border ${broadcastResult.error ? 'bg-red-950/10 border-red-900/30 text-red-400' : 'bg-emerald-950/10 border-emerald-900/30 text-emerald-400'}`}>
            <p className="text-xs font-bold font-sans">
              {broadcastResult.error || `✓ Sent to ${broadcastResult.sent} of ${broadcastResult.total} subscribers. Failed: ${broadcastResult.failed}`}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}