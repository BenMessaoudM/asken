import { createHash, randomBytes } from 'crypto';
import { Types } from 'mongoose';
import { slugify } from '../../cms/utils/slug';
import { AppError } from '../../http/errors';
import { recordAudit } from '../../identity/services/audit';
import { AuthPrincipal, RequestContext } from '../../identity/types';
import { BookingModel } from '../models/Booking';
import { BookingHistoryModel } from '../models/BookingHistory';
import { BookingResourceModel } from '../models/BookingResource';
import { BookingSlotModel } from '../models/BookingSlot';
import { assertBookable, bookingSlots } from './availability';
import { BookingHistoryEntry, BookingLocale, BookingNotifier, BookingRecord, BookingRequestInput, BookingResource, BookingResourceInput, BookingService, BookingStatus, PublicBookingResource, PublicBookingStatus } from '../types';

type ResourceDoc = BookingResourceInput & { _id: Types.ObjectId; slug: string; createdAt: Date; updatedAt: Date };
type BookingDoc = Omit<BookingRequestInput, 'privacyAccepted'> & { _id: Types.ObjectId; reference: string; accessCodeHash: string; resourceId: Types.ObjectId | ResourceDoc; status: BookingStatus; publicNotes?: string; internalNotes?: string; decisionAt?: Date; privacyAcceptedAt: Date; createdAt: Date; updatedAt: Date };

export class MongooseBookingService implements BookingService {
  constructor(private readonly notify: BookingNotifier = async () => undefined) {}

  async listPublicResources(locale: BookingLocale): Promise<PublicBookingResource[]> {
    const resources = await BookingResourceModel.find({ active: true }).sort({ [`name.${locale}`]: 1 }).lean() as unknown as ResourceDoc[];
    return resources.map((resource) => this.toPublicResource(resource, locale));
  }

  async getPublicResource(slug: string, locale: BookingLocale): Promise<PublicBookingResource> {
    const resource = await BookingResourceModel.findOne({ slug, active: true }).lean() as unknown as ResourceDoc | null;
    if (!resource) throw new AppError(404, 'BOOKING_RESOURCE_NOT_FOUND', 'Booking resource was not found');
    return this.toPublicResource(resource, locale);
  }

  async getAvailability(resourceId: string, from: Date, to: Date) {
    this.assertId(resourceId, 'RESOURCE');
    const resource = await BookingResourceModel.findOne({ _id: resourceId, active: true }).lean() as unknown as ResourceDoc | null;
    if (!resource) throw new AppError(404, 'BOOKING_RESOURCE_NOT_FOUND', 'Booking resource was not found');
    const bookings = await BookingModel.find({ resourceId, status: { $in: ['pending', 'approved'] }, startAt: { $lt: to }, endAt: { $gt: from } }).sort({ startAt: 1 }).lean() as unknown as BookingDoc[];
    const blocked = resource.blackoutPeriods.filter((period) => period.startAt < to && period.endAt > from).map((period) => ({ startAt: period.startAt, endAt: period.endAt, kind: 'blackout' as const }));
    return [...bookings.map((booking) => ({ startAt: booking.startAt, endAt: booking.endAt, kind: 'booking' as const })), ...blocked].sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
  }

  async createBooking(input: BookingRequestInput, context: RequestContext) {
    const resource = await this.resource(input.resourceId);
    assertBookable(resource, input.startAt, input.endAt, input.attendees);
    const accessCode = randomBytes(24).toString('base64url');
    const reference = `ASK-${randomBytes(4).toString('hex').toUpperCase()}`;
    const status: BookingStatus = resource.requiresApproval ? 'pending' : 'approved';
    const booking = await BookingModel.create({ ...input, requesterEmail: input.requesterEmail.toLowerCase(), privacyAcceptedAt: new Date(), accessCodeHash: this.hash(accessCode), reference, status });
    try {
      await BookingSlotModel.insertMany(bookingSlots(input.startAt, input.endAt).map((slotAt) => ({ resourceId: input.resourceId, bookingId: booking._id, slotAt })), { ordered: true });
    } catch (error) {
      await Promise.all([BookingSlotModel.deleteMany({ bookingId: booking._id }), BookingModel.deleteOne({ _id: booking._id })]);
      if (this.isDuplicate(error)) throw new AppError(409, 'BOOKING_CONFLICT', 'The selected time is no longer available');
      throw error;
    }
    await this.history(booking.id, 'booking.requested', status, undefined, undefined, booking.toObject());
    await recordAudit({ action: 'booking.requested', targetType: 'booking', targetId: booking.id, context, metadata: { reference, resourceId: input.resourceId, startAt: input.startAt, endAt: input.endAt, status } });
    const managed = await this.getBooking(booking.id);
    try { await this.notify(this.requestEmail(managed, accessCode)); } catch { await recordAudit({ action: 'booking.notification_failed', targetType: 'booking', targetId: booking.id, context, metadata: { reference } }); }
    return { booking: this.toPublicStatus(managed, input.locale), accessCode };
  }

