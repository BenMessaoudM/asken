# ASK Digital Platform Project Advancement Audit

**Audit date:** 2026-06-26
**Audited branch:** main
**Latest commit:** pending v0.7 organization commit
**Scope:** inspection, validation, completion estimate, and documentation update only

## Executive Summary

The platform has moved beyond the previous pre-booking baseline and now includes an Organization v0.7 foundation. Release v0.5 delivered the public website route set, and v0.6 delivered a substantial Cor House booking system with resources, availability, pricing, billing details, contract generation, status lookup, and admin operations. A later configurable pricing pass added editable booking categories and pricing rules. Date/time helpers and booking UI formatting are present in admin, frontend, and backend formatting layers.

The project is still not production-ready. The strongest implemented areas are platform foundation, booking, authentication/RBAC, News, Events, and the core public/admin shells. The main gaps are complete Swedish-first multilingual workflows, media library, content review/approval workflows, GDPR/data governance, accessibility assurance, production operations, and several feature modules that remain placeholders or static pages.

**Realistic overall completion after Organization v0.7:** 38%.

## Repository State

| Check | Result |
|---|---|
| Current branch | main |
| Latest commit | a45decf chore(project): update advancement audit and booking hardening |
| Tags | v0.5, v0.6.0 |
| Local sync with origin/main | Synced by local refs: origin/main...HEAD = 0 behind / 0 ahead |
| Working tree clean | No, v0.7 implementation in progress |
| Uncommitted files | Booking/date-time/settings related modified files are present |
| Untracked files | admin/src/utils/dateTime.test.ts |

Dirty worktree at audit time:

- admin/src/booking/types.ts
- admin/src/pages/BookingDashboard.tsx
- admin/src/pages/BookingEditor.tsx
- admin/src/utils/dateTime.ts
- backend/src/app.test.ts
- backend/src/booking/routes/adminBookingRoutes.ts
- backend/src/booking/services/mongooseBookingService.ts
- backend/src/booking/types.ts
- docs/BOOKING_AND_DATETIME_FIX_REPORT.md
- frontend/src/pages/Booking.tsx
- frontend/src/utils/dateTime.ts
- admin/src/utils/dateTime.test.ts

## Latest 15 Commits

1. a76a6e8 feat(booking): make categories and pricing configurable
2. 346f9e1 docs: add daily project status report
3. bfbdb88 style(admin): add Dax Wide font assets
4. 4d14cbd style(ui): add Dax Wide brand font
5. ca88004 feat(booking): finalize Cor House booking system v0.6
6. 1f5fc17 feat: implement booking system v0.6
7. c422b7a feat: implement public website release v0.5
8. f055c2b fix: configure local CORS and complete public website foundation
9. d8b5aba fix: configure local CORS and complete public website foundation
10. 1ce1379 fix: standardize ASK naming
11. 3548942 Merge 11
12. 4897e48 Merge branch main into codex/ensure-header-is-bearer-and-return-401
13. 293250e Enforce Bearer auth format and type user
14. 5a9044b Merge 10
15. 7e9a6b9 Merge branch main into codex/remove-secret-fallback-and-validate-jwt_secret

## Validation Results

| Command | Result |
|---|---|
| Backend typecheck | Passed |
| Backend build | Passed |
| Backend tests | Passed: 15 suites, 65 tests |
| Admin build | Passed |
| Admin tests | Passed: 8 files, 20 tests |
| Frontend build | Passed |
| git diff --check | Passed |

Admin tests emitted non-failing Vite deprecation warnings.

## Migration Status

Migrations are implemented and included in backend/src/database/migrate.ts through 011:

- 009-cor-house-booking-v06: seeds Cor House booking resources, disables legacy resources, adds booking references, counters, contract indexes, and booking indexes.
- 010-booking-configurable-pricing: seeds configurable booking categories and pricing rules, and adds category/pricing indexes.
- 011-organization-v07: adds Organization indexes and default Role Badge, Fullmäktige, and Alumni public content.

