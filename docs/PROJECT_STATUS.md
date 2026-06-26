# Arcada Student Union - ASK Platform Project Status

**Audit date:** 2026-06-26
**Authoritative status source:** implemented code, migrations, automated tests, successful local builds, and docs/PROJECT_ADVANCEMENT_AUDIT.md
**Canonical Epic definitions:** docs/TASK_BACKLOG.md

## Executive Status

**Estimated overall completion: 32%.**

The platform has a working technical foundation, secure administration authentication, generic CMS foundations, usable News and Events slices, a public website route set, and a substantial Cor House booking system. Booking is the most advanced product area after v0.6, configurable pricing, billing address handling, contract generation, status lookup, and DD.MM.YYYY/24-hour date-time presentation work.

The platform is not production-ready. The largest remaining areas are complete Swedish-first multilingual workflows, complete CMS editorial workflows, managed media, GDPR/data governance, accessibility assurance, production operations, browser E2E coverage, and product modules that are still placeholders or static pages.

## Current Aggregate Completion

| Area | Completion % |
|---|---:|
| Overall project completion | 32% |
| Public website completion | 58% |
| Admin backoffice completion | 55% |
| Backend/API completion | 62% |
| Booking system completion | 84% |
| Production readiness | 28% |

## Module Status

| Area | Status | Completion % | Notes |
|---|---|---:|---|
| Platform Foundation | Mostly complete | 85% | API foundation, migrations, env validation, health/readiness, build/test flows, request/error handling, and seed tooling are implemented. |
| Authentication & RBAC | Partial | 72% | Persisted users, roles, permissions, JWT sessions, refresh sessions, route guards, and admin management exist. Password reset, account recovery, MFA, and full role policy remain. |
| CMS | Partial | 45% | Generic content, sections, versions, and draft/publish exist. Review/approval, preview, archive/restore, media, pagination, and translation completeness remain. |
| Public Website | Partial | 58% | v0.5 route set and shell exist. Managed content coverage, search, sitemap, full SEO/social metadata, media optimization, and complete accessibility verification remain. |
| News | Partial | 68% | CRUD, categories, tags, bilingual fields, scheduled visibility, public list/detail, and tests exist. Full workflow and SEO/localized slug completeness remain. |
| Events | Partial | 55% | CRUD, categories, bilingual fields, dates, public list/detail, calendar API, and tests exist. Capacity, registration, accessibility details, add-to-calendar files, and notifications remain. |
| Booking System | Substantial | 84% | v0.6, configurable pricing, billing, contracts, status lookup, availability, admin lifecycle, and tests exist. Self-service, reminders, retention, browser E2E, and production hardening remain. |
| Configurable Booking Categories & Pricing | Substantial | 78% | Models, migration seed data, APIs, and admin editing exist. Temporal edge cases and E2E coverage remain. |
| Billing Address Workflow | Substantial | 80% | Paid booking billing collection and admin review exist. Invoicing/accounting integration remains. |
| Date/Time Formatting | Substantial | 85% | Shared helpers and booking picker UI use DD.MM.YYYY and 24-hour time. Older non-booking paths remain a formatting risk. |
| Multilingual Foundation Swedish-first | Partial | 45% | Locale constants, fallback helpers, public i18n, admin field ordering, and docs exist. Full admin localization, translation workflows, localized slugs, and email localization remain. |
| Admin Backoffice | Partial | 55% | Users, roles, content, News, Events, booking, resources, pricing, and settings exist. Several modules are placeholders. |
| Public Frontend | Partial | 60% | Main route set, i18n shell, content pages, News, Events, booking, and status lookup exist. Several pages are static/hard-coded. |
| Organization | Minimal/static only | 12% | Public static content exists; no domain model or admin workflow. |
| Collaborations | Placeholder/static only | 5% | No domain model, API, or admin workflow. |
| Live at Cor | Placeholder only | 5% | No product implementation. |
| Membership & Student Services | Static only | 12% | Public content exists; no workflows or admin management. |
| Public Governance | Placeholder/static only | 10% | No governance domain workflow. |
| Alumni Page | Not started | 0% | No dedicated implementation found. |
| Theme Manager / Appearance | Not started | 5% | Brand tokens exist; no manager. |
| Media Library | Not started | 5% | External URLs are used; no managed library. |
| GDPR/Data Governance | Foundational only | 12% | No full retention, export, deletion, anonymization, or legal-hold workflows. |
| Accessibility | Partial/informal | 18% | Some accessible patterns exist; no WCAG 2.1 AA audit or automated suite. |
| Testing & Production Operations | Partial | 30% | Build/typecheck/test coverage exists; browser E2E, observability, deployment, backup, rollback, and incident operations remain. |

## Current Completed Releases

- v0.5 public website route set and public shell.
- v0.6.0 Cor House booking system.
- Configurable booking categories and pricing rules.
- Billing address workflow for paid bookings.
- Shared date/time formatting helpers and booking date-time picker presentation.
- Initial Swedish-first multilingual foundation.

## Current Risks and Blockers

- Current validated worktree is dirty with uncommitted booking/date-time/settings changes.
- Migrations 009 and 010 are present but must be run manually in each target database.
- Several admin modules are placeholders.
- Multilingual behavior is incomplete and should be finished before new content-heavy modules.
- GDPR/data governance, accessibility conformance, browser E2E tests, and production operations are launch blockers.

## Recommended Next Epic

Continue **Epic 3 - Bilingual Content and Localization** before starting Organization, Collaborations, Live at Cor, Alumni, Theme Manager, or Media Library.

The next task should complete the Swedish-first multilingual foundation across admin UI, public UI, backend validation/errors, content translation workflow, localized slugs/metadata, and email templates, with tests for critical bilingual journeys.
