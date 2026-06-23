import { z } from 'zod';
import { contentTypes } from '../types';

const url = z.string().url().max(2048);
const heroSection = z.object({
  type: z.literal('hero'), position: z.number().int().min(0),
  data: z.object({ heading: z.string().trim().min(1).max(160), subheading: z.string().trim().max(500).optional(), imageUrl: url.optional(), ctaLabel: z.string().trim().max(80).optional(), ctaUrl: url.optional() }),
});
const textSection = z.object({ type: z.literal('text'), position: z.number().int().min(0), data: z.object({ heading: z.string().trim().max(160).optional(), body: z.string().trim().min(1).max(20000) }) });
const imageSection = z.object({ type: z.literal('image'), position: z.number().int().min(0), data: z.object({ url, alt: z.string().trim().min(1).max(300), caption: z.string().trim().max(500).optional() }) });
const ctaSection = z.object({ type: z.literal('cta'), position: z.number().int().min(0), data: z.object({ heading: z.string().trim().min(1).max(160), text: z.string().trim().max(500).optional(), label: z.string().trim().min(1).max(80), url }) });
const faqSection = z.object({ type: z.literal('faq'), position: z.number().int().min(0), data: z.object({ heading: z.string().trim().max(160).optional(), items: z.array(z.object({ question: z.string().trim().min(1).max(500), answer: z.string().trim().min(1).max(5000) })).min(1).max(50) }) });

export const contentTypeSchema = z.enum(contentTypes);
export const contentSectionSchema = z.discriminatedUnion('type', [heroSection, textSection, imageSection, ctaSection, faqSection]);
export const contentSectionsSchema = z.array(contentSectionSchema).max(100).superRefine((sections, context) => {
  const positions = sections.map((section) => section.position);
  if (new Set(positions).size !== positions.length) context.addIssue({ code: z.ZodIssueCode.custom, message: 'Section positions must be unique' });
  if ([...positions].sort((a, b) => a - b).some((position, index) => position !== index)) context.addIssue({ code: z.ZodIssueCode.custom, message: 'Section positions must be contiguous from zero' });
});
export const createContentSchema = z.object({ contentType: contentTypeSchema, title: z.string().trim().min(1).max(160), slug: z.string().trim().max(120).optional(), sections: contentSectionsSchema.default([]) });
export const updateContentSchema = createContentSchema.extend({ expectedVersion: z.number().int().min(1) });
export const publishContentSchema = z.object({ expectedVersion: z.number().int().min(1) });
