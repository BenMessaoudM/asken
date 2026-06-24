import { AuthPrincipal, RequestContext } from '../identity/types';

export const contentTypes = [
  'page',
  'news',
  'event',
  'cor_activity',
  'governance_document',
  'collaboration',
] as const;

export type ContentType = typeof contentTypes[number];
export type ContentStatus = 'draft' | 'published';
export type ContentSectionType = 'hero' | 'text' | 'image' | 'cta' | 'faq';

export interface ContentSectionInput {
  type: ContentSectionType;
  position: number;
  data: Record<string, unknown>;
}

export interface ManagedContentSection extends ContentSectionInput {
  id: string;
}

export interface ManagedContent {
  id: string;
  contentType: ContentType;
  title: string;
  slug: string;
  status: ContentStatus;
  version: number;
  sections: ManagedContentSection[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentSummary {
  id: string;
  contentType: ContentType;
  title: string;
  slug: string;
  status: ContentStatus;
  version: number;
  sectionCount: number;
  publishedAt?: Date;
  updatedAt: Date;
}

export interface ContentVersionSummary {
  id: string;
  version: number;
  contentType: ContentType;
  status: ContentStatus;
  title: string;
  slug: string;
  createdAt: Date;
  actorId: string;
}

export interface CmsService {
  listContents(contentType?: ContentType): Promise<ContentSummary[]>;
  getContent(contentId: string): Promise<ManagedContent>;
  createContent(input: { contentType: ContentType; title: string; slug?: string; sections: ContentSectionInput[] }, actor: AuthPrincipal, context: RequestContext): Promise<ManagedContent>;
  updateContent(input: { contentId: string; contentType: ContentType; title: string; slug?: string; sections: ContentSectionInput[]; expectedVersion: number }, actor: AuthPrincipal, context: RequestContext): Promise<ManagedContent>;
  deleteContent(contentId: string, actor: AuthPrincipal, context: RequestContext): Promise<void>;
  publishContent(contentId: string, expectedVersion: number, actor: AuthPrincipal, context: RequestContext, publishAt?: Date): Promise<ManagedContent>;
  listVersions(contentId: string): Promise<ContentVersionSummary[]>;
}
