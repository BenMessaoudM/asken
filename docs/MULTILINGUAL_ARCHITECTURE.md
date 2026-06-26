# Multilingual Architecture

## Swedish-first policy

ASK is a Swedish-speaking student union. Swedish is the platform source language and default user-facing language unless a specific legal or operational workflow explicitly defines another source.

Language order is always:

1. Svenska (`sv`)
2. English (`en`)
3. Suomi (`fi`) only where needed, currently booking and contracts

## Supported languages

| Area | Languages | Default |
| --- | --- | --- |
| Public website UI | Svenska, English | Svenska |
| Admin UI | English shell for now, Swedish-first content fields | Svenska content source |
| CMS managed pages | Svenska, English | Svenska |
| News | Svenska, English | Svenska |
| Events | Svenska, English | Svenska |
| Booking public flow | Svenska, English, Suomi | Svenska |
| Booking resources/categories | Svenska, English, Suomi | Svenska |
| Contracts | Svenska, English, Suomi | Svenska |
| Emails | Svenska, English; Suomi for booking notifications | Svenska |

Shared constants live in:

- Backend: `backend/src/localization/languages.ts`
- Admin: `admin/src/localization/languages.ts`
- Frontend: `frontend/src/localization/languages.ts`

Required helper API:

- `getDefaultLanguage()`
- `getSupportedLanguages()`
- `getPublicLanguages()`
- `getBookingLanguages()`
- `getContractLanguages()`
- `getLanguageLabel()`
- `resolveLocalizedValue()`
- `fallbackLocalizedValue()`

## Fallback rules

1. Prefer the selected language if non-empty content exists.
2. Fall back to Svenska first.
3. Fall back to English only if Swedish is missing.
4. Fall back to Finnish only for scoped booking/contract content where it is the only available value.
5. Never render broken empty public content when a supported fallback exists.

## Content translation model

Current implementation uses a mixed model:

- Generic CMS pages are still separate slug-based records, such as `home-sv` and `home-en`.
- News and Events store `translations.sv` and `translations.en` on one feature record while sharing the current content slug.
- Booking resources/categories store `sv`, `en`, and `fi` values because booking and contracts support Finnish.

Target model for future migrations:

- One canonical content identity per managed content item.
- Language-specific translation payloads and optional language-specific slugs.
- Swedish source language and source version used for stale detection.
- Per-language status/review metadata.

## Translation status model

Shared statuses:

- Missing
- Draft
- Needs Review
- Reviewed
- Published
- Stale

Metadata fields prepared in backend/admin types and existing content models where feasible:

- `sourceLanguage`
- `lastTranslatedAt`
- `reviewedBy`
- `reviewedAt`
- `staleSourceVersion`

The full persisted review workflow remains a later CMS workflow task. Current admin forms use field completeness indicators for News and Events.

## Admin UI translation model

Admin multilingual content fields must show this order:

1. Svenska
2. English
3. Suomi only for booking/contracts

Applied foundation:

- News editor uses shared public language order.
- Events editor uses shared public language order.
- Booking resource editor uses shared booking language order.
- Booking contract generation uses shared contract language order.
- Booking categories already expose Svenska, English, Suomi labels in that order.

The admin shell itself is still mostly English. Full admin UI localization is a later workflow task, not a new product module.

## Public frontend translation model

The public frontend default language is Svenska. The global language switcher exposes only:

1. Svenska
2. English

Booking-specific screens expose:

1. Svenska
2. English
3. Suomi

Public page metadata sets document language, canonical URL, Open Graph locale, and `sv`/`en`/`x-default` hreflang alternates using the current stable URL structure. The helper is prepared for future localized URL generation.

## Email language rules

Email template architecture is Swedish-first:

- Swedish templates are primary.
- English templates are secondary.
- Finnish templates exist only where needed for booking notifications.

Implemented booking email foundation:

- Booking notification subjects/bodies are centralized in `backend/src/booking/emailTemplates.ts`.
- Booking emails use shared DD.MM.YYYY and 24-hour time formatting.
- Normal booking emails do not include the Cor House door code.
- The door code remains scoped to generated contracts.

## Contract language rules

Contracts support:

1. Svenska
2. English
3. Suomi

Default contract language is Svenska. Admin users can generate English or Finnish contracts. Contract PDFs may include the door code; normal email bodies must not.

## Slug and URL strategy

Current URL migrations are intentionally deferred.

Current safe strategy:

- Swedish is canonical/default.
- Existing shared slugs and locale-suffix CMS slugs remain stable.
- Public metadata prepares hreflang alternates without changing routes.

Preferred future strategy:

- Swedish default URLs stay canonical.
- English becomes language-aware through tested localized routes.
- Managed content gains language-specific slugs under one canonical content identity.
- Existing URLs redirect rather than break.

## SEO and hreflang strategy

Current implementation:

- Sets `document.documentElement.lang`.
- Sets title, description, Open Graph title/description/url/locale.
- Sets canonical link.
- Sets `hreflang=sv`, `hreflang=en`, and `hreflang=x-default` alternates for the current stable path.

Future localized route work should replace same-path alternates with exact localized URLs.

## Date/time formatting standard

Display format is always:

- Date: `DD.MM.YYYY`
- Time: 24-hour `HH:mm`
- Date-time example: `02.09.2026 14:30`
- Range example: `20.08.2026 18:00–23:00`

Backend storage remains ISO/RFC3339/UTC. User-facing formatting must use shared helpers:

- Backend: `backend/src/formatting/dateTime.ts`
- Admin: `admin/src/utils/dateTime.ts`
- Frontend: `frontend/src/utils/dateTime.ts`

## Stale translation detection

Prepared target behavior:

1. Swedish source content changes and increments source version.
2. Existing non-source translations keep their content but become Stale if reviewed/published against an older source version.
3. Editors update the translation, then mark it Needs Review, Reviewed, or Published.
4. Review metadata records reviewer and review date.

This is documented and typed, but full workflow transitions remain later CMS/editorial work.

## Migration strategy

1. Keep existing APIs and URLs stable.
2. Use shared constants/helpers across backend, admin, and frontend.
3. Keep Swedish-first admin field order.
4. Backfill/maintain translation metadata as records are edited.
5. Later add canonical translation grouping for CMS pages.
6. Later introduce language-specific slugs and tested redirects.
7. Later localize all admin UI strings and backend validation messages.
8. Later expand email templates beyond booking notifications.

## Current implementation status

Implemented in this foundation pass:

- Shared language constants and helpers across backend/admin/frontend.
- Swedish-first fallback helpers and tests.
- Public language list excludes Finnish; booking/contract lists include Finnish.
- Booking Mongoose locale storage now accepts `sv`, `en`, and `fi`.
- Booking and contract validation uses shared language constants.
- Events public validation uses shared public language constants.
- Admin booking contract/resource forms use shared language order.
- Public booking/status language selectors use shared booking language order.
- Booking emails use centralized language templates and shared date/time formatting.
- Public metadata uses a shared hreflang helper for current stable URLs.

Documented/prepared only:

- Full admin UI localization.
- Full backend validation/error localization.
- Canonical CMS translation grouping.
- Localized slug migration and redirects.
- Persisted review workflow transitions.
- Automated stale translation state transitions.
