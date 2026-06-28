import { z } from 'zod';

export const collaborationTypes = ['arcada_association', 'student_nation', 'sponsor', 'company', 'university', 'strategic_partner', 'student_organization', 'other'] as const;
export const collaborationTypeSchema = z.enum(collaborationTypes);
export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Expected MongoDB ObjectId');
export const slugSchema = z.string().trim().min(1).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const collaborationLocaleSchema = z.preprocess((value) => value || 'sv', z.enum(['sv', 'en']));
const optionalString = z.string().trim().max(5000).optional().or(z.literal(''));
const localizedTextSchema = z.object({ sv: z.string().trim().max(10000).default(''), en: z.string().trim().max(10000).default('') });

export const collaborationInputSchema = z.object({
  name: z.string().trim().min(1).max(200),
  slug: slugSchema.optional().or(z.literal('')),
  type: collaborationTypeSchema,
  description: localizedTextSchema,
  shortDescription: localizedTextSchema.optional(),
  logoUrl: optionalString,
  logoAltText: localizedTextSchema.optional(),
  websiteUrl: optionalString,
  email: optionalString,
  contactPerson: optionalString,
  socialLinks: z.object({ instagram: optionalString, linkedin: optionalString, facebook: optionalString, tiktok: optionalString, other: optionalString }).default({}),
  officeAtCor: z.boolean().default(false),
  officeHours: localizedTextSchema.optional(),
  location: optionalString,
  active: z.boolean().default(true),
  visible: z.boolean().default(true),
  featured: z.boolean().default(false),
  displayOrder: z.coerce.number().int().default(0),
  tags: localizedTextSchema.optional(),
  internalNotes: optionalString,
  relationshipOwner: optionalString,
  validFrom: z.coerce.date().optional().or(z.literal('')),
  validUntil: z.coerce.date().optional().or(z.literal('')),
});

export const collaborationQuerySchema = z.object({
  type: collaborationTypeSchema.optional(),
  featured: z.enum(['true', 'false']).optional().transform((value) => value === undefined ? undefined : value === 'true'),
  active: z.enum(['true', 'false']).optional().transform((value) => value === undefined ? undefined : value === 'true'),
  visible: z.enum(['true', 'false']).optional().transform((value) => value === undefined ? undefined : value === 'true'),
  search: z.string().trim().max(120).optional(),
  locale: collaborationLocaleSchema.optional(),
  lang: collaborationLocaleSchema.optional(),
});

export const settingsInputSchema = z.object({ intro: localizedTextSchema, contactEmail: optionalString, visible: z.boolean().default(true) });
