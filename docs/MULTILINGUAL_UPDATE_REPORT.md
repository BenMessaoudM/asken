# Multilingual Update Report

## Implemented

- Added shared language constants and fallback helpers for backend, admin, and public frontend.
- Set Swedish as the public frontend default and i18n fallback language.
- Updated public language switcher to use shared Swedish-first order: Svenska, English.
- Added optional translation metadata foundations to generic CMS, News, and Events persistence models.
- Updated News and Events services to use Swedish title/slug defaults and Swedish-first public fallback helpers.
- Updated Booking language types and validation so contracts default to Swedish while still supporting English and Finnish.
- Added Swedish-first public fallback for Booking resource text.
- Kept booking notification bodies free of door codes.
- Reordered existing admin multilingual forms to show Svenska before English, with Suomi retained only for Booking resource fields.
- Added simple admin translation completeness indicators for News and Events.
- Prepared public page metadata with `sv`, `en`, and `x-default` alternate links without changing current URLs.
- Added Swedish fallback for missing English CMS pages.

## Documented only

- Future language-aware URL structure.
- Future localized slug migration.
- Canonical CMS translation grouping.
- Persisted review workflow transitions.
- Stale translation detection workflow.
- Reusable bilingual email template file architecture.

## Deferred

- No new product modules were started.
- No Organization, Collaborations, Live at Cor, Theme Manager, or Media Library work was started.
- No risky URL migration was performed.
- No Visma API integration was added.
