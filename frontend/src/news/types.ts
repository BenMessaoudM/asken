import { PublicLanguage } from '../localization/languages'

export type NewsLocale = PublicLanguage
export interface PublicNewsArticle {
  id: string
  slug: string
  title: string
  summary: string
  body: string
  imageUrl?: string
  imageAlt?: string
  locale: NewsLocale
  categories: Array<{ slug: string; label: string }>
  tags: Array<{ slug: string; label: string }>
  featured: boolean
  publishedAt: string
}
export interface NewsCategory {
  id: string
  slug: string
  labels: { en: string; sv: string }
}
