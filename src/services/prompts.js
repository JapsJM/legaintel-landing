import api from './api'

export const getPrompts    = ()             => api.get('/prompts').then(r => r.data.prompts)
export const savePrompt    = (agent, prompt) => api.put(`/prompts/${agent}`, { prompt })
export const resetPrompt   = (agent)        => api.delete(`/prompts/${agent}`)
