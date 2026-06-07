import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'

// Free Lottie animations from LottieFiles CDN (Lottie Simple License)
const STEPS = [
  {
    step: '01',
    title: 'Upload Case Documents',
    what: 'Your private AI-powered document workspace.',
    how: 'Upload any PDF, scanned image, or text file. AI automatically extracts, chunks, and embeds content into your private ChromaDB index. Every document becomes instantly searchable in Legal Chat.',
    lottie: 'https://assets9.lottiefiles.com/packages/lf20_iorpbol0.json',
    path: '/documents',
    cta: 'Go to Documents'
  },
  {
    step: '02',
    title: 'Research with Legal Chat',
    what: 'GraphRAG + Neo4j Knowledge Graph powered legal research.',
    how: 'Ask any legal question in plain English. The system searches your uploaded documents and SC precedents simultaneously, returning cited, structured answers with case references. Use jurisdiction filter to restrict to specific courts.',
    lottie: 'https://assets4.lottiefiles.com/packages/lf20_l3sfdi9x.json',
    path: '/chat',
    cta: 'Open Chat'
  },
  {
    step: '03',
    title: "Counsel's Digest",
    what: 'Your daily AI-compiled matter intelligence briefing.',
    how: "Opens automatically with today's brief. Shows active matter priorities, contradiction alerts between your documents and recent SC rulings, and deadlines. Refreshes every morning — no manual input required.",
    lottie: 'https://assets3.lottiefiles.com/packages/lf20_qm8eqzse.json',
    path: '/briefing',
    cta: 'View Digest'
  },
  {
    step: '04',
    title: 'Public SC Judgements',
    what: 'Daily-indexed Supreme Court judgements with AI 10-point Case Briefs.',
    how: 'Browse the public catalog. Click any judgment to instantly view its AI Case Brief — ratio decidendi, legislative provisions, when to use it in court, opposing arguments, and best supporting authorities. Filter by court, category, or date.',
    lottie: 'https://assets1.lottiefiles.com/packages/lf20_w51pcehl.json',
    path: '/precedents',
    cta: 'Browse Judgements'
  },
]

const FEATURES = [
  {
    num: '05',
    icon: '📖',
    title: 'Statutory Bridge',
    what: 'Cross-reference old and new legislation in seconds.',
    how: 'Inside Legal Chat, ask about any IPC section and get its BNS equivalent automatically. Works for IPC → BNS, CrPC → BNSS, and Evidence Act → BSA. Type "Section 302 IPC equivalent in BNS" to try it.',
    lottie: 'https://assets5.lottiefiles.com/packages/lf20_obhph3sh.json',
    path: '/chat'
  },
  {
    num: '06',
    icon: '🖼️',
    title: 'Image Analysis',
    what: 'AI-powered analysis of scanned legal documents.',
    how: 'Upload any scanned court document, affidavit, or exhibit. Gemini Vision extracts all text, detects stamps and seals, identifies handwritten annotations, and recognises table structures. Once analysed, the document is queryable in Legal Chat.',
    lottie: 'https://assets3.lottiefiles.com/packages/lf20_twijbubv.json',
    path: '/media'
  },
  {
    num: '07',
    icon: '📋',
    title: 'Orders Library',
    what: 'All SC orders and final orders — ingested daily.',
    how: 'Browse by order type (Order / Final Order), search by case number or party name. Click any row to preview the full PDF inline without leaving the page. New orders appear within hours of SC publishing them.',
    lottie: 'https://assets9.lottiefiles.com/packages/lf20_qm8eqzse.json',
    path: '/orders'
  },
  {
    num: '08',
    icon: '👤',
    title: 'Profile & Settings',
    what: 'Account management and subscription controls.',
    how: 'View your current subscription tier and resource quotas. Update personal information and change your password. Use the Platform Guide restore button if you dismissed this guide and want it back.',
    lottie: 'https://assets10.lottiefiles.com/packages/lf20_xvrofzfk.json',
    path: '/profile'
  },
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

  const handleNav = (path) => {
    if (path.startsWith('external:')) {
      // Full page navigation — bypasses React Router entirely
      window.location.href = path.replace('external:', '')
    } else {
      navigate(path)
    }
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
                  <p className="text-[10px] font-bold tracking-widest mb-3 text-[#c5a059]">
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

                  {/* Title */}
                  <p className="text-[12px] font-semibold text-slate-200 mb-2">{s.title}</p>

                  {/* What */}
                  <p className="text-[11px] font-semibold text-[#c5a059]/70 mb-1">What it is</p>
                  <p className="text-[12px] text-slate-400 leading-relaxed mb-3">{s.what}</p>

                  {/* How */}
                  <p className="text-[11px] font-semibold text-[#c5a059]/70 mb-1">How to use it</p>
                  <p className="text-[12px] text-slate-500 leading-relaxed mb-4">{s.how}</p>

                  {/* CTA */}
                  <button
                    onClick={() => handleNav(s.path)}
                    className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm border border-[#c5a059]/30 text-[#c5a059] hover:bg-[#c5a059]/10 transition font-sans">
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
              Additional Features — 05 to 08
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {FEATURES.map(f => (
                <div key={f.title}
                  className="bg-[#050505] border border-white/5 rounded-sm p-4 hover:border-white/10 transition group">

                  {/* Feature number */}
                  <p className="text-[10px] font-bold tracking-widest mb-3 text-[#c5a059]">
                    FEATURE {f.num}
                  </p>

                  {/* Lottie animation */}
                  <div className="flex justify-center mb-3">
                    <lottie-player
                      src={f.lottie}
                      background="transparent"
                      speed="1"
                      style={{ width: '80px', height: '80px' }}
                      loop
                      autoplay
                    />
                  </div>

                  {/* Title */}
                  <p className="text-[12px] font-semibold text-slate-200 mb-2">{f.icon} {f.title}</p>

                  {/* What */}
                  <p className="text-[11px] font-semibold text-[#c5a059]/70 mb-1">What it is</p>
                  <p className="text-[12px] text-slate-400 leading-relaxed mb-3">{f.what}</p>

                  {/* How */}
                  <p className="text-[11px] font-semibold text-[#c5a059]/70 mb-1">How to use it</p>
                  <p className="text-[12px] text-slate-500 leading-relaxed mb-4">{f.how}</p>

                  {/* CTA */}
                  <button
                    onClick={() => handleNav(f.path)}
                    className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm border border-[#c5a059]/30 text-[#c5a059] hover:bg-[#c5a059]/10 transition font-sans">
                    Open →
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
