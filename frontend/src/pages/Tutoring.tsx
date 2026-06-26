import { Link } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import PageHero from '../components/PageHero'

export default function Tutoring() {
  return <PublicLayout><PageHero eyebrow="Organisation / Organization" title="Tutoring" description="Tutorer hjälper nya studerande och utbytesstuderande att hitta in i gemenskapen vid Arcada." /><section className="ask-container grid gap-6 py-12 md:grid-cols-2"><article className="rounded-2xl bg-white p-6 dark:bg-white/5"><h2 className="text-2xl font-black">Vad gör tutorer?</h2><p className="mt-3 leading-7 text-black/65 dark:text-white/65">Tutorer välkomnar nya studerande, visar praktiska rutiner, stöder gruppgemenskap och hjälper nya studerande att hitta rätt kontaktvägar.</p></article><article className="rounded-2xl bg-white p-6 dark:bg-white/5"><h2 className="text-2xl font-black">Exchange tutoring</h2><p className="mt-3 leading-7 text-black/65 dark:text-white/65">Exchange tutors support international exchange students with arrival, orientation and social connection during the first weeks.</p><Link className="ask-button-primary mt-5" to="/organisation/engagera-dig">Se rekryteringar</Link></article></section></PublicLayout>
}
