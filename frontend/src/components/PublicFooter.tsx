import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import BrandMark from './BrandMark'
import Icon from './Icon'

export default function PublicFooter() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-black/5 bg-white dark:border-white/10 dark:bg-ask-ink">
      <div className="ask-container grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" aria-label={t('navigation.home')}><BrandMark /></Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-black/60 dark:text-white/60">{t('footer.description')}</p>
        </div>
        <div>
          <h2 className="font-bold">{t('footer.explore')}</h2>
          <ul className="mt-4 space-y-3 text-sm text-black/65 dark:text-white/65">
            <li><Link className="hover:text-ask-600" to="/news">{t('news.navigation')}</Link></li>
            <li><Link className="hover:text-ask-600" to="/events">{t('events.navigation')}</Link></li>
            <li><a className="hover:text-ask-600" href="/#membership">{t('navigation.membership')}</a></li>
            <li><a className="hover:text-ask-600" href="/#contact">{t('navigation.contact')}</a></li>
          </ul>
        </div>
        <div>
          <h2 className="font-bold">{t('footer.contact')}</h2>
          <ul className="mt-4 space-y-3 text-sm text-black/65 dark:text-white/65">
            <li><a className="flex items-center gap-2 hover:text-ask-600" href="mailto:info@asken.fi"><Icon name="mail" className="h-4 w-4" />info@asken.fi</a></li>
            <li><a className="flex items-center gap-2 hover:text-ask-600" href="https://www.instagram.com/askenfi/" target="_blank" rel="noreferrer"><Icon name="instagram" className="h-4 w-4" />@askenfi</a></li>
            <li className="flex items-start gap-2"><Icon name="map" className="mt-0.5 h-4 w-4 shrink-0" /><span>{t('contact.location')}</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-black/5 dark:border-white/10">
        <div className="ask-container flex flex-col gap-2 py-5 text-xs text-black/50 dark:text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {t('organization_name')}</p>
          <a className="hover:text-ask-600" href="mailto:hello@asken.fi">{t('footer.harassment')}: hello@asken.fi</a>
        </div>
      </div>
    </footer>
  )
}
