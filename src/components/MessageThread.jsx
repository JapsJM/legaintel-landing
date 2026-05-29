/**
 * MessageThread.jsx
 * ─────────────────────────────────────────────────────────────────
 * MODIFIED FROM ORIGINAL:
 * 1. AiOutputDisclaimer component added — renders on EVERY AI response.
 *    Non-dismissible. Visually attached to the output card.
 * 2. useAuditLog hook wired — fires silently on every AI message render.
 *    Logs: query, response_preview, disclaimer_shown:true, timestamp.
 *
 * LEGAL PURPOSE:
 * - The disclaimer is screenshot evidence that every output carried a warning.
 * - The audit log is server-side evidence of what was queried and returned.
 * - disclaimer_shown: true in every log entry proves the user saw the warning.
 * ─────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, AlertCircle, ChevronDown, ChevronUp, FileText, AlertTriangle } from 'lucide-react';
import useAuditLog from '../hooks/useAuditLog';

// ─── AI Output Disclaimer ────────────────────────────────────────
// Renders directly inside every assistant message card.
// Non-dismissible. Always visible. Part of the output card structure.
function AiOutputDisclaimer() {
  return (
    <div className="mt-4 pt-4 border-t border-white/5 flex items-start gap-3">
      <AlertTriangle className="w-3.5 h-3.5 text-amber-500/70 shrink-0 mt-0.5" />
      <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
        <span className="text-amber-500/80 font-semibold">AI Research Output — Not Legal Advice.</span>{' '}
        This analysis may contain errors, incorrect citations, or outdated information.
        You are solely responsible for independently verifying this output before relying
        on it in any professional, advisory, or court context. LegAIntel accepts no
        liability for consequences arising from unverified use of AI-generated content.
      </p>
    </div>
  );
}

// ─── Sources Panel (unchanged from original) ────────────────────
function SourcesPanel({ sources }) {
  const [open, setOpen] = useState(false);
  if (!sources?.length) return null;
  return (
    <div className="mt-4 border-t border-white/5 pt-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-[11px] text-slate-400 hover:text-slate-200 transition-colors uppercase tracking-widest font-sans"
      >
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {sources.length} source{sources.length > 1 ? 's' : ''} — {open ? 'hide' : 'view'}
      </button>
      {open && (
        <div className="mt-3 space-y-2">
          {sources.map((src, i) => (
            <div key={i} className="flex gap-3 p-3 bg-white/[0.02] border border-white/5 rounded text-xs text-slate-400 leading-relaxed font-sans">
              <FileText className="w-3 h-3 text-[#c5a059]/50 shrink-0 mt-0.5" />
              <span>{src.content || src.text || 'No preview available.'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── AssistantMessage ────────────────────────────────────────────
// Extracted to a named component so useEffect can fire per message.
function AssistantMessage({ msg, msgIndex, messages, logOutput }) {
  // Find the most recent user query preceding this assistant message
  const precedingUserQuery = (() => {
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') return messages[i].content;
    }
    return '';
  })();

  // Fire audit log once per message render
  useEffect(() => {
    if (msg.content) {
      logOutput(precedingUserQuery, msg.content, msg.id ?? msgIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msg.id ?? msgIndex]);

  return (
    <div className="flex flex-col gap-3 bg-white/[0.02] border border-white/5 p-6 rounded">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-[1px] w-4 bg-slate-500" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] font-sans">
            LegAIntel Analysis
          </span>
        </div>
        {msg.confidence && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[9px] font-bold uppercase tracking-widest font-sans">
            <ShieldCheck className="w-3 h-3" />
            {msg.confidence}
          </div>
        )}
      </div>

      <div className="text-slate-100 text-base font-normal leading-7 font-sans whitespace-pre-wrap">
        {msg.content}
      </div>

      {msg.flagged && (
        <div className="p-3 bg-red-950/20 border border-red-900/30 rounded flex gap-3 items-start font-sans">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs text-red-200/70 leading-relaxed">{msg.flag_reason}</p>
        </div>
      )}

      <SourcesPanel sources={msg.sources} />

      {/* ── DISCLAIMER — always last, always visible, non-dismissible ── */}
      <AiOutputDisclaimer />
    </div>
  );
}

