# Booking Hardening Patch Report

Date: 27.06.2026

## Scope

This patch hardens the existing Cor House booking system after v0.7. It does not introduce Collaborations, Live at Cor, Theme Manager, Media Library, or a booking redesign.

## Contract Alignment

Generated rental contracts now use a more formal Cor-huset structure:

- Fastighets Ab Cor-huset is the landlord.
- Arcada studerandekår - ASK is shown as contact/administrator, not landlord.
- The contract uses sections for Hyresvärd, Kontaktperson, Hyresgäst, Faktureringsadress, Hyresobjekt, Avtalsperiod, Hyra, Hyresvillkor, Tillträde / dörrkod, and Underskrifter.
- Swedish terms include cleaning fee 150€ + moms, damage liability, unnecessary fire alarm liability, post-event invoicing, and two-copy contract wording.
- Dates use DD.MM.YYYY and 24-hour time through shared formatting helpers.

The implementation uses configurable Cor House settings with defaults for Fastighets Ab Cor-huset, Jan-Magnus Janssons plats 1, FO-nummer 2006332-4, and Nordea 174530-2982.

## Arcada Association Rule

Arcada Association bookings no longer require rental contracts by default.

- Free Arcada Association booking: no contract, no bill.
- Paid Arcada Association booking: no contract, bill/invoice basis required before completion.
- Contract generation is blocked when the category policy marks contracts as not required.
- The seeded/default pricing remains configurable in backoffice: Monday-Thursday free, Friday-Sunday 75€, kitchen included, sauna +30€.

## Bill / Invoice Basis

A generated PDF bill basis was added for paid Arcada Association bookings. It includes booking reference, category, association/contact, billing address, VAT/business ID, reference, resource, date/time, purpose, pricing breakdown, total, and configured ASK billing notes. It is not online invoicing and has no Visma integration.

## Date-Time Inputs

Public booking and admin booking detail use controlled date/time picker fields with DD.MM.YYYY and HH:mm display. Backend storage remains ISO/RFC3339/UTC-compatible.

## Safe Deletion

Admins with `booking.delete` can soft delete bookings. Soft-deleted bookings are hidden from normal admin lists, availability/calendar, and public lookup while preserving the database record, generated documents, history, and audit trail. Delete requires a reason.

This is operational soft deletion only. It is not full GDPR deletion/anonymization. Retention and anonymization remain future workflows because financial/legal records may need retention.

## Door Code Security

Door code remains scoped to rental contract generation. Normal booking emails and public status lookup do not include the door code. Paid Arcada Association bill PDFs do not include the door code by default.

## Migration / Settings

Run migration `012-booking-hardening-v08` in each environment. It updates Arcada Association category defaults, adds soft-delete indexes, bill indexes, and seeds `booking.delete` permission for Super Admin.

Manual settings to review in admin booking settings:

- landlord/contact details
- bank details
- door code
- ASK billing notes

## Known Limitations

- Settings are still held through the existing booking settings path and should later be persisted in a dedicated settings collection if the platform expands settings management.
- Bill basis generation is a PDF document only, not an accounting integration.
- Browser E2E coverage is still missing.
