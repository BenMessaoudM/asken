import { z } from 'zod';
import { supportedLocales } from '../types';

const optionalUrl = z.union([z.string().url().max(2048), z.literal('')]).optional();
const translationSchema = z.object({
  title: z.string().trim().min(1).max(180),
  summary: z.string().trim().min(1).max(600),
  body: z.string().trim().min(1).max(50000),
  imageUrl: optionalUrl,
  imageAlt: z.string().trim().max(300).optional(),
}).superRefine((translation, context) => {
  if (translation.imageUrl && !translation.imageAlt) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['imageAlt'], message: 'Alternative text is required when an image is provided' });
  }
});

const translationsSchema = z.object({ en: translationSchema, sv: translationSchema });
const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid identifier');
const uniqueIds = z.array(objectId).max(50).transform((ids) => [...new Set(ids)]);

export const articleInputSchema = z.object({
  slug: z.string().trim().max(120).optional(),
  translations: translationsSchema,
  categoryIds: uniqueIds.default([]),
  tagIds: uniqueIds.default([]),
  featured: z.boolean().default(false),
});
export const updateArticleSchema = articleInputSchema.extend({ expectedVersion: z.number().int().min(1) });
export const publishArticleSchema = z.object({
  expectedVersion: z.number().int().min(1),
  publishAt: z.string().datetime({ offset: true }).optional(),
});
export const featuredSchema = z.object({ featured: z.boolean() });
export const taxonomySchema = z.object({
  slug: z.string().trim().max(120).optional(),
  labels: z.object({ en: z.string().trim().min(1).max(100), sv: z.string().trim().min(1).max(100) }),
});
export const localeSchema = z.enum(supportedLocales).default('sv');
export const publicNewsQuerySchema = z.object({
  locale: localeSchema,
  q: z.string().trim().min(1).max(200).optional(),
  category: z.string().trim().min(1).max(120).optional(),
  tag: z.string().trim().min(1).max(120).optional(),
  featured: z.enum(['true', 'false']).transform((value) => value === 'true').optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});
export const articleIdSchema = objectId;