  async getPublicBooking(reference: string, accessCode: string, locale: BookingLocale) {
    const booking = await BookingModel.findOne({ reference }).populate('resourceId').lean() as unknown as BookingDoc | null;
    if (!booking || booking.accessCodeHash !== this.hash(accessCode)) throw new AppError(404, 'BOOKING_NOT_FOUND', 'Booking was not found');
    return this.toPublicStatus(this.toBookingRecord(booking), locale);
  }

  async listAdminResources() {
    const resources = await BookingResourceModel.find().sort({ 'name.en': 1 }).lean() as unknown as ResourceDoc[];
    return resources.map((resource) => this.toResource(resource));
  }

  async createResource(input: BookingResourceInput, actor: AuthPrincipal, context: RequestContext) {
    const slug = this.slug(input.slug || input.name.en);
    try {
      const created = await BookingResourceModel.create({ ...input, imageUrl: input.imageUrl || undefined, slug });
      await recordAudit({ actorId: actor.userId, action: 'booking.resource_created', targetType: 'booking_resource', targetId: created.id, context, metadata: { slug } });
      return this.toResource(created.toObject() as unknown as ResourceDoc);
    } catch (error) { this.duplicate(error, 'RESOURCE_SLUG_IN_USE'); throw error; }
  }

  async updateResource(id: string, input: BookingResourceInput, actor: AuthPrincipal, context: RequestContext) {
    this.assertId(id, 'RESOURCE');
    const slug = this.slug(input.slug || input.name.en);
    try {
      const updated = await BookingResourceModel.findByIdAndUpdate(id, { $set: { ...input, imageUrl: input.imageUrl || undefined, slug } }, { new: true }).lean() as unknown as ResourceDoc | null;
      if (!updated) throw new AppError(404, 'BOOKING_RESOURCE_NOT_FOUND', 'Booking resource was not found');
      await recordAudit({ actorId: actor.userId, action: 'booking.resource_updated', targetType: 'booking_resource', targetId: id, context, metadata: { slug, active: input.active } });
      return this.toResource(updated);
    } catch (error) { this.duplicate(error, 'RESOURCE_SLUG_IN_USE'); throw error; }
  }

  async listBookings(query: { status?: BookingStatus; resourceId?: string; from?: Date; to?: Date } = {}) {
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;
    if (query.resourceId) filter.resourceId = query.resourceId;
    if (query.from || query.to) filter.startAt = { ...(query.from ? { $gte: query.from } : {}), ...(query.to ? { $lte: query.to } : {}) };
    const bookings = await BookingModel.find(filter).populate('resourceId').sort({ startAt: 1, createdAt: -1 }).lean() as unknown as BookingDoc[];
    return bookings.map((booking) => this.toBookingRecord(booking));
  }

  async getBooking(id: string) {
    this.assertId(id, 'BOOKING');
    const booking = await BookingModel.findById(id).populate('resourceId').lean() as unknown as BookingDoc | null;
    if (!booking) throw new AppError(404, 'BOOKING_NOT_FOUND', 'Booking was not found');
    return this.toBookingRecord(booking);
  }

