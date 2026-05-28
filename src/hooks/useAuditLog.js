/**
 * useAuditLog.js
 * ─────────────────────────────────────────────────────────────────
 * Audit trail hook for AI outputs.
 *
 * WHAT IT LOGS (per AI response):
 * - user_query:        the user's original query text
 * - response_preview:  first 500 chars of AI response (not full text)
 * - disclaimer_shown:  always true — confirms disclaimer was rendered
 * - timestamp:         ISO string at time of render
 * - session_id:        per-session UUID (generated once, stored in sessionStorage)
 *
 * WHY response_preview NOT full response:
 * Logging full responses creates DPDPA data minimisation risk.
 * A 500-char preview is sufficient to identify the exchange in dispute
 * without storing entire AI outputs.
 *
 * BACKEND REQUIREMENT:
 * POST /api/audit/log
 * Headers: Authorization: Bearer <token>
 * Body:    AuditPayload (see below)
 * Response: { success: true }
 * → Store: user_id, ip_address, user_agent + payload fields server-side.
 * → Retention: minimum 2 years recommended for dispute resolution.
 *
 * BEHAVIOUR:
 * - Silent — never blocks UI, never throws to caller.
 * - Fire-and-forget — no retry on failure (to avoid blocking chat).
 * - Deduplicates: same message_id not logged twice in one session.
 * ─────────────────────────────────────────────────────────────────
 */

import { useRef, useCallback } from 'react';
import api from '../services/api';

/** Generate or retrieve a stable session ID for this browser tab */
function getSessionId() {
  const key = 'legaintel_session_id';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now();
    sessionStorage.setItem(key, id);
  }
  return id;
}

/**
 * @typedef {Object} AuditPayload
 * @property {string} user_query         - Full user query text
 * @property {string} response_preview   - First 500 chars of AI response
 * @property {boolean} disclaimer_shown  - Always true (disclaimer rendered)
 * @property {string} timestamp          - ISO timestamp of render
 * @property {string} session_id         - Per-tab session UUID
 */

/**
 * useAuditLog
 * Returns a `logOutput` function. Call it whenever an AI message renders.
 *
 * Usage in MessageThread.jsx:
 *   const { logOutput } = useAuditLog();
 *   // inside assistant message render:
 *   useEffect(() => { logOutput(userQuery, msg.content, msg.id); }, [msg.id]);
 */
export default function useAuditLog() {
  const logged = useRef(new Set());
  const sessionId = useRef(getSessionId());

  /**
   * @param {string} userQuery      - The query that produced this output
   * @param {string} aiResponse     - The full AI response text
   * @param {string|number} msgId   - Unique message ID to prevent duplicate logs
   */
  const logOutput = useCallback(async (userQuery, aiResponse, msgId) => {
    // Deduplicate — don't log the same message twice
    const dedupKey = String(msgId ?? aiResponse.slice(0, 40));
    if (logged.current.has(dedupKey)) return;
    logged.current.add(dedupKey);

    /** @type {AuditPayload} */
    const payload = {
      user_query: userQuery ?? '',
      response_preview: (aiResponse ?? '').slice(0, 500),
      disclaimer_shown: true,
      timestamp: new Date().toISOString(),
      session_id: sessionId.current,
    };

    try {
      await api.post('/audit/log', payload);
    } catch (err) {
      // Silent — audit log failure must never interrupt user experience
      // Backend should also capture via access logs as secondary trail
      console.warn('[LegAIntel] Audit log failed (non-blocking):', err?.message);
    }
  }, []);

  return { logOutput };
}
