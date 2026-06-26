import { Types } from 'mongoose';
import { CmsService } from '../../cms/types';
import { slugify } from '../../cms/utils/slug';
import { AppError } from '../../http/errors';
import { recordAudit } from '../../identity/services/audit';
import { AuthPrincipal, RequestContext } from '../../identity/types';
import { ContentModel } from '../../cms/models/Content';
import { TranslationMetadata, localizedObject, localizedValue } from '../../localization/languages';
import { NewsArticleModel } from '../models/NewsArticle';
import { NewsArticleVersionModel } from '../models/NewsArticleVersion';
import { NewsCategoryModel } from '../models/NewsCategory';
import { NewsTagModel } from '../models/NewsTag';
import {
  LocalizedLabel,
  ManagedNewsArticle,
  NewsArticleInput,
  NewsService,
  NewsTaxonomyItem,
  PublicNewsArticle,
  PublicNewsQuery,
  SupportedLocale,
} from '../types';

interface TaxonomyDocument {
  _id: Types.ObjectId;
  slug: string;
  labels: LocalizedLabel;
  createdAt: Date;
  updatedAt: Date;
}

interface ArticleDocument {
  _id: Types.ObjectId;
  contentId: Types.ObjectId;
  translations: NewsArticleInput['translations'];
  translationMeta?: Partial<Record<SupportedLocale, TranslationMetadata>>;
  categoryIds: Types.ObjectId[];
  tagIds: Types.ObjectId[];
  featured: boolean;
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ContentDocument {
  _id: Types.ObjectId;
  slug: string;
  status: 'draft' | 'published';
  version: number;
  publishedAt?: Date;
}

type TaxonomyKind = 'category' | 'tag';

export class MongooseNewsService implements NewsService {
  constructor(private readonly cmsService: CmsService) {}

  async listAdminArticles(): Promise<ManagedNewsArticle[]> {
    const articles = await NewsArticleModel.find().sort({ updatedAt: -1 }).lean() as unknown as ArticleDocument[];
    const contents = await ContentModel.find({ _id: { $in: articles.map((article) => article.contentId) }, contentType: 'news' }).lean() as unknown as ContentDocument[];
    return this.hydrateManaged(articles, contents);
  }

  async getAdminArticle(articleId: string): Promise<ManagedNewsArticle> {
    this.assertId(articleId, 'ARTICLE');
    const article = await NewsArticleModel.findById(articleId).lean() as unknown as ArticleDocument | null;
    if (!article) throw new AppError(404, 'NEWS_NOT_FOUND', 'News article was not found');
    const content = await ContentModel.findOne({ _id: article.contentId, contentType: 'news' }).lean() as unknown as ContentDocument | null;
    if (!content) throw new AppError(404, 'NEWS_NOT_FOUND', 'News article was not found');
    return (await this.hydrateManaged([article], [content]))[0];
  }

  async createArticle(input: NewsArticleInput, actor: AuthPrincipal, context: RequestContext): Promise<ManagedNewsArticle> {
    await this.validateTaxonomy(input.categoryIds, input.tagIds);
    const content = await this.cmsService.createContent({
      contentType: 'news', title: input.translations.sv.title, slug: input.slug, sections: [],
    }, actor, context);
    try {
      const article = await NewsArticleModel.create({
        contentId: content.id, translations: input.translations, categoryIds: input.categoryIds,
        tagIds: input.tagIds, featured: input.featured,
      });
      await this.recordVersion(article.toObject() as unknown as ArticleDocument, content.version, actor.userId);
      return this.getAdminArticle(article.id);
    } catch (error) {
      await this.cmsService.deleteContent(content.id, actor, context);
      throw error;
    }
  }

  async updateArticle(articleId: string, input: NewsArticleInput & { expectedVersion: number }, actor: AuthPrincipal, context: RequestContext): Promise<ManagedNewsArticle> {
    this.assertId(articleId, 'ARTICLE');
    await this.validateTaxonomy(input.categoryIds, input.tagIds);
    const existing = await NewsArticleModel.findById(articleId).lean() as unknown as ArticleDocument | null;
    if (!existing) throw new AppError(404, 'NEWS_NOT_FOUND', 'News article was not found');
    const content = await this.cmsService.updateContent({
      contentId: existing.contentId.toString(), contentType: 'news', title: input.translations.sv.title,
      slug: input.slug, sections: [], expectedVersion: input.expectedVersion,
    }, actor, context);
    const article = await NewsArticleModel.findByIdAndUpdate(articleId, {
      $set: {
        translations: input.translations, categoryIds: input.categoryIds, tagIds: input.tagIds,
        featured: input.featured,
      },
      $unset: { scheduledAt: 1 },
    }, { new: true }).lean() as unknown as ArticleDocument | null;
    await this.recordVersion(article!, content.version, actor.userId);
    return this.getAdminArticle(articleId);
  }

