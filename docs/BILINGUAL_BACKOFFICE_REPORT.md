# Bilingual Backoffice Report

## Public Language Separation

Public website labels now follow the selected public language. Swedish mode shows Swedish labels only, and English mode shows English labels only. Mixed labels such as `Styrelsen / Board`, `Fullmäktige / Student Council`, and `Alumner / Alumni` were removed from the public Organization, Alumni, Elders’ Council, Student Representatives, Governance, footer, and related page surfaces.

Content fallback remains Swedish-first: selected language, then Swedish, then English. If English content is missing, a Swedish content value may appear, but structural labels stay English.

## Admin Bilingual Behavior

The backoffice now has a header language switcher with:

1. Svenska
2. English

The default is Svenska. The selected admin language is stored in `localStorage` as `ask-admin-language`.

Central dictionaries live in `admin/src/localization/adminTranslations.ts`, exposed through `AdminLocaleProvider` and `useAdminLocale()`.

Implemented dictionary-backed areas include:

- Admin navigation labels
- Dashboard/overview cards
- Login/auth screen
- Organization page heading, tabs, and major labels
- Booking page heading, tabs, dashboard cards, filters, and main list table labels
- Student Representatives page heading and tabs
- Governance page heading and tabs
- Collaborations page heading, tabs, type labels, filters, form labels, settings labels, and key actions
- Obvious News and Events taxonomy displays and creation field order

## Swedish-First Content Fields

Admin content fields remain Swedish-first in both admin UI languages. Field order is always:

1. Svenska / Swedish
2. English

The admin language changes field labels, not field order.

## Known Limitations

Several older dense admin internals still contain hardcoded labels, especially the detailed Booking editor, News editor, Event editor, and some nested Organization/Governance form controls. They remain localization debt and should be handled in a focused follow-up rather than by starting new product modules.

The frontend package still has no configured test script; public language separation is protected by TypeScript build and string scans in this pass, not by frontend unit tests.

## Validation Notes

Admin translation dictionary tests cover language options, navigation labels, key module tabs, and Swedish-first content field labels. Public pages build successfully with the new separated label dictionary.
