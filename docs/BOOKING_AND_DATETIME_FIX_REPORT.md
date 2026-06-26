# Booking and Date/Time Fix Report

Date: 2026-06-26

## Summary

This focused fix keeps ASK Swedish-first while tightening Cor House booking language support, paid-booking billing validation, and presentation date/time formatting. It does not add new product modules, change date storage, migrate URLs, integrate Visma, or redesign the platform.

## Date/time formatting changed

- Added shared presentation helpers for backend, admin, and public frontend.
- Updated public News, Events, Booking, Booking status, CMS/public detail views, admin booking dashboard/detail timeline, admin CMS lists/version history, admin News scheduling, and admin Events date displays to use shared helpers.
- Contract PDF dates and booking email date ranges now use shared backend formatting.
- User-facing dates render as DD.MM.YYYY and times as 24-hour HH:mm. Backend storage remains ISO/RFC3339/UTC.
- Remaining direct Intl.DateTimeFormat usage is internal backend logic for booking pricing, availability, and annual reference calculation, not user-facing display.

## Shared helpers added

- frontend/src/utils/dateTime.ts
- admin/src/utils/dateTime.ts
- backend/src/formatting/dateTime.ts

Helpers include formatDate, formatTime, formatDateTime, formatDateRange, and formatTimeRange. Missing or invalid dates return an empty string instead of broken output.

## Booking language support added

- Public booking request form supports Svenska, English, and Suomi in that order.
- Public booking status lookup supports Svenska, English, and Suomi in that order.
- Svenska remains default. Finnish is scoped to booking/contract workflows and is not promoted as a global public-site language.
- Backend booking validation accepts locale fi for booking requests and public resource/status responses.

## Billing address behavior added

- Paid public booking requests require billing name, billing address, postal code, city, and country.
- VAT / Business ID and reference number remain optional.
- Free bookings do not require billing fields.
- Admin booking details now show billing completeness, editable billing fields, and a warning for paid bookings with incomplete billing data.
- Paid booking contract generation is disabled in admin when billing is incomplete and blocked again on the backend before PDF generation.

## Validation rules implemented

- Shared backend billing helper enforces whether a paid booking requires complete billing data.
- Booking creation uses the shared billing rule after server-side price calculation.
- Contract generation uses the same rule before generating Swedish, English, or Finnish PDFs.
- Public form blocks paid submission when required billing fields are incomplete.

## Booking emails and door codes

- Booking notification text uses shared date range formatting.
- Swedish, English, and Finnish booking notification text is available according to the booking locale.
- Door codes remain excluded from normal booking email bodies and appear only in contract PDF generation.

## What remains for later

- Full platform-wide admin UI localization and namespaced email template files.
- Browser-level E2E tests for paid/free booking billing flows and contract generation blocking.
- Localized URL/slug migration and hreflang expansion.
- Student self-service cancellation, reminders, notification retry state, and retention/anonymization jobs.

## Validation results

- Backend typecheck: passed.
- Backend build: passed.
- Backend tests: passed, 15 suites and 65 tests.
- Admin build: passed.
- Admin tests: passed, 7 suites and 15 tests.
- Frontend build: passed.
- git diff --check: passed.

## Risks and follow-up recommendations

- Admin and public booking flows were build-tested but not browser-E2E tested.
- Billing completeness is intentionally based on required invoice address fields only; VAT/business ID and reference number stay optional.
- Booker categories and pricing rules are now persisted configuration records managed from the existing booking backoffice. Current prices are seeded defaults, and each booking stores the pricing rule version used so existing bookings do not silently change.
- Recommended next priority is a focused browser/accessibility test pass for the Cor House booking paid/free journeys before starting any new product module.
