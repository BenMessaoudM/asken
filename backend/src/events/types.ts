import { AuthPrincipal, RequestContext } from '../identity/types';
export type EventLocale = 'en' | 'sv';
export type EventStatus = 'scheduled' | 'postponed' | 'cancelled';
export interface EventTranslation { title: string; description: string; organizer: string; location: string; imageAlt?: string; }
export interface EventCategory { id: string; slug: string; labels: { en: string; sv: string }; createdAt: Date; updatedAt: Date; }
export interface EventInput { slug?: string; translations: Record<EventLocale, EventTranslation>; imageUrl?: string; startAt: Date; endAt: Date; categoryId: string; eventStatus: EventStatus; featured: boolean; kideAppUrl?: string; }
export interface ManagedEvent extends Omit<EventInput, 'categoryId'> { id: string; contentId: string; slug: string; publicationStatus: 'draft' | 'published'; temporalStatus: 'upcoming' | 'past'; version: number; category: EventCategory; publishedAt?: Date; createdAt: Date; updatedAt: Date; }
export interface PublicEvent { id: string; slug: string; title: string; description: string; organizer: string; location: string; imageUrl?: string; imageAlt?: string; startAt: Date; endAt: Date; eventStatus: EventStatus; temporalStatus: 'upcoming' | 'past'; category: { slug: string; label: string }; featured: boolean; kideAppUrl?: string; locale: EventLocale; }
export interface EventQuery { locale: EventLocale; search?: string; category?: string; period?: 'upcoming' | 'past'; featured?: boolean; from?: Date; to?: Date; page: number; limit: number; }
export interface EventService {
 listAdminEvents(): Promise<ManagedEvent[]>; getAdminEvent(id: string): Promise<ManagedEvent>; createEvent(input: EventInput, actor: AuthPrincipal, context: RequestContext): Promise<ManagedEvent>; updateEvent(id: string, input: EventInput & { expectedVersion: number }, actor: AuthPrincipal, context: RequestContext): Promise<ManagedEvent>; deleteEvent(id: string, actor: AuthPrincipal, context: RequestContext): Promise<void>; publishEvent(id: string, expectedVersion: number, actor: AuthPrincipal, context: RequestContext): Promise<ManagedEvent>; setFeatured(id: string, featured: boolean, actor: AuthPrincipal, context: RequestContext): Promise<ManagedEvent>;
 listPublicEvents(query: EventQuery): Promise<{ events: PublicEvent[]; total: number; page: number; limit: number }>; getPublicEvent(slug: string, locale: EventLocale): Promise<PublicEvent>; calendar(query: EventQuery): Promise<PublicEvent[]>;
 listCategories(): Promise<EventCategory[]>; createCategory(input: { slug?: string; labels: { en: string; sv: string } }): Promise<EventCategory>; updateCategory(id: string, input: { slug?: string; labels: { en: string; sv: string } }): Promise<EventCategory>; deleteCategory(id: string): Promise<void>;
}