The migration runner records applied migrations in the _migrations collection. These migrations are not automatically run by backend startup, so development and production databases must run npm run migrate before relying on booking v0.6 or configurable pricing data.

## Completed Releases

- v0.5 public website release: implemented public route coverage and public shell foundations.
- v0.6.0 Cor House booking release: implemented resource booking, availability, pricing, billing details, references, contract generation, manual signing lifecycle, email foundation, status lookup, dashboard summaries, blackouts, and admin operations.
- Post-v0.6 configurable pricing: implemented booking category and pricing rule storage plus admin editing.
- Date/time formatting pass: shared helpers now format date/time as DD.MM.YYYY and 24-hour HH:mm in relevant booking/admin/public paths.
- Multilingual foundation pass: Swedish-first constants, fallback helpers, optional translation metadata, admin language ordering, Finnish booking flow support, and multilingual architecture documentation are present.

## Module Completion

| Area | Status | Completion % | Notes |
|---|---|---:|---|
| Platform Foundation | Mostly complete | 85% | Three-package architecture, API versioning, env validation, health/readiness, migrations, request/error handling, and build/test flows exist. Some list conventions and production controls remain uneven. |
| Authentication & RBAC | Partial | 72% | Users, roles, permissions, JWT sessions, refresh sessions, route guards, and admin user/role UI exist. Password reset, account recovery, MFA, lockout policy, and broader seeded roles are missing. |
| CMS | Partial | 45% | Generic content, sections, version snapshots, draft/publish, optimistic version checks, and admin editing exist. Review/approval, preview, archive/restore, media library, pagination/bulk tooling, and translation completeness are incomplete. |
| Public Website | Partial | 58% | v0.5 route set and public shell are implemented with Home, About, Board, Membership, Contact, Associations, Cor House, Booking, News, Events, Privacy, Accessibility, and 404. Search, sitemap, full SEO/social metadata, media optimization, and complete managed content are missing. |
| News | Partial | 68% | News CRUD, categories, tags, bilingual fields, scheduled visibility, public list/detail, and tests exist. Preview, archive/restore, localized slugs, SEO completeness, related content, and rich-content hardening remain. |
| Events | Partial | 55% | Events CRUD, categories, bilingual fields, dates, public list/detail, calendar API, and tests exist. Capacity, standard registration, accessibility details, add-to-calendar files, duplication/archive workflow, and notifications remain. |
| Booking System | Substantial | 84% | Cor House booking is the most complete product slice, including resources, availability, conflicts, pricing, billing, references, contracts, admin lifecycle, status lookup, and tests. Remaining gaps include account-backed self-service, reminders, retention automation, stronger concurrency/browser tests, and production operations. |
| Configurable Booking Categories & Pricing | Substantial | 78% | Category and pricing rule models, migration seed data, backend routes/services, and admin editing exist. UX polish, audit depth, temporal rule edge cases, and end-to-end browser tests remain. |
| Billing Address Workflow | Substantial | 80% | Paid bookings collect billing data, admin reviews billing details, and contracts use billing data. Remaining gaps are invoicing integration, validation breadth, and downstream accounting automation. |
| Date/Time Formatting | Substantial | 85% | Shared helpers in backend/admin/frontend format DD.MM.YYYY and 24-hour time. Booking inputs no longer depend on raw browser datetime display. Remaining risk is older non-booking date input/display paths and locale assumptions in future code. |
| Multilingual Foundation Swedish-first | Shared foundation complete | 68% | Shared constants/helpers, Swedish-first fallback, booking/contract Finnish scoping, metadata/status model, booking email templates, SEO alternates, and tests exist. Full admin UI localization, backend validation localization, persisted review workflow, stale automation, and localized slug migration remain. |
| Admin Backoffice | Partial | 55% | Real admin pages exist for auth/session restoration, users, roles, content, News, Events, booking, resources, pricing, and settings. Cor Activities, Collaborations, Governance, and general Settings are placeholders. |
| Public Frontend | Partial | 60% | Public app has the main route set, i18n shell, content pages, News, Events, booking, and status lookup. Several pages are static/hard-coded and lack full CMS, SEO, media, search, and accessibility verification. |
| Organization | Minimal/static only | 12% | Public About/Board style pages exist, but no organization domain model, admin workflow, member records, or governance data model exists. |
| Collaborations | Placeholder/static only | 5% | Admin navigation placeholder exists and public Associations content is static. No collaboration model, API, admin workflow, expiry handling, or media integration exists. |
| Live at Cor | Placeholder only | 5% | Admin navigation placeholder exists. No model, API, scheduling, pinning, expiry, or public operational view exists. |
| Membership & Student Services | Static only | 12% | Public membership content exists, but no membership/service domain workflows, eligibility, application, or admin management exist. |
| Public Governance | Placeholder/static only | 10% | Governance appears as admin placeholder/static content only. No minutes, documents, meetings, policy, or publishing workflow exists. |
| Alumni Page | Not started | 0% | No dedicated implementation found. |
| Theme Manager / Appearance | Not started | 5% | Brand tokens and font assets exist, but there is no appearance/theme manager product capability. |
| Media Library | Not started | 5% | Media URLs are used, but no upload, metadata, alt-text workflow, reuse tracking, storage abstraction, or validation product exists. |
| GDPR/Data Governance | Foundational only | 12% | Audit-oriented foundations and some privacy pages exist. No processing inventory, retention jobs, data-subject exports/deletion, anonymization, or legal-hold workflow exists. |
| Accessibility | Partial/informal | 18% | Some labels, focus styles, semantic markup, and responsive patterns exist. No WCAG 2.1 AA audit, automated axe checks, keyboard journey suite, or documented remediation process exists. |
| Testing & Production Operations | Partial | 30% | Typechecks, builds, unit/API tests, migrations, package locks, and docs exist. Missing browser E2E, accessibility tests, real DB integration depth, deploy/rollback automation, monitoring, backups, and incident operations. |

