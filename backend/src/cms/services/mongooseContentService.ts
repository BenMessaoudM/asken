import { Types } from 'mongoose';
import { AppError } from '../../http/errors';
import { recordAudit } from '../../identity/services/audit';
import { AuthPrincipal, RequestContext } from '../../identity/types';
import { ContentModel } from '../models/Content';
import { ContentSectionModel } from '../models/ContentSection';
import { ContentVersionModel } from '../models/ContentVersion';
import {
  CmsService,
  ContentSectionInput,
  ContentSummary,
  ContentType,
  ContentVersionSummary,
  ManagedContent,
  ManagedContentSection,
} from '../types';
import { slugify } from '../utils/slug';

interface LeanContent {
  _id: Types.ObjectId;
  contentType: ContentType;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  version: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface LeanSection {
  _id: Types.ObjectId;
  type: 'hero' | 'text' | 'image' | 'cta' | 'faq';
  position: number;
  data: Record<string, unknown>;
}

export class MongooseContentService implements CmsService {
  async listContents(contentType?: ContentType): Promise<ContentSummary[]> {
    const match = contentType ? { contentType } : {};
    const contents = await ContentModel.aggregate<LeanContent & { sectionCount: number }>([
      { $match: match },
      { $lookup: { from: 'contentsections', localField: '_id', foreignField: 'contentId', as: 'sections' } },
      { $addFields: { sectionCount: { $size: '$sections' } } },
      { $project: { sections: 0 } },
      { $sort: { updatedAt: -1 } },
    ]);
    return contents.map((content) => ({
      id: content._id.toString(), contentType: content.contentType, title: content.title,
      slug: content.slug, status: content.status, version: content.version,
      sectionCount: content.sectionCount, publishedAt: content.publishedAt, updatedAt: content.updatedAt,
    }));
  }

  async getContent(contentId: string): Promise<ManagedContent> {
    this.assertContentId(contentId);
    const content = await ContentModel.findById(contentId).lean() as unknown as LeanContent | null;
    if (!content) throw new AppError(404, 'CONTENT_NOT_FOUND', 'Content was not found');
    const sections = await ContentSectionModel.find({ contentId }).sort({ position: 1 }).lean() as unknown as LeanSection[];
    return this.toManagedContent(content, sections);
  }

  async getPublishedPage(slug: string): Promise<ManagedContent> {
    const content = await ContentModel.findOne({
      contentType: 'page',
      slug,
      status: 'published',
      publishedAt: { $lte: new Date() },
    }).lean() as unknown as LeanContent | null;
    if (!content) throw new AppError(404, 'PAGE_NOT_FOUND', 'Page was not found');
    const sections = await ContentSectionModel.find({ contentId: content._id }).sort({ position: 1 }).lean() as unknown as LeanSection[];
    return this.toManagedContent(content, sections);
  }

  async createContent(input: { contentType: ContentType; title: string; slug?: string; sections: ContentSectionInput[] }, actor: AuthPrincipal, context: RequestContext): Promise<ManagedContent> {
    const slug = await this.resolveSlug(input.contentType, input.slug || input.title);
    let content;
    try {
      content = await ContentModel.create({
        contentType: input.contentType, title: input.title, slug, status: 'draft', version: 1,
        createdBy: actor.userId, updatedBy: actor.userId,
      });
    } catch (error) {
      this.handleDuplicateSlug(error);
      throw error;
    }
    const sections = await this.replaceSections(content.id, input.sections);
    await this.recordVersion(content.toObject() as unknown as LeanContent, sections, actor.userId);
    await recordAudit({
      actorId: actor.userId, action: 'cms.content_created', targetType: input.contentType,
      targetId: content.id, context, metadata: { contentType: input.contentType, title: input.title, slug },
    });
    return this.getContent(content.id);
  }

  async updateContent(input: { contentId: string; contentType: ContentType; title: string; slug?: string; sections: ContentSectionInput[]; expectedVersion: number }, actor: AuthPrincipal, context: RequestContext): Promise<ManagedContent> {
    this.assertContentId(input.contentId);
    const slug = await this.resolveSlug(input.contentType, input.slug || input.title, input.contentId);
    let content: LeanContent | null;
    try {
      content = await ContentModel.findOneAndUpdate(
        { _id: input.contentId, version: input.expectedVersion },
        {
          $set: { contentType: input.contentType, title: input.title, slug, status: 'draft', updatedBy: actor.userId },
          $unset: { publishedAt: 1 },
          $inc: { version: 1 },
        },
        { new: true },
      ).lean() as unknown as LeanContent | null;
    } catch (error) {
      this.handleDuplicateSlug(error);
      throw error;
    }
    if (!content) await this.throwVersionOrNotFound(input.contentId);
    const sections = await this.replaceSections(input.contentId, input.sections);
    await this.recordVersion(content!, sections, actor.userId);
    await recordAudit({
      actorId: actor.userId, action: 'cms.content_updated', targetType: input.contentType,
      targetId: input.contentId, context, metadata: { contentType: input.contentType, version: content!.version, slug },
    });
    return this.toManagedContent(content!, sections);
  }

