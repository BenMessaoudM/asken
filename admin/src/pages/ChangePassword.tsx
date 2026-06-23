import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest, ApiError } from '../api/client'
import { useAuth } from '../AuthContext'

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const { refreshSession } = useAuth()
  const navigate = useNavigate()
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError('')
    try { await apiRequest('/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) }); await refreshSession(); navigate('/login') }
    catch (requestError) { setError(requestError instanceof ApiError ? requestError.message : 'Unable to change password') }
  }
  return <section className="max-w-lg"><h1 className="text-2xl font-bold">Change Password</h1><p className="mt-2 text-gray-600">Use at least 12 characters with upper- and lowercase letters, a number, and a special character.</p>{error && <p role="alert" className="mt-4 rounded bg-red-50 p-3 text-red-800">{error}</p>}<form onSubmit={submit} className="mt-4 space-y-4 rounded bg-white p-4 shadow"><label className="block">Current password<input type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="mt-1 w-full rounded border p-2" /></label><label className="block">New password<input type="password" autoComplete="new-password" required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="mt-1 w-full rounded border p-2" /></label><button className="rounded bg-fuchsia-800 px-4 py-2 text-white">Change password</button></form></section>
}
