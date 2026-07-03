export type CollaborationType = 'arcada_association' | 'student_nation' | 'sponsor' | 'company' | 'university' | 'strategic_partner' | 'student_organization' | 'public_body' | 'alumni_association' | 'other'
export interface LocalizedText { sv: string; en: string }
export interface SocialLinks { instagram?: string; linkedin?: string; facebook?: string; tiktok?: string; youtube?: string; other?: string }
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
  phone?: string
  socialLinks: SocialLinks
  officeAtCor: boolean
  officeLocation?: string
  officeHours?: LocalizedText
  publicContactInfo?: LocalizedText
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
export interface CollaborationSettings { id: string; intro: LocalizedText; featuredIntro?: LocalizedText; contactEmail?: string; visible: boolean; updatedAt?: string }
