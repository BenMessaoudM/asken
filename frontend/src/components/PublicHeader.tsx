import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import BrandMark from './BrandMark'
import Icon from './Icon'
import LanguageSwitcher from './LanguageSwitcher'

export default function PublicHeader() {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const routeClass = ({ isActive }: { isActive: boolean }) => `rounded-full px-4 py-2 text-sm font-bold transition ${isActive ? 'bg-ask-50 text-ask-600 dark:bg-white/10 dark:text-ask-400' : 'text-ask-ink/70 hover:bg-black/5 hover:text-ask-600 dark:text-white/70 dark:hover:bg-white/10'}`

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#17161C]/85">
      <div className="ask-container flex h-20 items-center justify-between gap-4">
        <Link to="/" aria-label={t('navigation.home')} onClick={() => setMenuOpen(false)}><BrandMark /></Link>
        <nav aria-label={t('navigation.main')} className="hidden items-center gap-1 lg:flex">
          <NavLink className={routeClass} to="/" end>{t('navigation.home')}</NavLink>
          <NavLink className={routeClass} to="/news">{t('news.navigation')}</NavLink>
          <NavLink className={routeClass} to="/events">{t('events.navigation')}</NavLink>
          <a className="rounded-full px-4 py-2 text-sm font-bold text-ask-ink/70 transition hover:bg-black/5 hover:text-ask-600 dark:text-white/70 dark:hover:bg-white/10" href="/#cor">{t('navigation.cor')}</a>
          <a className="rounded-full px-4 py-2 text-sm font-bold text-ask-ink/70 transition hover:bg-black/5 hover:text-ask-600 dark:text-white/70 dark:hover:bg-white/10" href="/#contact">{t('navigation.contact')}</a>
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block"><LanguageSwitcher /></div>
          <a href="/#membership" className="hidden rounded-full bg-ask-600 px-5 py-2.5 text-sm font-bold text-white shadow-glow transition hover:bg-ask-700 md:inline-flex">{t('navigation.join')}</a>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white lg:hidden dark:border-white/15 dark:bg-white/5" aria-label={menuOpen ? t('navigation.close') : t('navigation.open')} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}>
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
      {menuOpen && <nav id="mobile-navigation" aria-label={t('navigation.mobile')} className="border-t border-black/5 bg-white px-4 py-4 dark:border-white/10 dark:bg-[#17161C] lg:hidden">
        <div className="ask-container flex flex-col gap-2 px-0">
          <NavLink className={routeClass} to="/" end onClick={() => setMenuOpen(false)}>{t('navigation.home')}</NavLink>
          <NavLink className={routeClass} to="/news" onClick={() => setMenuOpen(false)}>{t('news.navigation')}</NavLink>
          <NavLink className={routeClass} to="/events" onClick={() => setMenuOpen(false)}>{t('events.navigation')}</NavLink>
          <a className="rounded-full px-4 py-2 text-sm font-bold" href="/#cor" onClick={() => setMenuOpen(false)}>{t('navigation.cor')}</a>
          <a className="rounded-full px-4 py-2 text-sm font-bold" href="/#contact" onClick={() => setMenuOpen(false)}>{t('navigation.contact')}</a>
          <a className="ask-button-primary mt-2" href="/#membership" onClick={() => setMenuOpen(false)}>{t('navigation.join')}</a>
          <div className="mt-2 sm:hidden"><LanguageSwitcher /></div>
        </div>
      </nav>}
    </header>
  )
}
