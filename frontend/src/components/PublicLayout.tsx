import { ReactNode, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PublicFooter from './PublicFooter'
import PublicHeader from './PublicHeader'
import ThemeAnnouncement from './ThemeAnnouncement'

export default function PublicLayout({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  useEffect(() => { document.documentElement.lang = i18n.resolvedLanguage || i18n.language }, [i18n.language, i18n.resolvedLanguage])
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }) }, [location.pathname])
  return <div className="min-h-screen bg-transparent text-ask-ink dark:text-white"><a href="#main-content" className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-full bg-ask-gold px-4 py-2 font-bold text-ask-ink transition focus:translate-y-0">{t('accessibility.skip_to_content')}</a><PublicHeader /><ThemeAnnouncement /><main id="main-content" tabIndex={-1}>{children}</main><PublicFooter /></div>
}
