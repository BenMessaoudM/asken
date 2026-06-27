import { apiRequest } from '../api/client'
import { GovernanceDocument, GovernanceSettings } from './types'

export const governanceAdminApi = {
  listDocuments(query = '') { return apiRequest<{ data: { documents: GovernanceDocument[] } }>(`/admin/governance/documents${query}`) },
  saveDocument(document: Omit<GovernanceDocument, 'id'> & { id?: string }) { const { id, ...payload } = document; return apiRequest(id ? `/admin/governance/documents/${id}` : '/admin/governance/documents', { method: id ? 'PUT' : 'POST', body: JSON.stringify(payload) }) },
  publishDocument(id: string) { return apiRequest(`/admin/governance/documents/${id}/publish`, { method: 'POST' }) },
  unpublishDocument(id: string) { return apiRequest(`/admin/governance/documents/${id}/unpublish`, { method: 'POST' }) },
  archiveDocument(id: string) { return apiRequest(`/admin/governance/documents/${id}`, { method: 'DELETE' }) },
  getSettings() { return apiRequest<{ data: { settings: GovernanceSettings } }>('/admin/governance/settings') },
  updateSettings(settings: Omit<GovernanceSettings, 'id' | 'updatedAt'>) { return apiRequest<{ data: { settings: GovernanceSettings } }>('/admin/governance/settings', { method: 'PUT', body: JSON.stringify(settings) }) }
}
