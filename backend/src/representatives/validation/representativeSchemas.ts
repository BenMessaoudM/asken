import { z } from 'zod';
import { publicLanguages } from '../../localization/languages';

const localizedTextSchema = z.object({
  sv: z.string().trim().default(''),
  en: z.string().trim().default(''),
});

const requiredLocalizedTextSchema = localizedTextSchema.refine((value) => value.sv.length > 0 || value.en.length > 0, {
  message: 'At least one language value is required',
});

const optionalString = z.string().trim().optional().or(z.literal('').transform(() => undefined));
const optionalEmail = z.string().trim().email().optional().or(z.literal('').transform(() => undefined));
const optionalUrl = z.string().trim().url().optional().or(z.literal('').transform(() => undefined));
const dateSchema = z.coerce.date();

export const representativeLocaleSchema = z.object({
  lang: z.enum(publicLanguages).default('sv'),
});

export const representativeSlugSchema = z.object({
  slug: z.string().trim().min(1),
});

export const representativeBodyInputSchema = z.object({
  name: requiredLocalizedTextSchema,
  slug: optionalString,
  description: localizedTextSchema.default({ sv: '', en: '' }),
  category: z.enum(['statutory_arcada_body', 'arcada_body', 'external_body', 'other']).default('arcada_body'),
  appointingBody: z.enum(['fullmaktige', 'board', 'other']).default('fullmaktige'),
  defaultTermLengthMonths: z.coerce.number().int().positive().optional(),
  defaultSeatCount: z.coerce.number().int().nonnegative().optional(),
  defaultDeputySeatCount: z.coerce.number().int().nonnegative().optional(),
  eligibilityDescription: localizedTextSchema.default({ sv: '', en: '' }),
  applicationInstructions: localizedTextSchema.default({ sv: '', en: '' }),
  active: z.boolean().default(true),
  visible: z.boolean().default(true),
  displayOrder: z.coerce.number().int().default(0),
});

export const studentRepresentativeInputSchema = z
  .object({
    bodyId: z.string().trim().min(1),
    fullName: z.string().trim().min(1),
    email: optionalEmail,
    contactPublic: z.boolean().default(false),
    studyProgramme: optionalString,
    role: z.enum(['representative', 'deputy']).default('representative'),
    termStart: dateSchema,
    termEnd: dateSchema,
    status: z.enum(['active', 'ended', 'resigned', 'dismissed']).default('active'),
    appointedBy: z.enum(['fullmaktige', 'board', 'other']).default('fullmaktige'),
    appointmentDate: dateSchema.optional(),
    publicProfile: z.boolean().default(false),
    photoUrl: optionalUrl,
    description: localizedTextSchema.default({ sv: '', en: '' }),
    displayOrder: z.coerce.number().int().default(0),
  })
  .refine((value) => value.termEnd > value.termStart, {
    message: 'Term end must be after term start',
    path: ['termEnd'],
  });

export const representativeCallInputSchema = z
  .object({
    title: requiredLocalizedTextSchema,
    bodyId: optionalString,
    description: localizedTextSchema.default({ sv: '', en: '' }),
    openingDate: dateSchema,
    closingDate: dateSchema,
    numberOfSeats: z.coerce.number().int().positive(),
    eligibility: localizedTextSchema.default({ sv: '', en: '' }),
    applicationInstructions: localizedTextSchema.default({ sv: '', en: '' }),
    ctaLabel: requiredLocalizedTextSchema,
    ctaUrl: optionalUrl,
    contactEmail: optionalEmail,
    status: z.enum(['coming_soon', 'open', 'closed']).optional(),
    published: z.boolean().default(false),
    featured: z.boolean().default(false),
    displayOrder: z.coerce.number().int().default(0),
  })
  .refine((value) => value.closingDate > value.openingDate, {
    message: 'Closing date must be after opening date',
    path: ['closingDate'],
  });
