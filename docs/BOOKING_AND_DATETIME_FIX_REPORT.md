# Booking and Date/Time Fix Report

## Components changed

- Admin booking detail: `admin/src/pages/BookingEditor.tsx`
  - Replaced the start/end combined text inputs with a controlled custom date-time picker.
  - The picker stores editable values as separate `date` and `time` fields and converts them to ISO only when saving.

- Public booking request form: `frontend/src/pages/Booking.tsx`
  - Replaced the start/end combined text inputs with the same custom date-time picker pattern.
  - Pricing calculation and booking submission parse picker values through shared helpers before sending ISO strings to the API.

- Shared helpers:
  - `admin/src/utils/dateTime.ts`
  - `frontend/src/utils/dateTime.ts`

## How the date-time picker works

The booking start/end UI is now a custom date + time picker composed of controlled selects:

- Day select: `DD`
- Month select: `MM`
- Year select: `YYYY`
- Hour select: `HH` from `00` to `23`
- Minute select: `mm` from `00` to `59`

The visible order is always `DD.MM.YYYY HH:mm`. The picker does not rely on browser locale rendering for date or time, so it does not show AM/PM or MM/DD/YYYY.

## Native datetime-local status

Browser-native `datetime-local` was replaced for booking start/end fields. The replacement is a controlled custom date + time input combination, not a wrapper around raw browser date-time display.

The availability date filter is not part of the booking start/end input scope and remains unchanged except for the existing shared date formatting behavior.

## Validation

Validation now runs before admin save, public pricing calculation, and public submission:

- Start and end are required.
- Date/time values must parse as `DD.MM.YYYY HH:mm`.
- End time must be after start time.
- Existing backend booking constraints, including minimum duration and resource bookability rules, remain unchanged and continue to validate ISO/RFC3339/UTC payloads.

## Storage

Backend storage and API payloads remain unchanged. Admin and public forms convert picker values to ISO strings before API calls.

## Test coverage

Added admin helper tests for:

- Formatting dates as `DD.MM.YYYY`.
- Formatting times as `HH:mm`.
- Formatting admin booking detail start/end picker values.
- Formatting public booking form start/end picker values.
- Parsing picker values to ISO safely.
- Required, invalid, and end-before-start validation.

Existing backend date/time formatting tests still cover backend-facing date/time output such as `20.08.2026 18:00–23:00`.

## Remaining risks

- The custom picker uses fixed select controls to avoid browser locale display. This is predictable but less calendar-like than a full calendar widget.
- Frontend has no existing test runner script in `frontend/package.json`; public form behavior is covered through shared helper tests and verified by frontend build.
