import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { listDocuments, getDocumentStatus } from '../services/documents'
import { useDocumentSocket } from '../hooks/useDocumentSocket'
import UploadZone from '../components/UploadZone'
import DocumentList from '../components/DocumentList'
import api from '../services/api'
import { BookOpen, X, ExternalLink } from 'lucide-react'

const phaseToStatus = (doc) => {
  if (doc.status === 'ready')  return 'ready'
  if (doc.status === 'failed') return 'failed'
  const phase = doc.phase || ''
  if (phase === 'ACTIVATED') return 'ready'
  if (phase === 'FAILED')    return 'failed'
  if (phase === 'PURGATORY') return 'ready'
  if (['RESERVED','STORED','PARSED','VALIDATED','EMBEDDED'].includes(phase)) return 'processing'
  return doc.status || 'pending'
}

// ── Deep Dive Workspace Section ───────────────────────────────────────────────
function DeepDiveWorkspace() {
  const [linked, setLinked]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [removing, setRemoving] = useState(null)
  const [open, setOpen]         = useState(true)

  useEffect(() => {
    api.get('/documents/workspace')
      .then(res => setLinked(res.data?.documents || []))
      .catch(() => setLinked([]))
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = async (docId) => {
    if (!window.confirm('Remove this judgment from your workspace?')) return
    setRemoving(docId)
    try {
      await api.delete(`/documents/${docId}/workspace`)
      setLinked(prev => prev.filter(d => d.id !== docId))
    } catch {
      alert('Failed to remove')
    } finally {
      setRemoving(null)
    }
  }

  if (!loading && linked.length === 0) return null

  return (
    <section>
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
            Deep Dive Workspace
          </h2>
          {linked.length > 0 && (
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/20 text-[#c5a059] font-bold font-sans">
              {linked.length}
            </span>
          )}
        </div>
        <span className="text-[10px] text-slate-600 font-sans">{open ? '▲ collapse' : '▼ expand'}</span>
      </button>

      {open && (
        <div className="space-y-2">
          {loading ? (
            <div className="space-y-2 animate-pulse">
              {[1,2].map(i => <div key={i} className="h-14 bg-white/5 rounded-sm" />)}
            </div>
          ) : linked.map(doc => (
            <div key={doc.id}
              className="flex items-center justify-between p-3.5 bg-[#0a0c10] border border-[#c5a059]/10 rounded-sm hover:border-[#c5a059]/20 transition-all">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-sm bg-[#c5a059]/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-3.5 h-3.5 text-[#c5a059]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate font-sans">{doc.filename?.replace('.pdf','')}</p>
                  <p className="text-[9px] text-slate-500 font-sans mt-0.5 uppercase tracking-widest">
                    {doc.court_id || 'SCI'} · Linked {doc.linked_at ? new Date(doc.linked_at).toLocaleDateString('en-IN') : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold uppercase tracking-widest font-sans">
                  Active in RAG
                </span>
                <button onClick={() => handleRemove(doc.id)} disabled={removing === doc.id}
                  className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-sm transition-all disabled:opacity-40">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          <p className="text-[9px] text-slate-600 font-sans px-1">
            These public judgments are available to the AI during Legal Chat queries.
          </p>
        </div>
      )}
    </section>
  )
}

// ── Main Documents Page ───────────────────────────────────────────────────────
export default function Documents() {
  const navigate     = useNavigate()
  const queryClient  = useQueryClient()
  const [liveStatuses, setLiveStatuses] = useState({})

  const { data, isLoading, isError } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const res = await listDocuments()
      return res.data.documents
    },
  })

  useEffect(() => {
    const interval = setInterval(async () => {
      const pending = (data || []).filter(d => {
        const st = liveStatuses[d.id]?.status || phaseToStatus(d)
        return st === 'processing' || st === 'pending'
      })
      for (const doc of pending) {
        try {
          const res = await getDocumentStatus(doc.id)
          setLiveStatuses(prev => ({ ...prev, [doc.id]: { status: phaseToStatus(res.data), progress: res.data.progress || 0 } }))
        } catch {}
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [data, liveStatuses])

  useDocumentSocket(useCallback((update) => {
    setLiveStatuses((prev) => ({ ...prev, [update.doc_id]: { status: update.status, progress: update.progress } }))
    if (update.status === 'ready' || update.status === 'failed') {
      setTimeout(() => { queryClient.invalidateQueries({ queryKey: ['documents'] }) }, 1000)
    }
  }, [queryClient]))

  const handleUploadStart  = useCallback(() => { setTimeout(() => queryClient.invalidateQueries({ queryKey: ['documents'] }), 1500) }, [queryClient])
  const handleDeleted      = useCallback((docId) => { queryClient.setQueryData(['documents'], (old) => old ? old.filter((d) => d.id !== docId) : []); setLiveStatuses((prev) => { const next = { ...prev }; delete next[docId]; return next }) }, [queryClient])
  const handleRechunkStarted = useCallback((docId) => { setLiveStatuses((prev) => ({ ...prev, [docId]: { status: 'processing', progress: 10 } })) }, [])

  const docs            = data || []
  const readyCount      = docs.filter(d => (liveStatuses[d.id]?.status || phaseToStatus(d)) === 'ready').length
  const processingCount = docs.filter(d => { const st = liveStatuses[d.id]?.status || phaseToStatus(d); return st === 'processing' || st === 'pending' }).length

  return (
    <div className="text-white">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">

        {/* LEFT — Upload + Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <button onClick={() => navigate('/dashboard')} className="text-xs text-slate-500 hover:text-slate-300 transition font-sans mb-4 block">
              ← Back to Dashboard
            </button>
            <h1 className="text-xl font-semibold text-slate-100 font-sans">Document Library</h1>
            <p className="text-sm text-slate-500 mt-1 font-sans">Upload and manage your case documents.</p>
          </div>

          {/* Stats */}
          {docs.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Total',      value: docs.length,     color: 'text-slate-100'   },
                { label: 'Ready',      value: readyCount,      color: 'text-emerald-400' },
                { label: 'Processing', value: processingCount, color: 'text-[#c5a059]'   },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-[#0a0c10] border border-white/5 rounded-sm p-3 text-center">
                  <div className={`text-xl font-bold font-sans ${color}`}>{value}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-sans uppercase tracking-widest">{label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Upload Zone */}
          <section>
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 font-sans">Upload Document</h2>
            <UploadZone onUploadStart={handleUploadStart} />
          </section>

          {/* Tips */}
          <div className="p-4 bg-[#0a0c10] border border-white/5 rounded-sm space-y-2">
            <p className="text-[10px] font-bold text-[#c5a059] uppercase tracking-widest font-sans">Supported Formats</p>
            {['PDF — judgments, pleadings, FIRs', 'Word documents — notices, contracts', 'Text files — statements, summaries'].map(tip => (
              <p key={tip} className="text-[10px] text-slate-500 font-sans flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0" />{tip}
              </p>
            ))}
          </div>
        </div>

        {/* RIGHT — Document List + Deep Dive Workspace */}
        <div className="lg:col-span-3 space-y-8">
          {/* Your Documents */}
          <section>
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 font-sans">Your Documents</h2>
            {isLoading && <div className="text-center py-10 text-slate-500 text-sm font-sans">Loading…</div>}
            {isError   && <div className="text-center py-10 text-red-400 text-sm font-sans">Failed to load documents.</div>}
            {!isLoading && !isError && (
              <DocumentList
                documents={docs}
                liveStatuses={liveStatuses}
                onDeleted={handleDeleted}
                onRechunkStarted={handleRechunkStarted}
              />
            )}
          </section>

          {/* Deep Dive Workspace */}
          <DeepDiveWorkspace />
        </div>

      </div>
    </div>
  )
}
