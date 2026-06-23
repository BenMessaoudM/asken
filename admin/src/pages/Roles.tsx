import { FormEvent, useEffect, useState } from 'react'
import { apiRequest, ApiError } from '../api/client'
import { useAuth } from '../AuthContext'

interface Permission { id: string; key: string; description: string }
interface Role { id: string; key: string; name: string; description: string; isSystem: boolean; permissions: Permission[] }

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [form, setForm] = useState({ key: '', name: '', description: '', permissionIds: [] as string[] })
  const [error, setError] = useState('')
  const { hasPermission } = useAuth()
  const canWrite = hasPermission('roles.write')
  const load = async () => {
    const [roleResult, permissionResult] = await Promise.all([
      apiRequest<{ data: { roles: Role[] } }>('/admin/roles'),
      apiRequest<{ data: { permissions: Permission[] } }>('/admin/permissions')
    ])
    setRoles(roleResult.data.roles); setPermissions(permissionResult.data.permissions)
  }
  useEffect(() => { void load().catch((requestError) => setError(requestError instanceof ApiError ? requestError.message : 'Unable to load roles')) }, [])

  const createRole = async (event: FormEvent) => {
    event.preventDefault(); setError('')
    try { await apiRequest('/admin/roles', { method: 'POST', body: JSON.stringify(form) }); setForm({ key: '', name: '', description: '', permissionIds: [] }); await load() }
    catch (requestError) { setError(requestError instanceof ApiError ? requestError.message : 'Unable to create role') }
  }
  const updatePermissions = async (role: Role, permissionId: string, enabled: boolean) => {
    const current = role.permissions.map((permission) => permission.id)
    const permissionIds = enabled ? [...new Set([...current, permissionId])] : current.filter((id) => id !== permissionId)
    try { await apiRequest(`/admin/roles/${role.id}/permissions`, { method: 'PUT', body: JSON.stringify({ permissionIds }) }); await load() }
    catch (requestError) { setError(requestError instanceof ApiError ? requestError.message : 'Unable to update role') }
  }
  return (
    <section className="space-y-8">
      <div><h1 className="text-2xl font-bold">Role Management</h1><p className="text-gray-600">Map roles to explicit backend permissions.</p></div>
      {error && <p role="alert" className="rounded bg-red-50 p-3 text-red-800">{error}</p>}
      {canWrite && <form onSubmit={createRole} className="grid gap-3 rounded bg-white p-4 shadow md:grid-cols-2"><h2 className="text-lg font-bold md:col-span-2">Create role</h2><label>Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 w-full rounded border p-2" /></label><label>Key<input required pattern="[a-z][a-z0-9_.-]{2,49}" value={form.key} onChange={(event) => setForm({ ...form, key: event.target.value })} className="mt-1 w-full rounded border p-2" /></label><label className="md:col-span-2">Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-1 w-full rounded border p-2" /></label><fieldset className="md:col-span-2"><legend className="font-medium">Permissions</legend><div className="mt-2 grid gap-2 md:grid-cols-2">{permissions.map((permission) => <label key={permission.id} className="flex gap-2"><input type="checkbox" checked={form.permissionIds.includes(permission.id)} onChange={(event) => setForm({ ...form, permissionIds: event.target.checked ? [...form.permissionIds, permission.id] : form.permissionIds.filter((id) => id !== permission.id) })} />{permission.key}</label>)}</div></fieldset><button className="rounded bg-fuchsia-800 px-4 py-2 text-white md:col-span-2">Create role</button></form>}
      <div className="space-y-4">{roles.map((role) => <article key={role.id} className="rounded bg-white p-4 shadow"><h2 className="font-bold">{role.name} <span className="text-sm font-normal text-gray-500">({role.key})</span></h2><p className="text-sm text-gray-600">{role.description}</p><fieldset className="mt-3"><legend className="font-medium">Permissions</legend><div className="mt-2 grid gap-2 md:grid-cols-2">{permissions.map((permission) => <label key={permission.id} className="flex gap-2"><input disabled={!canWrite || role.isSystem} type="checkbox" checked={role.permissions.some((assigned) => assigned.id === permission.id)} onChange={(event) => void updatePermissions(role, permission.id, event.target.checked)} />{permission.key}</label>)}</div></fieldset></article>)}</div>
    </section>
  )
}
