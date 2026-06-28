import { useQuery } from '@tanstack/react-query'
import PublicLayout from '../components/PublicLayout'
import PageHero from '../components/PageHero'
import { publicText } from '../content/publicLabels'
import { useSiteLocale } from '../hooks/useSiteLocale'
import { organizationApi } from '../organization/api'
import { PublicCampaign } from '../organization/types'
import { formatDate } from '../utils/dateTime'

function statusLabel(status: PublicCampaign['status'], labels: ReturnType<typeof publicText>) {
  return status === 'open' ? labels.open : status === 'closed' ? labels.closed : labels.comingSoon
}

export default function GetInvolved() {
  const { locale } = useSiteLocale()
  const labels = publicText(locale)
  const { data } = useQuery({ queryKey: ['get-involved', locale], queryFn: organizationApi.campaigns })
  const campaigns = data?.data.campaigns || []
  return <PublicLayout><PageHero eyebrow={labels.organization} title={labels.getInvolved} description={locale === 'sv' ? 'Aktuella offentliga rekryteringar och sätt att bidra till ASK.' : 'Current public recruitments and ways to contribute to ASK.'} /><section className="ask-container grid gap-5 py-12 md:grid-cols-2">{campaigns.length === 0 && <p className="rounded-2xl bg-white p-6 dark:bg-white/5">{locale === 'sv' ? 'Inga rekryteringar är publicerade just nu.' : 'No recruitments are published right now.'}</p>}{campaigns.map((campaign) => <article key={campaign.id} className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-black">{campaign.title}</h2><span className="rounded-full bg-ask-50 px-3 py-1 text-xs font-bold text-ask-700">{statusLabel(campaign.status, labels)}</span></div><p className="mt-3 leading-7 text-black/65 dark:text-white/65">{campaign.description}</p><p className="mt-3 text-sm">{formatDate(campaign.openingDate)} - {formatDate(campaign.closingDate)}</p>{campaign.status === 'open' && <a className="ask-button-primary mt-5" href={campaign.ctaUrl}>{campaign.ctaLabel}</a>}{campaign.contactEmail && <p className="mt-4 text-sm"><a className="text-ask-600" href={`mailto:${campaign.contactEmail}`}>{campaign.contactEmail}</a></p>}</article>)}</section></PublicLayout>
}
