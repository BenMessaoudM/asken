# Booking System — Release v0.6

Release v0.6 provides bilingual public booking requests and authenticated booking operations for Arcada Student Union – ASK.

## Public workflow

1. The visitor selects an active resource and reviews localized capacity, accessibility, rules, and opening hours.
2. The availability API returns pending and approved intervals plus resource blackout periods.
3. The visitor submits a validated request and accepts the privacy notice.
4. The backend creates a non-guessable reference and access code, reserves 15-minute occupancy slots, records history/audit events, and sends a bilingual confirmation email.
5. The visitor can retrieve status with the reference and access code at `/booking/status`.

Pending and approved bookings reserve slots. Rejected and cancelled bookings release them. A unique MongoDB index on `{ resourceId, slotAt }` prevents overlapping requests even when submissions race.

## Administration

Users require `booking.read` to view bookings, resources, calendars, and history. `booking.write` permits resource management, edits, notes, approval, rejection, and cancellation. All state-changing operations create platform audit events; booking-specific history stores status, actor, note, timestamp, and a snapshot where applicable.

The admin booking module provides list and calendar views, filters, conflict-safe editing, status actions, internal/public notes, resource configuration, opening hours, blackout periods, and bilingual resource content.

## Persistence

- `bookingresources`: bilingual catalogue data, policy limits, opening hours, and blackouts.
- `bookings`: requester details, time range, status, secure status credentials, decisions, and notes.
- `bookingslots`: 15-minute occupancy records with a unique resource/time index.
- `bookinghistories`: immutable booking workflow history.
- `auditevents`: shared security and administrative audit trail.

Migration `007-booking-system` creates the booking schema indexes. Migration `008-remove-legacy-booking-indexes` removes indexes belonging to the retired placeholder booking model.

## Local verification

Start MongoDB and the development SMTP sink, then run migrations and seed permissions before starting the backend:

```sh
cd backend
npm run migrate
npm run seed
npm run smtp:dev
npm run dev
```

Start the clients separately with `npm run dev` in `frontend` and `admin`. The default public, admin, API, and SMTP ports are 5173, 5174, 3000, and 1025 respectively.

## Validation

```sh
cd backend && npm run typecheck && npm test && npm run build
cd ../frontend && npm run build
cd ../admin && npm test && npm run build
```