  async updateBooking(id: string, input: Parameters<BookingService['updateBooking']>[1], actor: AuthPrincipal, context: RequestContext) {
    const existing = await this.getBooking(id);
    if (!['pending', 'approved'].includes(existing.status)) throw new AppError(409, 'BOOKING_FINALIZED', 'Finalized bookings cannot be edited');
    const resourceId = input.resourceId || existing.resource.id;
    const startAt = input.startAt || existing.startAt;
    const endAt = input.endAt || existing.endAt;
    const attendees = input.attendees || existing.attendees;
    const resource = await this.resource(resourceId);
    assertBookable(resource, startAt, endAt, attendees);
    const oldSlots = await BookingSlotModel.find({ bookingId: id }).lean();
    await BookingSlotModel.deleteMany({ bookingId: id });
    try {
      await BookingSlotModel.insertMany(bookingSlots(startAt, endAt).map((slotAt) => ({ resourceId, bookingId: id, slotAt })), { ordered: true });
    } catch (error) {
      await BookingSlotModel.deleteMany({ bookingId: id });
      if (oldSlots.length) await BookingSlotModel.insertMany(oldSlots.map(({ resourceId: previousResource, bookingId, slotAt }) => ({ resourceId: previousResource, bookingId, slotAt })));
      if (this.isDuplicate(error)) throw new AppError(409, 'BOOKING_CONFLICT', 'The selected time is no longer available');
      throw error;
    }
    const update = { ...input, resourceId, startAt, endAt };
    const booking = await BookingModel.findByIdAndUpdate(id, { $set: update }, { new: true }).populate('resourceId').lean() as unknown as BookingDoc;
    await this.history(id, 'booking.updated', existing.status, actor.userId, input.internalNotes, booking);
    await recordAudit({ actorId: actor.userId, action: 'booking.updated', targetType: 'booking', targetId: id, context, metadata: { resourceId, startAt, endAt } });
    const managed = this.toBookingRecord(booking);
    try { await this.notify(this.changeEmail(managed)); } catch { await recordAudit({ actorId: actor.userId, action: 'booking.notification_failed', targetType: 'booking', targetId: id, context }); }
    return managed;
  }

  async setBookingStatus(id: string, status: BookingStatus, note: string | undefined, actor: AuthPrincipal, context: RequestContext) {
    const existing = await this.getBooking(id);
    const allowed = existing.status === 'pending' ? ['approved', 'rejected', 'cancelled'] : existing.status === 'approved' ? ['cancelled'] : [];
    if (!allowed.includes(status)) throw new AppError(409, 'INVALID_BOOKING_TRANSITION', `Cannot change booking from ${existing.status} to ${status}`);
    if (status === 'rejected' || status === 'cancelled') await BookingSlotModel.deleteMany({ bookingId: id });
    const booking = await BookingModel.findByIdAndUpdate(id, { $set: { status, publicNotes: note || existing.publicNotes, decisionAt: new Date(), decidedBy: actor.userId } }, { new: true }).populate('resourceId').lean() as unknown as BookingDoc;
    await this.history(id, `booking.${status}`, status, actor.userId, note, booking);
    await recordAudit({ actorId: actor.userId, action: `booking.${status}`, targetType: 'booking', targetId: id, context, metadata: { reference: existing.reference, note } });
    const managed = this.toBookingRecord(booking);
    try { await this.notify(this.changeEmail(managed)); } catch { await recordAudit({ actorId: actor.userId, action: 'booking.notification_failed', targetType: 'booking', targetId: id, context }); }
    return managed;
  }

  async listHistory(id: string): Promise<BookingHistoryEntry[]> {
    this.assertId(id, 'BOOKING');
    const entries = await BookingHistoryModel.find({ bookingId: id }).sort({ occurredAt: -1 }).lean();
    return entries.map((entry) => ({ id: entry._id.toString(), action: entry.action, status: entry.status as BookingStatus, actorId: entry.actorId?.toString(), note: entry.note || undefined, occurredAt: entry.occurredAt }));
  }

