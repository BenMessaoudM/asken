import { getJson } from '../api/client'
import { EventCategory, EventLocale, PublicEvent } from './types'

export function listEvents(input: { locale: EventLocale; search?: string; category?: string; period?: string; limit?: number }) {
  const query = new URLSearchParams({ locale: input.locale })
  if (input.search) query.set('q', input.search)
  if (input.category) query.set('category', input.category)
  if (input.period) query.set('period', input.period)
  if (input.limit) query.set('limit', String(input.limit))
  return getJson<{ data: { events: PublicEvent[]; total: number; page: number; limit: number } }>(`/events?${query}`)
}

export function getEvent(slug: string, locale: EventLocale) {
  return getJson<{ data: { event: PublicEvent } }>(`/events/${encodeURIComponent(slug)}?locale=${locale}`)
}

export function listEventCategories() {
  return getJson<{ data: { categories: EventCategory[] } }>('/events/categories')
}
