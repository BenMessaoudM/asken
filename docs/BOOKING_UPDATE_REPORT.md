# Release v0.6 Booking Update Report

## Delivered

- `COR-YYYY-XXXX` yearly booking references
- fixed trilingual catalogue of three Cor House resources
- five booking types and mandate-year Internal ASK private benefit logic
- date-versioned backend pricing engine
- pre-submission public price calculator
- required paid-booking billing address
- booking-request and quote-request submission paths
- manual quote adjustment, notes, and Quote Sent transition
- ten-state booking lifecycle
- English, Swedish, and Finnish contract PDF generation
- versioned contract templates and metadata
- manual Visma Sign status workflow
- server-only door-code injection into contracts
- email automation foundation without door-code disclosure
- email plus reference public status lookup
- dashboard summary cards, timeline, internal notes, checklist, and blackout controls
- migration and automated pricing/API coverage

## Explicitly excluded

QR codes, Visma API integration, online payment, invoicing automation, digital keys, Wi-Fi credentials, Google Drive integration, and a media library were not added.

## Data migration

Migration `009-cor-house-booking-v06`:

- upserts the approved resource catalogue;
- disables other resources;
- converts legacy references and statuses;
- removes legacy access-code hashes;
- initializes legacy pricing/checklist fields;
- creates reference-counter and contract indexes.

## Operational configuration

Configure the following in `backend/.env`:

```text
COR_HOUSE_DOOR_CODE=
COR_HOUSE_LANDLORD_ADDRESS=
COR_HOUSE_LANDLORD_EMAIL=
COR_HOUSE_BOARD_MEMBER_EMAILS=
```

The board-member list is comma-separated and controls eligibility for the one-free-private-booking mandate-year benefit.

## Remaining operational work

Before deployment, enter the actual landlord address, current door code, and board-member eligibility list; run migration `009`; and validate a generated PDF in all three languages with ASK's approved legal wording.
