export type GovernanceDocumentType = 'meeting_notice' | 'agenda' | 'minutes' | 'statutes' | 'regulations' | 'annual_report' | 'financial_statement' | 'policy' | 'other'
export type GovernanceBody = 'fullmaktige' | 'student_union' | 'other'
export type GovernanceDocumentLanguage = 'sv' | 'en' | 'bilingual'
export interface PublicGovernanceDocument { id: string; title: string; slug: string; description: string; documentType: GovernanceDocumentType; governanceBody: GovernanceBody; meetingDate?: string; publishDate?: string; documentDate?: string; year?: number; language: GovernanceDocumentLanguage; fileUrl: string; fileName?: string; externalUrl?: string; fileSize?: number; publishedAt?: string; displayOrder: number; tags: string }
export interface PublicGovernanceOverview { settings: { intro: string; documentPolicyText: string; contactEmail?: string; visible: boolean }; latestDocuments: PublicGovernanceDocument[]; sections: Array<{ key: string; label: string; href: string; description: string }> }
export interface FullmaktigeDocumentsOverview { meetingNotices: PublicGovernanceDocument[]; agendas: PublicGovernanceDocument[]; minutes: PublicGovernanceDocument[] }
