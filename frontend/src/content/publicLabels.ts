import { PublicLanguage } from '../localization/languages'

export const publicLabels = {
  sv: {
    organization: 'Organisation', board: 'Styrelsen', council: 'Fullmäktige', committees: 'Kommittéer', tutoring: 'Tutoring', staff: 'Personal', elders: 'Äldres Råd', representatives: 'Studeranderepresentanter', alumni: 'Alumner', getInvolved: 'Engagera dig', governance: 'Styrning', publicGovernance: 'Offentlig styrning', documents: 'Dokument', documentList: 'Dokumentlista', publicDocuments: 'Offentliga dokument', allTypes: 'Alla typer', year: 'År', noDocuments: 'Inga publicerade dokument matchar filtret.', fullmaktigeDocuments: 'Fullmäktige dokument', meetingNotices: 'Kallelser', agendas: 'Föredragningslistor', minutes: 'Protokoll', speaker: 'Talman', contact: 'Kontakt', members: 'Ledamöter', role: 'Roll', appointedBy: 'Utses av', mandate: 'Mandat', advisoryBody: 'Rådgivande organ', application: 'Ansökan', eligibility: 'Valbarhet', open: 'Öppen', closed: 'Stängd', comingSoon: 'Kommer snart', other: 'Annat', deputy: 'Suppleant', representative: 'Representant', apply: 'Ansök', noPeople: 'Inga personer är publicerade ännu.', loading: 'Laddar...', joinAlumni: 'Gå med i alumninätverket', current: 'Nuvarande', calls: 'Utlysningar', seats: 'plats(er)', months: 'mån', ordinary: 'ordinarie', deputies: 'suppleanter'
  },
  en: {
    organization: 'Organization', board: 'Board', council: 'Student Council', committees: 'Committees', tutoring: 'Tutoring', staff: 'Staff', elders: 'Elders’ Council', representatives: 'Student Representatives', alumni: 'Alumni', getInvolved: 'Get Involved', governance: 'Governance', publicGovernance: 'Public Governance', documents: 'Documents', documentList: 'Document list', publicDocuments: 'Public documents', allTypes: 'All types', year: 'Year', noDocuments: 'No published documents match the filter.', fullmaktigeDocuments: 'Student Council documents', meetingNotices: 'Meeting notices', agendas: 'Agendas', minutes: 'Minutes', speaker: 'Speaker', contact: 'Contact', members: 'Members', role: 'Role', appointedBy: 'Appointed by', mandate: 'Term', advisoryBody: 'Advisory body', application: 'Application', eligibility: 'Eligibility', open: 'Open', closed: 'Closed', comingSoon: 'Coming soon', other: 'Other', deputy: 'Deputy', representative: 'Representative', apply: 'Apply', noPeople: 'No people have been published yet.', loading: 'Loading...', joinAlumni: 'Join the Alumni Network', current: 'Current', calls: 'Calls', seats: 'seat(s)', months: 'mo', ordinary: 'ordinary', deputies: 'deputies'
  },
} as const

export function publicText(locale: PublicLanguage) {
  return publicLabels[locale]
}
