import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { activeTheme } from '../themes/api'
import { PublicWebsiteTheme } from '../themes/types'
import { useSiteLocale } from '../hooks/useSiteLocale'

function DuckRow({ theme }: { theme: PublicWebsiteTheme }) {
  if (theme.decorationType !== 'ducks' || !theme.showHeroDecoration) return null
  return <div className={`pointer-events-none absolute inset-y-0 right-4 hidden items-center gap-2 md:flex ${theme.animationEnabled ? 'theme-duck-drift' : ''}`} aria-hidden="true"><span className="theme-duck">●</span><span className="theme-duck scale-75">●</span><span className="theme-duck scale-90">●</span></div>
}
export default function ThemeAnnouncement() {
  const { locale } = useSiteLocale()
  const query = useQuery({ queryKey: ['active-theme', locale], queryFn: activeTheme, staleTime: 60_000, retry: false })
  const theme = query.data?.data.theme
  if (!theme?.showAnnouncementBar || !theme.announcementTitle) return null
  const href = theme.ctaPrimaryUrl || theme.homepageCardUrl
  return <aside className="relative isolate overflow-hidden border-b border-black/5 bg-white dark:border-white/10 dark:bg-ask-ink"><div className="ask-container relative flex flex-col gap-3 py-3 text-sm md:flex-row md:items-center md:justify-between"><div className="relative z-10"><p className="font-black text-ask-600 dark:text-ask-400">{theme.announcementTitle}</p>{theme.announcementText && <p className="text-black/65 dark:text-white/65">{theme.announcementText}</p>}</div>{href && theme.ctaPrimaryLabel && <Link className="ask-button-secondary relative z-10 min-h-10 px-4 py-2 text-sm" to={href}>{theme.ctaPrimaryLabel}</Link>}<DuckRow theme={theme} /></div></aside>
}
export function ThemeHomepageCard() {
  const { locale } = useSiteLocale()
  const query = useQuery({ queryKey: ['active-theme', locale], queryFn: activeTheme, staleTime: 60_000, retry: false })
  const theme = query.data?.data.theme
  if (!theme?.showOnHomepage) return null
  const title = theme.homepageCardTitle || theme.heroTitle || theme.announcementTitle
  const body = theme.homepageCardText || theme.heroText || theme.announcementText
  const href = theme.homepageCardUrl || theme.ctaPrimaryUrl
  return <section className="ask-container pt-8"><div className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/[0.055] sm:p-8"><div className="absolute right-0 top-0 h-40 w-40 rounded-full opacity-25 blur-3xl" style={{ backgroundColor: theme.accentColor || '#E0C13D' }} /><div className="relative max-w-3xl"><p className="ask-eyebrow">{theme.name}</p><h2 className="mt-2 text-3xl font-black">{title}</h2>{body && <p className="mt-3 text-black/65 dark:text-white/65">{body}</p>}{href && theme.ctaPrimaryLabel && <Link className="ask-button-primary mt-5" to={href}>{theme.ctaPrimaryLabel}</Link>}</div>{theme.decorationType === 'ducks' && <div className="absolute bottom-4 right-6 flex gap-2" aria-hidden="true"><span className="theme-duck">●</span><span className="theme-duck scale-75">●</span></div>}</div></section>
}
