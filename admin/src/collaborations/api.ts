import { apiRequest } from '../api/client'
import { Collaboration, CollaborationSettings } from './types'

export const collaborationsAdminApi = {
  list(query = '') { return apiRequest<{ data: { collaborations: Collaboration[] } }>(`/admin/collaborations${query}`) },
  save(collaboration: Omit<Collaboration, 'id'> & { id?: string }) { const { id, ...payload } = collaboration; return apiRequest<{ data: { collaboration: Collaboration } }>(id ? `/admin/collaborations/${id}` : '/admin/collaborations', { method: id ? 'PUT' : 'POST', body: JSON.stringify(payload) }) },
  archive(id: string) { return apiRequest(`/admin/collaborations/${id}`, { method: 'DELETE' }) },
  getSettings() { return apiRequest<{ data: { settings: CollaborationSettings } }>('/admin/collaborations/settings') },
  updateSettings(settings: Omit<CollaborationSettings, 'id' | 'updatedAt'>) { return apiRequest<{ data: { settings: CollaborationSettings } }>('/admin/collaborations/settings', { method: 'PUT', body: JSON.stringify(settings) }) },
}
