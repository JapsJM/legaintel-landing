import { useState, useRef, useCallback } from 'react'
import { uploadDocument } from '../services/documents'

const ACCEPTED = '.pdf,.docx,.txt'
const MAX_MB   = 50

export default function UploadZone({ onUploadStart }) {
  const [dragging,   setDragging]   = useState(false)
  const [uploading,  setUploading]  = useState(false)
  const [uploadPct,  setUploadPct]  = useState(0)
  const [error,      setError]      = useState(null)
  const inputRef = useRef()

  const handleFile = useCallback(async (file) => {
    if (!file) return
    setError(null)

    // Client-side validation
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['pdf', 'docx', 'txt'].includes(ext)) {
      setError(`"${file.name}" is not supported. Use PDF, DOCX, or TXT.`)
      return
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`File exceeds ${MAX_MB} MB limit.`)
      return
    }

    setUploading(true)
    setUploadPct(0)

    try {
      const res = await uploadDocument(file, setUploadPct)
      onUploadStart?.(res.data)       // Notify parent — adds doc to list
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
      setUploadPct(0)
      if (inputRef.current) inputRef.current.value = ''
    }
  }, [onUploadStart])

  // ── Drag events ─────────────────────────────────────────────────────────────
  const onDragOver  = (e) => { e.preventDefault(); setDragging(true)  }
  const onDragLeave = (e) => { e.preventDefault(); setDragging(false) }
  const onDrop      = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div className="w-full">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
          transition-all duration-200 select-none
          ${dragging
            ? 'border-violet-400 bg-violet-500/10 scale-[1.01]'
            : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
          }
          ${uploading ? 'pointer-events-none opacity-70' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {uploading ? (
          <div className="space-y-3">
            <div className="text-2xl">⏫</div>
            <p className="text-sm text-white/70">Uploading… {uploadPct}%</p>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all duration-200"
                style={{ width: `${uploadPct}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-4xl mb-3">
              {dragging ? '📂' : '📁'}
            </div>
            <p className="text-white/80 font-medium">
              {dragging ? 'Drop it here' : 'Drag & drop a file'}
            </p>
            <p className="text-white/40 text-sm">
              or click to browse — PDF, DOCX, TXT up to {MAX_MB} MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-400 flex items-center gap-1.5">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
}
