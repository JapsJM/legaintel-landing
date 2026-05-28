import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFeedback, getDocumentAnalytics, getQueryAnalytics } from '../services/feedback'

const VoteBadge = ({ vote }) => (
  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium
    ${vote === 'up'
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30'
    }`}>
    {vote === 'up' ? '👍 Helpful' : '👎 Not helpful'}
  </span>
)

const ConfidencePill = ({ confidence }) => {
  const styles = {
    HIGH:   'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    LOW:    'bg-red-500/20 text-red-400 border-red-500/30',
    NONE:   'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${styles[confidence] || styles.NONE}`}>
      {confidence}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════
// SOURCE DISPLAY UTILITY
// ═══════════════════════════════════════════════════════════════

const cleanSourceName = (rawSource) => {
  if (!rawSource || typeof rawSource !== 'string') {
    return 'Unknown Source'
  }

  let cleaned = rawSource.trim()
  cleaned = cleaned.replace(/^<source>|<\/source>$/gi, '')
  cleaned = cleaned.replace(/^ObjectId\(['"]|['"]\)$/gi, '')
  const parts = cleaned.split(/[\\/]/)
  cleaned = parts[parts.length - 1]
  if (/^[a-f0-9]{24}$/i.test(cleaned)) {
    cleaned = `doc_${cleaned.substring(0, 8)}`
  }
  return cleaned || 'Unknown Source'
}

// ═══════════════════════════════════════════════════════════════
// FEEDBACK CARD
// ═══════════════════════════════════════════════════════════════

const FeedbackCard = ({ item, onSourceClick }) => (
  <div className={`p-5 rounded-2xl bg-gray-900 border transition-colors
    ${item.flagged ? 'border-amber-500/30' : 'border-white/10'}`}>

    <div className="flex items-center gap-2 flex-wrap mb-3">
      <VoteBadge vote={item.vote} />
      <ConfidencePill confidence={item.confidence} />
      {item.flagged && (
        <span className="text-xs px-2 py-0.5 rounded-full border
                         bg-amber-500/10 text-amber-400 border-amber-500/30">
          ⚠ Validator flagged
        </span>
      )}
      <span className="text-xs text-gray-600 ml-auto">
        {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
      </span>
    </div>

    {item.question && (
      <div className="mb-2">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Question</p>
        <p className="text-sm text-gray-300">{item.question}</p>
      </div>
    )}

    <div className="mb-2">
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Answer</p>
      <p className="text-sm text-gray-400 line-clamp-4 whitespace-pre-wrap">{item.answer}</p>
    </div>

    {item.flagged && item.flag_reason && (
      <div className="mt-2 flex items-start gap-1.5 text-amber-400">
        <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        </svg>
        <span className="text-xs">{item.flag_reason}</span>
      </div>
    )}

    {item.sources?.length > 0 && (
      <div className="mt-2 flex flex-wrap gap-1">
        {[...new Map(item.sources.map(s => [s.source, s])).values()].map((s, i) => (
          <button
            key={i}
            onClick={() => onSourceClick?.(s.source)}
            className="text-xs bg-white/5 border border-white/10 rounded px-2 py-0.5 text-gray-500
                       hover:bg-white/10 hover:text-gray-300 transition-colors cursor-pointer"
          >
            {cleanSourceName(s.source)}
          </button>
        ))}
      </div>
    )}
  </div>
)

// ═══════════════════════════════════════════════════════════════
// DOCUMENT ANALYTICS TABLE
// ═══════════════════════════════════════════════════════════════

const DocumentAnalyticsTable = ({ documents, onDocumentClick }) => {
  if (!documents || documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-800 border border-white/10
                        flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        </div>
        <p className="text-white font-medium mb-1">No document analytics yet</p>
        <p className="text-gray-500 text-sm">
          Start rating answers to see which documents perform best
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Document
            </th>
            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Uses
            </th>
            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              👎 Down
            </th>
            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              👍 Up
            </th>
            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              ⚠ Flags
            </th>
            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Downvote %
            </th>
            <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Avg Confidence
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {documents.map((doc, i) => {
            const downvoteRate = doc.downvote_rate || 0
            const isProblematic = downvoteRate > 50
            
            return (
              <tr
                key={i}
                onClick={() => onDocumentClick?.(doc.document)}
                className={`hover:bg-white/5 transition-colors cursor-pointer
                  ${isProblematic ? 'bg-red-500/5' : ''}`}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {isProblematic && (
                      <span className="text-red-400 text-xs">⚠</span>
                    )}
                    <span className="text-sm text-gray-300 font-mono">
                      {cleanSourceName(doc.document)}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center text-sm text-gray-400">
                  {doc.total_uses}
                </td>
                <td className="py-3 px-4 text-center text-sm text-red-400">
                  {doc.downvotes}
                </td>
                <td className="py-3 px-4 text-center text-sm text-emerald-400">
                  {doc.upvotes}
                </td>
                <td className="py-3 px-4 text-center text-sm text-amber-400">
                  {doc.flags}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`text-sm font-medium
                    ${downvoteRate > 75 ? 'text-red-400' :
                      downvoteRate > 50 ? 'text-orange-400' :
                      downvoteRate > 25 ? 'text-yellow-400' :
                      'text-gray-400'}`}>
                    {downvoteRate.toFixed(1)}%
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <ConfidencePill confidence={doc.avg_confidence} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// QUERY ANALYTICS CHARTS
// ═══════════════════════════════════════════════════════════════

const QueryAnalytics = ({ data }) => {
  if (!data || data.total_queries === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-800 border border-white/10
                        flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        </div>
        <p className="text-white font-medium mb-1">No query data yet</p>
        <p className="text-gray-500 text-sm">
          Start asking questions to see analytics
        </p>
      </div>
    )
  }

  const { by_type, overall_confidence, timeline, total_queries } = data

  // Query type colors
  const typeColors = {
    FACTUAL: 'bg-blue-500',
    COMPARATIVE: 'bg-purple-500',
    RELATIONAL: 'bg-green-500',
    AMBIGUOUS: 'bg-yellow-500',
    OUT_OF_SCOPE: 'bg-red-500'
  }

  // Confidence colors
  const confidenceColors = {
    HIGH: 'bg-emerald-500',
    MEDIUM: 'bg-yellow-500',
    LOW: 'bg-orange-500',
    NONE: 'bg-gray-500'
  }

  const maxTimelineCount = Math.max(...(timeline.map(t => t.count) || [1]))

  return (
    <div className="space-y-8">
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gray-900 border border-white/10">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Queries</p>
          <p className="text-3xl font-bold text-white">{total_queries}</p>
          <p className="text-xs text-gray-600 mt-1">Last {data.lookback_days} days</p>
        </div>

        <div className="p-5 rounded-2xl bg-gray-900 border border-white/10">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Avg Response Time</p>
          <p className="text-3xl font-bold text-white">
            {Math.round(by_type.reduce((sum, t) => sum + t.avg_response_time * t.count, 0) / total_queries)}
            <span className="text-lg text-gray-500 ml-1">ms</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gray-900 border border-white/10">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">High Confidence</p>
          <p className="text-3xl font-bold text-emerald-400">
            {((overall_confidence.HIGH / total_queries) * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Query type distribution */}
      <div className="p-6 rounded-2xl bg-gray-900 border border-white/10">
        <h3 className="text-white font-semibold mb-4">Query Type Distribution</h3>
        <div className="space-y-3">
          {by_type.map(item => {
            const percentage = (item.count / total_queries) * 100
            return (
              <div key={item.query_type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-300">{item.query_type || 'Unknown'}</span>
                  <span className="text-sm text-gray-500">{item.count} ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${typeColors[item.query_type] || 'bg-gray-600'}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Response times by type */}
      <div className="p-6 rounded-2xl bg-gray-900 border border-white/10">
        <h3 className="text-white font-semibold mb-4">Avg Response Time by Type</h3>
        <div className="space-y-3">
          {by_type.map(item => {
            const maxTime = Math.max(...by_type.map(t => t.avg_response_time))
            const percentage = (item.avg_response_time / maxTime) * 100
            return (
              <div key={item.query_type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-300">{item.query_type || 'Unknown'}</span>
                  <span className="text-sm text-gray-500">{item.avg_response_time} ms</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Confidence distribution */}
      <div className="p-6 rounded-2xl bg-gray-900 border border-white/10">
        <h3 className="text-white font-semibold mb-4">Overall Confidence Distribution</h3>
        <div className="space-y-3">
          {Object.entries(overall_confidence).map(([level, count]) => {
            const percentage = (count / total_queries) * 100
            return (
              <div key={level}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-300">{level}</span>
                  <span className="text-sm text-gray-500">{count} ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${confidenceColors[level]}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Query volume timeline */}
      {timeline.length > 0 && (
        <div className="p-6 rounded-2xl bg-gray-900 border border-white/10">
          <h3 className="text-white font-semibold mb-4">Query Volume (Last 7 Days)</h3>
          <div className="flex items-end gap-2 h-32">
            {timeline.map(day => {
              const height = (day.count / maxTimelineCount) * 100
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col justify-end h-24">
                    <div
                      className="w-full bg-indigo-500 rounded-t"
                      style={{ height: `${height}%` }}
                      title={`${day.count} queries`}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{new Date(day.date).getDate()}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const Analytics = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab]     = useState('feedback') // 'feedback' | 'documents' | 'queries'
  const [items, setItems]             = useState([])
  const [documents, setDocuments]     = useState([])
  const [queryData, setQueryData]     = useState(null)
  const [filter, setFilter]           = useState('all')
  const [sourceFilter, setSourceFilter] = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)

  // Load feedback
  useEffect(() => {
    if (activeTab !== 'feedback') return
    
    const vote = filter === 'up' ? 'up' : filter === 'down' ? 'down' : null
    setLoading(true)
    getFeedback(vote)
      .then(data => {
        let filtered = filter === 'flagged'
          ? data.filter(d => d.flagged)
          : data
        
        if (sourceFilter) {
          filtered = filtered.filter(item => 
            item.sources?.some(s => s.source === sourceFilter)
          )
        }
        
        setItems(filtered)
      })
      .catch(() => setError('Failed to load feedback'))
      .finally(() => setLoading(false))
  }, [filter, activeTab, sourceFilter])

  // Load document analytics
  useEffect(() => {
    if (activeTab !== 'documents') return
    
    setLoading(true)
    getDocumentAnalytics()
      .then(data => setDocuments(data))
      .catch(() => setError('Failed to load document analytics'))
      .finally(() => setLoading(false))
  }, [activeTab])

  // Load query analytics
  useEffect(() => {
    if (activeTab !== 'queries') return
    
    setLoading(true)
    getQueryAnalytics(30)
      .then(data => setQueryData(data))
      .catch(() => setError('Failed to load query analytics'))
      .finally(() => setLoading(false))
  }, [activeTab])

  const handleSourceClick = (source) => {
    setSourceFilter(source)
    setActiveTab('feedback')
    setFilter('all')
  }

  const handleDocumentClick = (document) => {
    setSourceFilter(document)
    setActiveTab('feedback')
    setFilter('all')
  }

  const clearSourceFilter = () => {
    setSourceFilter(null)
  }

  const FILTERS = [
    { key: 'all',     label: 'All' },
    { key: 'down',    label: '👎 Downvoted' },
    { key: 'flagged', label: '⚠ Validator Flagged' },
    { key: 'up',      label: '👍 Upvoted' }
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h1 className="text-white font-semibold">Analytics</h1>
          <p className="text-xs text-gray-500">
            {activeTab === 'feedback' 
              ? 'Answer quality signals from your sessions'
              : activeTab === 'documents'
              ? 'Per-document performance metrics'
              : 'Query patterns and performance trends'}
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex gap-2 mb-6 border-b border-white/10">
          <button
            onClick={() => { setActiveTab('feedback'); setSourceFilter(null) }}
            className={`px-4 py-2 text-sm font-medium transition-colors relative
              ${activeTab === 'feedback'
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-300'
              }`}
          >
            Feedback
            {activeTab === 'feedback' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 text-sm font-medium transition-colors relative
              ${activeTab === 'documents'
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-300'
              }`}
          >
            Document Quality
            {activeTab === 'documents' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('queries')}
            className={`px-4 py-2 text-sm font-medium transition-colors relative
              ${activeTab === 'queries'
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-300'
              }`}
          >
            Query Analytics
            {activeTab === 'queries' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
            )}
          </button>
        </div>

        {/* FEEDBACK TAB */}
        {activeTab === 'feedback' && (
          <>
            {sourceFilter && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-gray-400">Filtering by source:</span>
                <span className="text-sm bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-lg border border-indigo-500/30">
                  {cleanSourceName(sourceFilter)}
                </span>
                <button
                  onClick={clearSourceFilter}
                  className="text-xs text-gray-500 hover:text-gray-300 underline"
                >
                  Clear filter
                </button>
              </div>
            )}

            <div className="flex gap-2 flex-wrap mb-6">
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors
                    ${filter === f.key
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white border border-white/10'
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {loading && (
              <div className="flex items-center justify-center py-20">
                <svg className="w-6 h-6 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              </div>
            )}

            {!loading && items.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-800 border border-white/10
                                flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <p className="text-white font-medium mb-1">No feedback yet</p>
                <p className="text-gray-500 text-sm">
                  Use thumbs up/down in chat to rate answers
                </p>
              </div>
            )}

            {!loading && items.length > 0 && (
              <div className="space-y-4">
                {items.map((item, i) => (
                  <FeedbackCard 
                    key={item.id || i} 
                    item={item}
                    onSourceClick={handleSourceClick}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <>
            {loading && (
              <div className="flex items-center justify-center py-20">
                <svg className="w-6 h-6 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              </div>
            )}

            {!loading && (
              <DocumentAnalyticsTable 
                documents={documents}
                onDocumentClick={handleDocumentClick}
              />
            )}
          </>
        )}

        {/* QUERIES TAB */}
        {activeTab === 'queries' && (
          <>
            {loading && (
              <div className="flex items-center justify-center py-20">
                <svg className="w-6 h-6 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              </div>
            )}

            {!loading && <QueryAnalytics data={queryData} />}
          </>
        )}
      </main>
    </div>
  )
}

export default Analytics
