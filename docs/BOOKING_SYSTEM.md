# Cor House Booking System — Release v0.6

Release v0.6 provides the finalized Cor House request, quote, approval, contract, signature, and completion workflow.

## Public workflow

1. Select one of the three configured Cor House resources.
2. Select the booking type and optional kitchen/sauna services.
3. Review the server-calculated price breakdown.
4. Enter requester and required billing information.
5. Submit either a booking request or quote request.
6. Receive a `COR-YYYY-XXXX` reference.
7. Check public status using the reference and requester email.

Public status responses never expose MongoDB identifiers, door codes, internal notes, or contract metadata.

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

Supported types are Internal ASK, Arcada Association, ASK Member, Alumni, and External. Pricing is implemented in `backend/src/booking/pricing.ts`, not in the clients.

- Arcada Association: Monday–Thursday free; Friday–Sunday €75; kitchen included; sauna €30.
- ASK Member: four-hour minimum; €30/hour Monday–Thursday; €40/hour Friday–Sunday; kitchen €25; sauna €20.
- Alumni: four-hour minimum; €40/hour Monday–Thursday; €50/hour Friday–Sunday; kitchen €35; sauna €25.
- External: four-hour minimum; first four hours €65/hour; later hours €40/hour; kitchen €60; sauna €40.
- Internal official activity: unlimited and free.
- Internal private booking: one free booking per eligible board-member email and mandate year, then ASK Member pricing.

Current eligible board-member emails are configured through `COR_HOUSE_BOARD_MEMBER_EMAILS`. Pricing rule version `2026.1` has explicit validity dates. Quote administrators can override a requested quote breakdown.

## Billing

Paid bookings require billing name, address, postal code, city, and country. VAT/business ID and reference number are optional. This includes paid Arcada Association bookings.

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
