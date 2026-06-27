import i18n from '../i18n'
import { getJson } from '../api/client'
import { OrganizationOverview, PublicAlumni, PublicCampaign, PublicCommittee, PublicPerson, PublicEldersCouncil, PublicStudentCouncil } from './types'

const locale = () => i18n.language?.startsWith('en') ? 'en' : 'sv'
const withLocale = (path: string) => `${path}?locale=${locale()}`

export const organizationApi = {
  overview: () => getJson<{ data: OrganizationOverview }>(withLocale('/organization')),
  people: (type: 'board' | 'staff') => getJson<{ data: { people: PublicPerson[] } }>(withLocale(`/organization/${type}`)),
  committees: () => getJson<{ data: { committees: PublicCommittee[] } }>(withLocale('/organization/committees')),
  studentCouncil: () => getJson<{ data: { studentCouncil: PublicStudentCouncil } }>(withLocale('/organization/student-council')),
  eldersCouncil: () => getJson<{ data: { eldersCouncil: PublicEldersCouncil } }>(withLocale('/organization/elders-council')),
  campaigns: () => getJson<{ data: { campaigns: PublicCampaign[] } }>(withLocale('/organization/get-involved')),
  alumni: () => getJson<{ data: { alumni: PublicAlumni } }>(withLocale('/organization/alumni')),
}
