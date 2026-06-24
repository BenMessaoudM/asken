import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Icon from '../components/Icon'
import PublicLayout from '../components/PublicLayout'

export default function NotFound() {
  const { t } = useTranslation()
  useEffect(() => { document.title = `${t('not_found.title')} | ${t('organization_name')}` }, [t])

  return (
    <PublicLayout>
      <section className="ask-container grid min-h-[65vh] place-items-center py-16 text-center">
        <div className="max-w-2xl">
          <p className="text-8xl font-black tracking-tighter text-ask-600/15 dark:text-ask-400/20">404</p>
          <p className="ask-eyebrow -mt-6">{t('not_found.eyebrow')}</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">{t('not_found.title')}</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-black/60 dark:text-white/60">{t('not_found.description')}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link className="ask-button-primary" to="/">{t('not_found.home')}<Icon name="arrow" /></Link>
            <Link className="ask-button-secondary" to="/events">{t('not_found.events')}</Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
