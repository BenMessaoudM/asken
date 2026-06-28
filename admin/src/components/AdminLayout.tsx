import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { dashboardModules, visibleDashboardModules } from '../dashboard/navigation'
import { resolveInitialTheme, Theme } from '../dashboard/theme'
import { useAdminLocale } from '../localization/AdminLocaleContext'
import DashboardIcon from './DashboardIcon'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const { language, setLanguage, t } = useAdminLocale()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>(() => resolveInitialTheme(localStorage.getItem('ask-admin-theme'), window.matchMedia('(prefers-color-scheme: dark)').matches))
  const modules = useMemo(() => visibleDashboardModules(dashboardModules, user?.permissions || []), [user?.permissions])
  const activeModule = modules.find((module) => module.path === location.pathname)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('ask-admin-theme', theme)
  }, [theme])
  useEffect(() => setSidebarOpen(false), [location.pathname])

  const handleLogout = async () => { await logout(); navigate('/login') }

  return (
    <div className="min-h-screen bg-[#F7F3F5] text-ask-ink transition-colors dark:bg-[#17161C] dark:text-[#F8F4F7]">
      {sidebarOpen && <button className="fixed inset-0 z-30 bg-black/50 lg:hidden" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-ask-ink text-white shadow-2xl transition-transform duration-200 dark:border-r dark:border-white/10 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-ask-600 text-xl font-black shadow-lg shadow-ask-600/30">A</div>
          <div><p className="text-lg font-bold tracking-tight">ASK Backoffice</p><p className="text-xs text-white/55">Arcada Student Union – ASK</p></div>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-5" aria-label="Dashboard modules">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">{t.common.workspace}</p>
          <ul className="space-y-1">
            {modules.map((module) => (
              <li key={module.path}>
                <NavLink to={module.path} end={module.path === '/'} className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-ask-600 text-white shadow-lg shadow-ask-600/20' : 'text-white/68 hover:bg-white/8 hover:text-white'}`}>
                  <DashboardIcon name={module.icon} className="h-5 w-5 shrink-0" />
                  <span>{t.nav[module.navKey as keyof typeof t.nav]}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ask-400 font-bold">{user?.name.charAt(0).toUpperCase()}</div>
            <div className="min-w-0"><p className="truncate text-sm font-semibold">{user?.name}</p><p className="truncate text-xs text-white/50">{user?.email}</p></div>
          </div>
          <NavLink to="/change-password" className="mb-2 block w-full rounded-xl px-3 py-2 text-center text-sm font-medium text-white/65 transition hover:bg-white/10 hover:text-white">{t.common.accountSecurity}</NavLink>
          <button onClick={() => void handleLogout()} className="w-full rounded-xl border border-white/15 px-3 py-2 text-sm font-medium text-white/75 transition hover:border-white/30 hover:bg-white/10 hover:text-white">{t.common.signOut}</button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-black/5 bg-white/85 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#23212B]/85 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 lg:hidden dark:border-white/15" aria-label="Open navigation"><span className="text-xl">☰</span></button>
            <div className="min-w-0"><p className="truncate text-lg font-bold">{activeModule ? t.nav[activeModule.navKey as keyof typeof t.nav] : t.common.askAdministration}</p><p className="hidden truncate text-sm text-gray-500 dark:text-white/45 sm:block">{activeModule?.description || 'Secure platform administration'}</p></div>
          </div>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="admin-language">{t.language.label}</label><select id="admin-language" value={language} onChange={(event) => setLanguage(event.target.value as typeof language)} className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold dark:border-white/15 dark:bg-white/5"><option value="sv">{t.language.sv}</option><option value="en">{t.language.en}</option></select><button onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 bg-white text-lg transition hover:border-ask-400 dark:border-white/15 dark:bg-white/5" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>{theme === 'dark' ? '☀' : '☾'}</button>
            <div className="hidden rounded-full bg-ask-50 px-3 py-1.5 text-xs font-semibold text-ask-600 dark:bg-ask-600/20 dark:text-ask-400 sm:block">{user?.roles[0]?.replaceAll('_', ' ') || 'Administrator'}</div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  )
}
