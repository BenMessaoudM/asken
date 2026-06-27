import { Types } from 'mongoose';
import { slugify } from '../../cms/utils/slug';
import { AppError } from '../../http/errors';
import { localizedValue } from '../../localization/languages';
import { AlumniPageContentModel } from '../models/AlumniPageContent';
import { CommitteeModel } from '../models/Committee';
import { EldersCouncilSettingsModel } from '../models/EldersCouncilSettings';
import { OrganizationPersonModel } from '../models/OrganizationPerson';
import { OrganizationRoleBadgeModel } from '../models/OrganizationRoleBadge';
import { RecruitmentCampaignModel } from '../models/RecruitmentCampaign';
import { StudentCouncilSettingsModel } from '../models/StudentCouncilSettings';
import { AlumniPageContent, Committee, EldersCouncilSettings, LocalizedText, OrganizationLocale, OrganizationPerson, OrganizationPersonType, OrganizationService, PublicAlumniPageContent, PublicCommittee, PublicEldersCouncilSettings, PublicOrganizationPerson, PublicRecruitmentCampaign, PublicStudentCouncilSettings, RecruitmentCampaign, RecruitmentCampaignStatus, RoleBadge, StudentCouncilSettings } from '../types';

type AnyDoc = Record<string, any>;

export function calculateRecruitmentStatus(openingDate: Date, closingDate: Date, now = new Date()): RecruitmentCampaignStatus {
  if (now < openingDate) return 'coming_soon';
  if (now > closingDate) return 'closed';
  return 'open';
}

const defaultCouncil = {
  singletonKey: 'student-council',
  title: { sv: 'Fullmäktige', en: 'Student Council' },
  description: { sv: 'Fullmäktige är ASK:s högsta beslutande organ.', en: 'The Student Council is ASK’s highest decision-making body.' },
  contactEmail: 'info@asken.fi', members: [], documentLinks: [], visible: true,
};
const defaultEldersCouncil = {
  singletonKey: 'elders-council',
  title: { sv: 'Äldres Råd', en: 'Elders’ Council' },
  description: { sv: 'Äldres Råd är ett rådgivande organ för studerandekåren. Rådet utses av Fullmäktige och består enligt reglementet av nio medlemmar med treårigt mandat. Fullmäktige kompletterar avgående medlemmar årligen vid höstmötet.', en: 'The Elders’ Council is an advisory body of the Student Union. It is appointed by the Student Council and, under the regulations, consists of nine members with a three-year mandate. The Student Council supplements outgoing members annually at the autumn meeting.' },
  contactEmail: 'aldresrad@asken.fi', members: [], visible: true,
};
const defaultAlumni = {
  singletonKey: 'alumni',
  title: { sv: 'Alumner', en: 'Alumni' },
  intro: { sv: 'ASK Alumni samlar tidigare studerande och vänner till ASK.', en: 'ASK Alumni connects former students and friends of ASK.' },
  body: { sv: 'Här kan framtida styrelser uppdatera information om alumninätverket, evenemang och sätt att stöda ASK.', en: 'Future boards can update information about the alumni network, events and ways to support ASK here.' },
  heroImageAltText: { sv: '', en: '' },
  benefits: [{ sv: 'Nätverk med andra alumner', en: 'Network with other alumni' }, { sv: 'Ta del av alumni-evenemang', en: 'Join alumni events' }, { sv: 'Stöd ASK:s fortsatta arbete', en: 'Support ASK’s continued work' }],
  ctaPrimaryLabel: { sv: 'Boka Cor-huset som alumn', en: 'Book Cor House as Alumni' },
  ctaPrimaryUrl: '/booking?category=alumni',
  ctaSecondaryLabel: { sv: 'Gå med i alumninätverket', en: 'Join the Alumni Network' },
  ctaSecondaryUrl: 'mailto:info@asken.fi', contactEmail: 'info@asken.fi', published: true,
};

