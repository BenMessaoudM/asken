import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useSiteLocale } from '../hooks/useSiteLocale'
import BrandMark from './BrandMark'
import Icon from './Icon'
import LanguageSwitcher from './LanguageSwitcher'

export default function PublicHeader() {
  const { content } = useSiteLocale()
  const { nav } = content
  const [menuOpen, setMenuOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const location = useLocation()
  const moreRef = useRef<HTMLDivElement>(null)
  const primary = [
    { to: '/about', label: nav.about },
    { to: '/organisation', label: nav.organization },
    { to: '/membership', label: nav.membership },
    { to: '/news', label: nav.news },
    { to: '/events', label: nav.events },
    { to: '/cor-house', label: nav.corHouse },
  ]
  const secondary = [
    { to: '/organisation/styrelsen', label: nav.board },
    { to: '/associations', label: nav.associations },
    { to: '/samarbeten', label: nav.collaborations },
    { to: '/booking', label: nav.booking },
    { to: '/alumner', label: nav.alumni },
    { to: '/contact', label: nav.contact },
  ]
  const routeClass = ({ isActive }: { isActive: boolean }) => `rounded-full px-3 py-2 text-sm font-bold transition ${isActive ? 'bg-ask-50 text-ask-600 dark:bg-white/10 dark:text-ask-400' : 'text-ask-ink/70 hover:bg-black/5 hover:text-ask-600 dark:text-white/70 dark:hover:bg-white/10'}`

  useEffect(() => { setMenuOpen(false); setMoreOpen(false) }, [location.pathname])
  useEffect(() => {
    const close = (event: MouseEvent) => { if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#17161C]/90">
    <div className="ask-container flex h-20 items-center justify-between gap-4">
      <Link to="/" aria-label={nav.home}><BrandMark /></Link>
      <nav aria-label={nav.main} className="hidden items-center gap-1 xl:flex">
        <NavLink className={routeClass} to="/" end>{nav.home}</NavLink>
        {primary.map((item) => <NavLink key={item.to} className={routeClass} to={item.to}>{item.label}</NavLink>)}
        <div className="relative" ref={moreRef}>
          <button type="button" onClick={() => setMoreOpen((open) => !open)} aria-expanded={moreOpen} className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm font-bold transition ${secondary.some((item) => location.pathname.startsWith(item.to)) ? 'bg-ask-50 text-ask-600 dark:bg-white/10 dark:text-ask-400' : 'text-ask-ink/70 hover:bg-black/5 hover:text-ask-600 dark:text-white/70'}`}>{nav.more}<Icon name="chevron" className={`h-4 w-4 rotate-90 transition ${moreOpen ? '-rotate-90' : ''}`} /></button>
          {moreOpen && <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-black/10 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-ask-ink">{secondary.map((item) => <NavLink key={item.to} to={item.to} className={({ isActive }) => `block rounded-xl px-4 py-2.5 text-sm font-semibold ${isActive ? 'bg-ask-50 text-ask-600 dark:bg-white/10 dark:text-ask-400' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}>{item.label}</NavLink>)}</div>}
        </div>
      </nav>
      <div className="flex items-center gap-2">
        <div className="hidden sm:block"><LanguageSwitcher /></div>
        <a href="https://kide.app/" target="_blank" rel="noreferrer" className="hidden rounded-full bg-ask-600 px-5 py-2.5 text-sm font-bold text-white shadow-glow transition hover:bg-ask-700 md:inline-flex">{nav.join}</a>
        <button type="button" className="grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white xl:hidden dark:border-white/15 dark:bg-white/5" aria-label={menuOpen ? nav.close : nav.open} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}><Icon name={menuOpen ? 'close' : 'menu'} /></button>
      </div>
    </div>
    {menuOpen && <nav id="mobile-navigation" aria-label={nav.mobile} className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-black/5 bg-white px-4 py-4 dark:border-white/10 dark:bg-[#17161C] xl:hidden"><div className="ask-container grid gap-1 px-0 sm:grid-cols-2">{[{ to: '/', label: nav.home }, ...primary, ...secondary].map((item) => <NavLink key={item.to} className={routeClass} to={item.to} end={item.to === '/'}>{item.label}</NavLink>)}<a className="ask-button-primary mt-2 sm:col-span-2" href="https://kide.app/" target="_blank" rel="noreferrer">{nav.join}</a><div className="mt-2 sm:hidden"><LanguageSwitcher /></div></div></nav>}
  </header>
}
