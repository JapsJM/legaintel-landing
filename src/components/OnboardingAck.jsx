/**
 * OnboardingAck.jsx
 * ─────────────────────────────────────────────────────────────────
 * Mandatory first-use acknowledgement gate.
 *
 * HOW IT WORKS:
 * - Renders a full-screen blocking modal on first login only.
 * - User must check all 3 boxes before the confirm button activates.
 * - On confirm:
 *     1. POSTs to /api/auth/acknowledge  (server-side timestamp log)
 *     2. Sets localStorage flag          (client-side gate)
 * - Never shown again once acknowledged.
 *
 * INTEGRATION:
 * - Import and mount inside ProtectedRoute in App.jsx (see below).
 * - The modal renders OVER Layout — no content is accessible beneath it.
 *
 * BACKEND REQUIREMENT:
 * POST /api/auth/acknowledge
 * Headers: Authorization: Bearer <token>
 * Body:    { acknowledged_at: ISO string, session_id: string }
 * Response: { success: true }
 * → Log user_id, acknowledged_at, ip_address, user_agent server-side.
 *
 * LEGAL NOTE:
 * This component is your strongest court evidence.
 * The server-side log (user_id + timestamp + IP) proves the user
 * saw and accepted the AI disclaimer before using the platform.
 * ─────────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import {AlertTriangle, CheckSquare, Square, ShieldAlert } from 'lucide-react';
import api from '../services/api';

const ACK_STORAGE_KEY = 'legaintel_ack_v1';

const ACKNOWLEDGEMENTS = [
  {
    id: 'no_legal_advice',
    text: 'I understand LegAIntel is an AI research tool — not a law firm. It does not provide legal advice and no attorney-client relationship is created by my use of this platform.',
  },
  {
    id: 'verify_outputs',
    text: 'I understand all AI-generated outputs may contain errors, incorrect citations, or outdated information. I am solely responsible for independently verifying every output before relying on it in any professional, advisory, or court context.',
  },
  {
    id: 'my_responsibility',
    text: 'I understand compliance with Bar Council rules, court filing standards, citation accuracy, and all professional obligations is my sole responsibility. LegAIntel accepts no liability for consequences arising from my use of AI outputs.',
  },
];

/**
 * Returns true if the user has already acknowledged in this browser.
 * Called by ProtectedRoute to decide whether to render the gate.
 */
export function hasAcknowledged() {
  return localStorage.getItem(ACK_STORAGE_KEY) === 'true';
}

export default function OnboardingAck({ onComplete }) {
  const [checked, setChecked] = useState({
    no_legal_advice: false,
    verify_outputs: false,
    my_responsibility: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const allChecked = Object.values(checked).every(Boolean);

  const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleConfirm = async () => {
    if (!allChecked || submitting) return;
    setSubmitting(true);
    setError(null);

    const payload = {
      acknowledged_at: new Date().toISOString(),
      session_id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
    };

    try {
      // Primary: server-side log (legal evidence)
      await api.post('/auth/acknowledge', payload);
    } catch (err) {
      // Non-blocking: if backend call fails, still set localStorage
      // so the user isn't permanently locked out on network issues.
      // Backend should also set a DB flag on next authenticated request.
      console.warn('[LegAIntel] Acknowledgement backend log failed:', err?.message);
    }

    // Client-side gate flag — always set regardless of backend result
    localStorage.setItem(ACK_STORAGE_KEY, 'true');
    setSubmitting(false);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505]/95 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Modal */}
      <div className="w-full max-w-2xl bg-[#0a0c10] border border-white/10 rounded-sm shadow-2xl shadow-black/60 overflow-hidden">

        {/* Red alert bar */}
        <div className="bg-red-950/60 border-b border-red-800/40 px-6 py-4 flex items-center gap-3">
          <ShieldAlert size={18} className="text-red-400 shrink-0" />
          <p className="text-red-200 text-xs font-bold uppercase tracking-widest">
            Required — Read Before Proceeding
          </p>
        </div>

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[#c5a059] text-xs tracking-[0.25em] font-bold uppercase">
              LegAIntel — AI Disclaimer & Acknowledgement
            </span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            Before accessing the platform, you must read and confirm each of the following.
            This acknowledgement is recorded with a timestamp and is a binding condition of your access.
          </p>
        </div>

        {/* Checkboxes */}
        <div className="px-8 py-6 space-y-5">
          {ACKNOWLEDGEMENTS.map(({ id, text }) => (
            <button
              key={id}
              onClick={() => toggle(id)}
              className="w-full flex items-start gap-4 text-left group focus:outline-none"
            >
              <div className="shrink-0 mt-0.5">
                {checked[id]
                  ? <CheckSquare size={18} className="text-[#c5a059]" />
                  : <Square size={18} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                }
              </div>
              <p className={`text-sm leading-relaxed transition-colors ${
                checked[id] ? 'text-slate-200' : 'text-slate-400 group-hover:text-slate-300'
              }`}>
                {text}
              </p>
            </button>
          ))}
        </div>

        {/* Warning */}
        <div className="px-8 pb-4">
          <div className="flex items-start gap-3 p-4 bg-amber-950/20 border border-amber-800/20 rounded-sm">
            <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-amber-200/70 text-xs leading-relaxed">
              By clicking confirm, you create a binding electronic record of this acknowledgement
              under the Information Technology Act, 2000 and Indian Evidence Act, 1872.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="px-8 pb-3">
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        )}

        {/* Footer */}
        <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
            {Object.values(checked).filter(Boolean).length} of {ACKNOWLEDGEMENTS.length} confirmed
          </p>
          <button
            onClick={handleConfirm}
            disabled={!allChecked || submitting}
            className={`px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-200 rounded-sm ${
              allChecked && !submitting
                ? 'bg-[#c5a059] text-black hover:bg-[#d4b06a] cursor-pointer'
                : 'bg-white/5 text-slate-600 cursor-not-allowed'
            }`}
          >
            {submitting ? 'Recording…' : 'I Confirm — Continue to Platform'}
          </button>
        </div>

      </div>
    </div>
  );
}
