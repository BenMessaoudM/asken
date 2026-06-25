import { FormEvent, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getBookingStatus } from '../booking/api'
import { bookingContent } from '../booking/content'
import { BookingStatusRecord } from '../booking/types'
import PageHero from '../components/PageHero'
import PublicLayout from '../components/PublicLayout'
import { usePageMetadata } from '../hooks/usePageMetadata'
import { useSiteLocale } from '../hooks/useSiteLocale'

export default function BookingStatus() {
  const {locale}=useSiteLocale();const copy=bookingContent[locale];const[params]=useSearchParams();const[reference,setReference]=useState(params.get('reference')||'');const[code,setCode]=useState(params.get('code')||'');const[booking,setBooking]=useState<BookingStatusRecord|null>(null);const[error,setError]=useState('');const[loading,setLoading]=useState(false)
  usePageMetadata(copy.statusLink,copy.intro,'/booking/status')
  const submit=async(event:FormEvent)=>{event.preventDefault();setLoading(true);setError('');try{setBooking((await getBookingStatus(reference.trim().toUpperCase(),code.trim(),locale)).data.booking)}catch{setBooking(null);setError(copy.error)}finally{setLoading(false)}}
  return <PublicLayout><PageHero compact eyebrow={copy.eyebrow} title={copy.statusLink} description={copy.intro}/><div className="ask-container py-14 sm:py-20"><form onSubmit={submit} className="ask-card mx-auto grid max-w-2xl gap-5 p-6 sm:p-9"><label className="font-semibold">{copy.reference}<input required value={reference} onChange={(event)=>setReference(event.target.value)} className="mt-2 w-full rounded-xl border p-3 uppercase"/></label><label className="font-semibold">{copy.code}<input required value={code} onChange={(event)=>setCode(event.target.value)} className="mt-2 w-full rounded-xl border p-3"/></label>{error&&<p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}<button disabled={loading} className="ask-button-primary">{loading?'…':copy.check}</button></form>{booking&&<article className="ask-card mx-auto mt-8 max-w-2xl p-6 sm:p-9" aria-live="polite"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-black">{booking.resource.name}</h2><strong className="rounded-full bg-ask-50 px-4 py-2 text-ask-600 dark:bg-white/10 dark:text-ask-400">{copy.statuses[booking.status]}</strong></div><dl className="mt-6 grid gap-5 sm:grid-cols-2"><div><dt className="font-bold">{copy.reference}</dt><dd>{booking.reference}</dd></div><div><dt className="font-bold">{copy.name}</dt><dd>{booking.requesterName}</dd></div><div><dt className="font-bold">{copy.start}</dt><dd>{new Date(booking.startAt).toLocaleString(locale)}</dd></div><div><dt className="font-bold">{copy.end}</dt><dd>{new Date(booking.endAt).toLocaleString(locale)}</dd></div><div className="sm:col-span-2"><dt className="font-bold">{copy.purpose}</dt><dd className="mt-1 whitespace-pre-line">{booking.purpose}</dd></div>{booking.publicNotes&&<div className="rounded-xl bg-ask-50 p-4 sm:col-span-2 dark:bg-white/10"><dt className="font-bold">ASK</dt><dd className="mt-1">{booking.publicNotes}</dd></div>}</dl></article>}</div></PublicLayout>
}
