import { useQuery } from '@tanstack/react-query'
import PublicLayout from '../components/PublicLayout'
import PageHero from '../components/PageHero'
import { useSiteLocale } from '../hooks/useSiteLocale'
import { organizationApi } from '../organization/api'

export default function Committees() {
  const { locale } = useSiteLocale()
  const { data } = useQuery({ queryKey: ['organization-committees', locale], queryFn: organizationApi.committees })
  const committees = data?.data.committees || []
  return <PublicLayout><PageHero eyebrow="Organisation / Organization" title="Kommittéer / Committees" description="ASK:s publicerade kommittéer, ansvarsområden och kontaktvägar." /><section className="ask-container grid gap-5 py-12 md:grid-cols-2">{committees.length === 0 && <p className="rounded-2xl bg-white p-6 dark:bg-white/5">Inga kommittéer är publicerade ännu.</p>}{committees.map((committee) => <article key={committee.id} className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5"><h2 className="text-2xl font-black">{committee.name}</h2><p className="mt-3 leading-7 text-black/65 dark:text-white/65">{committee.description}</p>{committee.responsibilities && <p className="mt-3 text-sm">{committee.responsibilities}</p>}{committee.contactEmail && <a className="mt-5 inline-flex font-bold text-ask-600" href={`mailto:${committee.contactEmail}`}>{committee.contactEmail}</a>}</article>)}</section></PublicLayout>
}
