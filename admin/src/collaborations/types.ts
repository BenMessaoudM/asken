export type CollaborationType = 'arcada_association' | 'student_nation' | 'sponsor' | 'company' | 'university' | 'strategic_partner' | 'student_organization' | 'other'
export interface LocalizedText { sv: string; en: string }
export interface SocialLinks { instagram?: string; linkedin?: string; facebook?: string; tiktok?: string; other?: string }
export interface Collaboration {
  id: string
  name: string
  slug: string
  type: CollaborationType
  description: LocalizedText
  shortDescription?: LocalizedText
  logoUrl?: string
  logoAltText?: LocalizedText
  websiteUrl?: string
  email?: string
  contactPerson?: string
  socialLinks: SocialLinks
  officeAtCor: boolean
  officeHours?: LocalizedText
  location?: string
  active: boolean
  visible: boolean
  featured: boolean
  displayOrder: number
  tags?: LocalizedText
  internalNotes?: string
  relationshipOwner?: string
  validFrom?: string
  validUntil?: string
  createdAt?: string
  updatedAt?: string
}
export interface CollaborationSettings { id: string; intro: LocalizedText; contactEmail?: string; visible: boolean; updatedAt?: string }
