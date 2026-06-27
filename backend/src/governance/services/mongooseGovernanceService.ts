import { Types } from 'mongoose';
import { slugify } from '../../cms/utils/slug';
import { AppError } from '../../http/errors';
import { localizedValue } from '../../localization/languages';
import { GovernanceDocumentModel } from '../models/GovernanceDocument';
import { GovernanceSettingsModel } from '../models/GovernanceSettings';
import { FullmaktigeDocumentsOverview, GovernanceDocument, GovernanceDocumentFilters, GovernanceLocale, GovernanceService, GovernanceSettings, PublicGovernanceDocument } from '../types';

type Doc = Record<string, any>;
const defaultSettings = {
  singletonKey: 'governance-settings',
  intro: { sv: 'Här publicerar ASK offentliga styrdokument, Fullmäktigehandlingar, stadgar, reglemente, verksamhetsberättelser, bokslut och policyer.', en: 'ASK publishes public governance documents, Student Council documents, statutes, regulations, annual reports, financial statements and policies here.' },
  documentPolicyText: { sv: 'Fullmäktiges protokoll är offentliga, men delar kan undanhållas om de innehåller uppgifter om privatpersoner eller annat material som inte ska publiceras. Styrelsens interna handlingar ingår inte i denna modul.', en: 'Student Council minutes are public, but parts may be withheld if they contain private-person information or other material that should not be published. Internal Board documents are not included in this module.' },
  contactEmail: 'info@asken.fi',
  visible: true,
};

