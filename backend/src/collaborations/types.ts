import { PublicLanguage } from '../localization/languages';

export type CollaborationLocale = Extract<PublicLanguage, 'sv' | 'en'>;
export type CollaborationType = 'arcada_association' | 'student_nation' | 'sponsor' | 'company' | 'university' | 'strategic_partner' | 'student_organization' | 'public_body' | 'alumni_association' | 'other';

export interface LocalizedText { sv: string; en: string; }
export interface SocialLinks { instagram?: string; linkedin?: string; facebook?: string; tiktok?: string; youtube?: string; other?: string; }

export interface Collaboration {
  id: string;
  name: string;
  slug: string;
  type: CollaborationType;
  description: LocalizedText;
  shortDescription?: LocalizedText;
  logoUrl?: string;
  logoAltText?: LocalizedText;
  websiteUrl?: string;
  email?: string;
  contactPerson?: string;
  phone?: string;
  socialLinks: SocialLinks;
  officeAtCor: boolean;
  officeLocation?: string;
  officeHours?: LocalizedText;
  publicContactInfo?: LocalizedText;
  active: boolean;
  visible: boolean;
  featured: boolean;
  displayOrder: number;
  tags?: LocalizedText;
  internalNotes?: string;
  relationshipOwner?: string;
  validFrom?: Date;
  validUntil?: Date;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicCollaboration {
  id: string;
  name: string;
  slug: string;
  type: CollaborationType;
  typeLabel: string;
  description: string;
  shortDescription?: string;
  logoUrl?: string;
  logoAltText?: string;
  websiteUrl?: string;
  email?: string;
  contactPerson?: string;
  phone?: string;
  socialLinks: SocialLinks;
  officeAtCor: boolean;
  officeLocation?: string;
  officeHours?: string;
  publicContactInfo?: string;
  featured: boolean;
  displayOrder: number;
  tags?: string;
  validFrom?: Date;
  validUntil?: Date;
  updatedAt: Date;
}

export interface CollaborationSettings {
  id: string;
  intro: LocalizedText;
  featuredIntro?: LocalizedText;
  contactEmail?: string;
  visible: boolean;
  updatedAt: Date;
}

export interface PublicCollaborationSettings {
  intro: string;
  featuredIntro?: string;
  contactEmail?: string;
  visible: boolean;
  updatedAt: Date;
}

export interface CollaborationListFilters { type?: CollaborationType; featured?: boolean; search?: string; officeAtCor?: boolean; tag?: string; }
export interface AdminCollaborationFilters extends CollaborationListFilters { active?: boolean; visible?: boolean; featured?: boolean; }

export interface CollaborationService {
  listPublic(filters: CollaborationListFilters, locale: CollaborationLocale): Promise<PublicCollaboration[]>;
  getPublicBySlug(slug: string, locale: CollaborationLocale): Promise<PublicCollaboration>;
  listTypes(locale: CollaborationLocale): Promise<Array<{ type: CollaborationType; label: string }>>;
  getPublicSettings(locale: CollaborationLocale): Promise<PublicCollaborationSettings>;
  listAdmin(filters: AdminCollaborationFilters): Promise<Collaboration[]>;
  create(input: Omit<Collaboration, 'id' | 'createdAt' | 'updatedAt'>): Promise<Collaboration>;
  update(id: string, input: Omit<Collaboration, 'id' | 'createdAt' | 'updatedAt'>): Promise<Collaboration>;
  deactivate(id: string): Promise<void>;
  getSettings(): Promise<CollaborationSettings>;
  updateSettings(input: Omit<CollaborationSettings, 'id' | 'updatedAt'>): Promise<CollaborationSettings>;
}

export const collaborationTypeLabels: Record<CollaborationType, { sv: string; en: string }> = {
  arcada_association: { sv: 'Specialförening', en: 'Arcada Association' },
  student_nation: { sv: 'Studentnation', en: 'Student Nation' },
  sponsor: { sv: 'Sponsor', en: 'Sponsor' },
  company: { sv: 'Företag', en: 'Company' },
  university: { sv: 'Universitet', en: 'University' },
  strategic_partner: { sv: 'Partner', en: 'Partner' },
  student_organization: { sv: 'Studentorganisation', en: 'Student Organization' },
  public_body: { sv: 'Offentligt organ', en: 'Public Body' },
  alumni_association: { sv: 'Alumnförening', en: 'Alumni Association' },
  other: { sv: 'Annat', en: 'Other' },
};
