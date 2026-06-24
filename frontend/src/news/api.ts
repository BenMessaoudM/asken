import { NewsCategory, NewsLocale, PublicNewsArticle } from './types'

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

export async function listNews(input: { locale: NewsLocale; search?: string; category?: string; limit?: number }) {
  const query = new URLSearchParams({ locale: input.locale })
  if (input.search) query.set('q', input.search)
  if (input.category) query.set('category', input.category)
  if (input.limit) query.set('limit', String(input.limit))
  return get<{ data: { articles: PublicNewsArticle[]; total: number; page: number; limit: number } }>(`/news?${query}`)
}

export function getNewsArticle(slug: string, locale: NewsLocale) {
  return get<{ data: { article: PublicNewsArticle } }>(`/news/${encodeURIComponent(slug)}?locale=${locale}`)
}

export function listNewsCategories() {
  return get<{ data: { categories: NewsCategory[] } }>('/news/categories')
}