## Aggregate Completion

| Area | Completion % |
|---|---:|
| Overall project completion | 35% |
| Public website completion | 58% |
| Admin backoffice completion | 55% |
| Backend/API completion | 64% |
| Booking system completion | 84% |
| Production readiness | 28% |

The overall estimate is conservative and weighted by implementation-backed product capability rather than file count or documentation. Placeholder UI, static content, and docs without working code are not counted as complete product capability.

## Implemented Features

- Backend Express/Mongoose API foundation with versioned routes, validation, standard errors, health/readiness, migrations, and seeds.
- Authentication and RBAC with persisted users, roles, permissions, JWT access, rotating refresh sessions, protected APIs, and admin user/role management.
- Generic CMS content records, sections, versions, and draft/publish behavior.
- News and Events backend/admin/public slices with partial editorial workflows.
- Public website route set and shared public layout.
- Cor House booking resources, availability, conflict checks, pricing, billing, references, contracts, status lookup, history/checklist, and admin lifecycle.
- Configurable booking categories and pricing rules.
- Shared date/time formatting helpers across backend, admin, and frontend.
- Swedish-first multilingual foundation, shared fallback helpers, scoped booking/contract Finnish support, booking email templates, and public i18next setup.

## Partially Implemented Features

- Public website content management and complete managed content coverage.
- Admin backoffice beyond the currently implemented content/news/events/booking/user/role modules.
- Bilingual content review workflows, full admin localization, backend validation localization, and localized URL migration.
- Editorial preview, review, approval, archive, restore, and translation completeness states.
- Booking lifecycle hardening for reminders, retention, self-service, and browser-level verification.
- Accessibility and production operations.

## Missing Features