  async deleteArticle(articleId: string, actor: AuthPrincipal, context: RequestContext): Promise<void> {
    this.assertId(articleId, 'ARTICLE');
    const article = await NewsArticleModel.findById(articleId).lean() as unknown as ArticleDocument | null;
    if (!article) throw new AppError(404, 'NEWS_NOT_FOUND', 'News article was not found');
    await this.cmsService.deleteContent(article.contentId.toString(), actor, context);
    await Promise.all([
      NewsArticleModel.deleteOne({ _id: articleId }),
      NewsArticleVersionModel.deleteMany({ articleId }),
    ]);
  }

  async publishArticle(articleId: string, expectedVersion: number, publishAt: Date | undefined, actor: AuthPrincipal, context: RequestContext): Promise<ManagedNewsArticle> {
    this.assertId(articleId, 'ARTICLE');
    const article = await NewsArticleModel.findById(articleId).lean() as unknown as ArticleDocument | null;
    if (!article) throw new AppError(404, 'NEWS_NOT_FOUND', 'News article was not found');
    const effectiveDate = publishAt || new Date();
    const content = await this.cmsService.publishContent(article.contentId.toString(), expectedVersion, actor, context, effectiveDate);
    const updated = await NewsArticleModel.findByIdAndUpdate(articleId, {
      ...(effectiveDate.getTime() > Date.now() ? { $set: { scheduledAt: effectiveDate } } : { $unset: { scheduledAt: 1 } }),
    }, { new: true }).lean() as unknown as ArticleDocument | null;
    await this.recordVersion(updated!, content.version, actor.userId);
    return this.getAdminArticle(articleId);
  }

  async setFeatured(articleId: string, featured: boolean, actor: AuthPrincipal, context: RequestContext): Promise<ManagedNewsArticle> {
    this.assertId(articleId, 'ARTICLE');
    const article = await NewsArticleModel.findByIdAndUpdate(articleId, { $set: { featured } }, { new: true }).lean() as unknown as ArticleDocument | null;
    if (!article) throw new AppError(404, 'NEWS_NOT_FOUND', 'News article was not found');
    await recordAudit({ actorId: actor.userId, action: 'news.featured_changed', targetType: 'news', targetId: articleId, context, metadata: { featured } });
    return this.getAdminArticle(articleId);
  }

  async listPublicArticles(query: PublicNewsQuery) {
    const articleFilter: Record<string, unknown> = {};
    if (query.featured !== undefined) articleFilter.featured = query.featured;
    if (query.category) {
      const category = await NewsCategoryModel.findOne({ slug: query.category }).lean() as unknown as TaxonomyDocument | null;
      if (!category) return { articles: [], total: 0, page: query.page, limit: query.limit };
      articleFilter.categoryIds = category._id;
    }
    if (query.tag) {
      const tag = await NewsTagModel.findOne({ slug: query.tag }).lean() as unknown as TaxonomyDocument | null;
      if (!tag) return { articles: [], total: 0, page: query.page, limit: query.limit };
      articleFilter.tagIds = tag._id;
    }
    if (query.search) {
      const expression = new RegExp(this.escapeRegex(query.search), 'i');
      articleFilter.$or = [
        { [`translations.${query.locale}.title`]: expression },
        { [`translations.${query.locale}.summary`]: expression },
        { [`translations.${query.locale}.body`]: expression },
      ];
    }
    const articles = await NewsArticleModel.find(articleFilter).lean() as unknown as ArticleDocument[];
    const contentIds = articles.map((article) => article.contentId);
    const contents = await ContentModel.find({
      _id: { $in: contentIds }, contentType: 'news', status: 'published', publishedAt: { $lte: new Date() },
    }).sort({ publishedAt: -1 }).lean() as unknown as ContentDocument[];
    const total = contents.length;
    const pageContents = contents.slice((query.page - 1) * query.limit, query.page * query.limit);
    const articleByContent = new Map(articles.map((article) => [article.contentId.toString(), article]));
    const publicArticles = await this.hydratePublic(
      pageContents.map((content) => articleByContent.get(content._id.toString())!).filter(Boolean),
      pageContents,
      query.locale,
    );
    return { articles: publicArticles, total, page: query.page, limit: query.limit };
  }

