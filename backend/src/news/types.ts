import { AuthPrincipal, RequestContext } from '../identity/types';

import { PublicLanguage, TranslationMetadata, publicLanguages } from '../localization/languages';

export const supportedLocales = publicLanguages;
export type SupportedLocale = PublicLanguage;

export interface LocalizedArticleContent {
  title: string;
  summary: string;
  body: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface LocalizedLabel {
  en: string;
  sv: string;
}

export interface NewsTaxonomyItem {
  id: string;
  slug: string;
  labels: LocalizedLabel;
  createdAt: Date;
  updatedAt: Date;
}

export interface ManagedNewsArticle {
  id: string;
  contentId: string;
  slug: string;
  status: 'draft' | 'scheduled' | 'published';
  version: number;
  translations: Record<SupportedLocale, LocalizedArticleContent>;
  translationMeta?: Partial<Record<SupportedLocale, TranslationMetadata>>;
  categories: NewsTaxonomyItem[];
  tags: NewsTaxonomyItem[];
  featured: boolean;
  publishedAt?: Date;
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicNewsArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  imageUrl?: string;
  imageAlt?: string;
  locale: SupportedLocale;
  categories: Array<{ slug: string; label: string }>;
  tags: Array<{ slug: string; label: string }>;
  featured: boolean;
  publishedAt: Date;
}

export interface NewsArticleInput {
  slug?: string;
  translations: Record<SupportedLocale, LocalizedArticleContent>;
  categoryIds: string[];
  tagIds: string[];
  featured: boolean;
}

export interface PublicNewsQuery {
  locale: SupportedLocale;
  search?: string;
  category?: string;
  tag?: string;
  featured?: boolean;
  page: number;
  limit: number;
}

export interface NewsService {
  listAdminArticles(): Promise<ManagedNewsArticle[]>;
  getAdminArticle(articleId: string): Promise<ManagedNewsArticle>;
  createArticle(input: NewsArticleInput, actor: AuthPrincipal, context: RequestContext): Promise<ManagedNewsArticle>;
  updateArticle(articleId: string, input: NewsArticleInput & { expectedVersion: number }, actor: AuthPrincipal, context: RequestContext): Promise<ManagedNewsArticle>;
  deleteArticle(articleId: string, actor: AuthPrincipal, context: RequestContext): Promise<void>;
  publishArticle(articleId: string, expectedVersion: number, publishAt: Date | undefined, actor: AuthPrincipal, context: RequestContext): Promise<ManagedNewsArticle>;
  setFeatured(articleId: string, featured: boolean, actor: AuthPrincipal, context: RequestContext): Promise<ManagedNewsArticle>;
  listPublicArticles(query: PublicNewsQuery): Promise<{ articles: PublicNewsArticle[]; total: number; page: number; limit: number }>;
  getPublicArticle(slug: string, locale: SupportedLocale): Promise<PublicNewsArticle>;
  listCategories(): Promise<NewsTaxonomyItem[]>;
  createCategory(input: { slug?: string; labels: LocalizedLabel }): Promise<NewsTaxonomyItem>;
  updateCategory(id: string, input: { slug?: string; labels: LocalizedLabel }): Promise<NewsTaxonomyItem>;
  deleteCategory(id: string): Promise<void>;
  listTags(): Promise<NewsTaxonomyItem[]>;
  createTag(input: { slug?: string; labels: LocalizedLabel }): Promise<NewsTaxonomyItem>;
  updateTag(id: string, input: { slug?: string; labels: LocalizedLabel }): Promise<NewsTaxonomyItem>;
  deleteTag(id: string): Promise<void>;
}
