import api from './api'

export const submitFeedback = async (sessionId, msgIndex, vote) => {
  const { data } = await api.post(
    `/conversations/${sessionId}/messages/${msgIndex}/feedback`,
    { vote }
  )
  return data
}

export const getFeedback = async (vote = null) => {
  const params = vote ? { vote } : {}
  const { data } = await api.get('/feedback', { params })
  return data.feedback
}

export const getDocumentAnalytics = async () => {
  const { data } = await api.get('/analytics/documents')
  return data.documents
}

export const getQueryAnalytics = async (days = 30) => {
  const { data } = await api.get('/analytics/queries', { params: { days } })
  return data
}

// --- Sidebar Feedback System ---
export const submitUserFeedback = async ({ rating, subject, category, message, page_url }) => {
  const { data } = await api.post('/feedback', { rating, subject, category, message, page_url })
  return data
}
