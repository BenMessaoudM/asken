import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid identifier');
const localizedText = z.object({ en: z.string().trim().min(1).max(2000), sv: z.string().trim().min(1).max(2000) });
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must use HH:mm');
const dateTime = z.string().datetime({ offset: true });

export const localeSchema = z.enum(['en', 'sv']).default('sv');
export const resourceIdSchema = objectId;
export const bookingIdSchema = objectId;
export const resourceSlugSchema = z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120);
export const referenceSchema = z.string().trim().regex(/^ASK-[A-Z0-9]{8}$/);
export const accessCodeSchema = z.string().trim().min(20).max(200);

export const bookingResourceSchema = z.object({
  slug: z.string().trim().max(120).optional(),
  name: localizedText,
  description: localizedText,
  location: localizedText,
  rules: localizedText,
  capacity: z.number().int().min(1).max(1000),
  accessibility: localizedText,
  imageUrl: z.union([z.string().url().max(2048), z.literal('')]).optional(),
  active: z.boolean().default(true),
  requiresApproval: z.boolean().default(true),
  minDurationMinutes: z.number().int().min(15).max(480).multipleOf(15),
  maxDurationMinutes: z.number().int().min(15).max(1440).multipleOf(15),
  advanceBookingDays: z.number().int().min(1).max(365),
  openingHours: z.array(z.object({ weekday: z.number().int().min(0).max(6), start: time, end: time })).max(14),
  blackoutPeriods: z.array(z.object({ startAt: dateTime, endAt: dateTime, reason: localizedText.optional() })).max(100),
}).superRefine((value, context) => {
  if (value.maxDurationMinutes < value.minDurationMinutes) context.addIssue({ code: z.ZodIssueCode.custom, path: ['maxDurationMinutes'], message: 'Maximum duration must not be less than minimum duration' });
  value.openingHours.forEach((hours, index) => { if (hours.end <= hours.start) context.addIssue({ code: z.ZodIssueCode.custom, path: ['openingHours', index, 'end'], message: 'Closing time must be after opening time' }); });
  value.blackoutPeriods.forEach((period, index) => { if (new Date(period.endAt) <= new Date(period.startAt)) context.addIssue({ code: z.ZodIssueCode.custom, path: ['blackoutPeriods', index, 'endAt'], message: 'Blackout end must be after start' }); });
});

export const bookingRequestSchema = z.object({
  resourceId: objectId,
  startAt: dateTime,
  endAt: dateTime,
  requesterName: z.string().trim().min(2).max(120),
  requesterEmail: z.string().trim().email().max(254),
  requesterPhone: z.string().trim().max(40).optional(),
  organization: z.string().trim().max(160).optional(),
  purpose: z.string().trim().min(3).max(2000),
  attendees: z.number().int().min(1).max(1000),
  accessibilityNeeds: z.string().trim().max(1000).optional(),
  locale: z.enum(['en', 'sv']),
  privacyAccepted: z.literal(true),
}).superRefine((value, context) => {
  if (new Date(value.endAt) <= new Date(value.startAt)) context.addIssue({ code: z.ZodIssueCode.custom, path: ['endAt'], message: 'End time must be after start time' });
});

export const bookingUpdateSchema = z.object({
  resourceId: objectId.optional(), startAt: dateTime.optional(), endAt: dateTime.optional(),
  requesterName: z.string().trim().min(2).max(120).optional(), requesterEmail: z.string().trim().email().max(254).optional(),
  requesterPhone: z.string().trim().max(40).optional(), organization: z.string().trim().max(160).optional(),
  purpose: z.string().trim().min(3).max(2000).optional(), attendees: z.number().int().min(1).max(1000).optional(),
  accessibilityNeeds: z.string().trim().max(1000).optional(), publicNotes: z.string().trim().max(2000).optional(), internalNotes: z.string().trim().max(5000).optional(),
}).refine((value) => Object.keys(value).length > 0, 'At least one field is required');

export const statusUpdateSchema = z.object({ status: z.enum(['approved', 'rejected', 'cancelled']), note: z.string().trim().max(2000).optional() });
export const availabilityQuerySchema = z.object({ resourceId: objectId, from: dateTime, to: dateTime }).superRefine((value, context) => { if (new Date(value.to) <= new Date(value.from)) context.addIssue({ code: z.ZodIssueCode.custom, path: ['to'], message: 'End must be after start' }); });
export const adminBookingQuerySchema = z.object({ status: z.enum(['pending', 'approved', 'rejected', 'cancelled']).optional(), resourceId: objectId.optional(), from: dateTime.optional(), to: dateTime.optional() });