export class MongooseOrganizationService implements OrganizationService {
  async overview(locale: OrganizationLocale) {
    const descriptions: Record<string, LocalizedText> = {
      board: { sv: 'Möt ASK:s styrelse och deras offentliga ansvarsområden.', en: 'Meet ASK’s board and their public responsibilities.' },
      council: { sv: 'Läs om Fullmäktige och offentliga kontaktuppgifter.', en: 'Read about the Student Council and public contacts.' },
      committees: { sv: 'Se kommittéer och kontaktvägar.', en: 'See committees and contact channels.' },
      tutoring: { sv: 'Information om tutoring för nya och utbytesstuderande.', en: 'Information about tutoring for new and exchange students.' },
      staff: { sv: 'Kontakt till ASK:s personal.', en: 'Contact ASK staff.' },
      elders: { sv: 'Äldres Råd är studerandekårens rådgivande organ, utsett av Fullmäktige.', en: 'The Elders’ Council is the Student Union advisory body appointed by the Student Council.' },
      alumni: { sv: 'ASK Alumni, nätverk och Cor-huset för alumner.', en: 'ASK Alumni, network and Cor House for alumni.' },
      involved: { sv: 'Aktuella sätt att engagera dig i ASK.', en: 'Current ways to get involved in ASK.' },
    };
    return {
      sections: [
        ['board', 'Styrelsen / Board', '/organisation/styrelsen'], ['council', 'Fullmäktige / Student Council', '/organisation/fullmaktige'],
        ['committees', 'Kommittéer / Committees', '/organisation/kommitteer'], ['tutoring', 'Tutoring', '/organisation/tutoring'],
        ['staff', 'Personal / Staff', '/organisation/personal'], ['elders', 'Äldres Råd / Elders’ Council', '/organisation/aldres-rad'], ['alumni', 'Alumner / Alumni', '/alumner'], ['involved', 'Engagera dig / Get Involved', '/organisation/engagera-dig'],
      ].map(([key, label, href]) => ({ key, label, href, description: localizedValue(descriptions[key], locale) })),
      featuredCampaigns: (await this.listPublicRecruitmentCampaigns(locale)).filter((campaign) => campaign.featured),
    };
  }
  async listPublicPeople(type: OrganizationPersonType, locale: OrganizationLocale) {
    return this.publicPeople(await OrganizationPersonModel.find({ type, active: true, visible: true }).sort({ displayOrder: 1, fullName: 1 }).lean(), locale);
  }
  async listPublicCommittees(locale: OrganizationLocale) {
    const docs = await CommitteeModel.find({ active: true, visible: true }).sort({ displayOrder: 1, 'name.sv': 1 }).lean();
    const people = await OrganizationPersonModel.find({ _id: { $in: docs.flatMap((c: AnyDoc) => [c.contactPersonId, ...(c.personIds || [])].filter(Boolean)) }, active: true, visible: true }).lean();
    const mapped = await this.publicPeople(people, locale); const byId = new Map(mapped.map((p) => [p.id, p]));
    return docs.map((doc: AnyDoc): PublicCommittee => ({ id: doc._id.toString(), name: localizedValue(doc.name, locale), slug: doc.slug, description: localizedValue(doc.description, locale), responsibilities: localizedValue(doc.responsibilities, locale), contactEmail: doc.contactEmail, contactPerson: doc.contactPersonId ? byId.get(doc.contactPersonId.toString()) : undefined, members: (doc.personIds || []).map((personId: Types.ObjectId) => byId.get(personId.toString())).filter(Boolean) as PublicOrganizationPerson[] }));
  }
  async getPublicStudentCouncil(locale: OrganizationLocale) { return this.publicCouncil(await this.getStudentCouncil(), locale); }
  async getPublicEldersCouncil(locale: OrganizationLocale) { return this.publicEldersCouncil(await this.getEldersCouncil(), locale); }
  async listPublicRecruitmentCampaigns(locale: OrganizationLocale) {
    const docs = await RecruitmentCampaignModel.find({ active: true, published: true }).sort({ featured: -1, displayOrder: 1, openingDate: 1 }).lean();
    const people = await this.publicPeople(await OrganizationPersonModel.find({ _id: { $in: docs.map((d: AnyDoc) => d.contactPersonId).filter(Boolean) }, active: true, visible: true }).lean(), locale);
    const byId = new Map(people.map((p) => [p.id, p]));
    return docs.map((doc: AnyDoc): PublicRecruitmentCampaign => ({ id: doc._id.toString(), title: localizedValue(doc.title, locale), description: localizedValue(doc.description, locale), type: doc.type, openingDate: doc.openingDate, closingDate: doc.closingDate, ctaLabel: localizedValue(doc.ctaLabel, locale), ctaUrl: doc.ctaUrl, contactPerson: doc.contactPersonId ? byId.get(doc.contactPersonId.toString()) : undefined, contactEmail: doc.contactEmail, featured: doc.featured, status: calculateRecruitmentStatus(doc.openingDate, doc.closingDate) }));
  }
  async getPublicAlumni(locale: OrganizationLocale) { return this.publicAlumni(await this.getAlumni(), locale); }
  async listPeople(type?: OrganizationPersonType) { return this.people(await OrganizationPersonModel.find(type ? { type } : {}).sort({ type: 1, displayOrder: 1, fullName: 1 }).lean()); }
  async createPerson(input: Omit<OrganizationPerson, 'id' | 'createdAt' | 'updatedAt' | 'roleBadges'>) { try { const doc = await OrganizationPersonModel.create({ ...input, slug: this.slug(input.slug || input.fullName) }); return (await this.listPeople()).find((p) => p.id === doc.id)!; } catch (e) { this.dup(e, 'ORGANIZATION_PERSON_SLUG_IN_USE'); throw e; } }
  async updatePerson(id: string, input: Omit<OrganizationPerson, 'id' | 'createdAt' | 'updatedAt' | 'roleBadges'>) { this.id(id); try { const doc = await OrganizationPersonModel.findByIdAndUpdate(id, { $set: { ...input, slug: this.slug(input.slug || input.fullName) } }, { new: true }); if (!doc) throw new AppError(404, 'ORGANIZATION_PERSON_NOT_FOUND', 'Organization person was not found'); return (await this.listPeople()).find((p) => p.id === id)!; } catch (e) { this.dup(e, 'ORGANIZATION_PERSON_SLUG_IN_USE'); throw e; } }
  async deactivatePerson(id: string) { this.id(id); const r = await OrganizationPersonModel.updateOne({ _id: id }, { $set: { active: false, visible: false } }); if (!r.matchedCount) throw new AppError(404, 'ORGANIZATION_PERSON_NOT_FOUND', 'Organization person was not found'); }
  async listRoleBadges() { return (await OrganizationRoleBadgeModel.find().sort({ displayOrder: 1, 'name.sv': 1 }).lean()).map(this.badge); }
  async createRoleBadge(input: Omit<RoleBadge, 'id' | 'createdAt' | 'updatedAt'>) { return this.badge((await OrganizationRoleBadgeModel.create(input)).toObject()); }
  async updateRoleBadge(id: string, input: Omit<RoleBadge, 'id' | 'createdAt' | 'updatedAt'>) { this.id(id); const doc = await OrganizationRoleBadgeModel.findByIdAndUpdate(id, { $set: input }, { new: true }).lean(); if (!doc) throw new AppError(404, 'ROLE_BADGE_NOT_FOUND', 'Role badge was not found'); return this.badge(doc); }
  async deactivateRoleBadge(id: string) { this.id(id); const r = await OrganizationRoleBadgeModel.updateOne({ _id: id }, { $set: { active: false } }); if (!r.matchedCount) throw new AppError(404, 'ROLE_BADGE_NOT_FOUND', 'Role badge was not found'); }
  async listCommittees() { return (await CommitteeModel.find().sort({ displayOrder: 1, 'name.sv': 1 }).lean()).map(this.committee); }
  async createCommittee(input: Omit<Committee, 'id' | 'createdAt' | 'updatedAt'>) { try { return this.committee((await CommitteeModel.create({ ...input, slug: this.slug(input.slug || input.name.sv) })).toObject()); } catch (e) { this.dup(e, 'COMMITTEE_SLUG_IN_USE'); throw e; } }
  async updateCommittee(id: string, input: Omit<Committee, 'id' | 'createdAt' | 'updatedAt'>) { this.id(id); try { const doc = await CommitteeModel.findByIdAndUpdate(id, { $set: { ...input, slug: this.slug(input.slug || input.name.sv) } }, { new: true }).lean(); if (!doc) throw new AppError(404, 'COMMITTEE_NOT_FOUND', 'Committee was not found'); return this.committee(doc); } catch (e) { this.dup(e, 'COMMITTEE_SLUG_IN_USE'); throw e; } }
  async deactivateCommittee(id: string) { this.id(id); const r = await CommitteeModel.updateOne({ _id: id }, { $set: { active: false, visible: false } }); if (!r.matchedCount) throw new AppError(404, 'COMMITTEE_NOT_FOUND', 'Committee was not found'); }
  async getStudentCouncil() { const doc = await StudentCouncilSettingsModel.findOneAndUpdate({ singletonKey: 'student-council' }, { $setOnInsert: defaultCouncil }, { upsert: true, new: true }).lean(); return this.council(doc); }
  async updateStudentCouncil(input: Omit<StudentCouncilSettings, 'id' | 'updatedAt'>) { const doc = await StudentCouncilSettingsModel.findOneAndUpdate({ singletonKey: 'student-council' }, { $set: input }, { upsert: true, new: true }).lean(); return this.council(doc); }
  async getEldersCouncil() { const doc = await EldersCouncilSettingsModel.findOneAndUpdate({ singletonKey: 'elders-council' }, { $setOnInsert: defaultEldersCouncil }, { upsert: true, new: true }).lean(); return this.eldersCouncil(doc); }
  async updateEldersCouncil(input: Omit<EldersCouncilSettings, 'id' | 'updatedAt'>) { const doc = await EldersCouncilSettingsModel.findOneAndUpdate({ singletonKey: 'elders-council' }, { $set: input }, { upsert: true, new: true }).lean(); return this.eldersCouncil(doc); }
  async listRecruitmentCampaigns() { return (await RecruitmentCampaignModel.find().sort({ displayOrder: 1, openingDate: -1 }).lean()).map(this.campaign); }
  async createRecruitmentCampaign(input: Omit<RecruitmentCampaign, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: RecruitmentCampaignStatus }) { return this.campaign((await RecruitmentCampaignModel.create({ ...input, status: input.status || calculateRecruitmentStatus(input.openingDate, input.closingDate) })).toObject()); }
  async updateRecruitmentCampaign(id: string, input: Omit<RecruitmentCampaign, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: RecruitmentCampaignStatus }) { this.id(id); const doc = await RecruitmentCampaignModel.findByIdAndUpdate(id, { $set: { ...input, status: input.status || calculateRecruitmentStatus(input.openingDate, input.closingDate) } }, { new: true }).lean(); if (!doc) throw new AppError(404, 'RECRUITMENT_CAMPAIGN_NOT_FOUND', 'Recruitment campaign was not found'); return this.campaign(doc); }
  async deactivateRecruitmentCampaign(id: string) { this.id(id); const r = await RecruitmentCampaignModel.updateOne({ _id: id }, { $set: { active: false, published: false } }); if (!r.matchedCount) throw new AppError(404, 'RECRUITMENT_CAMPAIGN_NOT_FOUND', 'Recruitment campaign was not found'); }
  async getAlumni() { const doc = await AlumniPageContentModel.findOneAndUpdate({ singletonKey: 'alumni' }, { $setOnInsert: defaultAlumni }, { upsert: true, new: true }).lean(); return this.alumni(doc); }
  async updateAlumni(input: Omit<AlumniPageContent, 'id' | 'updatedAt'>) { const doc = await AlumniPageContentModel.findOneAndUpdate({ singletonKey: 'alumni' }, { $set: input }, { upsert: true, new: true }).lean(); return this.alumni(doc); }
  private async publicPeople(docs: AnyDoc[], locale: OrganizationLocale) { const badges = new Map((await this.listRoleBadges()).filter((b) => b.active).map((b) => [b.id, b])); return docs.map((doc): PublicOrganizationPerson => ({ id: doc._id.toString(), fullName: doc.fullName, nickname: doc.nickname, slug: doc.slug, photoUrl: doc.photoUrl, photoAltText: localizedValue(doc.photoAltText, locale), positionTitle: localizedValue(doc.positionTitle, locale), description: localizedValue(doc.description, locale), responsibilities: localizedValue(doc.responsibilities, locale), email: doc.email, phone: doc.phone, languagesSpoken: doc.languagesSpoken || [], roleBadges: (doc.roleBadgeIds || []).map((badgeId: Types.ObjectId) => badges.get(badgeId.toString())).filter(Boolean).map((b: RoleBadge | undefined) => ({ name: localizedValue(b!.name, locale), description: localizedValue(b!.description, locale), icon: b!.icon, color: b!.color, link: b!.link })), socialLinks: doc.socialLinks || {}, officeHours: doc.officeHours ? localizedValue(doc.officeHours, locale) : undefined, type: doc.type })); }
  private async people(docs: AnyDoc[]) { const badgeMap = new Map((await this.listRoleBadges()).map((b) => [b.id, b])); return docs.map((doc) => ({ ...this.person(doc), roleBadges: (doc.roleBadgeIds || []).map((id: Types.ObjectId) => badgeMap.get(id.toString())).filter(Boolean) })); }
  private person = (doc: AnyDoc): OrganizationPerson => ({ id: doc._id.toString(), fullName: doc.fullName, nickname: doc.nickname, slug: doc.slug, photoUrl: doc.photoUrl, photoAltText: doc.photoAltText || { sv: '', en: '' }, positionTitle: doc.positionTitle || { sv: '', en: '' }, description: doc.description || { sv: '', en: '' }, responsibilities: doc.responsibilities || { sv: '', en: '' }, email: doc.email, phone: doc.phone, languagesSpoken: doc.languagesSpoken || [], roleBadgeIds: (doc.roleBadgeIds || []).map((x: Types.ObjectId) => x.toString()), socialLinks: doc.socialLinks || {}, officeHours: doc.officeHours, type: doc.type, displayOrder: doc.displayOrder, active: doc.active, visible: doc.visible, startDate: doc.startDate, endDate: doc.endDate, createdAt: doc.createdAt, updatedAt: doc.updatedAt });
  private badge = (doc: AnyDoc): RoleBadge => ({ id: doc._id.toString(), name: doc.name || { sv: '', en: '' }, description: doc.description || { sv: '', en: '' }, icon: doc.icon, color: doc.color, link: doc.link, active: doc.active, displayOrder: doc.displayOrder, createdAt: doc.createdAt, updatedAt: doc.updatedAt });
  private committee = (doc: AnyDoc): Committee => ({ id: doc._id.toString(), name: doc.name || { sv: '', en: '' }, slug: doc.slug, description: doc.description || { sv: '', en: '' }, responsibilities: doc.responsibilities || { sv: '', en: '' }, contactEmail: doc.contactEmail, contactPersonId: doc.contactPersonId?.toString(), personIds: (doc.personIds || []).map((x: Types.ObjectId) => x.toString()), active: doc.active, visible: doc.visible, displayOrder: doc.displayOrder, createdAt: doc.createdAt, updatedAt: doc.updatedAt });
  private council = (doc: AnyDoc): StudentCouncilSettings => ({ id: doc._id.toString(), title: doc.title, description: doc.description, speakerName: doc.speakerName, speakerEmail: doc.speakerEmail, viceSpeakerName: doc.viceSpeakerName, viceSpeakerEmail: doc.viceSpeakerEmail, contactEmail: doc.contactEmail, members: (doc.members || []).sort((a: AnyDoc, b: AnyDoc) => a.displayOrder - b.displayOrder), documentLinks: doc.documentLinks || [], visible: doc.visible, updatedAt: doc.updatedAt });
  private publicCouncil(c: StudentCouncilSettings, locale: OrganizationLocale): PublicStudentCouncilSettings { return { title: localizedValue(c.title, locale), description: localizedValue(c.description, locale), speakerName: c.speakerName, speakerEmail: c.speakerEmail, viceSpeakerName: c.viceSpeakerName, viceSpeakerEmail: c.viceSpeakerEmail, contactEmail: c.contactEmail, members: c.members.filter((m) => m.active).sort((a, b) => a.displayOrder - b.displayOrder), documentLinks: c.documentLinks.map((d) => ({ label: localizedValue(d.label, locale), url: d.url, type: d.type })), visible: c.visible, updatedAt: c.updatedAt }; }
  private eldersCouncil = (doc: AnyDoc): EldersCouncilSettings => ({ id: doc._id.toString(), title: doc.title, description: doc.description, contactEmail: doc.contactEmail, members: (doc.members || []).sort((a: AnyDoc, b: AnyDoc) => a.displayOrder - b.displayOrder), visible: doc.visible, updatedAt: doc.updatedAt });
  private publicEldersCouncil(c: EldersCouncilSettings, locale: OrganizationLocale): PublicEldersCouncilSettings { return { title: localizedValue(c.title, locale), description: localizedValue(c.description, locale), contactEmail: c.contactEmail, members: c.members.filter((m) => m.active).sort((a, b) => a.displayOrder - b.displayOrder), visible: c.visible, updatedAt: c.updatedAt }; }
  private campaign = (doc: AnyDoc): RecruitmentCampaign => ({ id: doc._id.toString(), title: doc.title, description: doc.description, type: doc.type, openingDate: doc.openingDate, closingDate: doc.closingDate, ctaLabel: doc.ctaLabel, ctaUrl: doc.ctaUrl, contactPersonId: doc.contactPersonId?.toString(), contactEmail: doc.contactEmail, featured: doc.featured, published: doc.published, status: calculateRecruitmentStatus(doc.openingDate, doc.closingDate), displayOrder: doc.displayOrder, active: doc.active, createdAt: doc.createdAt, updatedAt: doc.updatedAt });
  private alumni = (doc: AnyDoc): AlumniPageContent => ({ id: doc._id.toString(), title: doc.title, intro: doc.intro, body: doc.body, heroImageUrl: doc.heroImageUrl, heroImageAltText: doc.heroImageAltText || { sv: '', en: '' }, benefits: doc.benefits || [], ctaPrimaryLabel: doc.ctaPrimaryLabel, ctaPrimaryUrl: doc.ctaPrimaryUrl, ctaSecondaryLabel: doc.ctaSecondaryLabel, ctaSecondaryUrl: doc.ctaSecondaryUrl, contactEmail: doc.contactEmail, published: doc.published, updatedAt: doc.updatedAt });
  private publicAlumni(a: AlumniPageContent, locale: OrganizationLocale): PublicAlumniPageContent { return { title: localizedValue(a.title, locale), intro: localizedValue(a.intro, locale), body: localizedValue(a.body, locale), heroImageUrl: a.heroImageUrl, heroImageAltText: localizedValue(a.heroImageAltText, locale), benefits: a.benefits.map((b) => localizedValue(b, locale)).filter(Boolean), ctaPrimaryLabel: localizedValue(a.ctaPrimaryLabel, locale), ctaPrimaryUrl: a.ctaPrimaryUrl, ctaSecondaryLabel: a.ctaSecondaryLabel ? localizedValue(a.ctaSecondaryLabel, locale) : undefined, ctaSecondaryUrl: a.ctaSecondaryUrl, contactEmail: a.contactEmail, published: a.published, updatedAt: a.updatedAt }; }
  private id(v: string) { if (!Types.ObjectId.isValid(v)) throw new AppError(400, 'INVALID_ID', 'Identifier is invalid'); }
  private slug(v: string) { const slug = slugify(v); if (!slug) throw new AppError(400, 'INVALID_SLUG', 'Slug is invalid'); return slug; }
  private dup(e: unknown, code: string) { if ((e as { code?: number }).code === 11000) throw new AppError(409, code, 'Slug is already in use'); }
}
