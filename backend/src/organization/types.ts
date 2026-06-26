import { PublicLanguage } from '../localization/languages';

export type OrganizationLocale = PublicLanguage;
export type OrganizationPersonType = 'board' | 'staff' | 'council' | 'committee' | 'alumni' | 'other';
export type RecruitmentCampaignType = 'tutor' | 'board' | 'student_council' | 'crew_member' | 'staff' | 'alumni' | 'other';
export type RecruitmentCampaignStatus = 'coming_soon' | 'open' | 'closed';
export type StudentCouncilDocumentType = 'agenda' | 'protocol' | 'bylaws' | 'other';

export interface LocalizedText { sv: string; en: string; }
export interface SocialLinks { instagram?: string; linkedIn?: string; website?: string; }
export interface OfficeHours { sv?: string; en?: string; }
export interface RoleBadge {
  id: string; name: LocalizedText; description: LocalizedText; icon?: string; color?: string; link?: string;
  active: boolean; displayOrder: number; createdAt: Date; updatedAt: Date;
}
export interface OrganizationPerson {
  id: string; fullName: string; nickname?: string; slug: string; photoUrl?: string; photoAltText: LocalizedText;
  positionTitle: LocalizedText; description: LocalizedText; responsibilities: LocalizedText; email: string; phone?: string;
  languagesSpoken: string[]; roleBadgeIds: string[]; roleBadges?: RoleBadge[]; socialLinks: SocialLinks; officeHours?: OfficeHours;
  type: OrganizationPersonType; displayOrder: number; active: boolean; visible: boolean; startDate?: Date; endDate?: Date;
  createdAt: Date; updatedAt: Date;
}
export interface PublicOrganizationPerson {
  id: string; fullName: string; nickname?: string; slug: string; photoUrl?: string; photoAltText: string;
  positionTitle: string; description: string; responsibilities: string; email: string; phone?: string;
  languagesSpoken: string[]; roleBadges: Array<{ name: string; description: string; icon?: string; color?: string; link?: string }>;
  socialLinks: SocialLinks; officeHours?: string; type: OrganizationPersonType;
}
export interface Committee {
  id: string; name: LocalizedText; slug: string; description: LocalizedText; responsibilities: LocalizedText;
  contactEmail?: string; contactPersonId?: string; personIds: string[]; active: boolean; visible: boolean; displayOrder: number;
  createdAt: Date; updatedAt: Date;
}
export interface PublicCommittee {
  id: string; name: string; slug: string; description: string; responsibilities: string; contactEmail?: string;
  contactPerson?: PublicOrganizationPerson; members: PublicOrganizationPerson[];
}
export interface StudentCouncilMember { name: string; title?: string; displayOrder: number; active: boolean; }
export interface StudentCouncilDocumentLink { label: LocalizedText; url: string; type: StudentCouncilDocumentType; }
export interface StudentCouncilSettings {
  id: string; title: LocalizedText; description: LocalizedText; speakerName?: string; speakerEmail?: string;
  viceSpeakerName?: string; viceSpeakerEmail?: string; contactEmail: string; members: StudentCouncilMember[];
  documentLinks: StudentCouncilDocumentLink[]; visible: boolean; updatedAt: Date;
}
export interface PublicStudentCouncilSettings {
  title: string; description: string; speakerName?: string; speakerEmail?: string; viceSpeakerName?: string;
  viceSpeakerEmail?: string; contactEmail: string; members: StudentCouncilMember[];
  documentLinks: Array<{ label: string; url: string; type: StudentCouncilDocumentType }>; visible: boolean; updatedAt: Date;
}
export interface RecruitmentCampaign {
  id: string; title: LocalizedText; description: LocalizedText; type: RecruitmentCampaignType; openingDate: Date; closingDate: Date;
  ctaLabel: LocalizedText; ctaUrl: string; contactPersonId?: string; contactEmail?: string; featured: boolean; published: boolean;
  status: RecruitmentCampaignStatus; displayOrder: number; active: boolean; createdAt: Date; updatedAt: Date;
}
export interface PublicRecruitmentCampaign {
  id: string; title: string; description: string; type: RecruitmentCampaignType; openingDate: Date; closingDate: Date;
  ctaLabel: string; ctaUrl: string; contactPerson?: PublicOrganizationPerson; contactEmail?: string; featured: boolean; status: RecruitmentCampaignStatus;
}
export interface AlumniPageContent {
  id: string; title: LocalizedText; intro: LocalizedText; body: LocalizedText; heroImageUrl?: string; heroImageAltText: LocalizedText;
  benefits: LocalizedText[]; ctaPrimaryLabel: LocalizedText; ctaPrimaryUrl: string; ctaSecondaryLabel?: LocalizedText;
  ctaSecondaryUrl?: string; contactEmail?: string; published: boolean; updatedAt: Date;
}
export interface PublicAlumniPageContent {
  title: string; intro: string; body: string; heroImageUrl?: string; heroImageAltText: string; benefits: string[];
  ctaPrimaryLabel: string; ctaPrimaryUrl: string; ctaSecondaryLabel?: string; ctaSecondaryUrl?: string; contactEmail?: string;
  published: boolean; updatedAt: Date;
}
export interface OrganizationOverview {
  sections: Array<{ key: string; label: string; href: string; description: string }>;
  featuredCampaigns: PublicRecruitmentCampaign[];
}
export interface OrganizationService {
  overview(locale: OrganizationLocale): Promise<OrganizationOverview>;
  listPublicPeople(type: OrganizationPersonType, locale: OrganizationLocale): Promise<PublicOrganizationPerson[]>;
  listPublicCommittees(locale: OrganizationLocale): Promise<PublicCommittee[]>;
  getPublicStudentCouncil(locale: OrganizationLocale): Promise<PublicStudentCouncilSettings>;
  listPublicRecruitmentCampaigns(locale: OrganizationLocale): Promise<PublicRecruitmentCampaign[]>;
  getPublicAlumni(locale: OrganizationLocale): Promise<PublicAlumniPageContent>;
  listPeople(type?: OrganizationPersonType): Promise<OrganizationPerson[]>;
  createPerson(input: Omit<OrganizationPerson, 'id' | 'createdAt' | 'updatedAt' | 'roleBadges'>): Promise<OrganizationPerson>;
  updatePerson(id: string, input: Omit<OrganizationPerson, 'id' | 'createdAt' | 'updatedAt' | 'roleBadges'>): Promise<OrganizationPerson>;
  deactivatePerson(id: string): Promise<void>;
  listRoleBadges(): Promise<RoleBadge[]>;
  createRoleBadge(input: Omit<RoleBadge, 'id' | 'createdAt' | 'updatedAt'>): Promise<RoleBadge>;
  updateRoleBadge(id: string, input: Omit<RoleBadge, 'id' | 'createdAt' | 'updatedAt'>): Promise<RoleBadge>;
  deactivateRoleBadge(id: string): Promise<void>;
  listCommittees(): Promise<Committee[]>;
  createCommittee(input: Omit<Committee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Committee>;
  updateCommittee(id: string, input: Omit<Committee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Committee>;
  deactivateCommittee(id: string): Promise<void>;
  getStudentCouncil(): Promise<StudentCouncilSettings>;
  updateStudentCouncil(input: Omit<StudentCouncilSettings, 'id' | 'updatedAt'>): Promise<StudentCouncilSettings>;
  listRecruitmentCampaigns(): Promise<RecruitmentCampaign[]>;
  createRecruitmentCampaign(input: Omit<RecruitmentCampaign, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: RecruitmentCampaignStatus }): Promise<RecruitmentCampaign>;
  updateRecruitmentCampaign(id: string, input: Omit<RecruitmentCampaign, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: RecruitmentCampaignStatus }): Promise<RecruitmentCampaign>;
  deactivateRecruitmentCampaign(id: string): Promise<void>;
  getAlumni(): Promise<AlumniPageContent>;
  updateAlumni(input: Omit<AlumniPageContent, 'id' | 'updatedAt'>): Promise<AlumniPageContent>;
}
