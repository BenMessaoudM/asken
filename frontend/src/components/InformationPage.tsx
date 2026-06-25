import { PageKey } from '../content/siteContent'
import { useCmsPage } from '../cms/useCmsPage'
import { usePageMetadata } from '../hooks/usePageMetadata'
import { useSiteLocale } from '../hooks/useSiteLocale'
import CmsSections from './CmsSections'
import Icon from './Icon'
import PageHero from './PageHero'
import PublicLayout from './PublicLayout'
import SmartLink from './SmartLink'

function value(data: Record<string, unknown>, key: string) { return typeof data[key] === 'string' ? data[key] as string : undefined }

export default function InformationPage({ pageKey }: { pageKey: PageKey }) {
  const { locale, content } = useSiteLocale()
  const definition = content.pages[pageKey]
  const { page, error } = useCmsPage(pageKey, locale)
  const hero = page?.sections.find((section) => section.type === 'hero')
  usePageMetadata(page?.title || definition.title, definition.metaDescription, `/${pageKey}`)

  return <PublicLayout>
    <PageHero
      compact
      eyebrow={definition.eyebrow}
      title={value(hero?.data || {}, 'heading') || page?.title || definition.title}
      description={value(hero?.data || {}, 'subheading') || definition.intro}
      imageUrl={value(hero?.data || {}, 'imageUrl')}
      action={hero && value(hero.data, 'ctaLabel') && value(hero.data, 'ctaUrl') ? { label: value(hero.data, 'ctaLabel')!, href: value(hero.data, 'ctaUrl')! } : undefined}
    />
    <div className="ask-container py-14 sm:py-20">
      {error && <p role="status" className="mb-6 rounded-2xl bg-amber-50 p-4 text-amber-900 dark:bg-amber-400/10 dark:text-amber-100">{content.common.cmsUnavailable}</p>}
      {page && page.sections.some((section) => section.type !== 'hero') ? <CmsSections sections={page.sections.filter((section) => section.type !== 'hero')} /> : <div className="grid gap-6 lg:grid-cols-3">{definition.sections.map((section, index) => <section key={section.title} className={`ask-card p-6 sm:p-8 ${index === 0 && definition.sections.length > 2 ? 'lg:col-span-2' : ''}`}><p className="ask-eyebrow">{String(index + 1).padStart(2, '0')}</p><h2 className="mt-3 text-2xl font-black">{section.title}</h2><p className="mt-4 leading-8 text-black/65 dark:text-white/65">{section.body}</p>{section.items && <ul className="mt-5 space-y-3">{section.items.map((item) => <li key={item} className="flex gap-3 leading-7"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-ask-600" aria-hidden="true" />{item}</li>)}</ul>}</section>)}</div>}
      {definition.cta && <div className="mt-10"><SmartLink href={definition.cta.href} external={definition.cta.external} className="ask-button-primary">{definition.cta.label}<Icon name="arrow" /></SmartLink></div>}
    </div>
  </PublicLayout>
}
