import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { FileText, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';

const docTypeBadge = (type) => {
  const styles = {
    order:       'bg-blue-500/10 text-blue-400 border-blue-500/20',
    final_order: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };
  const label = type === 'final_order' ? 'Final Order' : 'Order';
  return (
    <span className={`px-2 py-0.5 text-[10px] font-medium rounded border uppercase tracking-wider font-sans ${styles[type] || 'bg-white/5 text-slate-400 border-white/10'}`}>
      {label}
    </span>
  );
};

export default function OrdersLibrary() {
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [page, setPage]                   = useState(1);
  const [total, setTotal]                 = useState(0);
  const [searchInput, setSearchInput]     = useState('');
  const [search, setSearch]               = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pdfUrl, setPdfUrl]               = useState(null);
  const [pdfLoading, setPdfLoading]       = useState(false);
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

  const handleSelectOrder = async (order) => {
    setSelectedOrder(order);
    setPdfUrl(null);
    setPdfLoading(true);
    try {
      const res = await api.get(`/documents/${order.id}/file`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      setPdfUrl(url);
    } catch {
      setPdfUrl(null);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleClose = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setSelectedOrder(null);
    setPdfUrl(null);
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">

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

        {/* Main layout — split when order selected */}
        <div className={`flex gap-6 ${selectedOrder ? 'flex-row' : 'flex-col'}`}>

          {/* Left — list */}
          <div className={selectedOrder ? 'w-80 flex-shrink-0' : 'w-full'}>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center mb-4">
              <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input type="text" value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    placeholder="Search filename…"
                    className="w-full pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#c5a059]/50 font-sans" />
                </div>
                <button type="submit"
                  className="px-3 py-1.5 bg-[#c5a059] hover:bg-[#c5a059]/80 text-black text-xs font-semibold rounded transition font-sans">
                  Go
                </button>
              </form>

              <div className="flex gap-1.5">
                {[['', 'All'], ['order', 'Orders'], ['final_order', 'Final']].map(([val, label]) => (
                  <button key={val}
                    onClick={() => { setDocTypeFilter(val); setPage(1); }}
                    className={`px-2.5 py-1.5 rounded text-xs font-medium transition font-sans ${docTypeFilter === val ? 'bg-[#c5a059] text-black' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            {loading ? (
              <div className="flex justify-center py-16">
                <svg className="w-5 h-5 animate-spin text-[#c5a059]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-950/20 border border-red-900/30 rounded text-red-300 text-xs font-sans">{error}</div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="w-8 h-8 text-slate-600 mb-3" />
                <p className="text-slate-400 text-sm font-sans">No orders found</p>
                <p className="text-slate-600 text-xs mt-1 font-sans">Orders are ingested automatically daily</p>
              </div>
            ) : (
              <div className="border border-white/5 rounded overflow-hidden">
                {orders.map((item, idx) => (
                  <div key={item.id}
                    onClick={() => handleSelectOrder(item)}
                    className={`flex items-center gap-3 px-4 py-3 border-b border-white/5 cursor-pointer transition
                      ${selectedOrder?.id === item.id ? 'bg-[#c5a059]/10 border-l-2 border-l-[#c5a059]' : 'hover:bg-white/[0.02]'}
                      ${idx % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
                    <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300 truncate font-sans" title={item.filename}>{item.filename}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5 font-sans">
                        {item.activated_at ? new Date(item.activated_at).toLocaleDateString('en-IN') : '—'}
                        {' · '}{item.file_size ? `${(item.file_size / 1024).toFixed(0)} KB` : ''}
                      </p>
                    </div>
                    {docTypeBadge(item.document_type)}
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-[10px] text-slate-600 font-sans">{total} orders total</p>
                <div className="flex gap-2 items-center">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="p-1 rounded bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition">
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <span className="text-[10px] text-slate-500 font-sans">{page}/{totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="p-1 rounded bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition">
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right — PDF Preview */}
          {selectedOrder && (
            <div className="flex-1 min-w-0">
              <div className="border border-white/5 rounded overflow-hidden h-full flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-[#c5a059] flex-shrink-0" />
                    <p className="text-xs text-slate-300 truncate font-sans">{selectedOrder.filename}</p>
                    {docTypeBadge(selectedOrder.document_type)}
                  </div>
                  <button onClick={handleClose}
                    className="ml-3 p-1 rounded hover:bg-white/10 text-slate-500 hover:text-slate-300 transition flex-shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* PDF Viewer */}
                <div className="flex-1" style={{ minHeight: '70vh' }}>
                  {pdfLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <svg className="w-5 h-5 animate-spin text-[#c5a059]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                    </div>
                  ) : pdfUrl ? (
                    <iframe src={pdfUrl} className="w-full h-full" style={{ minHeight: '70vh' }}
                      title={selectedOrder.filename} />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center px-6">
                      <FileText className="w-8 h-8 text-slate-600 mb-3" />
                      <p className="text-slate-400 text-sm font-sans">Could not load PDF preview</p>
                      <p className="text-slate-600 text-xs mt-1 font-sans">The file may not be available for preview</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