  async deleteContent(contentId: string, actor: AuthPrincipal, context: RequestContext): Promise<void> {
    this.assertContentId(contentId);
    const content = await ContentModel.findByIdAndDelete(contentId);
    if (!content) throw new AppError(404, 'CONTENT_NOT_FOUND', 'Content was not found');
    await Promise.all([
      ContentSectionModel.deleteMany({ contentId }),
      ContentVersionModel.deleteMany({ contentId }),
    ]);
    await recordAudit({
      actorId: actor.userId, action: 'cms.content_deleted', targetType: content.contentType,
      targetId: contentId, context, metadata: { contentType: content.contentType, title: content.title, slug: content.slug },
    });
  }

  async publishContent(contentId: string, expectedVersion: number, actor: AuthPrincipal, context: RequestContext, publishAt = new Date()): Promise<ManagedContent> {
    this.assertContentId(contentId);
    const content = await ContentModel.findOneAndUpdate(
      { _id: contentId, version: expectedVersion },
      { $set: { status: 'published', publishedAt: publishAt, updatedBy: actor.userId }, $inc: { version: 1 } },
      { new: true },
    ).lean() as unknown as LeanContent | null;
    if (!content) await this.throwVersionOrNotFound(contentId);
    const sections = await ContentSectionModel.find({ contentId }).sort({ position: 1 }).lean() as unknown as LeanSection[];
    await this.recordVersion(content!, sections, actor.userId);
    await recordAudit({
      actorId: actor.userId, action: 'cms.content_published', targetType: content!.contentType,
      targetId: contentId, context, metadata: { contentType: content!.contentType, version: content!.version },
    });
    return this.toManagedContent(content!, sections);
  }

  async listVersions(contentId: string): Promise<ContentVersionSummary[]> {
    this.assertContentId(contentId);
    if (!await ContentModel.exists({ _id: contentId })) throw new AppError(404, 'CONTENT_NOT_FOUND', 'Content was not found');
    const versions = await ContentVersionModel.find({ contentId }).sort({ version: -1 }).lean();
    return versions.map((version) => ({
      id: version._id.toString(), version: version.version, contentType: version.contentType,
      status: version.status, title: version.title, slug: version.slug,
      createdAt: version.createdAt, actorId: version.actorId.toString(),
    }));
  }

  private async replaceSections(contentId: string, sections: ContentSectionInput[]): Promise<LeanSection[]> {
    await ContentSectionModel.deleteMany({ contentId });
    if (sections.length === 0) return [];
    const created = await ContentSectionModel.insertMany(sections.map((section) => ({ ...section, contentId })));
    return created.map((section) => ({
      _id: section._id, type: section.type, position: section.position,
      data: section.data as Record<string, unknown>,
    })).sort((a, b) => a.position - b.position);
  }

  private async recordVersion(content: LeanContent, sections: LeanSection[], actorId: string) {
    await ContentVersionModel.create({
      contentId: content._id, version: content.version, contentType: content.contentType,
      title: content.title, slug: content.slug, status: content.status,
      publishedAt: content.publishedAt,
      sections: sections.map(({ type, position, data }) => ({ type, position, data })),
      actorId,
    });
  }

  private async resolveSlug(contentType: ContentType, value: string, excludeContentId?: string): Promise<string> {
    const slug = slugify(value);
    if (!slug) throw new AppError(400, 'INVALID_SLUG', 'Content title or slug must contain letters or numbers');
    const query: Record<string, unknown> = { contentType, slug };
    if (excludeContentId) query._id = { $ne: excludeContentId };
    if (await ContentModel.exists(query)) throw new AppError(409, 'SLUG_IN_USE', 'Content slug is already in use for this type');
    return slug;
  }

  private toManagedContent(content: LeanContent, sections: LeanSection[]): ManagedContent {
    return {
      id: content._id.toString(), contentType: content.contentType, title: content.title,
      slug: content.slug, status: content.status, version: content.version,
      publishedAt: content.publishedAt, createdAt: content.createdAt, updatedAt: content.updatedAt,
      sections: sections.map((section): ManagedContentSection => ({
        id: section._id.toString(), type: section.type, position: section.position, data: section.data,
      })),
    };
  }

  private assertContentId(contentId: string) {
    if (!Types.ObjectId.isValid(contentId)) throw new AppError(400, 'INVALID_CONTENT_ID', 'Content identifier is invalid');
  }

  private async throwVersionOrNotFound(contentId: string): Promise<never> {
    if (!await ContentModel.exists({ _id: contentId })) throw new AppError(404, 'CONTENT_NOT_FOUND', 'Content was not found');
    throw new AppError(409, 'VERSION_CONFLICT', 'Content has changed since it was loaded');
  }

  private handleDuplicateSlug(error: unknown): void {
    if ((error as { code?: number }).code === 11000) {
      throw new AppError(409, 'SLUG_IN_USE', 'Content slug is already in use for this type');
    }
  }
}
