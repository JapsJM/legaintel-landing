import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBriefing, triggerBriefing, getBriefingSettings, updateBriefingSettings } from '../services/briefing'
import { FileText, HelpCircle, Zap, ShieldAlert, Calendar, Loader2, Scale, AlertTriangle, CheckCircle, MinusCircle, ListChecks, Gavel } from 'lucide-react'

const cardCls = "bg-[#0a0c10] border border-white/5 rounded-sm p-8 shadow-[0_4px_25px_rgba(0,0,0,0.35)]"

const ConfidencePill = ({ confidence }) => {
  const styles = {
    HIGH:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    MEDIUM: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    LOW:    'bg-red-500/10 text-red-400 border-red-500/20',
    NONE:   'bg-slate-500/10 text-slate-400 border-slate-500/20'
  }
  return (
    <span className={`text-xs px-3 py-1 rounded-full border uppercase tracking-widest font-sans font-bold ${styles[confidence] || styles.NONE}`}>
      {confidence} confidence
    </span>
  )
}

const VerdictBadge = ({ verdict }) => {
  const map = {
    SUPPORTS:  { cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: <CheckCircle className="w-3 h-3" />, label: 'Supports Position' },
    THREATENS: { cls: 'bg-red-500/10 text-red-400 border-red-500/20',           icon: <AlertTriangle className="w-3 h-3" />, label: 'Threatens Position' },
    NEUTRAL:   { cls: 'bg-slate-500/10 text-slate-400 border-slate-500/20',     icon: <MinusCircle className="w-3 h-3" />,   label: 'Neutral' },
  }
  const v = map[verdict] || map.NEUTRAL
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full border uppercase tracking-widest font-bold ${v.cls}`}>
      {v.icon}{v.label}
    </span>
  )
}

const UrgencyDot = ({ urgency }) => {
  const map = { HIGH: 'bg-red-400', MEDIUM: 'bg-yellow-400', LOW: 'bg-emerald-400' }
  return <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${map[urgency] || map.LOW}`} />
}

