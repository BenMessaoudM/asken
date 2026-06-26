import { useQuery } from '@tanstack/react-query'
import PublicLayout from '../components/PublicLayout'
import PageHero from '../components/PageHero'
import { useSiteLocale } from '../hooks/useSiteLocale'
import { organizationApi } from '../organization/api'

export default function OrganizationPeople({ type }: { type: 'board' | 'staff' }) {
  const { locale } = useSiteLocale()
  const title = type === 'board' ? 'Styrelsen / Board' : 'Personal / Staff'
  const { data, isLoading } = useQuery({ queryKey: ['organization-people', type, locale], queryFn: () => organizationApi.people(type) })
  const people = data?.data.people || []
  return <PublicLayout><PageHero eyebrow="Organisation / Organization" title={title} description={type === 'board' ? 'ASK:s aktiva och synliga styrelsemedlemmar.' : 'ASK:s personal och offentliga kontaktuppgifter.'} /><section className="ask-container py-12">{isLoading && <p>Laddar...</p>}{!isLoading && people.length === 0 && <p className="rounded-2xl bg-white p-6 text-black/60 dark:bg-white/5 dark:text-white/60">Inga personer är publicerade ännu.</p>}<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{people.map((person) => <article key={person.id} className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">{person.photoUrl && <img src={person.photoUrl} alt={person.photoAltText || person.fullName} className="mb-5 aspect-[4/3] w-full rounded-xl object-cover" />}<h2 className="text-2xl font-black">{person.fullName}</h2>{person.nickname && <p className="font-semibold text-ask-600">{person.nickname}</p>}<p className="mt-2 font-bold">{person.positionTitle}</p>{person.responsibilities && <p className="mt-3 text-sm leading-6 text-black/65 dark:text-white/65">{person.responsibilities}</p>}<div className="mt-4 flex flex-wrap gap-2">{person.roleBadges.map((badge) => <span key={badge.name} className="rounded-full bg-ask-50 px-3 py-1 text-xs font-bold text-ask-700">{badge.name}</span>)}</div><div className="mt-4 space-y-1 text-sm"><a className="font-semibold text-ask-600" href={`mailto:${person.email}`}>{person.email}</a>{person.languagesSpoken.length > 0 && <p>{person.languagesSpoken.join(', ')}</p>}</div></article>)}</div></section></PublicLayout>
}
