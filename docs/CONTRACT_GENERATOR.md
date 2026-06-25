# Cor House Contract Generator

## Purpose

The backoffice generates a rental-contract PDF after a booking is approved. The Swedish rental-contract example informed only the document structure. No names, addresses, identifiers, signatures, or other personal data were copied from it.

## Structure

Generated contracts contain:

1. Contract identity and booking reference
2. Landlord / lessor
3. Tenant / booker
4. Billing address
5. Rental object and booking type
6. Rental period, participants, and purpose
7. Price breakdown
8. Door code and access instructions
9. Rental terms
10. Cleaning and damage liability
11. Signature fields

## Languages and official names

- English: Arcada Student Union – ASK
- Swedish: Arcada Studerandekår – ASK
- Finnish: Arcada opiskelijakunta – ASK

Templates are separate from booking persistence in `backend/src/booking/contractTemplates.ts`. Template and terms version are currently `2026.1`.

Supported placeholder contract:

```text
{{bookingReference}} {{contractDate}} {{customerName}} {{organization}}
{{billingAddress}} {{resourceName}} {{bookingDate}} {{startTime}}
{{endTime}} {{participants}} {{purpose}} {{rentalPrice}}
{{kitchenFee}} {{saunaFee}} {{totalPrice}} {{doorCode}} {{termsVersion}}
```

The current renderer maps booking data directly into the structured template. The explicit placeholder list is the compatibility contract for a future editable-template UI.

## Metadata

MongoDB stores only contract metadata:

- contract ID
- booking ID and public booking reference
- generating administrator
- generation timestamp
- language
- template and terms versions
- contract status

The generated or signed PDF is not stored in MongoDB.

## Visma Sign workflow

1. Administrator generates and downloads the PDF.
2. Administrator uploads/sends it through Visma Sign manually.
3. Administrator marks the booking Waiting for Signature.
4. After signing in Visma Sign, the administrator marks it Signed.
5. The signed PDF remains in Visma Sign.

No Visma API integration is included.

## Door-code handling

`COR_HOUSE_DOOR_CODE` is read only by the backend contract generator. It is not returned by JSON APIs, stored in booking or contract records, placed in public URLs, or included in normal email bodies. Generation fails safely when no door code is configured.

## Authorization and audit

Contract listing requires `booking.read`. PDF generation and status changes require `booking.write`. Generation and status changes are written to both platform audit events and booking history using the public booking reference.