const Briefing = () => {
  const navigate = useNavigate()
  const [briefing, setBriefing]           = useState(null)
  const [settings, setSettings]           = useState({ briefing_enabled: false, briefing_time: '08:00' })
  const [loading, setLoading]             = useState(true)
  const [generating, setGenerating]       = useState(false)
  const [savingSettings, setSaving]       = useState(false)
  const [error, setError]                 = useState(null)
  const [settingsSaved, setSettingsSaved] = useState(false)

  useEffect(() => {
    Promise.all([getBriefing(), getBriefingSettings()])
      .then(([briefingData, settingsData]) => {
        setBriefing(briefingData.briefing)
        setSettings(settingsData)
      })
      .catch(() => setError('Failed to load digest'))
      .finally(() => setLoading(false))
  }, [])

  const handleGenerate = async () => {
    setGenerating(true)
    setError(null)
    try {
      await triggerBriefing()
      let attempts = 0
      const poll = setInterval(async () => {
        attempts++
        try {
          const data = await getBriefing()
          if (data.briefing?.summary && data.briefing.summary !== 'No documents available to generate a briefing.') {
            setBriefing(data.briefing)
            setGenerating(false)
            clearInterval(poll)
          }
        } catch {}
        if (attempts >= 9) { setGenerating(false); clearInterval(poll) }
      }, 10000)
    } catch {
      setError('Failed to trigger digest generation')
      setGenerating(false)
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      await updateBriefingSettings(settings)
      setSettingsSaved(true)
      setTimeout(() => setSettingsSaved(false), 3000)
    } catch {
      setError('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (iso) => {
    if (!iso) return ''
    return new Date(iso).toLocaleString([], {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  const judgmentWatch = briefing?.judgment_watch || []
  const priorities    = briefing?.counsel_priorities || []

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans selection:bg-[#c5a059] selection:text-black">

      <header className="border-b border-white/5 px-6 py-5 flex items-center justify-between gap-4 sticky top-0 bg-[#0a0c10]/95 backdrop-blur z-40">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-1.5 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <div>
            <h1 className="text-base font-bold text-white uppercase tracking-widest font-sans flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="9" width="20" height="3.5" rx="1.75" fill="#c5a059"/>
                <rect x="12" y="12.5" width="7" height="15" rx="1.5" fill="#c5a059" opacity="0.9"/>
                <rect x="21" y="12.5" width="7" height="15" rx="1.5" fill="#c5a059" opacity="0.9"/>
              </svg>
              Counsel's Digest
            </h1>
            <p className="text-xs text-slate-400 font-sans">Personalised Daily Intelligence · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {briefing && (
            <span className="text-xs text-[#c5a059] font-bold uppercase tracking-widest">
              {briefing.doc_count} document{briefing.doc_count !== 1 ? 's' : ''} analysed
            </span>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {error && (
          <div className="p-4 rounded-sm bg-red-950/20 border border-red-900/35 text-red-200 text-sm font-sans flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Settings */}
        <div className={cardCls}>
          <h2 className="text-sm font-bold text-[#c5a059] uppercase tracking-widest mb-6 font-sans">Digest Schedule</h2>
          <div className="flex flex-wrap items-center gap-8">
            <label className="flex items-center gap-4 cursor-pointer select-none">
              <div
                onClick={() => setSettings(s => ({ ...s, briefing_enabled: !s.briefing_enabled }))}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${settings.briefing_enabled ? 'bg-[#c5a059]' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.briefing_enabled ? 'translate-x-7' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm text-slate-100 font-bold tracking-wide font-sans">Enable daily digest</span>
            </label>
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-300 font-sans">Delivery Time (IST):</label>
              <input
                type="time"
                value={settings.briefing_time}
                onChange={(e) => setSettings(s => ({ ...s, briefing_time: e.target.value }))}
                className="bg-[#050505] border border-white/10 rounded-sm px-4 py-2 text-slate-100 text-sm font-bold font-sans focus:outline-none focus:border-[#c5a059] transition-colors"
              />
            </div>
            <button onClick={handleSaveSettings} disabled={savingSettings}
              className="px-6 py-2.5 rounded-sm bg-[#c5a059] hover:bg-[#b38f48] disabled:opacity-50 text-black text-xs font-bold uppercase tracking-widest transition-all">
              {savingSettings ? 'Saving…' : settingsSaved ? '✓ Saved' : 'Save'}
            </button>
          </div>
        </div>

        {/* Generate */}
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center gap-2 text-slate-300 text-sm">
            <Calendar className="w-4 h-4 text-[#c5a059]" />
            <span>{briefing ? `Last compiled: ${formatDate(briefing.generated_at)}` : 'No digest compiled yet'}</span>
          </div>
          <button onClick={handleGenerate} disabled={generating}
            className="flex items-center gap-3 px-6 py-3 rounded-sm bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold uppercase tracking-widest transition disabled:opacity-50">
            {generating ? (
              <><Loader2 className="w-4 h-4 animate-spin text-[#c5a059]" />Compiling Digest…</>
            ) : (
              <><Zap className="w-4 h-4 text-[#c5a059]" />Compile Now</>
            )}
          </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#c5a059]" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading your digest...</p>
          </div>
        )}

        {/* Contradiction Alerts */}
        {!loading && briefing?.critical_alerts?.map((alert, idx) => (
          <div key={idx} className="p-6 border border-red-950/40 bg-red-950/5 text-red-100 rounded-sm flex gap-4">
            <ShieldAlert className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-widest text-red-400">Contradiction Warning</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-bold text-slate-300">{alert.case_name}</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">{alert.message}</p>
            </div>
          </div>
        ))}

        {!loading && briefing && (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <ConfidencePill confidence={briefing.confidence} />
            </div>

            {/* Executive Summary */}
            <div className={cardCls}>
              <h2 className="text-xs font-bold text-white uppercase tracking-widest mb-4 font-sans flex items-center gap-2 pb-2 border-b border-white/5">
                <FileText className="w-4 h-4 text-[#c5a059]" /> Executive Summary
              </h2>
              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">{briefing.summary}</p>
            </div>

            {/* Judgment Watch — NEW */}
            {judgmentWatch.length > 0 && (
              <div className={cardCls}>
                <h2 className="text-xs font-bold text-white uppercase tracking-widest mb-1 font-sans flex items-center gap-2">
                  <Gavel className="w-4 h-4 text-[#c5a059]" /> Judgment Watch
                </h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-5">New Supreme Court judgments cross-referenced against your active matters</p>
                <div className="space-y-5">
                  {judgmentWatch.map((j, idx) => (
                    <div key={idx} className={`p-4 rounded-sm border ${j.verdict === 'THREATENS' ? 'border-red-900/30 bg-red-950/5' : j.verdict === 'SUPPORTS' ? 'border-emerald-900/30 bg-emerald-950/5' : 'border-white/5 bg-white/2'}`}>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <p className="text-xs font-bold text-white truncate max-w-sm">{j.title}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{j.court} · {j.date}</p>
                        </div>
                        <VerdictBadge verdict={j.verdict} />
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{j.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Today's Counsel Priorities — NEW */}
            {priorities.length > 0 && (
              <div className={cardCls}>
                <h2 className="text-xs font-bold text-white uppercase tracking-widest mb-1 font-sans flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-[#c5a059]" /> Today's Priorities
                </h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-5">Ranked action items for counsel to execute today</p>
                <div className="space-y-4">
                  {priorities.map((p, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <UrgencyDot urgency={p.urgency} />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-[10px] font-black text-[#c5a059]">#{p.rank}</span>
                          <span className="text-xs font-bold text-white uppercase tracking-wide">{p.title}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border ${p.urgency === 'HIGH' ? 'text-red-400 border-red-900/40 bg-red-950/10' : p.urgency === 'MEDIUM' ? 'text-yellow-400 border-yellow-900/40 bg-yellow-950/10' : 'text-emerald-400 border-emerald-900/40 bg-emerald-950/10'}`}>
                            {p.urgency}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strategic Risk Questions */}
            {briefing.key_questions && (
              <div className={cardCls}>
                <h2 className="text-xs font-bold text-white uppercase tracking-widest mb-4 font-sans flex items-center gap-2 pb-2 border-b border-white/5">
                  <HelpCircle className="w-4 h-4 text-[#c5a059]" /> Strategic Risk Inquiry
                </h2>
                <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">{briefing.key_questions}</p>
              </div>
            )}

            {/* IRAC Agenda */}
            {briefing.irac_agenda?.length > 0 && (
              <div className={cardCls}>
                <h2 className="text-xs font-bold text-white uppercase tracking-widest mb-4 font-sans flex items-center gap-2 pb-2 border-b border-white/5">
                  <Scale className="w-4 h-4 text-[#c5a059]" /> IRAC Tactical Agenda
                </h2>
                {briefing.irac_agenda.map((item, idx) => (
                  <div key={idx} className="space-y-3">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Issue</p>
                      <p className="text-sm text-slate-200 leading-relaxed">{item.issue}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Governing Rule</p>
                      <p className="text-sm text-slate-200 leading-relaxed">{item.rule}</p>
                    </div>
                    {item.application_steps?.length > 0 && (
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Execution Steps</p>
                        <div className="space-y-1.5">
                          {item.application_steps.map((step, si) => (
                            <div key={si} className="flex items-start gap-3">
                              <span className="text-[#c5a059] text-xs font-black shrink-0">{si + 1}.</span>
                              <p className="text-sm text-slate-300 leading-relaxed">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !briefing && (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-white/5 bg-[#0a0c10]/20 rounded-sm">
            <div className="w-16 h-16 rounded-sm bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-[#c5a059]" />
            </div>
            <p className="text-slate-100 text-lg font-bold font-sans mb-2">No Digest Compiled Yet</p>
            <p className="text-slate-400 text-sm font-sans mb-6 max-w-sm leading-relaxed">
              Upload your case documents, then compile your first Counsel's Digest — a personalised brief combining your matter intelligence with today's new Supreme Court judgments.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default Briefing
