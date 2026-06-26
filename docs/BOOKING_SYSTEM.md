# Cor House Booking System — Release v0.6

Release v0.6 provides the finalized Cor House request, quote, approval, contract, signature, and completion workflow.

## Public workflow

1. Select one of the three configured Cor House resources.
2. Select the booking type and optional kitchen/sauna services.
3. Review the server-calculated price breakdown.
4. Enter requester details and, for paid bookings, required billing information.
5. Submit either a booking request or quote request.
6. Receive a `COR-YYYY-XXXX` reference.
7. Check public status using the reference and requester email.

Public status responses never expose MongoDB identifiers, door codes, internal notes, or contract metadata.

## Language and date/time presentation

The public booking request and status forms support Svenska, English, and Suomi in that order. Svenska remains the default and Finnish is scoped to booking/contract workflows rather than becoming a global public-site language.

User-facing booking dates render as DD.MM.YYYY; times render as 24-hour HH:mm. Date-time ranges use examples such as 20.08.2026 18:00-23:00. API payloads and database storage remain ISO/UTC.


## Bookable resources

Only these slugs are accepted by the backend:

| Slug | English | Swedish | Finnish | Floor | Capacity |
| --- | --- | --- | --- | --- | ---: |
| `kitchen` | Kitchen | Köket | Keittiö | 1 | 8 |
| `main-hall` | Main Hall | Salen | Juhlasali | 1 | 80 |
| `meeting-room-sauna` | Meeting Room & Sauna | Kabinettet & Bastu | Kabinetti ja sauna | 2 | 20 |

Migration `009-cor-house-booking-v06` upserts these resources and disables other resource records.

## References

References use `COR-YYYY-XXXX`. An atomic yearly counter prevents duplicate references and resets sequence numbering by reference-generation calendar year.

## Booking types and pricing

Supported types are Internal ASK, Arcada Association, ASK Member, Alumni, and External. Booker categories are persisted configuration records with Swedish, English, and Finnish labels, descriptions, display order, active/public flags, billing requirements, contract requirements, and quote-request permissions. Admins can update these from the booking backoffice.

Pricing is persisted as configurable booking pricing rules, not hidden frontend/admin/backend constants. Current prices are seeded defaults through migration 010-booking-configurable-pricing; future ASK boards can update prices from the backoffice without developer work.

- Arcada Association: Monday–Thursday free; Friday–Sunday €75; kitchen included; sauna €30.
- ASK Member: four-hour minimum; €30/hour Monday–Thursday; €40/hour Friday–Sunday; kitchen €25; sauna €20.
- Alumni: four-hour minimum; €40/hour Monday–Thursday; €50/hour Friday–Sunday; kitchen €35; sauna €25.
- External: four-hour minimum; first four hours €65/hour; later hours €40/hour; kitchen €60; sauna €40.
- Internal official activity: unlimited and free.
- Internal private booking: one free booking per eligible board-member email and mandate year, then ASK Member pricing.

Current eligible board-member emails are configured through COR_HOUSE_BOARD_MEMBER_EMAILS. Seeded pricing rules have explicit versions and validity dates. Each booking stores the pricing rule version used in its price snapshot so existing bookings do not silently change when rules are edited later. Quote administrators can manually override a requested quote breakdown with notes.

## Billing

Paid bookings require billing name, address, postal code, city, and country. VAT/business ID and reference number are optional. This includes External, ASK Member, Alumni, and paid Arcada Association bookings. Free internal official activity, free Arcada Association bookings, and the free ASK board private booking benefit are not blocked by billing validation. Paid contract generation is blocked until billing is complete.

## Status lifecycle

- Submitted
- Quote Requested
- Quote Sent
- Approved
- Contract Generated
- Waiting for Signature
- Signed
- Completed
- Cancelled
- Rejected

Pending lifecycle states reserve conflict slots. Cancelled, rejected, and completed records release slots while retaining booking and activity history.

## Administration

The booking dashboard includes pending approval, waiting-for-signature, quote-request, upcoming-week, and completed-month cards. Staff can manage resources, opening hours, blackouts, requester details, billing data, prices, quotes, notes, checklist items, contract status, and the booking timeline.

`booking.read` permits read access. `booking.write` is required for resource changes, quote delivery, booking transitions, contract generation, and contract-status changes.

## Email foundation

The module defines booking received, quote requested, quote sent, booking approved, contract ready, reminder, and booking completed email types. Current transactional messages use the configured SMTP transport. Door codes are never included in email content.

## Security

- Door code configuration is server-side through `COR_HOUSE_DOOR_CODE`.
- Door codes appear only in generated contract PDFs.
- Contract endpoints require `booking.write`.
- Contract generation and status changes create audit and booking-history entries containing the public reference.
- Generated PDFs are streamed to the authorized administrator and are not stored in MongoDB.
- Signed documents remain in Visma Sign.

## Validation

```sh
cd backend && npm run typecheck && npm test && npm run build
cd ../admin && npm test && npm run build
cd ../frontend && npm run build
git diff --check
```
