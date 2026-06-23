import { FormEvent, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { ApiError } from '../api/client'

export default function Login() {
  const { login, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isLoading && isAuthenticated) return <Navigate to="/" replace />

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); setError(''); setSubmitting(true)
    try {
      await login(email, password)
      navigate((location.state as { from?: string } | null)?.from || '/', { replace: true })
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Unable to sign in')
    } finally { setSubmitting(false) }
  }

  return (
    <main className="grid min-h-screen bg-[#F7F3F5] lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-ask-ink p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-ask-600/40 blur-3xl" />
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-ask-400/25 blur-3xl" />
        <div className="relative flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-ask-600 text-xl font-black">A</div><div><p className="text-xl font-bold">ASK Backoffice</p><p className="text-sm text-white/50">Arcada Student Union – ASK</p></div></div>
        <div className="relative max-w-xl"><p className="text-sm font-semibold uppercase tracking-[.2em] text-ask-400">Secure administration</p><h1 className="mt-4 text-5xl font-bold leading-tight">One workspace for ASK operations.</h1><p className="mt-5 text-lg leading-8 text-white/58">Manage people, content, events, bookings, and governance through a permission-aware platform.</p></div>
        <p className="relative text-sm text-white/35">Protected by secure sessions and role-based access.</p>
      </section>
      <section className="flex items-center justify-center p-6 sm:p-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl shadow-ask-ink/5 sm:p-9">
          <div className="mb-8 lg:hidden"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-ask-600 font-black text-white">A</div></div>
          <p className="text-sm font-semibold text-ask-600">Welcome back</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-ask-ink">Sign in to ASK</h2><p className="mt-2 text-sm text-gray-500">Use your administration account to continue.</p>
          {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
          <div className="mt-7 space-y-5"><label htmlFor="email" className="block text-sm font-semibold text-ask-ink">Email<input id="email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none transition focus:border-ask-600 focus:ring-4 focus:ring-ask-600/10" /></label><label htmlFor="password" className="block text-sm font-semibold text-ask-ink">Password<input id="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none transition focus:border-ask-600 focus:ring-4 focus:ring-ask-600/10" /></label></div>
          <button disabled={submitting} type="submit" className="mt-7 w-full rounded-xl bg-ask-600 px-4 py-3 font-semibold text-white shadow-lg shadow-ask-600/20 transition hover:bg-[#8C287B] disabled:opacity-50">{submitting ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </section>
    </main>
  )
}
