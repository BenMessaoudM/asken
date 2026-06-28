import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import PageHero from '../components/PageHero'
import SectionHeading from '../components/SectionHeading'
import { publicText } from '../content/publicLabels'
import { useSiteLocale } from '../hooks/useSiteLocale'
import { organizationApi } from '../organization/api'

const descriptions = {
  sv: { board: 'Möt ASK:s styrelse.', council: 'ASK:s högsta beslutande organ.', committees: 'Kommittéer och kontaktvägar.', tutoring: 'Stöd för nya och utbytesstuderande.', staff: 'Kontakt till ASK:s personal.', elders: 'Studerandekårens rådgivande organ.', representatives: 'Förtroendeuppdrag i Arcadas organ.', alumni: 'ASK Alumni och alumnnätverket.', involved: 'Aktuella rekryteringar och möjligheter.' },
  en: { board: 'Meet the ASK board.', council: 'ASK’s highest decision-making body.', committees: 'Committees and contact paths.', tutoring: 'Support for new and exchange students.', staff: 'Contact ASK staff.', elders: 'The student union’s advisory body.', representatives: 'Representative roles in Arcada bodies.', alumni: 'ASK Alumni and the alumni network.', involved: 'Current recruitments and opportunities.' },
} as const

export default function Organization() {
  const { locale } = useSiteLocale()
  const labels = publicText(locale)
  const fallback = [
    { key: 'board', label: labels.board, href: '/organisation/styrelsen', description: descriptions[locale].board },
    { key: 'council', label: labels.council, href: '/organisation/fullmaktige', description: descriptions[locale].council },
    { key: 'committees', label: labels.committees, href: '/organisation/kommitteer', description: descriptions[locale].committees },
    { key: 'tutoring', label: labels.tutoring, href: '/organisation/tutoring', description: descriptions[locale].tutoring },
    { key: 'staff', label: labels.staff, href: '/organisation/personal', description: descriptions[locale].staff },
    { key: 'elders', label: labels.elders, href: '/organisation/aldres-rad', description: descriptions[locale].elders },
    { key: 'representatives', label: labels.representatives, href: '/organisation/studeranderepresentanter', description: descriptions[locale].representatives },
    { key: 'alumni', label: labels.alumni, href: '/alumner', description: descriptions[locale].alumni },
    { key: 'involved', label: labels.getInvolved, href: '/organisation/engagera-dig', description: descriptions[locale].involved },
  ]
  const { data } = useQuery({ queryKey: ['organization-overview', locale], queryFn: organizationApi.overview })
  const sections = data?.data.sections.length ? data.data.sections : fallback
  return <PublicLayout><PageHero eyebrow={labels.organization} title={labels.organization} description={locale === 'sv' ? 'ASK:s offentliga organisation, kontaktvägar och möjligheter att engagera sig.' : 'ASK’s public organization, contact paths, and ways to get involved.'} /><section className="ask-container py-12"><SectionHeading eyebrow={labels.publicDocuments} title={locale === 'sv' ? 'Hitta rätt del av ASK' : 'Find the right part of ASK'} description={locale === 'sv' ? 'Svenska är källspråk. Engelskt innehåll visas när English är valt och faller tillbaka till svenska vid behov.' : 'Swedish is the source language. English content is shown when English is selected and falls back to Swedish when needed.'} /><div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{sections.map((item) => <Link key={item.key} to={item.href} className="rounded-2xl border border-black/10 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-white/5"><h2 className="text-xl font-black">{item.label}</h2><p className="mt-3 text-sm leading-6 text-black/60 dark:text-white/60">{item.description}</p></Link>)}</div></section></PublicLayout>
}
