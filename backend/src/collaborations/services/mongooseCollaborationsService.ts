import { Types } from 'mongoose';
import { slugify } from '../../cms/utils/slug';
import { AppError } from '../../http/errors';
import { localizedValue } from '../../localization/languages';
import { CollaborationModel } from '../models/Collaboration';
import { CollaborationSettingsModel } from '../models/CollaborationSettings';
import { AdminCollaborationFilters, Collaboration, CollaborationListFilters, CollaborationLocale, CollaborationService, CollaborationSettings, collaborationTypeLabels, PublicCollaboration, PublicCollaborationSettings } from '../types';

type CollaborationDoc = Collaboration & { _id: Types.ObjectId; toObject: () => Record<string, unknown> };

const defaultSettings = { intro: { sv: 'Samarbeten samlar ASK:s specialföreningar, studentnationer och partner.', en: 'Collaborations collect ASK associations, student nations and partners.' }, visible: true };

function emptyToUndefined(value?: string) { return value && value.trim() ? value.trim() : undefined; }

export class MongooseCollaborationsService implements CollaborationService {
  private slug(value: string) { const slug = slugify(value); if (!slug) throw new AppError(400, 'INVALID_SLUG', 'Slug is invalid'); return slug; }
  private id(value: string) { if (!Types.ObjectId.isValid(value)) throw new AppError(400, 'INVALID_ID', 'Identifier is invalid'); return value; }
  private duplicate(error: unknown) { if ((error as { code?: number }).code === 11000) throw new AppError(409, 'COLLABORATION_SLUG_IN_USE', 'Collaboration slug is already in use'); }

  private toAdmin(doc: CollaborationDoc): Collaboration {
    return { ...doc.toObject(), id: doc._id.toString() } as unknown as Collaboration;
  }

  private toPublic(doc: CollaborationDoc, locale: CollaborationLocale): PublicCollaboration {
    const item = this.toAdmin(doc);
    return {
      id: item.id,
      name: item.name,
      slug: item.slug,
      type: item.type,
      typeLabel: collaborationTypeLabels[item.type][locale],
      description: localizedValue(item.description, locale),
      shortDescription: item.shortDescription ? localizedValue(item.shortDescription, locale) : undefined,
      logoUrl: item.logoUrl,
      logoAltText: item.logoAltText ? localizedValue(item.logoAltText, locale) : undefined,
      websiteUrl: item.websiteUrl,
      email: item.email,
      contactPerson: item.contactPerson,
      socialLinks: item.socialLinks || {},
      officeAtCor: item.officeAtCor,
      officeHours: item.officeHours ? localizedValue(item.officeHours, locale) : undefined,
      location: item.location,
      featured: item.featured,
      displayOrder: item.displayOrder,
      tags: item.tags ? localizedValue(item.tags, locale) : undefined,
      validFrom: item.validFrom,
      validUntil: item.validUntil,
      updatedAt: item.updatedAt,
    };
  }

  private query(filters: CollaborationListFilters & { active?: boolean; visible?: boolean }) {
    const query: Record<string, unknown> = {};
    if (filters.type) query.type = filters.type;
    if (filters.featured !== undefined) query.featured = filters.featured;
    if (filters.active !== undefined) query.active = filters.active;
    if (filters.visible !== undefined) query.visible = filters.visible;
    if (filters.search) query.$or = [
      { name: new RegExp(filters.search, 'i') },
      { 'description.sv': new RegExp(filters.search, 'i') },
      { 'description.en': new RegExp(filters.search, 'i') },
      { 'tags.sv': new RegExp(filters.search, 'i') },
      { 'tags.en': new RegExp(filters.search, 'i') },
    ];
    return query;
  }

  async listPublic(filters: CollaborationListFilters, locale: CollaborationLocale): Promise<PublicCollaboration[]> {
    const docs = await CollaborationModel.find(this.query({ ...filters, active: true, visible: true })).sort({ featured: -1, displayOrder: 1, name: 1 });
    return docs.map((doc: CollaborationDoc) => this.toPublic(doc, locale));
  }

  async getPublicBySlug(slug: string, locale: CollaborationLocale): Promise<PublicCollaboration> {
    const doc = await CollaborationModel.findOne({ slug, active: true, visible: true });
    if (!doc) throw new AppError(404, 'COLLABORATION_NOT_FOUND', 'Collaboration was not found');
    return this.toPublic(doc as CollaborationDoc, locale);
  }

  async listTypes(locale: CollaborationLocale) { return Object.entries(collaborationTypeLabels).map(([type, labels]) => ({ type: type as never, label: labels[locale] })); }

  async getPublicSettings(locale: CollaborationLocale): Promise<PublicCollaborationSettings> {
    const settings = await this.getSettings();
    return { intro: localizedValue(settings.intro, locale), contactEmail: settings.contactEmail, visible: settings.visible, updatedAt: settings.updatedAt };
  }

  async listAdmin(filters: AdminCollaborationFilters): Promise<Collaboration[]> {
    const docs = await CollaborationModel.find(this.query(filters)).sort({ displayOrder: 1, name: 1 });
    return docs.map((doc: CollaborationDoc) => this.toAdmin(doc));
  }

  async create(input: Omit<Collaboration, 'id' | 'createdAt' | 'updatedAt'>): Promise<Collaboration> {
    try {
      const doc = await CollaborationModel.create({ ...input, slug: this.slug(input.slug || input.name), logoUrl: emptyToUndefined(input.logoUrl), websiteUrl: emptyToUndefined(input.websiteUrl), email: emptyToUndefined(input.email) });
      return this.toAdmin(doc as CollaborationDoc);
    } catch (error) { this.duplicate(error); throw error; }
  }

  async update(id: string, input: Omit<Collaboration, 'id' | 'createdAt' | 'updatedAt'>): Promise<Collaboration> {
    try {
      const doc = await CollaborationModel.findByIdAndUpdate(this.id(id), { ...input, slug: this.slug(input.slug || input.name), logoUrl: emptyToUndefined(input.logoUrl), websiteUrl: emptyToUndefined(input.websiteUrl), email: emptyToUndefined(input.email) }, { new: true, runValidators: true });
      if (!doc) throw new AppError(404, 'COLLABORATION_NOT_FOUND', 'Collaboration was not found');
      return this.toAdmin(doc as CollaborationDoc);
    } catch (error) { this.duplicate(error); throw error; }
  }

  async deactivate(id: string): Promise<void> { await CollaborationModel.findByIdAndUpdate(this.id(id), { active: false, visible: false }); }

  async getSettings(): Promise<CollaborationSettings> {
    const doc = await CollaborationSettingsModel.findOneAndUpdate({ key: 'collaborations-settings' }, { $setOnInsert: { key: 'collaborations-settings', ...defaultSettings } }, { new: true, upsert: true });
    return { ...(doc.toObject()), id: doc._id.toString() } as unknown as CollaborationSettings;
  }

  async updateSettings(input: Omit<CollaborationSettings, 'id' | 'updatedAt'>): Promise<CollaborationSettings> {
    const doc = await CollaborationSettingsModel.findOneAndUpdate({ key: 'collaborations-settings' }, { ...input, key: 'collaborations-settings' }, { new: true, upsert: true, runValidators: true });
    return { ...(doc.toObject()), id: doc._id.toString() } as unknown as CollaborationSettings;
  }
}
