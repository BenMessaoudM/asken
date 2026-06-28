import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import CmsSections from '../components/CmsSections'
import EventCard from '../components/EventCard'
import Icon from '../components/Icon'
import NewsCard from '../components/NewsCard'
import PageHero from '../components/PageHero'
import PublicLayout from '../components/PublicLayout'
import SectionHeading from '../components/SectionHeading'
import SmartLink from '../components/SmartLink'
import { ThemeHomepageCard } from '../components/ThemeAnnouncement'
import { useCmsPage } from '../cms/useCmsPage'
import { listEvents } from '../events/api'
import { EventLocale } from '../events/types'
import { usePageMetadata } from '../hooks/usePageMetadata'
import { useSiteLocale } from '../hooks/useSiteLocale'
import { listNews } from '../news/api'
import { NewsLocale } from '../news/types'

function text(data: Record<string, unknown> | undefined, key: string) { return typeof data?.[key] === 'string' ? data[key] as string : undefined }
function LoadingCards() { return <div className="grid gap-5 md:grid-cols-3" aria-hidden="true">{[0, 1, 2].map((item) => <div key={item} className="ask-card h-72 animate-pulse bg-black/5 dark:bg-white/5" />)}</div> }

export default function Home() {
  const { locale, content } = useSiteLocale()
  const copy = content.home
  const { page, error: cmsError } = useCmsPage('home', locale)
  const hero = page?.sections.find((section) => section.type === 'hero')
  const managedText = page?.sections.filter((section) => section.type === 'text') || []
  const extraSections = page?.sections.filter((section) => section.type !== 'hero' && section.type !== 'text') || []
  const newsQuery = useQuery({ queryKey: ['news', 'home', locale], queryFn: () => listNews({ locale: locale as NewsLocale, limit: 3 }), staleTime: 60_000 })
  const eventQuery = useQuery({ queryKey: ['events', 'home', locale], queryFn: () => listEvents({ locale: locale as EventLocale, period: 'upcoming', limit: 3 }), staleTime: 60_000 })
  const news = newsQuery.data?.data.articles.slice(0, 3) || []
  const events = eventQuery.data?.data.events.slice(0, 3) || []
  usePageMetadata(copy.metaTitle, copy.metaDescription, '/')

  const aboutTitle = text(managedText[0]?.data, 'heading') || copy.about.title
  const aboutBody = text(managedText[0]?.data, 'body') || copy.about.body
  const benefitsTitle = text(managedText[1]?.data, 'heading') || copy.benefits.title
  const benefitsBody = text(managedText[1]?.data, 'body') || copy.benefits.description

  return <PublicLayout>
    <PageHero
      eyebrow={copy.hero.eyebrow}
      title={text(hero?.data, 'heading') || copy.hero.title}
      description={text(hero?.data, 'subheading') || copy.hero.description}
      imageUrl={text(hero?.data, 'imageUrl')}
      action={{ label: text(hero?.data, 'ctaLabel') || copy.hero.primary, href: text(hero?.data, 'ctaUrl') || 'https://kide.app/' }}
      secondaryAction={{ label: copy.hero.secondary, href: '/events' }}
    />

    <ThemeHomepageCard />

    {cmsError && <div className="ask-container pt-6"><p role="status" className="rounded-2xl bg-amber-50 p-4 text-amber-900 dark:bg-amber-400/10 dark:text-amber-100">{content.common.cmsUnavailable}</p></div>}

    <section className="ask-container py-16 sm:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
        <div className="relative min-h-80 overflow-hidden rounded-[2rem] bg-ask-50 dark:bg-ask-600/15" aria-hidden="true">
          <div className="absolute -left-12 top-12 h-48 w-48 rounded-full bg-ask-400/35 blur-2xl" />
          <div className="absolute bottom-8 right-8 grid h-56 w-56 place-items-center rounded-[3rem] bg-ask-600 text-7xl font-black text-white shadow-glow">ASK</div>
          <div className="absolute left-10 top-10 h-24 w-24 rounded-3xl bg-ask-gold" />
        </div>
        <div><p className="ask-eyebrow">{copy.about.eyebrow}</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{aboutTitle}</h2><p className="mt-5 text-lg leading-8 text-black/65 dark:text-white/65">{aboutBody}</p><Link className="mt-7 inline-flex items-center gap-2 font-bold text-ask-600 dark:text-ask-400" to="/about">{copy.about.action}<Icon name="arrow" /></Link></div>
      </div>
    </section>

    <section className="border-y border-black/5 bg-white py-16 dark:border-white/10 dark:bg-white/[0.025] sm:py-24">
      <div className="ask-container">
        <SectionHeading eyebrow={copy.benefits.eyebrow} title={benefitsTitle} description={benefitsBody} />
        <div className="mt-9 grid gap-5 md:grid-cols-3">{copy.benefits.items.map((item, index) => <article key={item.title} className="ask-card p-6 sm:p-8"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-ask-50 text-ask-600 dark:bg-ask-600/20 dark:text-ask-400"><Icon name={index === 0 ? 'heart' : index === 1 ? 'users' : 'sparkles'} /></span><h3 className="mt-5 text-xl font-black">{item.title}</h3><p className="mt-3 leading-7 text-black/60 dark:text-white/60">{item.body}</p></article>)}</div>
      </div>
    </section>

    <section className="ask-container py-16 sm:py-24">
      <SectionHeading eyebrow={copy.news.eyebrow} title={copy.news.title} description={copy.news.description} action={<Link className="ask-button-secondary" to="/news">{copy.news.all}<Icon name="arrow" /></Link>} />
      <div className="mt-9">{newsQuery.isLoading ? <LoadingCards /> : newsQuery.isError ? <div className="ask-card p-8 text-center">{copy.news.error}</div> : news.length === 0 ? <div className="ask-card p-8 text-center text-black/60 dark:text-white/60">{copy.news.empty}</div> : <div className="grid gap-5 md:grid-cols-3">{news.map((article) => <NewsCard key={article.id} article={article} locale={locale} readMore={content.common.readMore} />)}</div>}</div>
    </section>

    <section className="bg-ask-ink py-16 text-white sm:py-24">
      <div className="ask-container"><SectionHeading eyebrow={copy.events.eyebrow} title={copy.events.title} description={copy.events.description} action={<Link className="ask-button-secondary border-white/15 bg-white/10 text-white hover:bg-white/15" to="/events">{copy.events.all}<Icon name="arrow" /></Link>} /><div className="mt-9">{eventQuery.isLoading ? <LoadingCards /> : eventQuery.isError ? <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">{copy.events.error}</div> : events.length === 0 ? <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/60">{copy.events.empty}</div> : <div className="grid gap-5 md:grid-cols-3">{events.map((event) => <EventCard key={event.id} event={event} locale={locale} dark />)}</div>}</div></div>
    </section>

    <section className="ask-container grid gap-6 py-16 sm:py-24 lg:grid-cols-2">
      <article className="ask-card ask-card-hover relative overflow-hidden p-7 sm:p-9"><div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-ask-gold/20 blur-3xl" /><div className="relative"><p className="ask-eyebrow">{copy.associations.eyebrow}</p><h2 className="mt-3 text-3xl font-black">{copy.associations.title}</h2><p className="mt-4 max-w-lg leading-7 text-black/60 dark:text-white/60">{copy.associations.body}</p><Link className="mt-7 inline-flex items-center gap-2 font-bold text-ask-600 dark:text-ask-400" to="/associations">{copy.associations.action}<Icon name="arrow" /></Link></div></article>
      <article className="ask-card ask-card-hover relative overflow-hidden bg-ask-50 p-7 dark:bg-ask-600/15 sm:p-9"><div className="relative"><p className="ask-eyebrow">{copy.cor.eyebrow}</p><h2 className="mt-3 text-3xl font-black">{copy.cor.title}</h2><p className="mt-4 max-w-lg leading-7 text-black/60 dark:text-white/60">{copy.cor.body}</p><Link className="mt-7 inline-flex items-center gap-2 font-bold text-ask-600 dark:text-ask-400" to="/cor-house">{copy.cor.action}<Icon name="arrow" /></Link></div></article>
    </section>

    {extraSections.length > 0 && <section className="ask-container pb-16 sm:pb-24"><CmsSections sections={extraSections} /></section>}

    <section className="ask-container pb-16 sm:pb-24"><div className="relative overflow-hidden rounded-[2rem] bg-ask-600 p-7 text-white shadow-glow sm:p-12 lg:flex lg:items-center lg:justify-between lg:gap-12"><div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-ask-gold/25 blur-3xl" /><div className="relative max-w-3xl"><p className="text-sm font-black uppercase tracking-[0.18em] text-ask-gold">{copy.membership.eyebrow}</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">{copy.membership.title}</h2><p className="mt-4 max-w-2xl text-lg leading-8 text-white/75">{copy.membership.body}</p></div><SmartLink className="ask-button-secondary relative mt-7 shrink-0 border-white/20 bg-white text-ask-ink hover:bg-ask-50 lg:mt-0" href="https://kide.app/" external>{copy.membership.action}<Icon name="arrow" /></SmartLink></div></section>

    <section className="border-t border-black/5 bg-white py-16 dark:border-white/10 dark:bg-white/[0.025] sm:py-24"><div className="ask-container"><SectionHeading eyebrow={content.contact.eyebrow} title={content.contact.title} description={content.contact.intro} action={<Link className="ask-button-secondary" to="/contact">{content.nav.contact}<Icon name="arrow" /></Link>} /><div className="mt-9 grid gap-5 md:grid-cols-3"><a href="mailto:info@asken.fi" className="ask-card ask-card-hover p-6"><Icon name="mail" className="h-7 w-7 text-ask-600" /><h3 className="mt-5 font-black">{content.contact.general}</h3><p className="mt-2 text-sm text-black/55 dark:text-white/55">info@asken.fi</p></a><a href="mailto:hello@asken.fi" className="ask-card ask-card-hover p-6"><Icon name="heart" className="h-7 w-7 text-ask-600" /><h3 className="mt-5 font-black">{content.contact.support}</h3><p className="mt-2 text-sm text-black/55 dark:text-white/55">hello@asken.fi</p></a><div className="ask-card p-6"><Icon name="map" className="h-7 w-7 text-ask-600" /><h3 className="mt-5 font-black">{content.contact.visit}</h3><p className="mt-2 text-sm leading-6 text-black/55 dark:text-white/55">{content.contact.location}</p></div></div></div></section>
  </PublicLayout>
}
