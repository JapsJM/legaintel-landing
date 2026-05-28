import { useState } from 'react'
import { deleteDocument, rechunkDocument } from '../services/documents'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'

// Map backend phase → frontend status (same as Documents.jsx)
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

export default function DocumentList({ documents, liveStatuses, onDeleted, onRechunkStarted }) {
  const [deleting, setDeleting]     = useState(null)
  const [rechunking, setRechunking] = useState(null)

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
        <p className="text-white/40 text-sm">No documents uploaded yet.</p>
      </div>
    )
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return
    setDeleting(id)
    try {
      await deleteDocument(id)
      onDeleted(id)
    } catch (err) {
      alert('Failed to delete document')
    } finally {
      setDeleting(null)
    }
  }

  const handleRechunk = async (id) => {
    setRechunking(id)
    try {
      await rechunkDocument(id)
      onRechunkStarted(id)
    } catch (err) {
      alert('Failed to start reprocessing')
    } finally {
      setRechunking(null)
    }
  }

  const handleDownload = async (doc) => {
    try {
      const token    = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/documents/${doc.id}/file`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!response.ok) throw new Error('Download failed')
      const blob = await response.blob()
      const url  = window.URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = doc.filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Failed to download document')
    }
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => {
        const live     = liveStatuses[doc.id] || {}
        const status   = live.status   || phaseToStatus(doc)
        const progress = live.progress || 0

        // Use live values if available, fall back to API fields (both old and new names)
        const pages  = live.pages  ?? doc.pages  ?? doc.page_count  ?? 0
        const chunks = live.chunks ?? doc.chunks ?? doc.chunk_count ?? 0

        const isProcessing = status === 'processing' || status === 'pending'
        const isReady      = status === 'ready'
        const isFailed     = status === 'failed'

        return (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.07] transition-colors"
          >
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-white truncate" title={doc.filename}>
                  {doc.filename}
                </h3>
                <div className="flex items-center gap-2 text-xs text-white/40 mt-1">
                  <span>{((doc.file_size || 0) / 1024 / 1024).toFixed(1)} MB</span>
                  <span>•</span>
                  <span>{pages} pages</span>
                  <span>•</span>
                  <span>{chunks} chunks</span>
                  <span>•</span>
                  <span>{doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Invalid Date'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 ml-4">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {isProcessing && (
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-medium bg-blue-400/10 px-2.5 py-1 rounded-full">
                    <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {progress > 0 ? `${progress}%` : 'Processing…'}
                  </div>
                )}
                {isReady && (
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2.5 py-1 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Ready
                  </div>
                )}
                {isFailed && (
                  <div className="flex items-center gap-1.5 text-red-400 text-xs font-medium bg-red-400/10 px-2.5 py-1 rounded-full" title={doc.error}>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    Failed
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 border-l border-white/10 pl-4">
                {isReady && (
                  <button
                    onClick={() => handleDownload(doc)}
                    className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    title="Download Document"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </button>
                )}

                <button
                  onClick={() => handleRechunk(doc.id)}
                  disabled={isProcessing || rechunking === doc.id}
                  className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all disabled:opacity-50"
                  title="Reprocess Document"
                >
                  <svg className={`w-4 h-4 ${rechunking === doc.id ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </button>

                <button
                  onClick={() => handleDelete(doc.id)}
                  disabled={deleting === doc.id}
                  className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all disabled:opacity-50"
                  title="Delete Document"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
