export type CollaborationType = 'arcada_association' | 'student_nation' | 'sponsor' | 'company' | 'university' | 'strategic_partner' | 'student_organization' | 'other'
export interface SocialLinks { instagram?: string; linkedin?: string; facebook?: string; tiktok?: string; other?: string }
export interface PublicCollaboration { id: string; name: string; slug: string; type: CollaborationType; typeLabel: string; description: string; shortDescription?: string; logoUrl?: string; logoAltText?: string; websiteUrl?: string; email?: string; contactPerson?: string; socialLinks: SocialLinks; officeAtCor: boolean; officeHours?: string; location?: string; featured: boolean; displayOrder: number; tags?: string; updatedAt?: string }
export interface PublicCollaborationSettings { intro: string; contactEmail?: string; visible: boolean; updatedAt?: string }
export interface CollaborationTypeOption { type: CollaborationType; label: string }