  async getPublicArticle(slug: string, locale: SupportedLocale): Promise<PublicNewsArticle> {
    const content = await ContentModel.findOne({ contentType: 'news', slug, status: 'published', publishedAt: { $lte: new Date() } }).lean() as unknown as ContentDocument | null;
    if (!content) throw new AppError(404, 'NEWS_NOT_FOUND', 'News article was not found');
    const article = await NewsArticleModel.findOne({ contentId: content._id }).lean() as unknown as ArticleDocument | null;
    if (!article) throw new AppError(404, 'NEWS_NOT_FOUND', 'News article was not found');
    return (await this.hydratePublic([article], [content], locale))[0];
  }

  listCategories() { return this.listTaxonomy('category'); }
  createCategory(input: { slug?: string; labels: LocalizedLabel }) { return this.createTaxonomy('category', input, 'CATEGORY'); }
  updateCategory(id: string, input: { slug?: string; labels: LocalizedLabel }) { return this.updateTaxonomy('category', id, input, 'CATEGORY'); }
  deleteCategory(id: string) { return this.deleteTaxonomy('category', id, 'categoryIds', 'CATEGORY'); }
  listTags() { return this.listTaxonomy('tag'); }
  createTag(input: { slug?: string; labels: LocalizedLabel }) { return this.createTaxonomy('tag', input, 'TAG'); }
  updateTag(id: string, input: { slug?: string; labels: LocalizedLabel }) { return this.updateTaxonomy('tag', id, input, 'TAG'); }
  deleteTag(id: string) { return this.deleteTaxonomy('tag', id, 'tagIds', 'TAG'); }

  private async hydrateManaged(articles: ArticleDocument[], contents: ContentDocument[]): Promise<ManagedNewsArticle[]> {
    const { categoryMap, tagMap } = await this.taxonomyMaps(articles);
    const contentMap = new Map(contents.map((content) => [content._id.toString(), content]));
    return articles.flatMap((article) => {
      const content = contentMap.get(article.contentId.toString());
      if (!content) return [];
      return [{
        id: article._id.toString(), contentId: article.contentId.toString(), slug: content.slug,
        status: this.status(content), version: content.version, translations: article.translations, translationMeta: article.translationMeta,
        categories: article.categoryIds.map((id) => categoryMap.get(id.toString())).filter((item): item is NewsTaxonomyItem => Boolean(item)),
        tags: article.tagIds.map((id) => tagMap.get(id.toString())).filter((item): item is NewsTaxonomyItem => Boolean(item)),
        featured: article.featured, publishedAt: content.publishedAt, scheduledAt: article.scheduledAt,
        createdAt: article.createdAt, updatedAt: article.updatedAt,
      }];
    });
  }

  private async hydratePublic(articles: ArticleDocument[], contents: ContentDocument[], locale: SupportedLocale): Promise<PublicNewsArticle[]> {
    const { categoryMap, tagMap } = await this.taxonomyMaps(articles);
    const contentMap = new Map(contents.map((content) => [content._id.toString(), content]));
    return articles.map((article) => {
      const content = contentMap.get(article.contentId.toString())!;
      const translation = localizedObject(article.translations, locale) || article.translations.sv;
      return {
        id: article._id.toString(), slug: content.slug, ...translation, locale,
        categories: article.categoryIds.map((id) => categoryMap.get(id.toString())).filter((item): item is NewsTaxonomyItem => Boolean(item)).map((item) => ({ slug: item.slug, label: localizedValue(item.labels, locale) })),
        tags: article.tagIds.map((id) => tagMap.get(id.toString())).filter((item): item is NewsTaxonomyItem => Boolean(item)).map((item) => ({ slug: item.slug, label: localizedValue(item.labels, locale) })),
        featured: article.featured, publishedAt: content.publishedAt!,
      };
    });
  }

  private async taxonomyMaps(articles: ArticleDocument[]) {
    const [categories, tags] = await Promise.all([
      NewsCategoryModel.find({ _id: { $in: articles.flatMap((article) => article.categoryIds) } }).lean() as unknown as TaxonomyDocument[],
      NewsTagModel.find({ _id: { $in: articles.flatMap((article) => article.tagIds) } }).lean() as unknown as TaxonomyDocument[],
    ]);
    return {
      categoryMap: new Map(categories.map((item) => [item._id.toString(), this.toTaxonomy(item)])),
      tagMap: new Map(tags.map((item) => [item._id.toString(), this.toTaxonomy(item)])),
    };
  }

