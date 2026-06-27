export interface LocalizedText { sv: string; en: string }
export type GovernanceDocumentType = 'meeting_notice' | 'agenda' | 'minutes' | 'statutes' | 'regulations' | 'annual_report' | 'financial_statement' | 'policy' | 'other'
export type GovernanceBody = 'fullmaktige' | 'student_union' | 'other'
export type GovernanceDocumentLanguage = 'sv' | 'en' | 'bilingual'
export interface GovernanceDocument { id: string; title: LocalizedText; slug: string; description: LocalizedText; documentType: GovernanceDocumentType; governanceBody: GovernanceBody; meetingDate?: string; publishDate?: string; documentDate?: string; year?: number; language: GovernanceDocumentLanguage; fileUrl: string; fileName?: string; externalUrl?: string; fileSize?: number; isPublic: boolean; isPublished: boolean; publishedAt?: string; displayOrder: number; tags: LocalizedText; createdBy?: string; updatedBy?: string; createdAt?: string; updatedAt?: string }
export interface GovernanceSettings { id: string; intro: LocalizedText; documentPolicyText: LocalizedText; contactEmail?: string; visible: boolean; updatedAt?: string }
