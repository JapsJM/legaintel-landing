import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { listConversations } from '../services/chat'
import { getBriefing } from '../services/briefing'
import { getJurisdictionPulse, getActiveMatters } from '../services/dashboard'
import OnboardingWizard, { hasSeenWizard } from '../components/OnboardingWizard'
import {
  FileText, MessageSquare, Zap, PlusCircle,
  AlertTriangle, CheckCircle, Clock, ArrowUpRight, ListChecks
} from 'lucide-react'

// ─── helpers ────────────────────────────────────────────────────────────────

const fmt = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

const StatusDot = ({ status }) => {
  const map = {
    ready:      'bg-emerald-400',
    processing: 'bg-yellow-400 animate-pulse',
    error:      'bg-red-400',
  }
  return <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${map[status] || 'bg-slate-500'}`} />
}

// ─── sub-components ──────────────────────────────────────────────────────────

const QuickAction = ({ icon: Icon, label, desc, onClick, accent }) => (
  <button onClick={onClick}
    className="flex items-start gap-4 w-full text-left p-5 bg-[#0a0c10] border border-white/5 rounded-sm hover:border-[#c5a059]/25 transition-all group">
    <div className={`p-2 rounded-sm ${accent || 'bg-[#c5a059]/10'} shrink-0`}>
      <Icon className="w-4 h-4 text-[#c5a059]" />
    </div>
    <div>
      <p className="text-xs font-bold text-white uppercase tracking-widest font-sans">{label}</p>
      <p className="text-[10px] text-slate-500 mt-0.5 font-sans leading-relaxed">{desc}</p>
    </div>
    <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#c5a059] ml-auto shrink-0 mt-0.5 transition-colors" />
  </button>
)

const MatterCard = ({ matter, onClick }) => (
  <div onClick={onClick}
    className={`p-4 rounded-sm border cursor-pointer transition-all group
      ${matter.has_alert
        ? 'border-red-900/30 bg-red-950/5 hover:border-red-700/40'
        : 'border-white/5 bg-[#0a0c10] hover:border-[#c5a059]/20'}`}>
    <div className="flex items-start gap-2.5 mb-2">
      <StatusDot status={matter.status} />
      <p className="text-xs font-bold text-white truncate leading-tight flex-1 font-sans">
        {matter.filename.replace(/\.[^.]+$/, '')}
      </p>
      {matter.has_alert && (
        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
      )}
    </div>
    <div className="flex items-center justify-between">
      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border font-sans
        ${matter.status === 'ready'
          ? 'text-emerald-400 border-emerald-900/30 bg-emerald-950/10'
          : matter.status === 'processing'
          ? 'text-yellow-400 border-yellow-900/30 bg-yellow-950/10'
          : 'text-red-400 border-red-900/30 bg-red-950/10'}`}>
        {matter.status}
      </span>
      <span className="text-[9px] text-slate-600 font-mono">{matter.date}</span>
    </div>
  </div>
)

const PulseBar = ({ label, count, max, total }) => {
  const pct = max > 0 ? Math.max(4, Math.round((count / max) * 100)) : 4
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-slate-400 font-sans w-28 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-[#c5a059] rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] text-slate-500 font-mono w-6 text-right shrink-0">{count}</span>
    </div>
  )
}

