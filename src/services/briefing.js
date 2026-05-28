import api from './api'

export const getBriefing = async () => {
  const { data } = await api.get('/briefing')
  return data
}

export const triggerBriefing = async () => {
  const { data } = await api.post('/briefing/generate')
  return data
}

export const getBriefingSettings = async () => {
  const { data } = await api.get('/briefing/settings')
  return data
}

export const updateBriefingSettings = async (settings) => {
  const { data } = await api.post('/briefing/settings', settings)
  return data
}
