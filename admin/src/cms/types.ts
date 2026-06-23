export const contentTypes = [
  'page',
  'news',
  'event',
  'cor_activity',
  'governance_document',
  'collaboration'
] as const

export type ContentType = typeof contentTypes[number]
export type ContentStatus = 'draft' | 'published'
export type SectionType = 'hero' | 'text' | 'image' | 'cta' | 'faq'

export const contentTypeLabels: Record<ContentType, string> = {
  page: 'Page',
  news: 'News',
  event: 'Event',
  cor_activity: 'Cor Activity',
  governance_document: 'Governance Document',
  collaboration: 'Collaboration'
}

export interface CmsSection {
  id?: string
  type: SectionType
  position: number
  data: Record<string, unknown>
}

export interface CmsContent {
  id: string
  contentType: ContentType
  title: string
  slug: string
  status: ContentStatus
  version: number
  sections: CmsSection[]
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface ContentSummary {
  id: string
  contentType: ContentType
  title: string
  slug: string
  status: ContentStatus
  version: number
  sectionCount: number
  publishedAt?: string
  updatedAt: string
}

export interface ContentVersion {
  id: string
  version: number
  contentType: ContentType
  status: ContentStatus
  title: string
  slug: string
  createdAt: string
}
