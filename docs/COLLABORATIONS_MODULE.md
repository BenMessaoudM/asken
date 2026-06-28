# Collaborations Module

## Purpose

The Samarbeten / Collaborations module is ASK's central register for public and internal collaboration records. It covers special associations, student nations, sponsors, companies, universities, strategic partners, student organizations, and other partner-like relationships.

This is a lightweight reusable content module, not a CRM.

## Public Pages

- Swedish route: `/samarbeten`
- English-friendly alias: `/collaborations`
- Detail routes: `/samarbeten/:slug` and `/collaborations/:slug`

Public pages show visible and active collaborations only. Structural labels follow the selected public language:

- Swedish: Samarbeten
- English: Collaborations

The public site must not render mixed labels such as `Samarbeten / Collaborations` outside glossary or explanatory content.

## Admin Pages

Admin route: `/collaborations`

Tabs:

- Översikt / Overview
- Samarbeten / Collaborations
- Inställningar / Settings

Backoffice labels come from `admin/src/localization/adminTranslations.ts` via `useAdminLocale()`. Content fields remain Swedish-first in both admin languages.

## Backend Models

`Collaboration` includes:

- name, slug, type
- description sv/en
- shortDescription sv/en
- logoUrl and logoAltText sv/en
- websiteUrl, email, contactPerson
- social links
- officeAtCor, officeHours sv/en, location
- active, visible, featured, displayOrder
- tags sv/en
- internalNotes, relationshipOwner, validFrom, validUntil
- createdAt, updatedAt

`internalNotes` and `relationshipOwner` are admin/internal fields and are not exposed by public endpoints.

`CollaborationSettings` includes intro sv/en, optional contactEmail, visibility, and updatedAt.

## APIs

Public:

- `GET /api/v1/collaborations`
- `GET /api/v1/collaborations/:slug`
- `GET /api/v1/collaborations/types`
- `GET /api/v1/collaborations/settings`
- Alias: `/api/public/collaborations/...`

Admin:

- `GET /api/v1/admin/collaborations`
- `POST /api/v1/admin/collaborations`
- `PUT /api/v1/admin/collaborations/:id`
- `DELETE /api/v1/admin/collaborations/:id`
- `GET /api/v1/admin/collaborations/settings`
- `PUT /api/v1/admin/collaborations/settings`
- Alias: `/api/admin/collaborations/...`

Public list filters support type, featured, and search. Admin list filters support type, featured, active, visible, and search.

## Permissions

- `collaborations.read`
- `collaborations.write`

Migration `017-collaborations` creates indexes, seeds settings, creates both permissions, and grants them to `super_admin`.

## Multilingual Behavior

Swedish is primary/default. English is secondary. Finnish is not used for Collaborations.

Content fallback follows selected language, then Swedish, then English. Labels do not combine Swedish and English into one public label.

Dates are displayed through the shared date/time helpers using `DD.MM.YYYY` and 24-hour time where relevant.

## Future Integrations

- Events can select partners and sponsors from Collaborations.
- Live at Cor can show office hours for associations at Cor.
- Membership can show partner benefits.
- Public homepage can feature selected partners.

## Explicit Exclusions

- No sponsorship accounting
- No CRM pipeline
- No contract management
- No membership management
- No Live at Cor integration yet
- No Media Library
