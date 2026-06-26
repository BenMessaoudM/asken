# Arcada Student Union - ASK Platform Project Status

**Audit date:** 2026-06-26
**Authoritative status source:** implemented code, migrations, automated tests, successful local builds, and docs/PROJECT_ADVANCEMENT_AUDIT.md
**Canonical Epic definitions:** docs/TASK_BACKLOG.md

## Executive Status

**Estimated overall completion: 35%.**

The platform has a working technical foundation, secure administration authentication, generic CMS foundations, usable News and Events slices, a public website route set, a substantial Cor House booking system, and a completed shared Swedish-first multilingual foundation for existing modules. Booking is the most advanced product area after v0.6, configurable pricing, billing address handling, contract generation, status lookup, and DD.MM.YYYY/24-hour date-time presentation work.

The platform is not production-ready. The largest remaining areas are complete CMS editorial workflows, full admin/validation localization, localized URL migration, managed media, GDPR/data governance, accessibility assurance, production operations, browser E2E coverage, and product modules that are still placeholders or static pages.

## Current Aggregate Completion

| Area | Completion % |
|---|---:|
| Overall project completion | 35% |
| Public website completion | 58% |
| Admin backoffice completion | 55% |
| Backend/API completion | 64% |
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
| Multilingual Foundation Swedish-first | Shared foundation complete | 68% | Shared constants/helpers, Swedish-first fallback, booking/contract Finnish scoping, metadata/status model, booking email templates, SEO alternates, and tests exist. Full admin UI localization, backend validation localization, persisted review workflow, stale automation, and localized slug migration remain. |
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
- Shared Swedish-first multilingual foundation for existing modules.

## Current Risks and Blockers

- Current validated worktree is dirty with uncommitted booking/date-time/settings changes.
- Migrations 009 and 010 are present but must be run manually in each target database.
- Several admin modules are placeholders.
- Multilingual shared foundation is complete enough for the next content-heavy module, but Organization must use the shared model from the start.
- GDPR/data governance, accessibility conformance, browser E2E tests, and production operations are launch blockers.

## Recommended Next Epic

Start **Organization** next, using the completed Swedish-first multilingual foundation. Do not create a separate translation model. Keep localized slug migration, full admin UI localization, and stale translation workflow as platform follow-up work.
