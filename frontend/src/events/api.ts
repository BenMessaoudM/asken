import { EventCategory, EventLocale, PublicEvent } from './types'

const browserApiBaseUrl = typeof window === 'undefined'
  ? 'http://localhost:3000/api/v1'
  : `${window.location.protocol}//${window.location.hostname}:3000/api/v1`
const apiBaseUrl = import.meta.env.VITE_API_URL || browserApiBaseUrl

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`)
  const body = await response.json()
  if (!response.ok) throw new Error(body.error?.message || 'Request failed')
  return body as T
}

export function listEvents(input: { locale: EventLocale; search?: string; category?: string; period?: string; limit?: number }) {
  const query = new URLSearchParams({ locale: input.locale })
  if (input.search) query.set('q', input.search)
  if (input.category) query.set('category', input.category)
  if (input.period) query.set('period', input.period)
  if (input.limit) query.set('limit', String(input.limit))
  return get<{ data: { events: PublicEvent[]; total: number; page: number; limit: number } }>(`/events?${query}`)
}

export function getEvent(slug: string, locale: EventLocale) {
  return get<{ data: { event: PublicEvent } }>(`/events/${encodeURIComponent(slug)}?locale=${locale}`)
}

export function listEventCategories() {
  return get<{ data: { categories: EventCategory[] } }>('/events/categories')
}
