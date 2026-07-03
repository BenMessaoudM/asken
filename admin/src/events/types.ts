import { PublicLanguage } from '../localization/languages'

export type EventLocale = PublicLanguage
export type EventCollaborationRole = 'organizer' | 'co_organizer' | 'partner' | 'sponsor' | 'venue_partner' | 'supporting_partner' | 'other'
export interface EventTranslation { title: string; description: string; organizer: string; location: string; imageAlt?: string }
export interface EventCategory { id: string; slug: string; labels: { en: string; sv: string } }
export interface EventCollaboration { collaborationId: string; role: EventCollaborationRole; displayOrder: number; visible: boolean; note?: { sv: string; en: string }; collaboration?: { id: string; name: string; slug: string; type: string; active: boolean; visible: boolean; logoUrl?: string }; warning?: 'inactive_or_hidden' | 'missing' }
export interface ManagedEvent { id: string; slug: string; publicationStatus: 'draft' | 'published'; temporalStatus: 'upcoming' | 'past'; version: number; translations: Record<EventLocale, EventTranslation>; imageUrl?: string; startAt: string; endAt: string; category: EventCategory; eventStatus: 'scheduled' | 'postponed' | 'cancelled'; featured: boolean; kideAppUrl?: string; eventCollaborations: EventCollaboration[] }