  private async resource(id: string) { this.assertId(id, 'RESOURCE'); const resource = await BookingResourceModel.findById(id).lean() as unknown as ResourceDoc | null; if (!resource) throw new AppError(404, 'BOOKING_RESOURCE_NOT_FOUND', 'Booking resource was not found'); return this.toResource(resource); }
  private toResource(resource: ResourceDoc): BookingResource { return { id: resource._id.toString(), slug: resource.slug, name: resource.name, description: resource.description, location: resource.location, rules: resource.rules, capacity: resource.capacity, accessibility: resource.accessibility, imageUrl: resource.imageUrl, active: resource.active, requiresApproval: resource.requiresApproval, minDurationMinutes: resource.minDurationMinutes, maxDurationMinutes: resource.maxDurationMinutes, advanceBookingDays: resource.advanceBookingDays, openingHours: resource.openingHours, blackoutPeriods: resource.blackoutPeriods, createdAt: resource.createdAt, updatedAt: resource.updatedAt }; }
  private toPublicResource(resource: ResourceDoc | BookingResource, locale: BookingLocale): PublicBookingResource { return { id: '_id' in resource ? resource._id.toString() : resource.id, slug: resource.slug, name: resource.name[locale], description: resource.description[locale], location: resource.location[locale], rules: resource.rules[locale], capacity: resource.capacity, accessibility: resource.accessibility[locale], imageUrl: resource.imageUrl, requiresApproval: resource.requiresApproval, minDurationMinutes: resource.minDurationMinutes, maxDurationMinutes: resource.maxDurationMinutes, advanceBookingDays: resource.advanceBookingDays, openingHours: resource.openingHours }; }
  private toBookingRecord(booking: BookingDoc): BookingRecord { const resource = booking.resourceId as ResourceDoc; return { id: booking._id.toString(), reference: booking.reference, resource: this.toResource(resource), resourceId: resource._id.toString(), startAt: booking.startAt, endAt: booking.endAt, requesterName: booking.requesterName, requesterEmail: booking.requesterEmail, requesterPhone: booking.requesterPhone, organization: booking.organization, purpose: booking.purpose, attendees: booking.attendees, accessibilityNeeds: booking.accessibilityNeeds, locale: booking.locale, privacyAccepted: true, status: booking.status, publicNotes: booking.publicNotes, internalNotes: booking.internalNotes, decisionAt: booking.decisionAt, createdAt: booking.createdAt, updatedAt: booking.updatedAt }; }
  private toPublicStatus(booking: BookingRecord, locale: BookingLocale): PublicBookingStatus { return { reference: booking.reference, status: booking.status, resource: this.toPublicResource(booking.resource, locale), startAt: booking.startAt, endAt: booking.endAt, requesterName: booking.requesterName, purpose: booking.purpose, publicNotes: booking.publicNotes, createdAt: booking.createdAt, updatedAt: booking.updatedAt }; }
  private async history(bookingId: string, action: string, status: BookingStatus, actorId?: string, note?: string, snapshot?: unknown) { await BookingHistoryModel.create({ bookingId, action, status, actorId, note, snapshot, occurredAt: new Date() }); }
  private requestEmail(booking: BookingRecord, accessCode: string) { const sv = booking.locale === 'sv'; const statusUrl = `/booking/status?reference=${encodeURIComponent(booking.reference)}&code=${encodeURIComponent(accessCode)}`; return { to: booking.requesterEmail, subject: sv ? `Bokningsförfrågan ${booking.reference}` : `Booking request ${booking.reference}`, text: sv ? `Tack för din bokningsförfrågan för ${booking.resource.name.sv}. Referens: ${booking.reference}. Status: ${booking.status}. Kontrollera status: ${statusUrl}` : `Thank you for your booking request for ${booking.resource.name.en}. Reference: ${booking.reference}. Status: ${booking.status}. Check status: ${statusUrl}` }; }
  private changeEmail(booking: BookingRecord) { const sv = booking.locale === 'sv'; return { to: booking.requesterEmail, subject: sv ? `Bokningsstatus ${booking.reference}` : `Booking status ${booking.reference}`, text: sv ? `Status för bokning ${booking.reference}: ${booking.status}.${booking.publicNotes ? ` Meddelande: ${booking.publicNotes}` : ''}` : `Status for booking ${booking.reference}: ${booking.status}.${booking.publicNotes ? ` Message: ${booking.publicNotes}` : ''}` }; }
  private hash(value: string) { return createHash('sha256').update(value).digest('hex'); }
  private slug(value: string) { const result = slugify(value); if (!result) throw new AppError(400, 'INVALID_SLUG', 'Resource slug is invalid'); return result; }
  private assertId(id: string, kind: string) { if (!Types.ObjectId.isValid(id)) throw new AppError(400, `INVALID_${kind}_ID`, `${kind.toLowerCase()} identifier is invalid`); }
  private isDuplicate(error: unknown) {
    const seen = new Set<object>();
    const inspect = (value: unknown): boolean => {
      if (!value || typeof value !== "object" || seen.has(value)) return false;
      seen.add(value);
      const candidate = value as {
        code?: number;
        cause?: unknown;
        err?: unknown;
        errorResponse?: unknown;
        result?: unknown;
        writeErrors?: unknown[];
        errors?: unknown[];
      };
      if (candidate.code === 11000) return true;
      if (candidate.writeErrors?.some(inspect) || candidate.errors?.some(inspect)) return true;
      return inspect(candidate.err) || inspect(candidate.cause) || inspect(candidate.errorResponse) || inspect(candidate.result);
    };
    return inspect(error);
  }
  private duplicate(error: unknown, code: string) { if (this.isDuplicate(error)) throw new AppError(409, code, 'Resource slug is already in use'); }
}