export class MongooseGovernanceService implements GovernanceService {
  async overview(locale: GovernanceLocale) {
    const settings = await this.getSettings();
    const latestDocuments = await this.listPublicDocuments({}, locale);
    const descriptions: Record<string, { sv: string; en: string }> = {
      fullmaktige: { sv: 'Kallelser, föredragningslistor och protokoll från Fullmäktige.', en: 'Meeting notices, agendas and minutes from the Student Council.' },
      statutes: { sv: 'ASK:s stadgar och reglemente.', en: 'ASK statutes and regulations.' },
      annual: { sv: 'Verksamhetsberättelser och andra årsvisa dokument.', en: 'Annual reports and other yearly documents.' },
      financial: { sv: 'Bokslut och offentliga ekonomiska handlingar.', en: 'Financial statements and public financial documents.' },
      policy: { sv: 'Offentliga policyer och styrande dokument.', en: 'Public policies and governing documents.' },
    };
    return { settings: { intro: localizedValue(settings.intro, locale), documentPolicyText: localizedValue(settings.documentPolicyText, locale), contactEmail: settings.contactEmail, visible: settings.visible }, latestDocuments: latestDocuments.slice(0, 8), sections: [
      ['fullmaktige', 'Fullmäktige', '/styrning/fullmaktige'], ['statutes', 'Stadgar och reglemente', '/styrning?type=statutes'], ['annual', 'Verksamhetsberättelser', '/styrning?type=annual_report'], ['financial', 'Bokslut', '/styrning?type=financial_statement'], ['policy', 'Policy documents', '/styrning?type=policy'],
    ].map(([key, label, href]) => ({ key, label, href, description: localizedValue(descriptions[key], locale) })) };
  }
  async listPublicDocuments(filters: GovernanceDocumentFilters, locale: GovernanceLocale) { return (await GovernanceDocumentModel.find({ ...this.query(filters), isPublic: true, isPublished: true }).sort({ displayOrder: 1, documentDate: -1, publishedAt: -1, createdAt: -1 }).lean()).map((doc) => this.publicDocument(doc, locale)); }
  async getPublicDocument(slug: string, locale: GovernanceLocale) { const doc = await GovernanceDocumentModel.findOne({ slug, isPublic: true, isPublished: true }).lean(); if (!doc) throw new AppError(404, 'GOVERNANCE_DOCUMENT_NOT_FOUND', 'Governance document was not found'); return this.publicDocument(doc, locale); }
  async fullmaktige(locale: GovernanceLocale, year?: number): Promise<FullmaktigeDocumentsOverview> { const documents = await this.listPublicDocuments({ governanceBody: 'fullmaktige', year }, locale); return { meetingNotices: documents.filter((doc) => doc.documentType === 'meeting_notice'), agendas: documents.filter((doc) => doc.documentType === 'agenda'), minutes: documents.filter((doc) => doc.documentType === 'minutes') }; }
  async listDocuments(filters: GovernanceDocumentFilters = {}) { return (await GovernanceDocumentModel.find(this.query(filters)).sort({ displayOrder: 1, documentDate: -1, createdAt: -1 }).lean()).map(this.document); }
  async createDocument(input: Omit<GovernanceDocument, 'id' | 'createdAt' | 'updatedAt'>) { try { const doc = await GovernanceDocumentModel.create({ ...input, slug: this.slug(input.slug || input.title.sv || input.title.en), publishedAt: input.isPublished ? input.publishedAt || new Date() : input.publishedAt }); return this.document(doc.toObject()); } catch (e) { this.dup(e); throw e; } }
  async updateDocument(id: string, input: Omit<GovernanceDocument, 'id' | 'createdAt' | 'updatedAt'>) { this.id(id); try { const doc = await GovernanceDocumentModel.findByIdAndUpdate(id, { $set: { ...input, slug: this.slug(input.slug || input.title.sv || input.title.en), publishedAt: input.isPublished ? input.publishedAt || new Date() : input.publishedAt } }, { new: true }).lean(); if (!doc) throw new AppError(404, 'GOVERNANCE_DOCUMENT_NOT_FOUND', 'Governance document was not found'); return this.document(doc); } catch (e) { this.dup(e); throw e; } }
  async publishDocument(id: string, actorId?: string) { this.id(id); const doc = await GovernanceDocumentModel.findByIdAndUpdate(id, { $set: { isPublished: true, isPublic: true, publishedAt: new Date(), updatedBy: actorId } }, { new: true }).lean(); if (!doc) throw new AppError(404, 'GOVERNANCE_DOCUMENT_NOT_FOUND', 'Governance document was not found'); return this.document(doc); }
  async unpublishDocument(id: string, actorId?: string) { this.id(id); const doc = await GovernanceDocumentModel.findByIdAndUpdate(id, { $set: { isPublished: false, updatedBy: actorId } }, { new: true }).lean(); if (!doc) throw new AppError(404, 'GOVERNANCE_DOCUMENT_NOT_FOUND', 'Governance document was not found'); return this.document(doc); }
  async archiveDocument(id: string, actorId?: string) { this.id(id); const result = await GovernanceDocumentModel.updateOne({ _id: id }, { $set: { isPublished: false, isPublic: false, updatedBy: actorId } }); if (!result.matchedCount) throw new AppError(404, 'GOVERNANCE_DOCUMENT_NOT_FOUND', 'Governance document was not found'); }
  async getSettings() { const doc = await GovernanceSettingsModel.findOneAndUpdate({ singletonKey: 'governance-settings' }, { $setOnInsert: defaultSettings }, { upsert: true, new: true }).lean(); return this.settings(doc); }
  async updateSettings(input: Omit<GovernanceSettings, 'id' | 'updatedAt'>) { const doc = await GovernanceSettingsModel.findOneAndUpdate({ singletonKey: 'governance-settings' }, { $set: input }, { upsert: true, new: true }).lean(); return this.settings(doc); }
  private query(filters: GovernanceDocumentFilters) { const q: Doc = {}; if (filters.documentType) q.documentType = filters.documentType; if (filters.governanceBody) q.governanceBody = filters.governanceBody; if (filters.language) q.language = filters.language; if (filters.year) q.year = filters.year; if (filters.published !== undefined) q.isPublished = filters.published; if (filters.publicOnly !== undefined) q.isPublic = filters.publicOnly; return q; }
  private document = (doc: Doc): GovernanceDocument => ({ id: doc._id.toString(), title: doc.title, slug: doc.slug, description: doc.description || { sv: '', en: '' }, documentType: doc.documentType, governanceBody: doc.governanceBody, meetingDate: doc.meetingDate, publishDate: doc.publishDate, documentDate: doc.documentDate, year: doc.year, language: doc.language, fileUrl: doc.fileUrl, fileName: doc.fileName, externalUrl: doc.externalUrl, fileSize: doc.fileSize, isPublic: doc.isPublic, isPublished: doc.isPublished, publishedAt: doc.publishedAt, displayOrder: doc.displayOrder, tags: doc.tags || { sv: '', en: '' }, createdBy: doc.createdBy, updatedBy: doc.updatedBy, createdAt: doc.createdAt, updatedAt: doc.updatedAt });
  private publicDocument(doc: Doc, locale: GovernanceLocale): PublicGovernanceDocument { return { id: doc._id.toString(), title: localizedValue(doc.title, locale), slug: doc.slug, description: localizedValue(doc.description || { sv: '', en: '' }, locale), documentType: doc.documentType, governanceBody: doc.governanceBody, meetingDate: doc.meetingDate, publishDate: doc.publishDate, documentDate: doc.documentDate, year: doc.year, language: doc.language, fileUrl: doc.fileUrl, fileName: doc.fileName, externalUrl: doc.externalUrl, fileSize: doc.fileSize, publishedAt: doc.publishedAt, displayOrder: doc.displayOrder, tags: localizedValue(doc.tags || { sv: '', en: '' }, locale) }; }
  private settings(doc: Doc): GovernanceSettings { return { id: doc._id.toString(), intro: doc.intro, documentPolicyText: doc.documentPolicyText, contactEmail: doc.contactEmail, visible: doc.visible, updatedAt: doc.updatedAt }; }
  private id(v: string) { if (!Types.ObjectId.isValid(v)) throw new AppError(400, 'INVALID_ID', 'Identifier is invalid'); }
  private slug(v: string) { const slug = slugify(v); if (!slug) throw new AppError(400, 'INVALID_SLUG', 'Slug is invalid'); return slug; }
  private dup(e: unknown) { if ((e as { code?: number }).code === 11000) throw new AppError(409, 'GOVERNANCE_DOCUMENT_SLUG_IN_USE', 'Slug is already in use'); }
}
