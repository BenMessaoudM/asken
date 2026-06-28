import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import DashboardIcon from '../components/DashboardIcon'
import { dashboardModules, visibleDashboardModules } from '../dashboard/navigation'
import { useAdminLocale } from '../localization/AdminLocaleContext'

export default function Management() {
  const { user } = useAuth()
  const { t } = useAdminLocale()
  const modules = visibleDashboardModules(dashboardModules, user?.permissions || []).filter((module) => module.path !== '/')
  return (
    <section className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-ask-ink p-6 text-white shadow-2xl sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-ask-600/35 blur-3xl" />
        <div className="absolute -bottom-24 right-28 h-52 w-52 rounded-full bg-ask-gold/15 blur-3xl" />
        <div className="relative"><p className="text-sm font-semibold text-ask-400">{t.nav.overview}</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{t.dashboard.title}, {user?.name.split(' ')[0]}</h1><p className="mt-3 max-w-2xl text-white/60">{t.dashboard.intro}</p></div>
      </div>
      <div><div className="mb-4 flex items-end justify-between"><div><h2 className="text-xl font-bold">{t.dashboard.modules}</h2><p className="mt-1 text-sm text-gray-500 dark:text-white/45">{t.dashboard.moduleHelp}</p></div><span className="rounded-full bg-ask-50 px-3 py-1 text-xs font-bold text-ask-600 dark:bg-ask-600/20 dark:text-ask-400">{modules.length} {t.dashboard.available}</span></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{modules.map((module) => <Link key={module.path} to={module.path} className="group rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-ask-400/50 hover:shadow-lg dark:border-white/10 dark:bg-white/5"><div className="flex items-start justify-between"><div className="grid h-11 w-11 place-items-center rounded-xl bg-ask-50 text-ask-600 transition group-hover:bg-ask-600 group-hover:text-white dark:bg-ask-600/20 dark:text-ask-400"><DashboardIcon name={module.icon} className="h-5 w-5" /></div><span className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-ask-600 dark:text-white/20">→</span></div><h3 className="mt-4 font-bold">{t.nav[module.navKey as keyof typeof t.nav]}</h3><p className="mt-1 text-sm leading-5 text-gray-500 dark:text-white/45">{module.description}</p></Link>)}</div>
      </div>
    </section>
  )
}
