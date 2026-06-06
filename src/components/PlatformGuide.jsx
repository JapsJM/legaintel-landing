import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'

// Free Lottie animations from LottieFiles CDN (Lottie Simple License — free for commercial use)
const STEPS = [
  {
    step: '01',
    title: 'Upload Your Matter',
    desc: 'Upload case documents, scanned images, or PDFs. Our AI extracts and indexes all content automatically for RAG-powered search.',
    lottie: 'https://assets9.lottiefiles.com/packages/lf20_iorpbol0.json',
    color: '#c5a059',
    path: '/documents',
    cta: 'Upload Now'
  },
  {
    step: '02',
    title: 'AI Legal Research',
    desc: 'Ask questions grounded in your uploaded documents and Supreme Court precedents. Get cited, structured answers in seconds.',
    lottie: 'https://assets4.lottiefiles.com/packages/lf20_l3sfdi9x.json',
    color: '#7c6fcd',
    path: '/chat',
    cta: 'Start Chat'
  },
  {
    step: '03',
    title: 'Counsel\'s Digest',
    desc: 'Get a daily AI-compiled briefing of your active matters — priorities, alerts, and contradictions surfaced automatically.',
    lottie: 'https://assets3.lottiefiles.com/packages/lf20_qm8eqzse.json',
    color: '#4ade80',
    path: '/briefing',
    cta: 'View Digest'
  },
  {
    step: '04',
    title: 'AI Case Brief',
    desc: 'Generate a 10-point structured brief for any Supreme Court judgment — ratio, provisions, how to use it, and opposing arguments.',
    lottie: 'https://assets1.lottiefiles.com/packages/lf20_w51pcehl.json',
    color: '#38bdf8',
    path: '/briefs',
    cta: 'Generate Brief'
  },
]

const FEATURES = [
  { icon: '⚖️', title: 'Public Precedents',    desc: 'Browse SC judgements with AI-generated 10-point briefs, indexed daily.',         path: '/precedents'  },
  { icon: '🖼️', title: 'Image Analysis',       desc: 'Upload scanned legal documents — Gemini Vision extracts stamps, text, tables.',   path: '/media'       },
  { icon: '📋', title: 'Orders Library',        desc: 'All SC orders and final orders ingested daily — searchable in Legal Chat.',       path: '/orders'      },
  { icon: '🔔', title: 'Telegram Alerts',       desc: 'Get instant Telegram notifications when new SC judgements are indexed.',         path: '/settings'    },
  { icon: '🧬', title: 'Knowledge Graph',       desc: 'Neo4j-powered entity graph links cases, statutes, judges and citations.',        path: '/chat'        },
  { icon: '📊', title: 'Matter Intelligence',   desc: 'Track all your active matters with status, alerts and AI-generated priorities.', path: '/documents'   },
]

// Load Lottie player web component once
let lottieLoaded = false
function ensureLottiePlayer() {
  if (lottieLoaded || typeof document === 'undefined') return
  const script = document.createElement('script')
  script.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js'
  script.async = true
  document.head.appendChild(script)
  lottieLoaded = true
}

export default function PlatformGuide({ navigate }) {
  const [collapsed, setCollapsed] = useState(false)
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem('platform_guide_dismissed') === 'true' } catch { return false }
  })

  useEffect(() => { ensureLottiePlayer() }, [])

  const handleDismiss = () => {
    try { localStorage.setItem('platform_guide_dismissed', 'true') } catch {}
    setDismissed(true)
  }

  if (dismissed) return null

  return (
    <div className="bg-[#0a0c10] border border-white/5 rounded-sm overflow-hidden font-sans">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c5a059]">
            Platform Guide
          </h2>
          <span className="text-[10px] text-slate-600 font-sans">— How Aetherius works</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCollapsed(c => !c)}
            className="p-1.5 rounded hover:bg-white/5 text-slate-500 hover:text-slate-300 transition">
            {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
          <button onClick={handleDismiss}
            className="p-1.5 rounded hover:bg-white/5 text-slate-600 hover:text-slate-400 transition"
            title="Dismiss guide">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-6 space-y-8">

          {/* Step flow */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-5">
              How It Works — 4 Steps
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {STEPS.map((s, idx) => (
                <div key={s.step}
                  className="relative bg-[#050505] border border-white/5 rounded-sm p-4 hover:border-white/10 transition group">

                  {/* Connector arrow — desktop only */}
                  {idx < STEPS.length - 1 && (
                    <div className="hidden lg:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10
                      w-5 h-5 bg-[#0a0c10] border border-white/5 rounded-full items-center justify-center">
                      <span className="text-[8px] text-slate-600">›</span>
                    </div>
                  )}

                  {/* Step number */}
                  <p className="text-[10px] font-bold tracking-widest mb-3" style={{ color: s.color }}>
                    STEP {s.step}
                  </p>

                  {/* Lottie animation */}
                  <div className="flex justify-center mb-3">
                    <lottie-player
                      src={s.lottie}
                      background="transparent"
                      speed="1"
                      style={{ width: '80px', height: '80px' }}
                      loop
                      autoplay
                    />
                  </div>

                  {/* Content */}
                  <p className="text-[12px] font-semibold text-slate-200 mb-2">{s.title}</p>
                  <p className="text-[12px] text-slate-500 leading-relaxed mb-4">{s.desc}</p>

                  {/* CTA */}
                  <button
                    onClick={() => navigate(s.path)}
                    className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm border transition"
                    style={{ borderColor: `${s.color}30`, color: s.color }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = `${s.color}10`}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    {s.cta} →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/5" />

          {/* Feature cards */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-5">
              All Features
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {FEATURES.map(f => (
                <button key={f.title}
                  onClick={() => navigate(f.path)}
                  className="text-left p-3 bg-[#050505] border border-white/5 rounded-sm hover:border-[#c5a059]/20 transition group">
                  <span className="text-lg mb-2 block">{f.icon}</span>
                  <p className="text-[12px] font-semibold text-slate-300 mb-1 group-hover:text-[#c5a059] transition">{f.title}</p>
                  <p className="text-[12px] text-slate-600 leading-relaxed">{f.desc}</p>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
