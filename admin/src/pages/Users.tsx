import { FormEvent, useEffect, useState } from 'react'
import { apiRequest, ApiError } from '../api/client'
import { useAuth } from '../AuthContext'

interface Role { id: string; key: string; name: string }
interface User { id: string; email: string; name: string; status: 'active' | 'disabled'; roles: Role[] }

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [form, setForm] = useState({ email: '', name: '', password: '', roleId: '' })
  const [error, setError] = useState('')
  const { hasPermission } = useAuth()
  const canWrite = hasPermission('users.write')

  const load = async () => {
    const [userResult, roleResult] = await Promise.all([
      apiRequest<{ data: { users: User[] } }>('/admin/users'),
      apiRequest<{ data: { roles: Role[] } }>('/admin/roles')
    ])
    setUsers(userResult.data.users)
    setRoles(roleResult.data.roles)
    if (!form.roleId && roleResult.data.roles[0]) setForm((current) => ({ ...current, roleId: roleResult.data.roles[0].id }))
  }
  useEffect(() => { void load().catch((requestError) => setError(requestError instanceof ApiError ? requestError.message : 'Unable to load users')) }, [])

  const createUser = async (event: FormEvent) => {
    event.preventDefault(); setError('')
    try {
      await apiRequest('/admin/users', { method: 'POST', body: JSON.stringify({ email: form.email, name: form.name, password: form.password, roleIds: [form.roleId] }) })
      setForm((current) => ({ ...current, email: '', name: '', password: '' })); await load()
    } catch (requestError) { setError(requestError instanceof ApiError ? requestError.message : 'Unable to create user') }
  }

  const updateUser = async (userId: string, update: { status?: User['status']; roleIds?: string[] }) => {
    setError('')
    try { await apiRequest(`/admin/users/${userId}`, { method: 'PATCH', body: JSON.stringify(update) }); await load() }
    catch (requestError) { setError(requestError instanceof ApiError ? requestError.message : 'Unable to update user') }
  }

  return (
    <section className="space-y-8">
      <div><h1 className="text-2xl font-bold">User Management</h1><p className="text-gray-600">Create accounts, assign roles, and disable access.</p></div>
      {error && <p role="alert" className="rounded bg-red-50 p-3 text-red-800">{error}</p>}
      {canWrite && <form onSubmit={createUser} className="grid gap-3 rounded bg-white p-4 shadow md:grid-cols-2">
        <h2 className="text-lg font-bold md:col-span-2">Create user</h2>
        <label>Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 w-full rounded border p-2" /></label>
        <label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-1 w-full rounded border p-2" /></label>
        <label>Temporary password<input required type="password" autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="mt-1 w-full rounded border p-2" /></label>
        <label>Role<select required value={form.roleId} onChange={(event) => setForm({ ...form, roleId: event.target.value })} className="mt-1 w-full rounded border p-2">{roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select></label>
        <button className="rounded bg-fuchsia-800 px-4 py-2 text-white md:col-span-2">Create user</button>
      </form>}
      <div className="overflow-x-auto rounded bg-white shadow"><table className="min-w-full"><thead><tr className="border-b text-left"><th className="p-3">User</th><th className="p-3">Status</th><th className="p-3">Role</th><th className="p-3">Actions</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-b"><td className="p-3"><strong>{user.name}</strong><br /><span className="text-sm text-gray-600">{user.email}</span></td><td className="p-3">{user.status}</td><td className="p-3"><select disabled={!canWrite} aria-label={`Role for ${user.name}`} value={user.roles[0]?.id || ''} onChange={(event) => void updateUser(user.id, { roleIds: [event.target.value] })} className="rounded border p-2">{roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select></td><td className="p-3"><button disabled={!canWrite} onClick={() => void updateUser(user.id, { status: user.status === 'active' ? 'disabled' : 'active' })} className="rounded border px-3 py-2">{user.status === 'active' ? 'Disable' : 'Enable'}</button></td></tr>)}</tbody></table></div>
    </section>
  )
}
