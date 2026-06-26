import { useQuery } from '@tanstack/react-query'
import PublicLayout from '../components/PublicLayout'
import PageHero from '../components/PageHero'
import { useSiteLocale } from '../hooks/useSiteLocale'
import { organizationApi } from '../organization/api'

export default function Alumni() {
  const { locale } = useSiteLocale()
  const { data } = useQuery({ queryKey: ['alumni', locale], queryFn: organizationApi.alumni })
  const alumni = data?.data.alumni
  const sections = ['Vad är ASK Alumni? / What is ASK Alumni?', 'Varför gå med? / Why join?', 'Alumni-evenemang / Alumni Events', 'Nätverk / Network', 'Stöd ASK / Support ASK', 'Hyr Cor-huset / Book Cor House']
  return <PublicLayout><PageHero eyebrow="Alumner / Alumni" title={alumni?.title || 'Alumner'} description={alumni?.intro || 'ASK Alumni samlar tidigare studerande och vänner till ASK.'} />{alumni && <section className="ask-container py-12"><div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]"><article className="rounded-2xl bg-white p-6 dark:bg-white/5"><h2 className="text-2xl font-black">ASK Alumni</h2><p className="mt-4 leading-7 text-black/65 dark:text-white/65">{alumni.body}</p><div className="mt-6 flex flex-wrap gap-3"><a className="ask-button-primary" href={alumni.ctaPrimaryUrl}>{alumni.ctaPrimaryLabel}</a>{alumni.ctaSecondaryLabel && alumni.ctaSecondaryUrl && <a className="ask-button-secondary" href={alumni.ctaSecondaryUrl}>{alumni.ctaSecondaryLabel}</a>}</div></article><aside className="rounded-2xl bg-white p-6 dark:bg-white/5"><h2 className="font-black">Gå med i alumninätverket / Join the Alumni Network</h2><ul className="mt-4 space-y-3">{alumni.benefits.map((benefit) => <li key={benefit} className="border-t pt-3 first:border-t-0 first:pt-0">{benefit}</li>)}</ul>{alumni.contactEmail && <a className="mt-5 inline-flex text-ask-600" href={`mailto:${alumni.contactEmail}`}>{alumni.contactEmail}</a>}</aside></div><div className="mt-8 grid gap-4 md:grid-cols-3">{sections.map((title) => <section key={title} className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5"><h2 className="font-black">{title}</h2></section>)}</div></section>}</PublicLayout>
}
