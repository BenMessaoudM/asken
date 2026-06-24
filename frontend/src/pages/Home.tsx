import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Icon from '../components/Icon'
import PublicLayout from '../components/PublicLayout'
import SectionHeading from '../components/SectionHeading'
import { homepageSections } from '../content/homepageSections'
import { listEvents } from '../events/api'
import { EventLocale, PublicEvent } from '../events/types'
import { listNews } from '../news/api'
import { NewsLocale, PublicNewsArticle } from '../news/types'

function LoadingCards() {
  return <div className="grid gap-5 md:grid-cols-3" aria-hidden="true">{[0, 1, 2].map((item) => <div key={item} className="ask-card h-72 animate-pulse bg-black/5 dark:bg-white/5" />)}</div>
}

export default function Home() {
  const { t, i18n } = useTranslation()
  const locale = (i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'sv') as NewsLocale & EventLocale
  const [news, setNews] = useState<PublicNewsArticle[]>([])
  const [events, setEvents] = useState<PublicEvent[]>([])
  const [newsState, setNewsState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [eventState, setEventState] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    document.title = t('metadata.title')
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('metadata.description'))
  }, [t, locale])

  useEffect(() => {
    setNewsState('loading')
    setEventState('loading')
    void listNews({ locale, limit: 3 })
      .then((result) => { setNews(result.data.articles.slice(0, 3)); setNewsState('ready') })
      .catch(() => setNewsState('error'))
    void listEvents({ locale, period: 'upcoming', limit: 3 })
      .then((result) => { setEvents(result.data.events.slice(0, 3)); setEventState('ready') })
      .catch(() => setEventState('error'))
  }, [locale])

  return (
    <PublicLayout>
      <section id={homepageSections.hero.id} className="ask-container py-6 sm:py-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-ask-mesh px-5 py-12 text-white shadow-2xl sm:px-10 sm:py-16 lg:grid lg:min-h-[36rem] lg:grid-cols-[1.2fr_.8fr] lg:items-center lg:gap-10 lg:px-16">
          <div className="absolute -right-28 -top-24 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-ask-400/15 blur-3xl" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
              <Icon name="sparkles" className="h-4 w-4 text-ask-gold" />
              {t('home.hero.eyebrow')}
            </div>
            <h1 className="mt-7 text-4xl font-black leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl">{t('home.hero.title')}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72 sm:text-xl">{t('home.hero.description')}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#membership" className="ask-button-primary bg-ask-gold text-ask-ink shadow-none hover:bg-[#ecd65f]">{t('home.hero.primary')}</a>
              <Link to="/events" className="ask-button-secondary border-white/20 bg-white/10 text-white hover:border-white/35 hover:bg-white/15">{t('home.hero.secondary')}<Icon name="arrow" /></Link>
            </div>
          </div>
          <div className="relative mt-10 grid gap-3 lg:mt-0">
            {(['community', 'events', 'voice'] as const).map((item, index) => (
              <div key={item} className={`rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md ${index === 1 ? 'lg:translate-x-8' : ''}`}>
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10 text-ask-gold"><Icon name={item === 'events' ? 'calendar' : item === 'community' ? 'users' : 'heart'} /></span>
                  <div><p className="font-bold">{t(`home.hero.points.${item}.title`)}</p><p className="mt-1 text-sm leading-6 text-white/60">{t(`home.hero.points.${item}.description`)}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id={homepageSections.latestNews.id} className="ask-container py-16 sm:py-24">
        <SectionHeading eyebrow={t('home.news.eyebrow')} title={t('home.news.title')} description={t('home.news.description')} action={<Link className="ask-button-secondary" to="/news">{t('home.news.all')}<Icon name="arrow" /></Link>} />
        <div className="mt-9">
          {newsState === 'loading' && <LoadingCards />}
          {newsState === 'error' && <div className="ask-card p-8 text-center"><p>{t('home.news.error')}</p><Link className="mt-4 inline-flex font-bold text-ask-600" to="/news">{t('home.news.all')}</Link></div>}
          {newsState === 'ready' && news.length === 0 && <div className="ask-card p-8 text-center text-black/60 dark:text-white/60">{t('home.news.empty')}</div>}
          {newsState === 'ready' && news.length > 0 && <div className="grid gap-5 md:grid-cols-3">{news.map((article) => (
            <article key={article.id} className="ask-card ask-card-hover group overflow-hidden">
              {article.imageUrl ? <img src={article.imageUrl} alt={article.imageAlt || ''} className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.03]" /> : <div className="grid h-48 place-items-center bg-gradient-to-br from-ask-50 to-ask-400/25 text-ask-600 dark:from-ask-600/25 dark:to-ask-ink"><Icon name="news" className="h-10 w-10" /></div>}
              <div className="p-6">
                <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-wider text-ask-600 dark:text-ask-400"><span>{article.categories[0]?.label || t('news.title')}</span><time>{new Date(article.publishedAt).toLocaleDateString(locale)}</time></div>
                <h3 className="mt-3 text-xl font-black leading-tight"><Link to={`/news/${article.slug}`} className="after:absolute">{article.title}</Link></h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/60 dark:text-white/60">{article.summary}</p>
                <Link to={`/news/${article.slug}`} className="mt-5 inline-flex items-center gap-2 font-bold text-ask-600 dark:text-ask-400">{t('news.read_more')}<Icon name="arrow" className="h-4 w-4" /></Link>
              </div>
            </article>
          ))}</div>}
        </div>
      </section>

      <section id={homepageSections.upcomingEvents.id} className="bg-ask-ink py-16 text-white sm:py-24">
        <div className="ask-container">
          <SectionHeading eyebrow={t('home.events.eyebrow')} title={t('home.events.title')} description={t('home.events.description')} action={<Link className="ask-button-secondary border-white/15 bg-white/10 text-white hover:bg-white/15" to="/events">{t('home.events.all')}<Icon name="arrow" /></Link>} />
          <div className="mt-9">
            {eventState === 'loading' && <LoadingCards />}
            {eventState === 'error' && <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center"><p>{t('home.events.error')}</p><Link className="mt-4 inline-flex font-bold text-ask-400" to="/events">{t('home.events.all')}</Link></div>}
            {eventState === 'ready' && events.length === 0 && <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/60">{t('home.events.empty')}</div>}
            {eventState === 'ready' && events.length > 0 && <div className="grid gap-5 md:grid-cols-3">{events.map((event) => {
              const start = new Date(event.startAt)
              return <article key={event.id} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] transition hover:-translate-y-1 hover:border-ask-400/50">
                {event.imageUrl && <img src={event.imageUrl} alt={event.imageAlt || ''} className="h-44 w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.03]" />}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="grid w-14 shrink-0 place-items-center rounded-2xl bg-ask-gold px-2 py-3 text-center text-ask-ink"><span className="text-xs font-black uppercase">{start.toLocaleDateString(locale, { month: 'short' })}</span><span className="text-2xl font-black leading-none">{start.getDate()}</span></div>
                    <div><p className="text-xs font-bold uppercase tracking-wider text-ask-400">{event.category.label}</p><h3 className="mt-2 text-xl font-black leading-tight"><Link to={`/events/${event.slug}`}>{event.title}</Link></h3></div>
                  </div>
                  <p className="mt-5 text-sm text-white/60">{start.toLocaleString(locale, { weekday: 'short', hour: '2-digit', minute: '2-digit' })} · {event.location}</p>
                </div>
              </article>
            })}</div>}
          </div>
        </div>
      </section>

      <section className="ask-container grid gap-6 py-16 sm:py-24 lg:grid-cols-2">
        <article id={homepageSections.cor.id} className="ask-card relative overflow-hidden p-7 sm:p-9">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-ask-gold/20 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-ask-gold/20 px-3 py-1.5 text-xs font-black uppercase tracking-wider"><Icon name="sparkles" className="h-4 w-4" />{t('home.preview')}</span>
            <p className="ask-eyebrow mt-7">{t('home.cor.eyebrow')}</p>
            <h2 className="mt-3 text-3xl font-black">{t('home.cor.title')}</h2>
            <p className="mt-4 max-w-lg leading-7 text-black/60 dark:text-white/60">{t('home.cor.description')}</p>
            <Link className="mt-7 inline-flex items-center gap-2 font-bold text-ask-600 dark:text-ask-400" to="/events">{t('home.cor.action')}<Icon name="arrow" /></Link>
          </div>
        </article>
        <article id={homepageSections.collaborations.id} className="ask-card relative overflow-hidden bg-ask-50 p-7 dark:bg-ask-600/15 sm:p-9">
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-ask-600 dark:bg-white/10 dark:text-ask-400"><Icon name="users" className="h-4 w-4" />{t('home.preview')}</span>
            <p className="ask-eyebrow mt-7">{t('home.collaborations.eyebrow')}</p>
            <h2 className="mt-3 text-3xl font-black">{t('home.collaborations.title')}</h2>
            <p className="mt-4 max-w-lg leading-7 text-black/60 dark:text-white/60">{t('home.collaborations.description')}</p>
            <a className="mt-7 inline-flex items-center gap-2 font-bold text-ask-600 dark:text-ask-400" href="#contact">{t('home.collaborations.action')}<Icon name="arrow" /></a>
          </div>
        </article>
      </section>

      <section id={homepageSections.membership.id} className="ask-container pb-16 sm:pb-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-ask-600 p-7 text-white shadow-glow sm:p-12 lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-ask-gold/25 blur-3xl" />
          <div className="relative max-w-3xl"><p className="text-sm font-black uppercase tracking-[0.18em] text-ask-gold">{t('home.membership.eyebrow')}</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">{t('home.membership.title')}</h2><p className="mt-4 max-w-2xl text-lg leading-8 text-white/75">{t('home.membership.description')}</p></div>
          <a className="ask-button-secondary relative mt-7 shrink-0 border-white/20 bg-white text-ask-ink hover:bg-ask-50 lg:mt-0" href="https://kide.app/" target="_blank" rel="noreferrer">{t('home.membership.action')}<Icon name="arrow" /></a>
        </div>
      </section>

      <section id={homepageSections.contact.id} className="border-t border-black/5 bg-white py-16 dark:border-white/10 dark:bg-white/[0.025] sm:py-24">
        <div className="ask-container">
          <SectionHeading eyebrow={t('contact.eyebrow')} title={t('contact.title')} description={t('contact.description')} />
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            <a href="mailto:info@asken.fi" className="ask-card ask-card-hover p-6"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-ask-50 text-ask-600 dark:bg-ask-600/20 dark:text-ask-400"><Icon name="mail" /></span><h3 className="mt-5 font-black">{t('contact.general')}</h3><p className="mt-2 text-sm text-black/55 dark:text-white/55">info@asken.fi</p></a>
            <a href="https://www.instagram.com/askenfi/" target="_blank" rel="noreferrer" className="ask-card ask-card-hover p-6"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-ask-50 text-ask-600 dark:bg-ask-600/20 dark:text-ask-400"><Icon name="instagram" /></span><h3 className="mt-5 font-black">{t('contact.instagram')}</h3><p className="mt-2 text-sm text-black/55 dark:text-white/55">@askenfi</p></a>
            <div className="ask-card p-6"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-ask-50 text-ask-600 dark:bg-ask-600/20 dark:text-ask-400"><Icon name="map" /></span><h3 className="mt-5 font-black">{t('contact.visit')}</h3><p className="mt-2 text-sm leading-6 text-black/55 dark:text-white/55">{t('contact.location')}</p></div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
