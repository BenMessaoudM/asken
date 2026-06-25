import { getJson } from '../api/client'
import { PublicCmsPage } from './types'

export function getPublishedPage(slug: string) {
  return getJson<{ data: { page: PublicCmsPage } }>(`/pages/${encodeURIComponent(slug)}`)
}
