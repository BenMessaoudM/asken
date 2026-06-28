import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import PageHero from '../components/PageHero'
import { publicText } from '../content/publicLabels'
import { useSiteLocale } from '../hooks/useSiteLocale'
import { organizationApi } from '../organization/api'

export default function StudentCouncil() {
  const { locale } = useSiteLocale()
  const labels = publicText(locale)
  const { data } = useQuery({ queryKey: ['student-council', locale], queryFn: organizationApi.studentCouncil })
  const council = data?.data.studentCouncil
  return <PublicLayout><PageHero eyebrow={labels.organization} title={labels.council} description={locale === 'sv' ? 'Offentlig information om ASK:s högsta beslutande organ.' : 'Public information about ASK’s highest decision-making body.'} /><section className="ask-container grid gap-8 py-12 lg:grid-cols-[1.3fr_.7fr]">{council && <><article className="rounded-2xl bg-white p-6 dark:bg-white/5"><h2 className="text-2xl font-black">{council.title}</h2><p className="mt-4 leading-7 text-black/65 dark:text-white/65">{council.description}</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><p><b>{labels.speaker}</b><br />{council.speakerName || (locale === 'sv' ? 'Publiceras senare' : 'Published later')}<br />{council.speakerEmail && <a className="text-ask-600" href={`mailto:${council.speakerEmail}`}>{council.speakerEmail}</a>}</p><p><b>{labels.contact}</b><br /><a className="text-ask-600" href={`mailto:${council.contactEmail}`}>{council.contactEmail}</a></p></div></article><aside className="space-y-5"><section className="rounded-2xl bg-white p-6 dark:bg-white/5"><h2 className="font-black">{labels.members}</h2>{council.members.length === 0 ? <p className="mt-3 text-sm text-black/60 dark:text-white/60">{locale === 'sv' ? 'Inga ledamöter är publicerade ännu.' : 'No members have been published yet.'}</p> : <ul className="mt-3 space-y-2">{council.members.map((member) => <li key={member.name}>{member.name}{member.title ? `, ${member.title}` : ''}</li>)}</ul>}</section><section className="rounded-2xl bg-white p-6 dark:bg-white/5"><h2 className="font-black">{labels.documents}</h2><Link className="mt-3 inline-block font-semibold text-ask-700" to="/styrning/fullmaktige">{labels.fullmaktigeDocuments}</Link>{council.documentLinks.length === 0 ? <p className="mt-3 text-sm text-black/60 dark:text-white/60">{locale === 'sv' ? 'Inga offentliga dokument är publicerade ännu.' : 'No public documents have been published yet.'}</p> : <ul className="mt-3 space-y-2">{council.documentLinks.map((link) => <li key={link.url}><a className="text-ask-600" href={link.url}>{link.label}</a></li>)}</ul>}</section></aside></>}</section></PublicLayout>
}