  private async validateTaxonomy(categoryIds: string[], tagIds: string[]) {
    const [categoryCount, tagCount] = await Promise.all([
      NewsCategoryModel.countDocuments({ _id: { $in: categoryIds } }),
      NewsTagModel.countDocuments({ _id: { $in: tagIds } }),
    ]);
    if (categoryCount !== categoryIds.length || tagCount !== tagIds.length) {
      throw new AppError(400, 'INVALID_TAXONOMY', 'One or more categories or tags do not exist');
    }
  }

  private async recordVersion(article: ArticleDocument, version: number, actorId: string) {
    await NewsArticleVersionModel.create({
      articleId: article._id, contentId: article.contentId, version,
      snapshot: {
        translations: article.translations, translationMeta: article.translationMeta, categoryIds: article.categoryIds,
        tagIds: article.tagIds, featured: article.featured, scheduledAt: article.scheduledAt,
      },
      actorId,
    });
  }

  private status(content: ContentDocument): 'draft' | 'scheduled' | 'published' {
    if (content.status === 'draft') return 'draft';
    return content.publishedAt && content.publishedAt.getTime() > Date.now() ? 'scheduled' : 'published';
  }

  private async listTaxonomy(kind: TaxonomyKind): Promise<NewsTaxonomyItem[]> {
    const model = this.taxonomyModel(kind);
    const items = await model.find().sort({ 'labels.sv': 1 }).lean() as unknown as TaxonomyDocument[];
    return items.map((item) => this.toTaxonomy(item));
  }

  private async createTaxonomy(kind: TaxonomyKind, input: { slug?: string; labels: LocalizedLabel }, code: string): Promise<NewsTaxonomyItem> {
    const model = this.taxonomyModel(kind);
    const slug = this.taxonomySlug(input.slug || input.labels.sv);
    try {
      const item = await model.create({ slug, labels: input.labels }) as unknown as { toObject(): TaxonomyDocument };
      return this.toTaxonomy(item.toObject());
    } catch (error) {
      this.handleDuplicate(error, code);
      throw error;
    }
  }

  private async updateTaxonomy(kind: TaxonomyKind, id: string, input: { slug?: string; labels: LocalizedLabel }, code: string): Promise<NewsTaxonomyItem> {
    const model = this.taxonomyModel(kind);
    this.assertId(id, code);
    try {
      const item = await model.findByIdAndUpdate(id, { $set: { slug: this.taxonomySlug(input.slug || input.labels.sv), labels: input.labels } }, { new: true }).lean() as unknown as TaxonomyDocument | null;
      if (!item) throw new AppError(404, `${code}_NOT_FOUND`, `${this.capitalize(code)} was not found`);
      return this.toTaxonomy(item);
    } catch (error) {
      this.handleDuplicate(error, code);
      throw error;
    }
  }

  private async deleteTaxonomy(kind: TaxonomyKind, id: string, field: 'categoryIds' | 'tagIds', code: string): Promise<void> {
    const model = this.taxonomyModel(kind);
    this.assertId(id, code);
    if (await NewsArticleModel.exists({ [field]: id })) throw new AppError(409, `${code}_IN_USE`, `${this.capitalize(code)} is assigned to one or more articles`);
    const result = await model.deleteOne({ _id: id });
    if (result.deletedCount === 0) throw new AppError(404, `${code}_NOT_FOUND`, `${this.capitalize(code)} was not found`);
  }


  private taxonomyModel(kind: TaxonomyKind): typeof NewsCategoryModel {
    return (kind === 'category' ? NewsCategoryModel : NewsTagModel) as typeof NewsCategoryModel;
  }

  private toTaxonomy(item: TaxonomyDocument): NewsTaxonomyItem {
    return { id: item._id.toString(), slug: item.slug, labels: item.labels, createdAt: item.createdAt, updatedAt: item.updatedAt };
  }

  private taxonomySlug(value: string) {
    const slug = slugify(value);
    if (!slug) throw new AppError(400, 'INVALID_SLUG', 'Taxonomy slug must contain letters or numbers');
    return slug;
  }

  private assertId(id: string, code: string) {
    if (!Types.ObjectId.isValid(id)) throw new AppError(400, `INVALID_${code}_ID`, `${this.capitalize(code)} identifier is invalid`);
  }

  private handleDuplicate(error: unknown, code: string) {
    if ((error as { code?: number }).code === 11000) throw new AppError(409, `${code}_SLUG_IN_USE`, `${this.capitalize(code)} slug is already in use`);
  }

  private escapeRegex(value: string) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  private capitalize(value: string) { return value.charAt(0) + value.slice(1).toLowerCase(); }
}
