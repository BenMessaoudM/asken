import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import { useSiteLocale } from '../hooks/useSiteLocale'
import { organizationApi } from '../organization/api'

const fallback = [
  { key: 'board', label: 'Styrelsen / Board', href: '/organisation/styrelsen', description: 'Möt ASK:s styrelse.' },
  { key: 'council', label: 'Fullmäktige / Student Council', href: '/organisation/fullmaktige', description: 'ASK:s högsta beslutande organ.' },
  { key: 'committees', label: 'Kommittéer / Committees', href: '/organisation/kommitteer', description: 'Kommittéer och kontaktvägar.' },
  { key: 'tutoring', label: 'Tutoring', href: '/organisation/tutoring', description: 'Stöd för nya och utbytesstuderande.' },
  { key: 'staff', label: 'Personal / Staff', href: '/organisation/personal', description: 'Kontakt till ASK:s personal.' },
  { key: 'elders', label: 'Äldres Råd / Elders’ Council', href: '/organisation/aldres-rad', description: 'Studerandekårens rådgivande organ.' },
  { key: 'representatives', label: 'Studeranderepresentanter / Student Representatives', href: '/organisation/studeranderepresentanter', description: 'Förtroendeuppdrag i Arcadas organ.' },
  { key: 'alumni', label: 'Alumner / Alumni', href: '/alumner', description: 'ASK Alumni och alumnnätverket.' },
  { key: 'involved', label: 'Engagera dig / Get Involved', href: '/organisation/engagera-dig', description: 'Aktuella rekryteringar och möjligheter.' },
]

export default function Organization() {
  const { locale } = useSiteLocale()
  const { data } = useQuery({ queryKey: ['organization-overview', locale], queryFn: organizationApi.overview })
  const sections = data?.data.sections.length ? data.data.sections : fallback
  return <PublicLayout><PageHero eyebrow="Organisation / Organization" title="Organisation" description="ASK:s offentliga organisation, kontaktvägar och möjligheter att engagera sig." /><section className="ask-container py-12"><SectionHeading eyebrow="Offentlig information" title="Hitta rätt del av ASK" description="Svenska är källspråk. English content is shown when selected and falls back to Swedish when needed." /><div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{sections.map((item) => <Link key={item.key} to={item.href} className="rounded-2xl border border-black/10 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-white/5"><h2 className="text-xl font-black">{item.label}</h2><p className="mt-3 text-sm leading-6 text-black/60 dark:text-white/60">{item.description}</p></Link>)}</div></section></PublicLayout>
}
