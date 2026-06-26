# Multilingual Architecture

## Swedish-first policy

ASK's primary language is Swedish. New platform behavior must treat Swedish content as the source of truth unless a legal or operational process explicitly defines another source.

Language order is always:

1. Swedish / Svenska
2. English
3. Finnish / Suomi only where required, currently contracts and existing Cor House booking resource text

## Supported languages

| Area | Languages | Default |
| --- | --- | --- |
| Public website UI | Swedish, English | Swedish |
| Admin UI | English interface for now, Swedish-first content fields | Swedish content source |
| CMS managed pages | Swedish, English target model | Swedish |
| News | Swedish, English | Swedish |
| Events | Swedish, English | Swedish |
| Booking public flow | Swedish, English, Finnish | Swedish |
| Booking resources | Swedish, English, Finnish where already present | Swedish |
| Contracts | Swedish, English, Finnish | Swedish |
| Emails | Swedish, English; Finnish for booking notifications where selected | Swedish |

## Fallback rules

- Prefer the selected language when it has non-empty content.
- If selected content is missing, use Swedish.
- If Swedish is unavailable and English exists, use English.
- Finnish is not a general public fallback. It may be used only for contract-specific content and the focused Cor House booking flow.
- All user-facing dates and times must render through shared helpers as DD.MM.YYYY and 24-hour HH:mm. Backend storage remains ISO/UTC.

- Public pages must never render broken empty content when another supported translation exists.

## Shared model

Shared language constants exist per package:

- Backend: `backend/src/localization/languages.ts`
- Admin: `admin/src/localization/languages.ts`
- Frontend: `frontend/src/localization/languages.ts`

The shared translation status set is:

- Missing
- Draft
- Needs Review
- Reviewed
- Published
- Stale

Translation metadata fields are:

- `sourceLanguage`
- `lastTranslatedAt`
- `reviewedBy`
- `reviewedAt`
- `staleSourceVersion`

## CMS translation model

Current generic CMS pages remain slug-based records such as `about-sv` and `about-en`. The foundation now adds optional source-language and translation metadata to content records so a later migration can group translations under one canonical content item.

Future target:

- One canonical content identity per page or content item.
- Language-specific translation payloads.
- Language-specific status and review metadata.
- Swedish source version used for stale detection.

## Admin UI translation model

Admin forms must show multilingual content fields in Swedish-first order. Existing News, Events, and Booking resource editors follow:

1. Svenska
2. English
3. Suomi only where required

Translation completeness indicators may be computed from required field presence until persisted workflow states are fully implemented.

## Public frontend translation model

The public frontend defaults to Swedish and persists only supported public languages: Swedish and English. Public CMS page loading attempts the selected language first and falls back to Swedish for missing English CMS pages.

News, Events, and Booking public responses should use shared fallback helpers so an available Swedish translation prevents empty public content.

## Email language rules

Email templates are Swedish first. English is secondary when the user has explicitly chosen English. Finnish email templates are not required unless a future process explicitly requires them.

Booking emails must not include door codes in normal email bodies. Door codes belong only in controlled contract generation or approved secure delivery mechanisms.

## Contract language rules

Contracts support Swedish, English, and Finnish. Swedish is the default contract language. Admin users may still generate English or Finnish contracts. Visma integration is out of scope for this foundation.

## Slug and URL strategy

Current URLs must not be migrated until tested. Existing shared slugs remain valid.

Preferred future structure:

- Swedish default URLs may be unprefixed or use `/sv`.
- English URLs should be language-aware, for example `/en/news/...`.
- Slugs should become language-specific when content records are grouped by canonical identity.
- Existing URLs should redirect rather than break when a migration is introduced.

## SEO and hreflang strategy

The public frontend should set document language, canonical URL, Open Graph locale, and alternate `hreflang` links. Current implementation prepares `sv`, `en`, and `x-default` alternates against stable current URLs. Future language-aware URLs should update those alternates to exact localized paths.

## Translation completeness

Completeness is determined per language:

- Missing: no translated fields exist.
- Draft: some fields exist, but required fields are incomplete.
- Needs Review: a translation is ready for human review.
- Reviewed: a human has reviewed it.
- Published: reviewed content is visible publicly.
- Stale: the source language changed after the translation was reviewed or published.

## Stale detection

Use the source content version as the stale marker. When Swedish source content changes:

- Keep Swedish in Draft or Published according to editor action.
- Mark non-source translations as Stale if their `staleSourceVersion` is older than the new source version.
- Preserve reviewer metadata until the translation is updated and reviewed again.

## Migration strategy

1. Keep existing APIs and URLs stable.
2. Add shared language constants, fallback helpers, and optional metadata fields.
3. Backfill missing metadata with Swedish as source language.
4. Add translation-group identifiers for generic CMS pages.
5. Migrate News and Events from shared slugs to language-specific slugs.
6. Add admin review workflow and persisted status transitions.
7. Introduce tested redirects and localized route generation.
8. Expand bilingual email template files and template tests.

## Current audit summary

- Public frontend has i18next and Swedish/English UI strings, but used English fallback before this foundation.
- Public language switcher already exposed Swedish and English and now uses shared Swedish-first order.
- Generic CMS is still effectively monolingual per record and uses locale suffix slugs.
- News and Events store Swedish and English translations but previously used English titles for source content and slug defaults.
- Booking supports Swedish/English public locale and trilingual resource/contract text.
- Contracts already support Swedish, English, and Finnish.
- Emails are inline and bilingual for booking notifications; they need a reusable template architecture later.
- Metadata exists on public pages and is prepared for `hreflang`; localized URL migration remains future work.
