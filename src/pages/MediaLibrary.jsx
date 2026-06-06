import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { FileText, ChevronLeft, ChevronRight, Search, ExternalLink } from 'lucide-react';

const docTypeLabel = (type) => {
  if (type === 'final_order') return 'Final Order';
  return 'Order';
};

const docTypeBadge = (type) => {
  const styles = {
    order:       'bg-blue-500/10 text-blue-400 border-blue-500/20',
    final_order: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] font-medium rounded border uppercase tracking-wider font-sans ${styles[type] || 'bg-white/5 text-slate-400 border-white/10'}`}>
      {docTypeLabel(type)}
    </span>
  );
};

export default function MediaLibrary() {
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [page, setPage]               = useState(1);
  const [total, setTotal]             = useState(0);
  const [search, setSearch]           = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('');
  const LIMIT = 20;

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: LIMIT };
      if (search)        params.search   = search;
      if (docTypeFilter) params.doc_type = docTypeFilter;
      const res = await api.get('/documents/orders', { params });
      setOrders(res.data.results || []);
      setTotal(res.data.total   || 0);
      setError(null);
    } catch (err) {
      if (err.response?.status === 402) {
        setError('Orders Library requires a Pro or Enterprise subscription.');
      } else {
        setError('Failed to load orders.');
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, docTypeFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">

        <button onClick={() => window.location.href = '/dashboard'}
          className="text-xs text-slate-500 hover:text-slate-300 transition mb-6 font-sans">
          ← Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-xl font-semibold text-slate-100 font-sans">Orders Library</h1>
          <p className="text-sm text-slate-500 mt-1 font-sans">
            Supreme Court orders and final orders — system ingested daily
          </p>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap gap-3 items-center mb-6">

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[220px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search by case number or filename…"
                className="w-full pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#c5a059]/50 font-sans"
              />
            </div>
            <button type="submit"
              className="px-3 py-1.5 bg-[#c5a059] hover:bg-[#c5a059]/80 text-black text-xs font-semibold rounded transition font-sans">
              Search
            </button>
          </form>

          {/* Doc type filter */}
          <div className="flex gap-2">
            {[['', 'All'], ['order', 'Orders'], ['final_order', 'Final Orders']].map(([val, label]) => (
              <button key={val}
                onClick={() => { setDocTypeFilter(val); setPage(1); }}
                className={`px-3 py-1.5 rounded text-xs font-medium transition font-sans ${docTypeFilter === val ? 'bg-[#c5a059] text-black' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <svg className="w-5 h-5 animate-spin text-[#c5a059]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-950/20 border border-red-900/30 rounded text-red-300 text-sm font-sans">{error}</div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-slate-600" />
            </div>
            <p className="text-slate-300 text-sm font-semibold font-sans mb-1">No orders found</p>
            <p className="text-slate-500 text-xs font-sans">Orders are ingested automatically from Supreme Court daily</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="border border-white/5 rounded overflow-hidden">
              <table className="w-full text-xs font-sans">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Case / Filename</th>
                    <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-slate-500 font-semibold w-24">Court</th>
                    <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-slate-500 font-semibold w-28">Type</th>
                    <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-slate-500 font-semibold w-28">Date</th>
                    <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-slate-500 font-semibold w-20">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((item, idx) => (
                    <tr key={item.id}
                      className={`border-b border-white/5 hover:bg-white/[0.02] transition ${idx % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
                      <td className="px-4 py-3 text-slate-300 max-w-xs">
                        <p className="truncate" title={item.filename}>{item.filename}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{item.court_id}</td>
                      <td className="px-4 py-3">{docTypeBadge(item.document_type)}</td>
                      <td className="px-4 py-3 text-slate-400">
                        {item.activated_at ? new Date(item.activated_at).toLocaleDateString('en-IN') : '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {item.file_size ? `${(item.file_size / 1024).toFixed(0)} KB` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-[11px] text-slate-500 font-sans">
                  Showing {((page - 1) * LIMIT) + 1}–{Math.min(page * LIMIT, total)} of {total} orders
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="p-1.5 rounded bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 py-1.5 text-xs text-slate-400 font-sans">{page} / {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="p-1.5 rounded bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
