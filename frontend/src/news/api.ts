import { getJson } from '../api/client'
import { NewsCategory, NewsLocale, PublicNewsArticle } from './types'

export async function listNews(input: { locale: NewsLocale; search?: string; category?: string; limit?: number }) {
  const query = new URLSearchParams({ locale: input.locale })
  if (input.search) query.set('q', input.search)
  if (input.category) query.set('category', input.category)
  if (input.limit) query.set('limit', String(input.limit))
  return getJson<{ data: { articles: PublicNewsArticle[]; total: number; page: number; limit: number } }>(`/news?${query}`)
}

export function getNewsArticle(slug: string, locale: NewsLocale) {
  return getJson<{ data: { article: PublicNewsArticle } }>(`/news/${encodeURIComponent(slug)}?locale=${locale}`)
}

export function listNewsCategories() {
  return getJson<{ data: { categories: NewsCategory[] } }>('/news/categories')
}
