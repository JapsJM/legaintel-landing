import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { listDocuments, getDocumentStatus } from '../services/documents'
import { useDocumentSocket } from '../hooks/useDocumentSocket'
import UploadZone from '../components/UploadZone'
import DocumentList from '../components/DocumentList'

// Map backend phase → frontend status
const phaseToStatus = (doc) => {
  if (doc.status === 'ready') return 'ready'
  if (doc.status === 'failed') return 'failed'
  const phase = doc.phase || ''
  if (phase === 'ACTIVATED') return 'ready'
  if (phase === 'FAILED')    return 'failed'
  if (phase === 'PURGATORY') return 'ready'
  if (['RESERVED','STORED','PARSED','VALIDATED','EMBEDDED'].includes(phase)) return 'processing'
  return doc.status || 'pending'
}

export default function Documents() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [liveStatuses, setLiveStatuses] = useState({})

  const { data, isLoading, isError } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const res = await listDocuments()
      return res.data.documents
    },
  })

  // Poll status for ALL non-ready documents every 4 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const pending = (data || []).filter(d => {
        const st = liveStatuses[d.id]?.status || phaseToStatus(d)
        return st === 'processing' || st === 'pending'
      })
      for (const doc of pending) {
        try {
          const res = await getDocumentStatus(doc.id)
          const newPhase  = res.data.phase
          const newStatus = phaseToStatus({ phase: newPhase })
          const current   = liveStatuses[doc.id]?.status || phaseToStatus(doc)
          if (newStatus !== current) {
            setLiveStatuses(prev => ({
              ...prev,
              [doc.id]: {
                status:   newStatus,
                progress: newStatus === 'ready' ? 100 : prev[doc.id]?.progress || 50,
                pages:    res.data.pages,
                chunks:   res.data.chunks,
              }
            }))
            if (newStatus === 'ready' || newStatus === 'failed') {
              queryClient.invalidateQueries({ queryKey: ['documents'] })
            }
          }
        } catch {}
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [data, liveStatuses, queryClient])

  // Set newly uploaded docs as processing immediately
  useEffect(() => {
    if (!data) return
    data.forEach(doc => {
      if (!liveStatuses[doc.id] && phaseToStatus(doc) === 'processing') {
        setLiveStatuses(prev => ({
          ...prev,
          [doc.id]: { status: 'processing', progress: 10 }
        }))
      }
    })
  }, [data])

  useDocumentSocket(useCallback((update) => {
    setLiveStatuses((prev) => ({
      ...prev,
      [update.doc_id]: { status: update.status, progress: update.progress },
    }))
    if (update.status === 'ready' || update.status === 'failed') {
      setTimeout(() => { queryClient.invalidateQueries({ queryKey: ['documents'] }) }, 1000)
    }
  }, [queryClient]))

  const handleUploadStart = useCallback(() => {
    setTimeout(() => queryClient.invalidateQueries({ queryKey: ['documents'] }), 1500)
  }, [queryClient])

  const handleDeleted = useCallback((docId) => {
    queryClient.setQueryData(['documents'], (old) => old ? old.filter((d) => d.id !== docId) : [])
    setLiveStatuses((prev) => { const next = { ...prev }; delete next[docId]; return next })
  }, [queryClient])

  const handleRechunkStarted = useCallback((docId) => {
    setLiveStatuses((prev) => ({ ...prev, [docId]: { status: 'processing', progress: 10 } }))
  }, [])

  const docs = data || []
  const readyCount      = docs.filter(d => (liveStatuses[d.id]?.status || phaseToStatus(d)) === 'ready').length
  const processingCount = docs.filter(d => {
    const st = liveStatuses[d.id]?.status || phaseToStatus(d)
    return st === 'processing' || st === 'pending'
  }).length

  return (
    <div className="text-white">
      <div className="max-w-3xl mx-auto space-y-8">

        <button onClick={() => navigate('/dashboard')}
          className="text-xs text-slate-500 hover:text-slate-300 transition font-sans">
          ← Back to Dashboard
        </button>

        <div>
          <h1 className="text-xl font-semibold text-slate-100 font-sans">Document Library</h1>
          <p className="text-sm text-slate-500 mt-1 font-sans">Upload, process, and manage your documents for AI-powered search.</p>
        </div>

        {docs.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total',      value: docs.length,     color: 'text-slate-100'   },
              { label: 'Ready',      value: readyCount,      color: 'text-emerald-400' },
              { label: 'Processing', value: processingCount, color: 'text-[#c5a059]'   },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-[#0a0c10] border border-white/5 rounded p-4 text-center">
                <div className={`text-2xl font-bold font-sans ${color}`}>{value}</div>
                <div className="text-xs text-slate-500 mt-1 font-sans">{label}</div>
              </div>
            ))}
          </div>
        )}

        <section>
          <h2 className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3 font-sans">Upload Document</h2>
          <UploadZone onUploadStart={handleUploadStart} />
        </section>

        <section>
          <h2 className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3 font-sans">Your Documents</h2>
          {isLoading && <div className="text-center py-10 text-slate-500 text-sm font-sans">Loading…</div>}
          {isError && <div className="text-center py-10 text-red-400 text-sm font-sans">Failed to load documents. Is the backend running?</div>}
          {!isLoading && !isError && (
            <DocumentList
              documents={docs}
              liveStatuses={liveStatuses}
              onDeleted={handleDeleted}
              onRechunkStarted={handleRechunkStarted}
            />
          )}
        </section>

      </div>
    </div>
  )
}
