import { AuthPrincipal, RequestContext } from '../identity/types';

export type BookingLocale = 'en' | 'sv';
export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LocalizedText { en: string; sv: string; }
export interface OpeningHours { weekday: number; start: string; end: string; }
export interface BlackoutPeriod { startAt: Date; endAt: Date; reason?: LocalizedText; }

export interface BookingResourceInput {
  slug?: string;
  name: LocalizedText;
  description: LocalizedText;
  location: LocalizedText;
  rules: LocalizedText;
  capacity: number;
  accessibility: LocalizedText;
  imageUrl?: string;
  active: boolean;
  requiresApproval: boolean;
  minDurationMinutes: number;
  maxDurationMinutes: number;
  advanceBookingDays: number;
  openingHours: OpeningHours[];
  blackoutPeriods: BlackoutPeriod[];
}

export interface BookingResource extends BookingResourceInput {
  id: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicBookingResource {
  id: string;
  slug: string;
  name: string;
  description: string;
  location: string;
  rules: string;
  capacity: number;
  accessibility: string;
  imageUrl?: string;
  requiresApproval: boolean;
  minDurationMinutes: number;
  maxDurationMinutes: number;
  advanceBookingDays: number;
  openingHours: OpeningHours[];
}

export interface BookingRequestInput {
  resourceId: string;
  startAt: Date;
  endAt: Date;
  requesterName: string;
  requesterEmail: string;
  requesterPhone?: string;
  organization?: string;
  purpose: string;
  attendees: number;
  accessibilityNeeds?: string;
  locale: BookingLocale;
  privacyAccepted: true;
}

export interface BookingRecord extends BookingRequestInput {
  id: string;
  reference: string;
  resource: BookingResource;
  status: BookingStatus;
  publicNotes?: string;
  internalNotes?: string;
  decisionAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicBookingStatus {
  reference: string;
  status: BookingStatus;
  resource: PublicBookingResource;
  startAt: Date;
  endAt: Date;
  requesterName: string;
  purpose: string;
  publicNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingHistoryEntry {
  id: string;
  action: string;
  status: BookingStatus;
  actorId?: string;
  note?: string;
  occurredAt: Date;
}

export interface BookingNotification {
  to: string;
  subject: string;
  text: string;
}

export type BookingNotifier = (notification: BookingNotification) => Promise<void>;

export interface BookingService {
  listPublicResources(locale: BookingLocale): Promise<PublicBookingResource[]>;
  getPublicResource(slug: string, locale: BookingLocale): Promise<PublicBookingResource>;
  getAvailability(resourceId: string, from: Date, to: Date): Promise<Array<{ startAt: Date; endAt: Date; kind: 'booking' | 'blackout' }>>;
  createBooking(input: BookingRequestInput, context: RequestContext): Promise<{ booking: PublicBookingStatus; accessCode: string }>;
  getPublicBooking(reference: string, accessCode: string, locale: BookingLocale): Promise<PublicBookingStatus>;
  listAdminResources(): Promise<BookingResource[]>;
  createResource(input: BookingResourceInput, actor: AuthPrincipal, context: RequestContext): Promise<BookingResource>;
  updateResource(id: string, input: BookingResourceInput, actor: AuthPrincipal, context: RequestContext): Promise<BookingResource>;
  listBookings(query?: { status?: BookingStatus; resourceId?: string; from?: Date; to?: Date }): Promise<BookingRecord[]>;
  getBooking(id: string): Promise<BookingRecord>;
  updateBooking(id: string, input: Partial<Pick<BookingRequestInput, 'resourceId' | 'startAt' | 'endAt' | 'requesterName' | 'requesterEmail' | 'requesterPhone' | 'organization' | 'purpose' | 'attendees' | 'accessibilityNeeds'>> & { publicNotes?: string; internalNotes?: string }, actor: AuthPrincipal, context: RequestContext): Promise<BookingRecord>;
  setBookingStatus(id: string, status: BookingStatus, note: string | undefined, actor: AuthPrincipal, context: RequestContext): Promise<BookingRecord>;
  listHistory(id: string): Promise<BookingHistoryEntry[]>;
}
