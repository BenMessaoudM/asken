import { getJson } from '../api/client'
import { FullmaktigeDocumentsOverview, PublicGovernanceDocument, PublicGovernanceOverview } from './types'
export const governanceApi = {
  overview(locale: string) { return getJson<{ data: PublicGovernanceOverview }>(`/governance?lang=${locale}`) },
  documents(locale: string, query = '') { return getJson<{ data: { documents: PublicGovernanceDocument[] } }>(`/governance/documents?lang=${locale}${query ? `&${query}` : ''}`) },
  document(slug: string, locale: string) { return getJson<{ data: { document: PublicGovernanceDocument } }>(`/governance/documents/${slug}?lang=${locale}`) },
  fullmaktige(locale: string, year?: string) { return getJson<{ data: FullmaktigeDocumentsOverview }>(`/governance/fullmaktige?lang=${locale}${year ? `&year=${year}` : ''}`) }
}