// ─── main ────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user }   = useAuth()
  const navigate   = useNavigate()

  const [briefing,     setBriefing]     = useState(null)
  const [pulse,        setPulse]        = useState(null)
  const [matters,      setMatters]      = useState([])
  const [priorities,   setPriorities]   = useState([])
  const [convCount,    setConvCount]    = useState(0)
  const [loading,      setLoading]      = useState(true)
  const [showWizard,   setShowWizard]   = useState(false)

  useEffect(() => {
    Promise.allSettled([
      getBriefing(),
      getJurisdictionPulse(),
      getActiveMatters(),
      listConversations(),
    ]).then(([brRes, pulseRes, mattersRes, convRes]) => {
      if (brRes.status      === 'fulfilled') setBriefing(brRes.value?.briefing || null)
      if (pulseRes.status   === 'fulfilled') setPulse(pulseRes.value || null)
      if (mattersRes.status === 'fulfilled') {
        setMatters(mattersRes.value?.matters || [])
        setPriorities(mattersRes.value?.priorities || [])
      }
      if (convRes.status === 'fulfilled') setConvCount((convRes.value || []).length)
    }).finally(() => {
      setLoading(false)
      // Show wizard on first visit if no documents
      if (!hasSeenWizard()) setShowWizard(true)
    })
  }, [])

  const readyCount    = matters.filter(m => m.status === 'ready').length
  const alertCount    = matters.filter(m => m.has_alert).length
  const briefingStale = !briefing || briefing.summary === 'No documents available to generate a briefing.'
  const noMatters     = matters.length === 0

  // Smart quick actions — contextual
  const quickActions = []
  if (noMatters) {
    quickActions.push({ icon: PlusCircle,    label: 'Upload First Matter',    desc: 'Add case documents to begin AI-powered analysis.', path: '/documents' })
  } else if (briefingStale) {
    quickActions.push({ icon: Zap,           label: "Compile Today's Digest", desc: "Your Counsel's Digest hasn't been compiled yet today.", path: '/briefing' })
  }
  if (alertCount > 0) {
    quickActions.push({ icon: AlertTriangle, label: `${alertCount} Contradiction Alert${alertCount > 1 ? 's' : ''}`, desc: 'Review flagged contradictions in your active matters.', path: '/briefing', accent: 'bg-red-500/10' })
  }
  if (!noMatters && !briefingStale) {
    quickActions.push({ icon: MessageSquare, label: 'New Research Query',     desc: 'Ask a legal question grounded in your case documents.', path: '/chat' })
  }
  quickActions.push({ icon: FileText,          label: 'Browse Precedents',      desc: 'Search Supreme Court and High Court judgments.', path: '/precedents' })
  quickActions.push({ icon: FileText,       label: 'Case Brief Generator',   desc: 'Generate a structured brief from any uploaded judgment.', path: '/case-briefs' })

  return (
    <div className="space-y-8 pb-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <p className="text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.2em] font-sans mb-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 className="text-2xl font-semibold text-slate-100 font-sans">
            {user?.username || 'Counselor'}'s Chamber
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-sans">
            {readyCount > 0
              ? `${readyCount} matter${readyCount !== 1 ? 's' : ''} ready · ${convCount} research quer${convCount !== 1 ? 'ies' : 'y'}`
              : 'Your legal intelligence workspace is ready.'}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/documents')}
            className="flex items-center gap-2 bg-[#c5a059] hover:bg-[#b38f48] text-black px-5 py-2.5 rounded-sm text-xs font-bold transition uppercase tracking-widest font-sans">
            <PlusCircle className="w-3.5 h-3.5" /> Upload Matter
          </button>
          <button onClick={() => navigate('/chat')}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 px-5 py-2.5 rounded-sm text-xs font-bold transition uppercase tracking-widest font-sans">
            <MessageSquare className="w-3.5 h-3.5" /> Research
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT — Active Matters + Priorities */}
        <div className="lg:col-span-2 space-y-6">

          {/* Active Matter Cards */}
          <div className="bg-[#0a0c10] border border-white/5 rounded-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c5a059] font-sans flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> Active Matters
              </h3>
              <button onClick={() => navigate('/documents')}
                className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-200 flex items-center gap-1.5 font-sans transition">
                Manage <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="p-5">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="p-4 rounded-sm border border-white/5 animate-pulse space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10 shrink-0" />
                        <div className="h-2.5 bg-white/10 rounded w-3/4" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="h-4 bg-white/10 rounded-full w-14" />
                        <div className="h-2 bg-white/5 rounded w-10" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : matters.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {matters.map(m => (
                    <MatterCard key={m.id} matter={m} onClick={() => navigate('/documents')} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <FileText className="w-8 h-8 text-slate-700 mb-3" />
                  <p className="text-slate-400 text-sm font-sans font-semibold">No matters uploaded</p>
                  <p className="text-slate-600 text-xs font-sans mt-1">Upload case documents to begin analysis.</p>
                  <button onClick={() => navigate('/documents')}
                    className="mt-4 text-xs px-4 py-2 bg-[#c5a059]/10 border border-[#c5a059]/20 text-[#c5a059] rounded-sm hover:bg-[#c5a059]/20 transition font-sans">
                    Upload Now →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Today's Priorities from Counsel's Digest */}
          {priorities.length > 0 && (
            <div className="bg-[#0a0c10] border border-white/5 rounded-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c5a059] font-sans flex items-center gap-2">
                  <ListChecks className="w-3.5 h-3.5" /> Today's Priorities
                </h3>
                <button onClick={() => navigate('/briefing')}
                  className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-200 flex items-center gap-1.5 font-sans transition">
                  Full Digest <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                {priorities.map((p, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className={`text-[9px] font-black px-2 py-1 rounded-sm border shrink-0 font-sans
                      ${p.urgency === 'HIGH'   ? 'text-red-400 border-red-900/30 bg-red-950/10'
                      : p.urgency === 'MEDIUM' ? 'text-yellow-400 border-yellow-900/30 bg-yellow-950/10'
                      :                          'text-emerald-400 border-emerald-900/30 bg-emerald-950/10'}`}>
                      #{p.rank}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-wide font-sans">{p.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-sans">{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Counsel's Digest preview — if no priorities yet */}
          {priorities.length === 0 && (
            <div className="bg-[#0a0c10] border border-white/5 rounded-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c5a059] font-sans flex items-center gap-2"> Counsel's Digest
                </h3>
                <button onClick={() => navigate('/briefing')}
                  className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-200 flex items-center gap-1.5 font-sans transition">
                  Open <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-3 bg-white/10 rounded w-full" />
                    <div className="h-3 bg-white/10 rounded w-5/6" />
                    <div className="h-3 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/10 rounded w-2/3" />
                    <div className="flex gap-2 pt-2">
                      <div className="h-5 bg-white/5 rounded w-20" />
                      <div className="h-5 bg-white/5 rounded w-24" />
                    </div>
                  </div>
                ) : briefing?.summary && !briefingStale ? (
                  <div className="space-y-4">
                    <p className="text-slate-200 text-sm leading-relaxed font-sans line-clamp-4">{briefing.summary}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold px-2.5 py-1 bg-white/5 border border-white/5 rounded text-slate-400 uppercase tracking-wider font-sans">
                        {briefing.doc_count} doc{briefing.doc_count !== 1 ? 's' : ''} analysed
                      </span>
                      <span className={`text-[9px] font-bold px-2.5 py-1 rounded border uppercase tracking-wider font-sans
                        ${briefing.confidence === 'HIGH'   ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : briefing.confidence === 'MEDIUM' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                        :                                    'bg-slate-500/10 border-slate-500/20 text-slate-400'}`}>
                        {briefing.confidence} confidence
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Zap className="w-7 h-7 text-slate-700 shrink-0" />
                    <div>
                      <p className="text-slate-300 text-sm font-semibold font-sans">No digest compiled yet</p>
                      <p className="text-slate-500 text-xs font-sans mt-0.5">
                        {matters.length === 0 ? 'Upload documents first.' : 'Click Compile Now in Counsel\'s Digest.'}
                      </p>
                    </div>
                    <button onClick={() => navigate('/briefing')}
                      className="ml-auto text-xs px-4 py-2 bg-[#c5a059]/10 border border-[#c5a059]/20 text-[#c5a059] rounded-sm hover:bg-[#c5a059]/20 transition font-sans shrink-0">
                      Compile →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Jurisdiction Pulse + Quick Actions */}
        <div className="space-y-6">

          {/* Jurisdiction Pulse */}
          <div className="bg-[#0a0c10] border border-white/5 rounded-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c5a059] font-sans flex items-center gap-2"> Jurisdiction Pulse
              </h3>
              <p className="text-[9px] text-slate-600 font-sans mt-0.5 uppercase tracking-widest">
                Judgments ingested · last 24 hrs
              </p>
            </div>
            <div className="p-5 space-y-3.5">
              {loading ? (
                <div className="space-y-3.5">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="h-2 bg-white/10 rounded w-28 shrink-0" />
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full" />
                      <div className="h-2 bg-white/10 rounded w-4" />
                    </div>
                  ))}
                </div>
              ) : pulse?.pulse?.length > 0 ? (
                <>
                  {pulse.pulse.map(p => (
                    <PulseBar key={p.court_id} label={p.label} count={p.count_24h} max={pulse.max_24h} />
                  ))}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[9px] text-slate-600 font-sans uppercase tracking-widest">Total today</span>
                    <span className="text-[10px] font-bold text-[#c5a059] font-mono">{pulse.total_24h}</span>
                  </div>
                </>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-[10px] text-slate-600 font-sans uppercase tracking-widest">No judgments in last 24hrs</p>
                  <p className="text-[9px] text-slate-700 font-sans mt-1">Scraper may be idle or courts not in session.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 font-sans px-1">Quick Actions</p>
            {quickActions.slice(0, 4).map((a, i) => (
              <QuickAction key={i} {...a} onClick={() => navigate(a.path)} />
            ))}
          </div>

        </div>
      </div>
      {showWizard && <OnboardingWizard onDismiss={() => setShowWizard(false)} />}
    </div>
  )
}
