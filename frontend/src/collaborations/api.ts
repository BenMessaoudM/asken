import i18n from '../i18n'
import { getJson } from '../api/client'
import { CollaborationTypeOption, PublicCollaboration, PublicCollaborationSettings } from './types'

const locale = () => i18n.language?.startsWith('en') ? 'en' : 'sv'
const withLocale = (path: string) => `${path}${path.includes('?') ? '&' : '?'}lang=${locale()}`

export const collaborationsApi = {
  list(query = '') { return getJson<{ data: { collaborations: PublicCollaboration[] } }>(withLocale(`/collaborations${query}`)) },
  detail(slug: string) { return getJson<{ data: { collaboration: PublicCollaboration } }>(withLocale(`/collaborations/${slug}`)) },
  types() { return getJson<{ data: { types: CollaborationTypeOption[] } }>(withLocale('/collaborations/types')) },
  settings() { return getJson<{ data: { settings: PublicCollaborationSettings } }>(withLocale('/collaborations/settings')) },
}
