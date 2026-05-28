import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import {
  Star, Filter, ChevronLeft, ChevronRight,
  CheckCircle, Clock, XCircle, MessageSquarePlus,
  RefreshCw, Search, StickyNote, X
} from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  pending:  { label: 'Pending',  color: 'text-amber-400',  bg: 'bg-amber-400/10 border-amber-400/20',  icon: Clock },
  reviewed: { label: 'Reviewed', color: 'text-blue-400',   bg: 'bg-blue-400/10 border-blue-400/20',   icon: CheckCircle },
  resolved: { label: 'Resolved', color: 'text-emerald-400',bg: 'bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle },
};

function StarDisplay({ rating }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${s <= rating ? 'text-[#c5a059] fill-[#c5a059]' : 'text-slate-700'}`}
        />
      ))}
    </span>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.bg} ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ── Notes Modal ───────────────────────────────────────────────────────────────

function NotesModal({ entry, onClose, onSave }) {
  const [notes, setNotes] = useState(entry.admin_notes || '');
  const [status, setStatus] = useState(entry.status || 'pending');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(entry.id, { status, admin_notes: notes });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed z-50 inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0d0f14] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <StickyNote className="w-4 h-4 text-[#c5a059]" />
              <h2 className="text-sm font-semibold text-white">Review Feedback</h2>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-5 py-5 space-y-4">
            {/* Ref + rating summary */}
            <div className="bg-white/3 border border-white/8 rounded-lg p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#c5a059]">{entry.reference_id}</span>
                <StarDisplay rating={entry.rating} />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {entry.message || <span className="italic text-slate-600">No message provided</span>}
              </p>
            </div>

            {/* Status selector */}
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-semibold">Status</p>
              <div className="flex gap-2">
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setStatus(key)}
                    className={`flex-1 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                      status === key
                        ? `${cfg.bg} ${cfg.color}`
                        : 'border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300'
                    }`}
                  >
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Admin notes */}
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-semibold">Admin Notes</p>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="Add internal notes for this feedback…"
                className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#c5a059]/40 resize-none"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-2.5 bg-[#c5a059] text-black text-xs font-bold rounded-md hover:bg-[#d4b06a] transition-all disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdminFeedback() {
  const [feedback, setFeedback]   = useState([]);
  const [total, setTotal]         = useState(0);
  const [pages, setPages]         = useState(1);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null); // entry for NotesModal

  // Filters
  const [ratingFilter, setRatingFilter]   = useState('');
  const [statusFilter, setStatusFilter]   = useState('');
  const [dateFrom, setDateFrom]           = useState('');
  const [dateTo, setDateTo]               = useState('');

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, per_page: 15 };
      if (ratingFilter) params.rating = ratingFilter;
      if (statusFilter) params.status = statusFilter;
      if (dateFrom)     params.date_from = dateFrom;
      if (dateTo)       params.date_to = dateTo;

      const res = await api.get('/admin/feedback', { params });
      setFeedback(res.data.feedback);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      console.error('[AdminFeedback] fetch error', err);
    } finally {
      setLoading(false);
    }
  }, [page, ratingFilter, statusFilter, dateFrom, dateTo]);

  useEffect(() => { fetchFeedback(); }, [fetchFeedback]);

  const handleUpdateFeedback = async (id, updates) => {
    await api.put(`/admin/feedback/${id}`, updates);
    fetchFeedback();
  };

  const clearFilters = () => {
    setRatingFilter('');
    setStatusFilter('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const hasFilters = ratingFilter || statusFilter || dateFrom || dateTo;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <MessageSquarePlus className="w-5 h-5 text-[#c5a059]" />
            <h1 className="text-2xl font-serif text-white tracking-tight">Feedback Dashboard</h1>
          </div>
          <p className="text-sm text-slate-500">Review, filter, and resolve user feedback submissions.</p>
        </div>
        <button
          onClick={fetchFeedback}
          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 border border-white/10 rounded-md hover:text-white hover:bg-white/5 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Submissions', value: total, color: 'text-white' },
          { label: 'Pending Review', value: feedback.filter(f => f.status === 'pending').length, color: 'text-amber-400' },
          { label: 'Resolved', value: feedback.filter(f => f.status === 'resolved').length, color: 'text-emerald-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#0a0c10] border border-white/5 rounded-xl px-5 py-4">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{loading ? '—' : value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[#0a0c10] border border-white/5 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-[#c5a059]" />
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Filters</h3>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" /> Clear all
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Rating */}
          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Rating</label>
            <select
              value={ratingFilter}
              onChange={e => { setRatingFilter(e.target.value); setPage(1); }}
              className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#c5a059]/40"
            >
              <option value="">All</option>
              {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#c5a059]/40"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={e => { setDateFrom(e.target.value); setPage(1); }}
              className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#c5a059]/40"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={e => { setDateTo(e.target.value); setPage(1); }}
              className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#c5a059]/40"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0a0c10] border border-white/5 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing <span className="text-white font-semibold">{feedback.length}</span> of{' '}
            <span className="text-white font-semibold">{total}</span> entries
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-600 text-sm">Loading feedback…</div>
        ) : feedback.length === 0 ? (
          <div className="py-20 text-center text-slate-600 text-sm">No feedback matches your filters.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Reference', 'User', 'Rating', 'Message', 'Page', 'Status', 'Date', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {feedback.map((entry, idx) => (
                <tr
                  key={entry.id}
                  className={`border-b border-white/5 hover:bg-white/3 transition-colors ${idx % 2 === 0 ? '' : 'bg-white/[0.01]'}`}
                >
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-mono text-[#c5a059]">{entry.reference_id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-white font-semibold truncate max-w-[90px]">{entry.username || '—'}</p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[90px]">{entry.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StarDisplay rating={entry.rating} />
                  </td>
                  <td className="px-4 py-3 max-w-[180px]">
                    <p className="text-xs text-slate-400 truncate">
                      {entry.message || <span className="italic text-slate-600">No message</span>}
                    </p>
                  </td>
                  <td className="px-4 py-3 max-w-[120px]">
                    <p className="text-[10px] text-slate-500 truncate" title={entry.page_url}>
                      {entry.page_url ? entry.page_url.replace(/^https?:\/\/[^/]+/, '') || '/' : '—'}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={entry.status} />
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[10px] text-slate-500 whitespace-nowrap">
                      {entry.timestamp ? new Date(entry.timestamp).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—'}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(entry)}
                      className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 border border-white/10 rounded-md hover:text-[#c5a059] hover:border-[#c5a059]/30 transition-all"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-xs text-slate-500">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="p-1.5 rounded-md border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notes Modal */}
      {selected && (
        <NotesModal
          entry={selected}
          onClose={() => setSelected(null)}
          onSave={handleUpdateFeedback}
        />
      )}
    </div>
  );
}
