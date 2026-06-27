import { z } from 'zod';
import { publicLanguages } from '../../localization/languages';

const id = z.string().regex(/^[a-f\d]{24}$/i);
const localized = z.object({ sv: z.string().trim().default(''), en: z.string().trim().default('') });
const requiredLocalized = z.object({ sv: z.string().trim().min(1), en: z.string().trim().default('') });
const optionalUrl = z.string().trim().url().optional().or(z.literal('').transform(() => undefined));
const optionalEmail = z.string().trim().email().optional().or(z.literal('').transform(() => undefined));
const date = z.string().datetime({ offset: true }).or(z.date()).transform((v) => new Date(v));

export const organizationLocaleSchema = z.enum(publicLanguages).default('sv');
export const personTypeSchema = z.enum(['board', 'staff', 'council', 'committee', 'alumni', 'other']);

export const personInputSchema = z.object({
  fullName: z.string().trim().min(1).max(160), nickname: z.string().trim().max(80).optional().or(z.literal('').transform(() => undefined)),
  slug: z.string().trim().max(120).optional().or(z.literal('').transform(() => undefined)), photoUrl: optionalUrl, photoAltText: localized.default({ sv: '', en: '' }),
  positionTitle: requiredLocalized, description: localized.default({ sv: '', en: '' }), responsibilities: localized.default({ sv: '', en: '' }),
  email: z.string().trim().email(), phone: z.string().trim().max(60).optional().or(z.literal('').transform(() => undefined)),
  languagesSpoken: z.array(z.string().trim().min(1).max(60)).default([]), roleBadgeIds: z.array(id).default([]),
  socialLinks: z.object({ instagram: optionalUrl, linkedIn: optionalUrl, website: optionalUrl }).default({}),
  officeHours: z.object({ sv: z.string().trim().optional(), en: z.string().trim().optional() }).optional(),
  type: personTypeSchema, displayOrder: z.coerce.number().int().default(100), active: z.boolean().default(true), visible: z.boolean().default(true),
  startDate: date.optional(), endDate: date.optional(),
});

export const roleBadgeInputSchema = z.object({
  name: requiredLocalized, description: localized.default({ sv: '', en: '' }), icon: z.string().trim().max(80).optional().or(z.literal('').transform(() => undefined)),
  color: z.string().trim().max(40).optional().or(z.literal('').transform(() => undefined)), link: optionalUrl,
  active: z.boolean().default(true), displayOrder: z.coerce.number().int().default(100),
});

export const committeeInputSchema = z.object({
  name: requiredLocalized, slug: z.string().trim().max(120).optional().or(z.literal('').transform(() => undefined)),
  description: localized.default({ sv: '', en: '' }), responsibilities: localized.default({ sv: '', en: '' }),
  contactEmail: optionalEmail, contactPersonId: id.optional(), personIds: z.array(id).default([]),
  active: z.boolean().default(true), visible: z.boolean().default(true), displayOrder: z.coerce.number().int().default(100),
});

export const studentCouncilInputSchema = z.object({
  title: requiredLocalized, description: localized.default({ sv: '', en: '' }), speakerName: z.string().trim().optional().or(z.literal('').transform(() => undefined)),
  speakerEmail: optionalEmail, viceSpeakerName: z.string().trim().optional().or(z.literal('').transform(() => undefined)), viceSpeakerEmail: optionalEmail,
  contactEmail: z.string().trim().email(), members: z.array(z.object({ name: z.string().trim().min(1), title: z.string().trim().optional().or(z.literal('').transform(() => undefined)), displayOrder: z.coerce.number().int().default(100), active: z.boolean().default(true) })).default([]),
  documentLinks: z.array(z.object({ label: requiredLocalized, url: z.string().trim().url(), type: z.enum(['agenda', 'protocol', 'bylaws', 'other']).default('other') })).default([]),
  visible: z.boolean().default(true),
});

export const eldersCouncilInputSchema = z.object({
  title: requiredLocalized, description: localized.default({ sv: '', en: '' }), contactEmail: z.string().trim().email(),
  members: z.array(z.object({ name: z.string().trim().min(1), title: z.string().trim().optional().or(z.literal('').transform(() => undefined)), mandateStart: date.optional(), mandateEnd: date.optional(), chairperson: z.boolean().default(false), secretary: z.boolean().default(false), active: z.boolean().default(true), displayOrder: z.coerce.number().int().default(100) })).default([]),
  visible: z.boolean().default(true),
});

export const recruitmentInputSchema = z.object({
  title: requiredLocalized, description: localized.default({ sv: '', en: '' }), type: z.enum(['tutor', 'board', 'student_council', 'crew_member', 'staff', 'alumni', 'other']),
  openingDate: date, closingDate: date, ctaLabel: requiredLocalized, ctaUrl: z.string().trim().url(),
  contactPersonId: id.optional(), contactEmail: optionalEmail, featured: z.boolean().default(false), published: z.boolean().default(false),
  status: z.enum(['coming_soon', 'open', 'closed']).optional(), displayOrder: z.coerce.number().int().default(100), active: z.boolean().default(true),
}).superRefine((value, ctx) => {
  if (value.closingDate < value.openingDate) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['closingDate'], message: 'Closing date must be after opening date' });
});

export const alumniInputSchema = z.object({
  title: requiredLocalized, intro: localized.default({ sv: '', en: '' }), body: localized.default({ sv: '', en: '' }),
  heroImageUrl: optionalUrl, heroImageAltText: localized.default({ sv: '', en: '' }), benefits: z.array(localized).default([]),
  ctaPrimaryLabel: requiredLocalized, ctaPrimaryUrl: z.string().trim().min(1), ctaSecondaryLabel: localized.optional(), ctaSecondaryUrl: z.string().trim().optional().or(z.literal('').transform(() => undefined)),
  contactEmail: optionalEmail, published: z.boolean().default(true),
});

export const objectIdSchema = id;
