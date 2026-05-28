/**
 * ProcessingBadge
 * Shows a coloured status pill for a document.
 * Status values: pending | processing | ready | failed
 */
export default function ProcessingBadge({ status, progress }) {
  const config = {
    pending: {
      label: 'Pending',
      cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      dot: 'bg-yellow-400',
    },
    processing: {
      label: progress != null ? `Processing ${progress}%` : 'Processing…',
      cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      dot: 'bg-blue-400 animate-pulse',
    },
    ready: {
      label: 'Ready',
      cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400',
    },
    failed: {
      label: 'Failed',
      cls: 'bg-red-500/20 text-red-400 border-red-500/30',
      dot: 'bg-red-400',
    },
  }

  const { label, cls, dot } = config[status] || config.pending

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}
