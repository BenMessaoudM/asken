import CmsSections from '../components/CmsSections'
import Icon from '../components/Icon'
import PageHero from '../components/PageHero'
import PublicLayout from '../components/PublicLayout'
import { useCmsPage } from '../cms/useCmsPage'
import { usePageMetadata } from '../hooks/usePageMetadata'
import { useSiteLocale } from '../hooks/useSiteLocale'

export default function Contact() {
  const { locale, content } = useSiteLocale()
  const { page, error } = useCmsPage('contact', locale)
  const copy = content.contact
  usePageMetadata(page?.title || copy.title, copy.metaDescription, '/contact')

  return <PublicLayout>
    <PageHero compact eyebrow={copy.eyebrow} title={page?.title || copy.title} description={copy.intro} />
    <div className="ask-container py-14 sm:py-20">
      {error && <p role="status" className="mb-6 rounded-2xl bg-amber-50 p-4 text-amber-900 dark:bg-amber-400/10 dark:text-amber-100">{content.common.cmsUnavailable}</p>}
      {page && <div className="mb-10"><CmsSections sections={page.sections.filter((section) => section.type !== 'hero')} /></div>}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <a href="mailto:info@asken.fi" className="ask-card ask-card-hover p-6"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-ask-50 text-ask-600 dark:bg-ask-600/20 dark:text-ask-400"><Icon name="mail" /></span><h2 className="mt-5 font-black">{copy.general}</h2><p className="mt-2 text-sm text-black/55 dark:text-white/55">info@asken.fi</p></a>
        <a href="mailto:hello@asken.fi" className="ask-card ask-card-hover p-6"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-ask-50 text-ask-600 dark:bg-ask-600/20 dark:text-ask-400"><Icon name="heart" /></span><h2 className="mt-5 font-black">{copy.support}</h2><p className="mt-2 text-sm text-black/55 dark:text-white/55">hello@asken.fi</p></a>
        <div className="ask-card p-6"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-ask-50 text-ask-600 dark:bg-ask-600/20 dark:text-ask-400"><Icon name="map" /></span><h2 className="mt-5 font-black">{copy.visit}</h2><p className="mt-2 text-sm leading-6 text-black/55 dark:text-white/55">{copy.location}</p></div>
        <a href="https://www.instagram.com/askenfi/" target="_blank" rel="noreferrer" className="ask-card ask-card-hover p-6"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-ask-50 text-ask-600 dark:bg-ask-600/20 dark:text-ask-400"><Icon name="instagram" /></span><h2 className="mt-5 font-black">{copy.social}</h2><p className="mt-2 text-sm text-black/55 dark:text-white/55">@askenfi</p></a>
      </div>
      <p className="mt-8 max-w-3xl leading-7 text-black/60 dark:text-white/60">{copy.hoursNote}</p>
    </div>
  </PublicLayout>
}
