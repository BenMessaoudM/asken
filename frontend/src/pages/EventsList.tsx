import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { resolvePublicLanguage } from '../localization/languages'
import Icon from '../components/Icon'
import { formatDateTime } from '../utils/dateTime'
import EventCard from '../components/EventCard'
import { usePageMetadata } from '../hooks/usePageMetadata'
import PublicLayout from '../components/PublicLayout'
import { listEventCategories, listEvents } from '../events/api'
import { EventCategory, EventLocale, PublicEvent } from '../events/types'

export default function EventsList() {
  const { t, i18n } = useTranslation()
  const locale = resolvePublicLanguage(i18n.resolvedLanguage) as EventLocale
  const [events, setEvents] = useState<PublicEvent[]>([])
  const [categories, setCategories] = useState<EventCategory[]>([])
  const [category, setCategory] = useState('')
  const [period, setPeriod] = useState('upcoming')
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    void Promise.all([listEvents({ locale, search, category, period }), listEventCategories()])
      .then(([eventResult, categoryResult]) => { setEvents(eventResult.data.events); setCategories(categoryResult.data.categories) })
      .catch(() => setError(t('events.error')))
      .finally(() => setLoading(false))
  }, [locale, search, category, period, t])

  usePageMetadata(t('events.title'), t('events.intro'), '/events')
  const featured = useMemo(() => events.find((event) => event.featured), [events])
  const submit = (event: FormEvent) => { event.preventDefault(); setSearch(input.trim()) }

  return (
    <PublicLayout>
      <section className="ask-container py-12 sm:py-16">
        <p className="ask-eyebrow">{t('home.events.eyebrow')}</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">{t('events.title')}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-black/60 dark:text-white/60">{t('events.intro')}</p>
        <form onSubmit={submit} className="ask-card mt-8 grid gap-3 p-4 md:grid-cols-4">
          <label className="sr-only" htmlFor="event-search">{t('events.search')}</label>
          <input id="event-search" value={input} onChange={(event) => setInput(event.target.value)} placeholder={t('events.search_placeholder')} className="min-h-12 rounded-2xl border border-black/10 bg-transparent px-4 dark:border-white/15" />
          <label className="sr-only" htmlFor="event-category">{t('events.all_categories')}</label>
          <select id="event-category" value={category} onChange={(event) => setCategory(event.target.value)} className="min-h-12 rounded-2xl border border-black/10 bg-transparent px-4 dark:border-white/15"><option value="">{t('events.all_categories')}</option>{categories.map((item) => <option key={item.id} value={item.slug}>{item.labels[locale]}</option>)}</select>
          <label className="sr-only" htmlFor="event-period">{t('events.upcoming')}</label>
          <select id="event-period" value={period} onChange={(event) => setPeriod(event.target.value)} className="min-h-12 rounded-2xl border border-black/10 bg-transparent px-4 dark:border-white/15"><option value="upcoming">{t('events.upcoming')}</option><option value="past">{t('events.past')}</option></select>
          <button className="ask-button-primary"><Icon name="calendar" className="h-4 w-4" />{t('events.search')}</button>
        </form>

        {loading && <p className="mt-10" aria-live="polite">{t('events.loading')}</p>}
        {error && <p role="alert" className="mt-10 rounded-2xl bg-red-50 p-4 text-red-800 dark:bg-red-500/10 dark:text-red-200">{error}</p>}
        {!loading && !error && <>
          {featured && <article className="mt-10 overflow-hidden rounded-[2rem] bg-ask-mesh text-white shadow-2xl lg:grid lg:grid-cols-2">
            {featured.imageUrl ? <img src={featured.imageUrl} alt={featured.imageAlt || ''} className="h-full min-h-72 w-full object-cover" /> : <div className="grid min-h-72 place-items-center bg-white/5"><Icon name="calendar" className="h-16 w-16 text-ask-400" /></div>}
            <div className="flex flex-col justify-center p-8 sm:p-10"><p className="font-bold text-ask-gold">{t('events.featured')}</p><h2 className="mt-3 text-3xl font-black sm:text-4xl"><Link to={`/events/${featured.slug}`}>{featured.title}</Link></h2><p className="mt-4 text-lg text-white/70">{featured.location} · {formatDateTime(featured.startAt)}</p><Link to={`/events/${featured.slug}`} className="mt-7 inline-flex items-center gap-2 font-bold text-ask-gold">{t('events.title')}<Icon name="arrow" /></Link></div>
          </article>}
          <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.filter((event) => event.id !== featured?.id).map((event) => <EventCard key={event.id} event={event} locale={locale} />)}
          </section>
          {events.length === 0 && <p className="ask-card mt-10 p-8 text-center text-black/55 dark:text-white/55">{t('events.empty')}</p>}
        </>}
      </section>
    </PublicLayout>
  )
}
