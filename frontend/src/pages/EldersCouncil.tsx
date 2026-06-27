import { useQuery } from '@tanstack/react-query'
import PublicLayout from '../components/PublicLayout'
import PageHero from '../components/PageHero'
import { useSiteLocale } from '../hooks/useSiteLocale'
import { organizationApi } from '../organization/api'
import { formatDate } from '../utils/dateTime'

export default function EldersCouncil() {
  const { locale } = useSiteLocale()
  const { data } = useQuery({ queryKey: ['elders-council', locale], queryFn: organizationApi.eldersCouncil })
  const council = data?.data.eldersCouncil
  return <PublicLayout><PageHero eyebrow="Organisation / Organization" title="Äldres Råd / Elders’ Council" description="ASK:s rådgivande organ enligt stadgar och reglemente." /><section className="ask-container grid gap-8 py-12 lg:grid-cols-[1.25fr_.75fr]">{council && <><article className="rounded-2xl bg-white p-6 dark:bg-white/5"><h2 className="text-2xl font-black">{council.title}</h2><p className="mt-4 leading-7 text-black/65 dark:text-white/65">{council.description}</p><dl className="mt-6 grid gap-4 sm:grid-cols-2"><div><dt className="font-bold">Roll</dt><dd>Rådgivande organ / Advisory body</dd></div><div><dt className="font-bold">Utses av</dt><dd>Fullmäktige / Student Council</dd></div><div><dt className="font-bold">Mandat</dt><dd>Nio medlemmar, tre år</dd></div><div><dt className="font-bold">Kontakt</dt><dd><a className="text-ask-600" href={`mailto:${council.contactEmail}`}>{council.contactEmail}</a></dd></div></dl><p className="mt-6 text-sm leading-6 text-black/60 dark:text-white/60">Fullmäktige kompletterar avgående medlemmar årligen vid höstmötet. Medlemmar kan vara utexaminerade från Arcada eller andra personer med god insyn i ASK:s verksamhet.</p></article><aside className="rounded-2xl bg-white p-6 dark:bg-white/5"><h2 className="font-black">Medlemmar / Members</h2>{council.members.length === 0 ? <p className="mt-3 text-sm text-black/60 dark:text-white/60">Medlemmar publiceras senare.</p> : <ul className="mt-3 space-y-3">{council.members.map((member) => <li key={member.name} className="border-t pt-3 first:border-t-0 first:pt-0"><b>{member.name}</b>{member.title && <span>, {member.title}</span>}{member.chairperson && <span> · Ordförande</span>}{member.secretary && <span> · Sekreterare</span>}{(member.mandateStart || member.mandateEnd) && <p className="text-sm text-black/55 dark:text-white/55">{member.mandateStart ? formatDate(member.mandateStart) : ''} - {member.mandateEnd ? formatDate(member.mandateEnd) : ''}</p>}</li>)}</ul>}</aside></>}</section></PublicLayout>
}