// ─── MessageThread (main export) ────────────────────────────────

// ── Agent Communication Animation ────────────────────────────────────────────

const AGENT_STEPS = [
  { label: 'Query Analyst',    desc: 'Parsing legal intent and extracting key provisions...' },
  { label: 'Document Retriever', desc: 'Scanning indexed matter chunks for relevance...' },
  { label: 'Precedent Mapper', desc: 'Cross-referencing judgments and citations...' },
  { label: 'Synthesis Engine', desc: 'Composing grounded legal response...' },
]

function AgentThinking() {
  const [activeStep, setActiveStep] = React.useState(0)
  const [dots, setDots] = React.useState('')

  React.useEffect(() => {
    const stepTimer = setInterval(() => {
      setActiveStep(s => (s + 1) % AGENT_STEPS.length)
    }, 2200)
    const dotTimer = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.')
    }, 400)
    return () => { clearInterval(stepTimer); clearInterval(dotTimer) }
  }, [])

  return (
    <div className="p-5 bg-[#0a0c10] border border-white/5 rounded-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-1">
          {[0,1,2].map(i => (
            <div key={i} className="w-1 h-1 rounded-full bg-[#c5a059]"
              style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
          ))}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c5a059] font-sans">
          Processing Query{dots}
        </span>
      </div>

      <div className="space-y-2">
        {AGENT_STEPS.map((step, i) => {
          const isDone   = i < activeStep
          const isActive = i === activeStep
          return (
            <div key={i} className={`flex items-start gap-3 py-2 px-3 rounded-sm transition-all duration-500
              ${isActive ? 'bg-white/[0.04] border border-white/[0.08]' : 'border border-transparent'}`}>
              {/* Status indicator */}
              <div className={`w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center transition-all duration-500
                ${isDone   ? 'bg-emerald-500/20 border border-emerald-500/40'
                : isActive ? 'bg-[#c5a059]/20 border border-[#c5a059]/40'
                :            'bg-white/5 border border-white/10'}`}>
                {isDone ? (
                  <svg className="w-2.5 h-2.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                  </svg>
                ) : isActive ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c5a059]"
                    style={{ animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite' }} />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-[10px] font-bold uppercase tracking-widest font-sans transition-colors
                  ${isDone ? 'text-emerald-400' : isActive ? 'text-white' : 'text-slate-600'}`}>
                  {step.label}
                </p>
                {isActive && (
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5 leading-relaxed">
                    {step.desc}
                  </p>
                )}
              </div>

              {/* Connector line */}
              {i < AGENT_STEPS.length - 1 && (
                <div className={`absolute left-[26px] w-px transition-all duration-700
                  ${isDone ? 'bg-emerald-500/30' : 'bg-white/5'}`}
                  style={{ height: '16px', marginTop: '20px' }} />
              )}
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export default function MessageThread({ messages, thinking }) {
  const bottomRef = useRef(null);
  const { logOutput } = useAuditLog();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  return (
    <div className="space-y-8">
      {messages.map((msg, i) => (
        <div key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {msg.role === 'user' ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="h-[1px] w-4 bg-[#c5a059]/50" />
                <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.2em] font-sans">
                  Query
                </span>
              </div>
              <p className="text-base text-slate-200 font-normal leading-relaxed pl-6 font-sans">
                {msg.content}
              </p>
            </div>
          ) : (
            <AssistantMessage
              msg={msg}
              msgIndex={i}
              messages={messages}
              logOutput={logOutput}
            />
          )}
        </div>
      ))}

      {thinking && <AgentThinking />}

      <div ref={bottomRef} />
    </div>
  );
}
