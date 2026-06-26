import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Icon from '../components/Icon'
import PublicLayout from '../components/PublicLayout'
import { usePageMetadata } from '../hooks/usePageMetadata'
import { getEvent } from '../events/api'
import { EventLocale, PublicEvent } from '../events/types'
import { formatDateTime } from '../utils/dateTime'

export default function EventDetail() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const locale = (i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'sv') as EventLocale
  const [event, setEvent] = useState<PublicEvent | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return
    setEvent(null)
    setError('')
    void getEvent(slug, locale).then((result) => setEvent(result.data.event)).catch(() => setError(t('events.error')))
  }, [slug, locale, t])
  usePageMetadata(event?.title || t('events.title'), event?.description || t('events.intro'), `/events/${slug || ''}`)

  return (
    <PublicLayout>
      <article className="ask-container max-w-5xl py-12 sm:py-16">
        <Link to="/events" className="inline-flex items-center gap-2 font-bold text-ask-600 dark:text-ask-400"><Icon name="arrow" className="h-4 w-4 rotate-180" />{t('events.back')}</Link>
        {error && <p role="alert" className="mt-8 rounded-2xl bg-red-50 p-4 text-red-800 dark:bg-red-500/10 dark:text-red-200">{error}</p>}
        {!event && !error && <p className="mt-8" aria-live="polite">{t('events.loading')}</p>}
        {event && <div className="mt-10">
          <p className="ask-eyebrow">{event.category.label}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">{event.title}</h1>
          {event.eventStatus !== 'scheduled' && <strong className="mt-5 inline-flex rounded-full bg-red-100 px-4 py-2 text-red-800 dark:bg-red-500/15 dark:text-red-200">{t(`events.${event.eventStatus}`)}</strong>}
          {event.imageUrl && <img src={event.imageUrl} alt={event.imageAlt || ''} className="mt-10 max-h-[38rem] w-full rounded-[2rem] object-cover shadow-soft" />}
          <dl className="ask-card mt-8 grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <div><dt className="text-xs font-bold uppercase tracking-wider text-black/45 dark:text-white/45">{t('events.location')}</dt><dd className="mt-2 font-black">{event.location}</dd></div>
            <div><dt className="text-xs font-bold uppercase tracking-wider text-black/45 dark:text-white/45">{t('events.organizer')}</dt><dd className="mt-2 font-black">{event.organizer}</dd></div>
            <div><dt className="text-xs font-bold uppercase tracking-wider text-black/45 dark:text-white/45">{t('events.start')}</dt><dd className="mt-2 font-black">{formatDateTime(event.startAt)}</dd></div>
            <div><dt className="text-xs font-bold uppercase tracking-wider text-black/45 dark:text-white/45">{t('events.end')}</dt><dd className="mt-2 font-black">{formatDateTime(event.endAt)}</dd></div>
          </dl>
          <div className="mx-auto mt-10 max-w-3xl whitespace-pre-line text-lg leading-8">{event.description}</div>
          {event.kideAppUrl && <div className="mx-auto mt-10 max-w-3xl"><a href={event.kideAppUrl} rel="noreferrer" target="_blank" className="ask-button-primary">{t('events.tickets')}<Icon name="arrow" /></a></div>}
        </div>}
      </article>
    </PublicLayout>
  )
}
