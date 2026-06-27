import { apiRequest } from '../api/client'
import { RepresentativeBody, RepresentativeCall, StudentRepresentative } from './types'

export const representativesAdminApi = {
  async list() {
    const [bodies, people, calls] = await Promise.all([
      apiRequest<{ data: { bodies: RepresentativeBody[] } }>('/admin/representatives/bodies'),
      apiRequest<{ data: { representatives: StudentRepresentative[] } }>('/admin/representatives/people'),
      apiRequest<{ data: { calls: RepresentativeCall[] } }>('/admin/representatives/calls')
    ])
    return { bodies: bodies.data.bodies, people: people.data.representatives, calls: calls.data.calls }
  },
  saveBody(body: Omit<RepresentativeBody, 'id'> & { id?: string }) {
    const { id, ...payload } = body
    return apiRequest(id ? `/admin/representatives/bodies/${id}` : '/admin/representatives/bodies', { method: id ? 'PUT' : 'POST', body: JSON.stringify(payload) })
  },
  archiveBody(id: string) { return apiRequest(`/admin/representatives/bodies/${id}`, { method: 'DELETE' }) },
  savePerson(person: Omit<StudentRepresentative, 'id'> & { id?: string }) {
    const { id, ...payload } = person
    return apiRequest(id ? `/admin/representatives/people/${id}` : '/admin/representatives/people', { method: id ? 'PUT' : 'POST', body: JSON.stringify(payload) })
  },
  archivePerson(id: string) { return apiRequest(`/admin/representatives/people/${id}`, { method: 'DELETE' }) },
  saveCall(call: Omit<RepresentativeCall, 'id' | 'status'> & { id?: string; status?: RepresentativeCall['status'] }) {
    const { id, ...payload } = call
    return apiRequest(id ? `/admin/representatives/calls/${id}` : '/admin/representatives/calls', { method: id ? 'PUT' : 'POST', body: JSON.stringify(payload) })
  },
  archiveCall(id: string) { return apiRequest(`/admin/representatives/calls/${id}`, { method: 'DELETE' }) }
}
