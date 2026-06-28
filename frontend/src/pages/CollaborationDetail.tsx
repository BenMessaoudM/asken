import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import { usePageMetadata } from '../hooks/usePageMetadata'
import { collaborationsApi } from '../collaborations/api'
import { PublicCollaboration } from '../collaborations/types'
import { publicText } from '../content/publicLabels'
import { useSiteLocale } from '../hooks/useSiteLocale'

export default function CollaborationDetail() {
  const { slug } = useParams(); const { locale } = useSiteLocale(); const labels = publicText(locale)
  const [item, setItem] = useState<PublicCollaboration | null>(null), [missing, setMissing] = useState(false)
  usePageMetadata(item?.name || labels.collaborations, item?.shortDescription || item?.description || labels.collaborations, slug ? `/samarbeten/${slug}` : '/samarbeten')
  useEffect(() => { if (!slug) { setMissing(true); return } let mounted = true; collaborationsApi.detail(slug).then((response) => { if (mounted) setItem(response.data.collaboration) }).catch(() => setMissing(true)); return () => { mounted = false } }, [slug, locale])
  return <PublicLayout><section className="ask-container py-12">{missing ? <><h1 className="text-4xl font-black">{locale === 'sv' ? 'Samarbete hittades inte' : 'Collaboration not found'}</h1><Link className="ask-button-primary mt-6" to="/samarbeten">{labels.collaborations}</Link></> : item ? <><Link to="/samarbeten" className="font-semibold text-ask-600">{labels.collaborations}</Link><div className="mt-6 grid gap-8 md:grid-cols-[1fr_320px]"><article><p className="font-semibold text-ask-600">{item.typeLabel}</p><h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">{item.name}</h1><p className="mt-6 whitespace-pre-line text-lg leading-8 text-black/70 dark:text-white/70">{item.description}</p></article><aside className="space-y-4 rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">{item.logoUrl && <img src={item.logoUrl} alt={item.logoAltText || ''} className="max-h-28 object-contain" />}{item.websiteUrl && <a className="ask-button-primary w-full justify-center" href={item.websiteUrl} target="_blank" rel="noreferrer">{locale === 'sv' ? 'Webbplats' : 'Website'}</a>}{item.email && <a className="block font-semibold text-ask-600" href={`mailto:${item.email}`}>{item.email}</a>}{item.contactPerson && <p>{item.contactPerson}</p>}{item.location && <p>{item.location}</p>}{item.officeAtCor && <p><strong>Cor House</strong>{item.officeHours ? `: ${item.officeHours}` : ''}</p>}</aside></div></> : <p>{labels.loading}</p>}</section></PublicLayout>
}
