import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import PublicLayout from '../components/PublicLayout'
import { publicText } from '../content/publicLabels'
import { useSiteLocale } from '../hooks/useSiteLocale'

export default function Tutoring() {
  const { locale } = useSiteLocale()
  const labels = publicText(locale)
  return <PublicLayout><PageHero eyebrow={labels.organization} title={labels.tutoring} description={locale === 'sv' ? 'Tutorer hjälper nya studerande och utbytesstuderande att hitta in i gemenskapen vid Arcada.' : 'Tutors help new students and exchange students find their place in the Arcada community.'} /><section className="ask-container grid gap-6 py-12 md:grid-cols-2"><article className="rounded-2xl bg-white p-6 dark:bg-white/5"><h2 className="text-2xl font-black">{locale === 'sv' ? 'Vad gör tutorer?' : 'What do tutors do?'}</h2><p className="mt-3 leading-7 text-black/65 dark:text-white/65">{locale === 'sv' ? 'Tutorer välkomnar nya studerande, visar praktiska rutiner, stöder gruppgemenskap och hjälper nya studerande att hitta rätt kontaktvägar.' : 'Tutors welcome new students, explain practical routines, support group community, and help new students find the right contact paths.'}</p></article><article className="rounded-2xl bg-white p-6 dark:bg-white/5"><h2 className="text-2xl font-black">{locale === 'sv' ? 'Utbytestutoring' : 'Exchange tutoring'}</h2><p className="mt-3 leading-7 text-black/65 dark:text-white/65">{locale === 'sv' ? 'Utbytestutorer stöder internationella utbytesstuderande med ankomst, introduktion och social gemenskap under de första veckorna.' : 'Exchange tutors support international exchange students with arrival, orientation and social connection during the first weeks.'}</p><Link className="ask-button-primary mt-5" to="/organisation/engagera-dig">{locale === 'sv' ? 'Se rekryteringar' : 'See recruitments'}</Link></article></section></PublicLayout>
}
