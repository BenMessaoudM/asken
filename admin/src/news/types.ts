export type NewsLocale = 'en' | 'sv'
export type NewsStatus = 'draft' | 'scheduled' | 'published'

export interface NewsTranslation {
  title: string
  summary: string
  body: string
  imageUrl?: string
  imageAlt?: string
}

export interface NewsTaxonomyItem {
  id: string
  slug: string
  labels: { en: string; sv: string }
  createdAt: string
  updatedAt: string
}

export interface NewsArticle {
  id: string
  contentId: string
  slug: string
  status: NewsStatus
  version: number
  translations: Record<NewsLocale, NewsTranslation>
  categories: NewsTaxonomyItem[]
  tags: NewsTaxonomyItem[]
  featured: boolean
  publishedAt?: string
  scheduledAt?: string
  createdAt: string
  updatedAt: string
}
