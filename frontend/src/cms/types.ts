export type CmsSectionType = 'hero' | 'text' | 'image' | 'cta' | 'faq'

export interface PublicCmsSection {
  id: string
  type: CmsSectionType
  position: number
  data: Record<string, unknown>
}

export interface PublicCmsPage {
  id: string
  contentType: 'page'
  title: string
  slug: string
  status: 'published'
  version: number
  sections: PublicCmsSection[]
  publishedAt: string
  createdAt: string
  updatedAt: string
}
