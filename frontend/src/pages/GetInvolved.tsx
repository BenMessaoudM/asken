import { useQuery } from '@tanstack/react-query'
import PublicLayout from '../components/PublicLayout'
import PageHero from '../components/PageHero'
import { useSiteLocale } from '../hooks/useSiteLocale'
import { organizationApi } from '../organization/api'
import { formatDate } from '../utils/dateTime'

const labels = { coming_soon: 'Kommer snart / Coming soon', open: 'Öppen / Open', closed: 'Stängd / Closed' }
export default function GetInvolved() {
  const { locale } = useSiteLocale()
  const { data } = useQuery({ queryKey: ['get-involved', locale], queryFn: organizationApi.campaigns })
  const campaigns = data?.data.campaigns || []
  return <PublicLayout><PageHero eyebrow="Organisation / Organization" title="Engagera dig / Get Involved" description="Aktuella offentliga rekryteringar och sätt att bidra till ASK." /><section className="ask-container grid gap-5 py-12 md:grid-cols-2">{campaigns.length === 0 && <p className="rounded-2xl bg-white p-6 dark:bg-white/5">Inga rekryteringar är publicerade just nu.</p>}{campaigns.map((campaign) => <article key={campaign.id} className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-black">{campaign.title}</h2><span className="rounded-full bg-ask-50 px-3 py-1 text-xs font-bold text-ask-700">{labels[campaign.status]}</span></div><p className="mt-3 leading-7 text-black/65 dark:text-white/65">{campaign.description}</p><p className="mt-3 text-sm">{formatDate(campaign.openingDate)} - {formatDate(campaign.closingDate)}</p>{campaign.status === 'open' && <a className="ask-button-primary mt-5" href={campaign.ctaUrl}>{campaign.ctaLabel}</a>}{campaign.contactEmail && <p className="mt-4 text-sm"><a className="text-ask-600" href={`mailto:${campaign.contactEmail}`}>{campaign.contactEmail}</a></p>}</article>)}</section></PublicLayout>
}
