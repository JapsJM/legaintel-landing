import api from './api'

export const uploadDocument = (file, onProgress) => {
  const formData = new FormData()
  formData.append('file', file)

  return api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total))
      }
    },
  })
}

export const listDocuments    = () => api.get('/documents/list')
export const getDocumentStatus = (docId) => api.get(`/documents/${docId}/status`)
export const deleteDocument   = (docId) => api.delete(`/documents/${docId}`)

export const rechunkDocument  = (docId, chunkSize, chunkOverlap) =>
  api.post(`/documents/${docId}/rechunk`, {
    chunk_size:    chunkSize,
    chunk_overlap: chunkOverlap,
  })
