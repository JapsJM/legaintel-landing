import api from './api'

// ── Query ────────────────────────────────────────────────────

export const sendQuery = async (message, sessionId = null) => {
  const payload = { message }
  if (sessionId) payload.session_id = sessionId
  const { data } = await api.post('/query', payload)
  return data
}

// ── Conversations ────────────────────────────────────────────

export const listConversations = async () => {
  const { data } = await api.get('/conversations')
  return data.conversations
}

export const getConversation = async (sessionId) => {
  const { data } = await api.get(`/conversations/${sessionId}`)
  return data.conversation
}

export const deleteConversation = async (sessionId) => {
  await api.delete(`/conversations/${sessionId}`)
}
