import { AuthPrincipal, RequestContext } from '../identity/types';
import { PublicLanguage, TranslationMetadata } from '../localization/languages';

export type EventLocale = PublicLanguage;
export type EventStatus = 'scheduled' | 'postponed' | 'cancelled';
export type EventCollaborationRole = 'organizer' | 'co_organizer' | 'partner' | 'sponsor' | 'venue_partner' | 'supporting_partner' | 'other';

export interface EventTranslation { title: string; description: string; organizer: string; location: string; imageAlt?: string; }
export interface EventCategory { id: string; slug: string; labels: { en: string; sv: string }; createdAt: Date; updatedAt: Date; }
export interface EventCollaborationInput { collaborationId: string; role: EventCollaborationRole; displayOrder: number; visible: boolean; note?: { sv: string; en: string }; }
export interface AdminEventCollaboration extends EventCollaborationInput { collaboration?: { id: string; name: string; slug: string; type: string; active: boolean; visible: boolean; logoUrl?: string }; warning?: 'inactive_or_hidden' | 'missing'; }
export interface PublicEventCollaboration { collaborationId: string; name: string; slug: string; type: string; role: EventCollaborationRole; displayOrder: number; note?: string; description?: string; shortDescription?: string; logoUrl?: string; logoAltText?: string; websiteUrl?: string; }
export interface EventInput { slug?: string; translations: Record<EventLocale, EventTranslation>; imageUrl?: string; startAt: Date; endAt: Date; categoryId: string; eventStatus: EventStatus; featured: boolean; kideAppUrl?: string; eventCollaborations?: EventCollaborationInput[]; }
export interface ManagedEvent extends Omit<EventInput, 'categoryId' | 'eventCollaborations'> { eventCollaborations: AdminEventCollaboration[]; translationMeta?: Partial<Record<EventLocale, TranslationMetadata>>; id: string; contentId: string; slug: string; publicationStatus: 'draft' | 'published'; temporalStatus: 'upcoming' | 'past'; version: number; category: EventCategory; publishedAt?: Date; createdAt: Date; updatedAt: Date; }
export interface PublicEvent { id: string; slug: string; title: string; description: string; organizer: string; location: string; imageUrl?: string; imageAlt?: string; startAt: Date; endAt: Date; eventStatus: EventStatus; temporalStatus: 'upcoming' | 'past'; category: { slug: string; label: string }; featured: boolean; kideAppUrl?: string; locale: EventLocale; eventCollaborations: PublicEventCollaboration[]; }
export interface EventQuery { locale: EventLocale; search?: string; category?: string; period?: 'upcoming' | 'past'; featured?: boolean; from?: Date; to?: Date; page: number; limit: number; }

export interface EventService {
 listAdminEvents(): Promise<ManagedEvent[]>; getAdminEvent(id: string): Promise<ManagedEvent>; createEvent(input: EventInput, actor: AuthPrincipal, context: RequestContext): Promise<ManagedEvent>; updateEvent(id: string, input: EventInput & { expectedVersion: number }, actor: AuthPrincipal, context: RequestContext): Promise<ManagedEvent>; deleteEvent(id: string, actor: AuthPrincipal, context: RequestContext): Promise<void>; publishEvent(id: string, expectedVersion: number, actor: AuthPrincipal, context: RequestContext): Promise<ManagedEvent>; setFeatured(id: string, featured: boolean, actor: AuthPrincipal, context: RequestContext): Promise<ManagedEvent>;
 listPublicEvents(query: EventQuery): Promise<{ events: PublicEvent[]; total: number; page: number; limit: number }>; getPublicEvent(slug: string, locale: EventLocale): Promise<PublicEvent>; calendar(query: EventQuery): Promise<PublicEvent[]>;
 listCategories(): Promise<EventCategory[]>; createCategory(input: { slug?: string; labels: { en: string; sv: string } }): Promise<EventCategory>; updateCategory(id: string, input: { slug?: string; labels: { en: string; sv: string } }): Promise<EventCategory>; deleteCategory(id: string): Promise<void>;
}
