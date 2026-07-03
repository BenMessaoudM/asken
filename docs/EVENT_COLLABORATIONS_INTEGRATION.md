# Event Collaborations Integration

## Purpose

Events can now reference records from the Samarbeten / Collaborations module instead of storing partner and sponsor names as free text. This prepares public event partner visibility while keeping Collaborations as the central source for names, logos, public links, and visibility rules.

## Current Event Model

Existing event records store CMS publication linkage, Swedish/English translations, image URL, start/end time, category, event status, featured flag, Kide.app URL, and version snapshots.

The integration adds optional `eventCollaborations` entries:

- `collaborationId`
- `role`: organizer, co_organizer, partner, sponsor, venue_partner, supporting_partner, other
- `displayOrder`
- `visible`
- `note` sv/en

Existing events without this field continue to work because the field defaults to an empty array.

## Admin Workflow

The admin event editor includes a **Samarbeten och sponsorer / Collaborations and sponsors** section. Editors select existing Collaboration records, assign a role, set public visibility, set display order, and optionally add Swedish/English notes. Swedish fields remain first.

Admin responses include selected collaborations even if the referenced Collaboration is inactive or hidden. Those rows include a warning so editors can correct stale selections.

## Public Display

Public event detail pages show visible event collaborations under:

- Swedish: `I samarbete med`
- English: `In collaboration with`

Public responses only expose event collaboration rows where:

- event collaboration row is `visible = true`
- referenced Collaboration is `active = true`
- referenced Collaboration is `visible = true`

Public event responses do not expose Collaboration `internalNotes`, `relationshipOwner`, or other admin-only fields.

## APIs

Admin event create/update accepts `eventCollaborations` in the existing event payload. Duplicate `collaborationId + role` combinations are rejected. Referenced Collaboration IDs must exist.

Public event detail includes localized collaboration data and links to `/samarbeten/:slug` or `/collaborations/:slug` depending on selected language.

## Migration

Migration `018-event-collaborations` adds an index on `cmsevents.eventCollaborations.collaborationId` and role. It does not seed fake data and does not alter existing event records.

## Future Work

- Related upcoming events on Collaboration detail pages.
- Event list partner logos if design and performance allow it.
- Event partner filtering and homepage partner/event highlights.

## Browser E2E Coverage

Playwright coverage in `e2e/event-collaborations.spec.ts` verifies admin Collaboration visibility/editing, admin Event collaborator selection persistence, Swedish and English public event collaboration labels, hidden collaborator privacy, and public collaboration detail links.

## Explicit Exclusions

- No sponsorship accounting
- No contract management
- No invoice integration
- No event ticketing
- No Live at Cor integration
- No Theme Manager
