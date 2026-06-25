import { AuthPrincipal, RequestContext } from '../identity/types';

export type BookingLocale = 'en' | 'sv';
export type ContractLanguage = 'en' | 'sv' | 'fi';
export type BookingType = 'internal_ask' | 'arcada_association' | 'ask_member' | 'alumni' | 'external';
export type InternalAskPurpose = 'official_activity' | 'private_booking';
export type BookingSubmissionType = 'booking_request' | 'quote_request';
export type BookingStatus = 'submitted' | 'quote_requested' | 'quote_sent' | 'approved' | 'contract_generated' | 'waiting_for_signature' | 'signed' | 'completed' | 'cancelled' | 'rejected';
export type ContractStatus = 'contract_generated' | 'waiting_for_signature' | 'signed';

export interface LocalizedText { en: string; sv: string; fi: string; }
export interface OpeningHours { weekday: number; start: string; end: string; }
export interface BlackoutPeriod { startAt: Date; endAt: Date; reason?: LocalizedText; }
export interface BookingResourceInput { slug?: string; name: LocalizedText; floor: LocalizedText; description: LocalizedText; location: LocalizedText; rules: LocalizedText; capacity: number; accessibility: LocalizedText; imageUrl?: string; active: boolean; requiresApproval: boolean; minDurationMinutes: number; maxDurationMinutes: number; advanceBookingDays: number; openingHours: OpeningHours[]; blackoutPeriods: BlackoutPeriod[]; }
export interface BookingResource extends BookingResourceInput { id: string; slug: string; createdAt: Date; updatedAt: Date; }
export interface PublicBookingResource { id: string; slug: string; name: string; floor: string; description: string; location: string; rules: string; capacity: number; accessibility: string; imageUrl?: string; requiresApproval: boolean; minDurationMinutes: number; maxDurationMinutes: number; advanceBookingDays: number; openingHours: OpeningHours[]; }
export interface BillingAddress { name: string; address: string; postalCode: string; city: string; country: string; vatOrBusinessId?: string; referenceNumber?: string; }
export interface PriceBreakdown { currency: 'EUR'; rentalPrice: number; kitchenFee: number; saunaFee: number; discount: number; totalPrice: number; minimumHours: number; billableHours: number; benefitApplied?: 'official_ask_activity' | 'board_private_booking'; pricingRuleVersion: string; manualOverride: boolean; }
export interface PricingRequest { bookingType: BookingType; internalAskPurpose?: InternalAskPurpose; requesterEmail?: string; mandateYear?: number; resourceSlug: string; startAt: Date; endAt: Date; kitchenExtra: boolean; saunaExtra: boolean; }
export interface BookingRequestInput extends PricingRequest { resourceId: string; requesterName: string; requesterEmail: string; requesterPhone?: string; organization?: string; billingAddress?: BillingAddress; purpose: string; attendees: number; accessibilityNeeds?: string; locale: BookingLocale; submissionType: BookingSubmissionType; privacyAccepted: true; }
export interface BookingChecklistItem { key: string; label: string; completed: boolean; completedAt?: Date; completedBy?: string; }
export interface BookingRecord extends BookingRequestInput { id: string; reference: string; resource: BookingResource; status: BookingStatus; price: PriceBreakdown; quoteNotes?: string; publicNotes?: string; internalNotes?: string; checklist: BookingChecklistItem[]; decisionAt?: Date; createdAt: Date; updatedAt: Date; }
export interface PublicBookingStatus { reference: string; status: BookingStatus; resource: PublicBookingResource; bookingType: BookingType; startAt: Date; endAt: Date; requesterName: string; purpose: string; price: PriceBreakdown; publicNotes?: string; createdAt: Date; updatedAt: Date; }
export interface BookingHistoryEntry { id: string; action: string; status: BookingStatus; reference?: string; actorId?: string; note?: string; occurredAt: Date; }
export interface ContractMetadata { id: string; bookingId: string; bookingReference: string; generatedBy: string; generatedAt: Date; language: ContractLanguage; templateVersion: string; termsVersion: string; status: ContractStatus; }
export interface GeneratedContract { metadata: ContractMetadata; filename: string; pdf: Buffer; }
export type BookingEmailType = 'booking_received' | 'quote_requested' | 'quote_sent' | 'booking_approved' | 'contract_ready' | 'reminder' | 'booking_completed';
export interface BookingNotification { type: BookingEmailType; to: string; subject: string; text: string; }
export type BookingNotifier = (notification: BookingNotification) => Promise<void>;
export interface BookingDashboardSummary { pendingApprovals: number; waitingForSignature: number; quoteRequests: number; upcomingThisWeek: number; completedThisMonth: number; }

export interface BookingService {
  listPublicResources(locale: BookingLocale): Promise<PublicBookingResource[]>;
  getPublicResource(slug: string, locale: BookingLocale): Promise<PublicBookingResource>;
  getAvailability(resourceId: string, from: Date, to: Date): Promise<Array<{ startAt: Date; endAt: Date; kind: 'booking' | 'blackout' }>>;
  calculatePrice(input: PricingRequest): Promise<PriceBreakdown>;
  createBooking(input: BookingRequestInput, context: RequestContext): Promise<{ booking: PublicBookingStatus }>;
  getPublicBooking(reference: string, email: string, locale: BookingLocale): Promise<PublicBookingStatus>;
  listAdminResources(): Promise<BookingResource[]>;
  createResource(input: BookingResourceInput, actor: AuthPrincipal, context: RequestContext): Promise<BookingResource>;
  updateResource(id: string, input: BookingResourceInput, actor: AuthPrincipal, context: RequestContext): Promise<BookingResource>;
  listBookings(query?: { status?: BookingStatus; resourceId?: string; from?: Date; to?: Date }): Promise<BookingRecord[]>;
  getDashboardSummary(): Promise<BookingDashboardSummary>;
  getBooking(id: string): Promise<BookingRecord>;
  updateBooking(id: string, input: Partial<Pick<BookingRequestInput, 'resourceId' | 'startAt' | 'endAt' | 'requesterName' | 'requesterEmail' | 'requesterPhone' | 'organization' | 'billingAddress' | 'purpose' | 'attendees' | 'accessibilityNeeds' | 'bookingType' | 'internalAskPurpose' | 'mandateYear' | 'kitchenExtra' | 'saunaExtra'>> & { publicNotes?: string; internalNotes?: string; checklist?: BookingChecklistItem[] }, actor: AuthPrincipal, context: RequestContext): Promise<BookingRecord>;
  setBookingStatus(id: string, status: BookingStatus, note: string | undefined, actor: AuthPrincipal, context: RequestContext): Promise<BookingRecord>;
  sendQuote(id: string, price: PriceBreakdown, notes: string | undefined, actor: AuthPrincipal, context: RequestContext): Promise<BookingRecord>;
  generateContract(id: string, language: ContractLanguage, actor: AuthPrincipal, context: RequestContext): Promise<GeneratedContract>;
  listContracts(id: string): Promise<ContractMetadata[]>;
  setContractStatus(id: string, status: Extract<ContractStatus, 'waiting_for_signature' | 'signed'>, actor: AuthPrincipal, context: RequestContext): Promise<BookingRecord>;
  listHistory(id: string): Promise<BookingHistoryEntry[]>;
}
