/**
 * OnboardingWizard.jsx
 * ─────────────────────────────────────────────────────────────────
 * Shown once on Dashboard when user has zero documents.
 * Dismissed via localStorage flag — never shown again.
 * Non-blocking: user can dismiss at any step.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Upload, Zap, MessageSquare, ChevronRight } from 'lucide-react'

const WIZARD_KEY = 'legaintel_wizard_v1'

export function hasSeenWizard() {
  return localStorage.getItem(WIZARD_KEY) === 'true'
}

function dismissWizard() {
  localStorage.setItem(WIZARD_KEY, 'true')
}

const STEPS = [
  {
    icon: Upload,
    number: '01',
    title: 'Upload Your First Matter',
    desc: 'Add any case document — judgment, FIR, notice, contract, or pleading. LegAIntel will read, chunk, and index it for AI-powered analysis.',
    action: 'Upload Now',
    path: '/documents',
  },
  {
    icon: Zap,
    number: '02',
    title: "Compile Your Counsel's Digest",
    desc: "Once documents are uploaded, compile your first Digest. The AI will cross-reference your matter against today's new Supreme Court judgments and flag threats or opportunities.",
    action: 'Go to Digest',
    path: '/briefing',
  },
  {
    icon: MessageSquare,
    number: '03',
    title: 'Ask Your First Research Query',
    desc: 'Use Legal Chat to ask any question grounded in your uploaded documents — citations, contradictions, section analysis, or procedural questions.',
    action: 'Start Research',
    path: '/chat',
  },
]

export default function OnboardingWizard({ onDismiss }) {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const current = STEPS[step]
  const Icon = current.icon
  const isLast = step === STEPS.length - 1

  const handleDismiss = () => {
    dismissWizard()
    onDismiss()
  }

  const handleAction = () => {
    dismissWizard()
    navigate(current.path)
  }

  const handleNext = () => {
    if (isLast) {
      handleDismiss()
    } else {
      setStep(s => s + 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-[#0a0c10] border border-white/10 rounded-sm shadow-2xl relative overflow-hidden">

        {/* Gold top bar */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#c5a059] to-transparent" />

        {/* Dismiss */}
        <button onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 text-slate-600 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="p-8">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-0.5 flex-1 rounded-full transition-all duration-500
                ${i <= step ? 'bg-[#c5a059]' : 'bg-white/10'}`} />
            ))}
          </div>

          {/* Icon */}
          <div className="w-12 h-12 rounded-sm bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center mb-6">
            <Icon className="w-5 h-5 text-[#c5a059]" />
          </div>

          {/* Step number */}
          <p className="text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.25em] font-sans mb-2">
            Step {current.number} of {STEPS.length}
          </p>

          {/* Title */}
          <h2 className="text-lg font-bold text-white font-serif mb-3">
            {current.title}
          </h2>

          {/* Description */}
          <p className="text-sm text-slate-400 leading-relaxed font-sans mb-8">
            {current.desc}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button onClick={handleAction}
              className="flex-1 py-2.5 bg-[#c5a059] hover:bg-[#b38f48] text-black text-xs font-bold uppercase tracking-widest rounded-sm transition-all">
              {current.action}
            </button>
            <button onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest rounded-sm transition-all">
              {isLast ? 'Done' : 'Next'} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button onClick={handleDismiss}
            className="mt-4 w-full text-[10px] text-slate-600 hover:text-slate-400 uppercase tracking-widest font-sans transition-colors text-center">
            Skip setup guide
          </button>
        </div>
      </div>
    </div>
  )
}
