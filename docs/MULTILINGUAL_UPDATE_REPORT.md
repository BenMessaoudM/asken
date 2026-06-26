# Multilingual Update Report

**Date:** 2026-06-26

## Implemented

- Expanded shared language constants/helpers in backend, admin, and frontend.
- Enforced Swedish-first order: `sv`, `en`, then `fi` only for booking/contracts.
- Added helper API for default, supported, public, booking, and contract languages.
- Added helper API for language labels and Swedish-first localized fallback.
- Added shared translation status constants/model foundations.
- Added backend tests for language order, Swedish-first fallback, English fallback, booking/contract Finnish support, and translation statuses.
- Added admin tests for language order and fallback behavior.
- Updated booking validation to use shared booking/contract language constants.
- Updated Events public validation to use shared public language constants.
- Updated Booking Mongoose locale enum to allow `sv`, `en`, and `fi`.
- Updated admin booking contract/resource language selectors to use shared constants.
- Updated public booking and booking-status language selectors to use shared constants.
- Updated public News/Event locale resolution to use the shared public language resolver.
- Prepared public SEO/hreflang generation through a shared helper without changing URLs.
- Centralized booking email text generation in `backend/src/booking/emailTemplates.ts`.
- Kept normal booking emails free of the Cor House door code.
- Confirmed booking email date/time formatting uses shared DD.MM.YYYY and 24-hour helpers.

## Documented or Prepared Only

- Full admin UI localization remains documented/prepared; the admin shell is still mostly English.
- Full backend validation message localization remains documented/prepared.
- Canonical CMS translation grouping remains documented/prepared.
- Language-specific slug migration remains documented/prepared and was not performed.
- Persisted translation review state transitions remain documented/prepared.
- Automated stale translation detection remains documented/prepared.
- Full multilingual email template coverage outside booking remains documented/prepared.

## Existing Modules Reviewed

- Backend language constants/types.
- Generic CMS translation metadata model.
- News model, validation, services, admin editor, and public pages.
- Events model, validation, services, admin editor, and public pages.
- Booking models, validation, public form, status form, admin contract generation, contract templates, and emails.
- Public language switcher and metadata hook.
- Slug/URL and SEO documentation.
- Date/time formatting helpers.

## Scope Control

No new product modules were started. Organization, Alumni, Collaborations, Live at Cor, Theme Manager, and Media Library remain untouched except for documentation references that explain dependency sequencing.

## Remaining Risks

- Generic CMS pages still use locale-suffix slugs rather than grouped translations.
- News and Events still share one slug per record; localized slug migration is future work.
- Admin UI strings are not fully localized.
- Backend validation messages are not fully localized.
- Stale translation detection is typed/documented but not automated as a workflow.
- Public hreflang alternates currently point to stable same-path URLs until localized routes exist.

## Readiness Assessment

The shared multilingual foundation is complete enough to start Organization next, provided Organization uses these shared helpers from the first implementation slice and does not introduce a separate translation model.
