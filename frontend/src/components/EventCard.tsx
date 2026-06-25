import { Link } from 'react-router-dom'
import { PublicEvent } from '../events/types'
import Icon from './Icon'

export default function EventCard({ event, locale, dark = false }: { event: PublicEvent; locale: string; dark?: boolean }) {
  const start = new Date(event.startAt)
  return <article className={dark ? 'group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] transition hover:-translate-y-1 hover:border-ask-400/50' : 'ask-card ask-card-hover group overflow-hidden'}>
    {event.imageUrl ? <img src={event.imageUrl} alt={event.imageAlt || ''} className="h-44 w-full object-cover transition duration-500 group-hover:scale-[1.03]" /> : !dark && <div className="grid h-44 place-items-center bg-ask-50 text-ask-600 dark:bg-ask-600/15 dark:text-ask-400"><Icon name="calendar" className="h-10 w-10" /></div>}
    <div className="p-6">
      <div className="flex items-start gap-4">
        <div className="grid w-14 shrink-0 place-items-center rounded-2xl bg-ask-gold px-2 py-3 text-center text-ask-ink"><span className="text-xs font-black uppercase">{start.toLocaleDateString(locale, { month: 'short' })}</span><span className="text-2xl font-black leading-none">{start.getDate()}</span></div>
        <div><p className={`text-xs font-bold uppercase tracking-wider ${dark ? 'text-ask-400' : 'text-ask-600 dark:text-ask-400'}`}>{event.category.label}</p><h3 className="mt-2 text-xl font-black leading-tight"><Link to={`/events/${event.slug}`}>{event.title}</Link></h3></div>
      </div>
      <p className={`mt-5 text-sm ${dark ? 'text-white/60' : 'text-black/55 dark:text-white/55'}`}>{start.toLocaleString(locale, { weekday: 'short', hour: '2-digit', minute: '2-digit' })} · {event.location}</p>
    </div>
  </article>
}