- Organization domain implementation.
- Collaborations domain implementation.
- Live at Cor / What's Happening at Cor implementation.
- Alumni page implementation.
- Theme Manager / Appearance implementation.
- Media Library implementation.
- Full GDPR/data governance implementation.
- Production deployment, monitoring, backup/restore, rollback, and incident procedures.

## Technical Risks

- Dirty worktree means current validated state includes uncommitted booking/date-time/settings changes.
- Several admin navigation entries still expose placeholders.
- Multilingual architecture is not yet enforced across all models, admin screens, validation messages, emails, slugs, or metadata.
- Media handling depends on external URLs instead of a governed media library.
- News and Events workflows are partial and do not meet full editorial acceptance criteria.
- Booking is strong but still lacks browser E2E, concurrency, reminder, retry, retention, and self-service coverage.
- Accessibility has not been audited to WCAG 2.1 AA.
- Production operations are not mature enough for a confident launch.

## Production Blockers

- Complete multilingual foundation for public/admin critical journeys and emails.
- Establish deployment, rollback, monitoring, logging, alerting, backup/restore, and incident runbooks.
- Implement GDPR retention and data-subject workflows.
- Add browser E2E tests for public booking, admin booking, auth, News, Events, and core navigation.
- Add accessibility automation and a manual WCAG 2.1 AA audit.
- Resolve or intentionally ship/commit the current dirty worktree.
- Run migrations 009 and 010 in each target database before booking/pricing use.

## Recommended Next Priority

The next step can be **Organization**, using the completed shared multilingual foundation.

Reasoning: the shared Swedish-first language constants, fallback behavior, scoped Finnish booking/contract support, metadata/status model, booking email templates, and SEO alternate helper are now in place for existing modules. Organization should reuse this model rather than creating a separate translation pattern.

Recommended next Codex task:

> Implement the Organization foundation using the shared Swedish-first multilingual model, without starting Alumni, Collaborations, Live at Cor, Theme Manager, or Media Library.

## Booking Hardening Update

The booking system has been hardened with formal Cor-huset contract layout, Fastighets Ab Cor-huset landlord handling, ASK contact handling, Arcada Association bill-basis workflow, controlled DD.MM.YYYY/24-hour date-time inputs, soft deletion, and stricter door-code scope.

## Organisation Bylaws Alignment

The Organization module now reflects ASK bylaws/regulations by adding Äldres Råd / Elders’ Council as a separate advisory body, not board/staff/committee/alumni. It has public and admin API/UI support, default contact email, and seeded visible content without fake members.

## Student Representatives v0.8 Update

The Organisation area now includes a Studeranderepresentanter / Student Representatives foundation. Backend models, APIs, migration `014-student-representatives`, admin management, public pages, and documentation are implemented for representative bodies, public representatives, and calls for applications.

The implementation is intentionally not a voting system, election counter, candidate portal, student login workflow, or full application workflow. Public privacy rules hide representative email addresses unless explicit contact visibility is enabled.

## Public Governance Update

The Governance placeholder has been replaced with a scoped public governance document module focused on Fullmäktige/public documents. It adds backend models/APIs, migration `015-public-governance`, admin document/settings management, public pages, filters, and publication privacy enforcement.

The module intentionally excludes Board meeting management, Board agendas/protocols, internal notes, voting, election counting, file storage, Media Library, and OCR/import.

## Bilingual Backoffice and Public Language Separation

Public structural labels now follow the selected public language instead of rendering Swedish and English side-by-side. The Organization, Alumni, Elders’ Council, Student Representatives, Governance, footer, and related public pages use Swedish labels in Swedish mode and English labels in English mode, with Swedish-first content fallback for missing descriptions.

Admin now includes a Swedish/English language switcher in the backoffice header. The selection persists in `localStorage` as `ask-admin-language`. Navigation, overview cards, login, and the primary Booking, Organization, Student Representatives, and Governance tabs/headings are dictionary-backed. Remaining older dense form internals in News, Events, detailed Booking editor, and some taxonomy displays still require a deeper translation pass.
