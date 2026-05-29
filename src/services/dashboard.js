import api from './api'

export const getJurisdictionPulse = async () => {
  const { data } = await api.get('/dashboard/pulse')
  return data
}

export const getActiveMatters = async () => {
  const { data } = await api.get('/dashboard/matters')
  return data
}
