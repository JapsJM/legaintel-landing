import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBriefing, triggerBriefing, getBriefingSettings, updateBriefingSettings } from '../services/briefing'
import { FileText, HelpCircle, Zap, ShieldAlert, Calendar, Loader2 } from 'lucide-react'

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
      .catch(() => setError('Failed to load briefing'))
      .finally(() => setLoading(false))
  }, [])

  const handleGenerate = async () => {
    setGenerating(true)
    setError(null)
    try {
      await triggerBriefing()
      // Poll every 10s up to 90s for briefing to complete
      let attempts = 0
      const poll = setInterval(async () => {
        attempts++
        try {
          const data = await getBriefing()
          if (data.briefing?.summary && data.briefing.summary !== 'No documents available to generate a briefing.') {
            setBriefing(data.briefing)
            setGenerating(false)
            clearInterval(poll)
            return
          }
        } catch {}
        if (attempts >= 9) { setGenerating(false); clearInterval(poll) }
      }, 10000)
    } catch {
      setError('Failed to trigger briefing generation')
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

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans selection:bg-[#c5a059] selection:text-black">
      
      {/* Navigation Header */}
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
              </svg> Morning Briefing
            </h1>
            <p className="text-xs text-slate-400 font-sans">Sovereign Daily Litigation Analytics Panel</p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-4">
          {briefing && (
            <span className="text-xs text-[#c5a059] font-bold uppercase tracking-widest">
              {briefing.doc_count} document{briefing.doc_count !== 1 ? 's' : ''} analysed
            </span>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {error && (
          <div className="p-4 rounded-sm bg-red-950/20 border border-red-900/35 text-red-200 text-sm font-sans flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Settings Card */}
        <div className={cardCls}>
          <h2 className="text-sm font-bold text-[#c5a059] uppercase tracking-widest mb-6 font-sans">
            Briefing Preferences & Schedule
          </h2>
          <div className="flex flex-wrap items-center gap-8">
            <label className="flex items-center gap-4 cursor-pointer select-none">
              <div
                onClick={() => setSettings(s => ({ ...s, briefing_enabled: !s.briefing_enabled }))}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${settings.briefing_enabled ? 'bg-[#c5a059]' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.briefing_enabled ? 'translate-x-7' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm md:text-base text-slate-100 font-bold tracking-wide font-sans">Enable daily briefing run</span>
            </label>

            <div className="flex items-center gap-3">
              <label className="text-sm md:text-base text-slate-300 font-sans">Execution Time (IST):</label>
              <input
                type="time"
                value={settings.briefing_time}
                onChange={(e) => setSettings(s => ({ ...s, briefing_time: e.target.value }))}
                className="bg-[#050505] border border-white/10 rounded-sm px-4 py-2 text-slate-100 text-sm md:text-base font-bold font-sans focus:outline-none focus:border-[#c5a059] transition-colors"
              />
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="px-6 py-2.5 rounded-sm bg-[#c5a059] hover:bg-[#b38f48] disabled:opacity-50 text-black text-xs md:text-sm font-bold uppercase tracking-widest transition-all"
            >
              {savingSettings ? 'Saving…' : settingsSaved ? '✓ Saved' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Generate / Refresh Panel */}
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center gap-2 text-slate-300 text-xs md:text-sm">
            <Calendar className="w-4 h-4 text-[#c5a059]" />
            <span>
              {briefing ? `Last generated: ${formatDate(briefing.generated_at)}` : 'No briefing generated yet'}
            </span>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-3 px-6 py-3 rounded-sm bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs md:text-sm font-bold uppercase tracking-widest transition disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#c5a059]" />
                Generating Summary…
              </>
            ) : (
              <><Zap className="w-4 h-4 text-[#c5a059]" /> Run Analysis Now</>
            )}
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#c5a059]" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading dynamic summary...</p>
          </div>
        )}

        {/* Dynamic Verification & Contradiction Alerts (Safe Conditional Render) */}
        {!loading && briefing && briefing.critical_alerts && briefing.critical_alerts.map((alert, idx) => (
          <div key={idx} className="p-6 border border-red-950/40 bg-red-950/5 text-red-100 rounded-sm flex gap-4">
            <ShieldAlert className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-widest text-red-400">Contradiction warning</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-bold text-slate-300">{alert.case_name}</span>
              </div>
              <p className="text-sm md:text-base text-slate-200 leading-relaxed font-sans">{alert.message}</p>
            </div>
          </div>
        ))}

        {/* Briefing Content Panel */}
        {!loading && briefing && (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <ConfidencePill confidence={briefing.confidence} />
            </div>

            {/* Executive Summary Card */}
            <div className={cardCls}>
              <h2 className="text-xs md:text-sm font-bold text-white uppercase tracking-widest mb-4 font-sans flex items-center gap-2 pb-2 border-b border-white/5">
                <FileText className="w-4 h-4 text-[#c5a059]" /> Executive Litigation Summary
              </h2>
              <p className="text-slate-200 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-sans">{briefing.summary}</p>
            </div>

            {/* Key Questions / Risks Card */}
            {briefing.key_questions && (
              <div className={cardCls}>
                <h2 className="text-xs md:text-sm font-bold text-white uppercase tracking-widest mb-4 font-sans flex items-center gap-2 pb-2 border-b border-white/5">
                  <HelpCircle className="w-4 h-4 text-[#c5a059]" /> Strategic Risk & Issues Inquiry
                </h2>
                <p className="text-slate-200 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-sans">{briefing.key_questions}</p>
              </div>
            )}
          </div>
        )}

        {/* Empty State Panel */}
        {!loading && !briefing && (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-white/5 bg-[#0a0c10]/20 rounded-sm">
            <div className="w-16 h-16 rounded-sm bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-[#c5a059]" />
            </div>
            <p className="text-slate-100 text-base md:text-lg font-bold font-sans mb-2">No Litigation Briefing Compiled</p>
            <p className="text-slate-400 text-xs md:text-sm font-sans mb-6 max-w-sm leading-relaxed">
              Enable the daily automation scheduler or trigger an immediate analysis run above to compile your records.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default Briefing