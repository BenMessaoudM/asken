# Arcada Student Union - ASK Platform Project Status

**Audit date:** 2026-06-26
**Authoritative status source:** implemented code, migrations, automated tests, successful local builds, and docs/PROJECT_ADVANCEMENT_AUDIT.md
**Canonical Epic definitions:** docs/TASK_BACKLOG.md

## Executive Status

**Estimated overall completion: 38%.**

The platform has a working technical foundation, secure administration authentication, generic CMS foundations, usable News and Events slices, a public website route set, a substantial Cor House booking system, a completed shared Swedish-first multilingual foundation for existing modules, and an Organization v0.7 foundation including Alumni. Booking is the most advanced product area after v0.6, configurable pricing, billing address handling, contract generation, status lookup, and DD.MM.YYYY/24-hour date-time presentation work.

The platform is not production-ready. The largest remaining areas are complete CMS editorial workflows, full admin/validation localization, localized URL migration, managed media, GDPR/data governance, accessibility assurance, production operations, browser E2E coverage, and product modules that are still placeholders or static pages.

## Current Aggregate Completion

| Area | Completion % |
|---|---:|
| Overall project completion | 38% |
| Public website completion | 62% |
| Admin backoffice completion | 59% |
| Backend/API completion | 67% |
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
| Organization | v0.7 foundation complete | 58% | Public pages, backend models/APIs, admin management, migration seed, recruitment campaigns, Fullmäktige public settings, committees, people, role badges, and Alumni page exist. Private board/governance management is excluded. |
| Collaborations | Placeholder/static only | 5% | No domain model, API, or admin workflow. |
| Live at Cor | Placeholder only | 5% | No product implementation. |
| Membership & Student Services | Static only | 12% | Public content exists; no workflows or admin management. |
| Public Governance | Placeholder/static only | 10% | No governance domain workflow. |
| Alumni Page | v0.7 foundation complete | 55% | Dedicated public Alumni page, admin-editable content, benefits, CTAs, and Cor House alumni booking link exist. No alumni CRM. |
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
- v0.7 Organization / Organisation foundation, including Alumni public page and admin management.

## Current Risks and Blockers

- Migration 011 is present and must be run manually in each target database.
- Several admin modules are placeholders.
- Organization v0.7 intentionally excludes private board meetings, internal votes/tasks, and alumni CRM.
- GDPR/data governance, accessibility conformance, browser E2E tests, and production operations are launch blockers.

## Recommended Next Epic

Recommended next priority: **Tutor Module** or the broader student engagement workflow, building on Organization recruitment campaigns. Keep Collaborations, Live at Cor, Theme Manager, and Media Library as separate future modules.

## Booking Hardening Patch

Booking now includes Cor-huset-style contract alignment, Fastighets Ab Cor-huset landlord / ASK contact role separation, Arcada Association no-contract handling, paid Arcada bill-basis generation, soft delete, and door-code scoping. Migration `012-booking-hardening-v08` must be run in each environment.

## Organisation Bylaws Alignment

Organisation now includes Äldres Råd / Elders’ Council as a bylaws-aligned advisory body appointed by Fullmäktige, with nine-member / three-year mandate wording, contact email `aldresrad@asken.fi`, admin editing, public page, and migration `013-organization-bylaws-alignment`.

## Student Representatives v0.8

Organisation now includes Studeranderepresentanter / Student Representatives as a separate Organisation-related module. It adds representative bodies, public representative profiles, and calls for applications, aligned to ASK's Swedish stadgar och reglemente.

Seeded bodies include Yrkeshögskolans styrelse, Omprövningsnämnden, Branschråd, Kvalitetsråd, Forskningsråd, Pedagogiska rådet, and Rådet för kvalitet och samhällsansvar. No fake representatives are seeded.

Public pages are available at `/organisation/studeranderepresentanter` and `/organisation/studeranderepresentanter/:slug`. Admin management is available at `/representatives` with `representatives.read` and `representatives.write` permissions. Migration `014-student-representatives` must be run in each target environment.
