import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPrompts, savePrompt, resetPrompt } from '../services/prompts'

// ═══════════════════════════════════════════════════════════════
// AGENT BADGE
// ═══════════════════════════════════════════════════════════════

const AgentBadge = ({ agent }) => {
  const colors = {
    router:      'bg-blue-500/20   text-blue-400   border-blue-500/30',
    transformer: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    memory:      'bg-green-500/20  text-green-400  border-green-500/30',
    synthesiser: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    validator:   'bg-amber-500/20  text-amber-400  border-amber-500/30',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-mono ${colors[agent] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
      {agent}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════
// PROMPT CARD
// ═══════════════════════════════════════════════════════════════

const PromptCard = ({ item, onSaved, onReset }) => {
  const [editing,  setEditing]  = useState(false)
  const [draft,    setDraft]    = useState(item.prompt)
  const [saving,   setSaving]   = useState(false)
  const [resetting,setResetting]= useState(false)
  const [error,    setError]    = useState(null)
  const [success,  setSuccess]  = useState(false)

  // Sync draft when item changes from outside
  useEffect(() => {
    if (!editing) setDraft(item.prompt)
  }, [item.prompt, editing])

  const handleSave = async () => {
    if (!draft.trim()) return
    setSaving(true)
    setError(null)
    try {
      await savePrompt(item.agent, draft.trim())
      setEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
      onSaved(item.agent, draft.trim())
    } catch (e) {
      setError(e?.response?.data?.error || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    setResetting(true)
    setError(null)
    try {
      await resetPrompt(item.agent)
      setEditing(false)
      onReset(item.agent)
    } catch (e) {
      setError(e?.response?.data?.error || 'Reset failed')
    } finally {
      setResetting(false)
    }
  }

  const handleCancel = () => {
    setDraft(item.prompt)
    setEditing(false)
    setError(null)
  }

  const charCount = draft.length

  return (
    <div className={`rounded-2xl bg-gray-900 border transition-colors
      ${item.is_custom ? 'border-indigo-500/30' : 'border-white/10'}`}>

      {/* Card header */}
      <div className="flex items-start gap-3 p-5 pb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <AgentBadge agent={item.agent} />
            <h3 className="text-white font-semibold text-sm">{item.label}</h3>
            {item.is_custom && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Custom
              </span>
            )}
            {success && (
              <span className="text-xs text-emerald-400">✓ Saved</span>
            )}
          </div>
          <p className="text-xs text-gray-500">{item.description}</p>
          {item.is_custom && item.updated_at && (
            <p className="text-xs text-gray-600 mt-0.5">
              Last updated: {new Date(item.updated_at).toLocaleString()}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {item.is_custom && !editing && (
            <button
              onClick={handleReset}
              disabled={resetting}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400
                         border border-white/10 hover:text-white hover:bg-gray-700
                         transition-colors disabled:opacity-50"
            >
              {resetting ? 'Resetting…' : '↺ Reset'}
            </button>
          )}
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white
                         hover:bg-indigo-700 transition-colors"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400
                           border border-white/10 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !draft.trim()}
                className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 text-white
                           hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Prompt textarea */}
      <div className="px-5 pb-5">
        {error && (
          <div className="mb-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        <div className="relative">
          <textarea
            value={editing ? draft : item.prompt}
            onChange={e => setDraft(e.target.value)}
            readOnly={!editing}
            rows={editing ? 10 : 6}
            className={`w-full text-xs font-mono rounded-xl px-4 py-3 resize-y
              bg-black/30 border text-gray-300 leading-relaxed outline-none
              transition-colors
              ${editing
                ? 'border-indigo-500/50 focus:border-indigo-400'
                : 'border-white/5 text-gray-500 cursor-default'
              }`}
          />
          {editing && (
            <div className="absolute bottom-2 right-3 text-xs text-gray-600">
              {charCount} chars
            </div>
          )}
        </div>

        {/* Variables hint */}
        {editing && (
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="text-xs text-gray-600">Available variables:</span>
            {_getVariables(item.agent).map(v => (
              <span key={v} className="text-xs font-mono bg-white/5 px-1.5 py-0.5 rounded text-gray-500 border border-white/10">
                {'{' + v + '}'}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Variable hints per agent
const _getVariables = (agent) => {
  const vars = {
    router:      ['query', 'history'],
    transformer: ['query', 'history'],
    memory:      ['history'],
    synthesiser: ['query', 'history', 'chunks', 'graph_section'],
    validator:   ['answer', 'chunks'],
  }
  return vars[agent] || []
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════

export default function Prompts() {
  const navigate = useNavigate()
  const [prompts,  setPrompts]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    getPrompts()
      .then(data => setPrompts(data))
      .catch(() => setError('Failed to load prompts'))
      .finally(() => setLoading(false))
  }, [])

  const handleSaved = (agent, newPrompt) => {
    setPrompts(prev => prev.map(p =>
      p.agent === agent
        ? { ...p, prompt: newPrompt, is_custom: true, updated_at: new Date().toISOString() }
        : p
    ))
  }

  const handleReset = (agent) => {
    // Reload all prompts from server to get default back
    getPrompts()
      .then(data => setPrompts(data))
      .catch(() => {})
  }

  const customCount = prompts.filter(p => p.is_custom).length

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-white font-semibold">Prompt Tuning</h1>
          <p className="text-xs text-gray-500">
            Customize agent prompts to improve RAG quality for your documents
          </p>
        </div>
        {customCount > 0 && (
          <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            {customCount} custom {customCount === 1 ? 'prompt' : 'prompts'}
          </span>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">

        {/* Warning banner */}
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
            <div>
              <p className="text-sm text-amber-400 font-medium">Changes take effect immediately</p>
              <p className="text-xs text-amber-400/70 mt-0.5">
                Modified prompts apply to all new queries. Use "Reset" to restore defaults. 
                Always include required variables shown below each editor.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <svg className="w-6 h-6 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          </div>
        )}

        {!loading && (
          <div className="space-y-4">
            {prompts.map(item => (
              <PromptCard
                key={item.agent}
                item={item}
                onSaved={handleSaved}
                onReset={handleReset}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
