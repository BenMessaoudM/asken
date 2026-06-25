# Arcada Student Union – ASK Platform Project Status

**Audit date:** 2026-06-24

> **Post-audit implementation note (2026-06-25):** Release v0.5 adds the complete required public route set. Finalized Release v0.6 adds the Cor House resource catalogue, pricing engine, quote workflow, billing data, yearly public references, contract PDF generator, manual Visma Sign lifecycle, email foundation, dashboard summaries, checklist, timeline, blackouts, and secure reference-plus-email public status lookup. The 19% figure below remains the last full-project audit baseline until the next full audit.

**Authoritative status source:** implemented code, migrations, automated tests, and successful local builds
**Canonical Epic definitions:** `docs/TASK_BACKLOG.md`

## Executive Status

**Estimated overall completion: 19%.**

The platform has a working technical foundation, secure administration authentication, a generic content foundation, and usable News and Events slices. It is not yet a production-ready implementation of the master specification. The largest remaining areas are platform-wide bilingual behavior, the complete public website and design system, the full editorial workflow, operational modules, GDPR workflows, accessibility assurance, and production operations.

The 19% estimate is weighted by the midpoint of each Epic's story-point range in `docs/TASK_BACKLOG.md`. Each Epic was scored against code-backed acceptance criteria rather than file count, commit messages, or previous status documents. The calculation is 88.1 earned weighted points out of 456 possible, or 19.3%, rounded to 19%.

## Epic Audit

| Epic | Status | Estimated completion | Code-backed assessment |
| --- | --- | ---: | --- |
| 1 — Platform Foundation and API Standards | **Completed** | 85% | Three-package architecture, versioned API, standard errors, request IDs, environment validation, health/readiness, migrations, seeds, CI, tests, and builds are implemented. List conventions and shared persistence models are not fully applied. |
| 2 — Identity, Authentication, and Authorization | Partial | 70% | Persisted users, bcrypt passwords, JWT access/rotating refresh sessions, HttpOnly cookies, backend RBAC, user/role administration, password change, rate limiting, and audit events are implemented. Password reset, account recovery, MFA, seeded role coverage, lockout controls, and database integration tests are missing. |
| 3 — Bilingual Content and Localization | Partial | 35% | Public News and Events UI strings and their managed content are English/Swedish. Generic CMS content and the admin interface are primarily English-only. Translation review state, stale detection, persisted locale choice, localized slugs/URLs, metadata coverage, and bilingual emails are missing. |
| 4 — ASK Design System and Public Website | Partial | 25% | Admin brand tokens, responsive admin layout, a small public header, and News/Events pages exist. The public app lacks a complete tokenized design system, global navigation, footer, contact/service pages, platform search, sitemap, social metadata, and verified performance targets. |
| 5 — Backoffice Content Management | Partial | 40% | Protected CMS routes, typed content, structured sections, optimistic version checks, draft/publish behavior, version history, admin lists, and editors exist. Preview, review/approval, archive/restore, media library, bulk operations, pagination, and translation completeness are missing. |
| 6 — News and Blog | Partial | 65% | Bilingual article CRUD, categories, tags, featured state, scheduled visibility, version snapshots, public search/list/detail views, permissions, and validation tests exist. Author/SEO fields, localized slugs, preview, archive/restore, related content, UI pagination, and rich-content sanitization are missing. |
| 7 — Events | Partial | 50% | Bilingual event CRUD, categories, dates, location, organizer, image metadata, status, featured state, Kide.app link, public filtering, calendar API, versions, permissions, and validation tests exist. Capacity, accessibility details, general registration workflow, add-to-calendar output, draft scheduling, archive/duplicate, location filtering, and notifications are missing. |
| 8 — What's Happening at Cor | Not started | 0% | Permission/navigation placeholders exist, but no domain model, API, workflow, or public view exists. |
| 9 — Collaborations | Not started | 0% | Permission/navigation placeholders and a generic content type exist, but no collaboration implementation exists. |
| 10 — Booking System | **Substantially complete (post-audit)** | 92% | Finalized v0.6 implements fixed Cor House resources, pricing and benefits, quotes, billing, yearly references, availability/conflict protection, contract PDFs, manual signature workflow, notifications, dashboard operations, blackouts, checklist/history, permissions, and audit logging. Student accounts, self-service cancellation, scheduled reminders, retention automation, and browser/database concurrency suites remain. |
| 11 — Tutor Module | Not started | 0% | No implementation found. |
| 12 — Governance Portal | Not started | 0% | Navigation placeholder and generic content type only. |
| 13 — Student Representative Management | Not started | 0% | No implementation found. |
| 14 — Knowledge Transfer System | Not started | 0% | No implementation found. |
| 15 — AI-Assisted Translation | Not started | 0% | No provider, workflow, policy enforcement, or audit metadata implementation found. |
| 16 — GDPR and Data Governance | Not started | 2% | Data minimization and audit-oriented foundations exist, but no processing inventory, privacy notices, retention jobs, data-subject workflows, exports, anonymization, or legal-hold behavior exists. |
| 17 — WCAG 2.1 AA Accessibility | Partial | 8% | Labels, focus styles, semantic elements, responsive layouts, and alternative-text validation appear in some flows. There is no automated accessibility suite or documented manual conformance audit. |
| 18 — Testing, Delivery, and Production Operations | Partial | 25% | GitHub Actions, package locks, builds, type checking, unit tests, HTTP tests, migrations, and development documentation exist. There are no real database integration tests, browser E2E tests, accessibility checks, deployment/rollback automation, observability, backup/restore exercises, or incident operations. |

## Completed Epics

### Epic 1 — Platform Foundation and API Standards

Epic 1 is the only Epic sufficiently complete to be treated as delivered. Remaining foundation gaps are tracked as technical debt and do not invalidate the working architecture.

No later Epic meets its complete acceptance criteria or the master specification's Definition of Done.

## Remaining Epics

### In progress or partially implemented

1. Epic 2 — Identity, Authentication, and Authorization
2. Epic 3 — Bilingual Content and Localization
3. Epic 4 — ASK Design System and Public Website
4. Epic 5 — Backoffice Content Management
5. Epic 6 — News and Blog
6. Epic 7 — Events
7. Epic 10 — Booking System
8. Epic 17 — WCAG 2.1 AA Accessibility
9. Epic 18 — Testing, Delivery, and Production Operations

### Not started as product capabilities

1. Epic 8 — What's Happening at Cor
2. Epic 9 — Collaborations
3. Epic 11 — Tutor Module
4. Epic 12 — Governance Portal
5. Epic 13 — Student Representative Management
6. Epic 14 — Knowledge Transfer System
7. Epic 15 — AI-Assisted Translation
8. Epic 16 — GDPR and Data Governance

## Current Architecture Status

- **Backend:** Express 5 and TypeScript with Mongoose persistence, Zod validation, Helmet, CORS controls, rate limiting, cookie parsing, Nodemailer, versioned `/api/v1` routes, standard errors, request IDs, and health/readiness endpoints.
- **Identity:** MongoDB-backed users, roles, permissions, refresh sessions, and audit events. Access and refresh JWTs are issued through HttpOnly cookies; protected actions use backend permission middleware.
- **Content:** A generic typed CMS stores content, ordered sections, publication state, optimistic versions, and immutable snapshots. News and Events specialize the generic content record with their own collections and APIs.
- **Admin application:** React/Vite application with session restoration, permission-aware navigation and route guards, user/role administration, generic content editing, News management, Events management, Booking operations/resource management, and placeholder routes for later modules.
- **Public application:** React/Vite application with i18next, responsive global navigation/footer, Home, About, Board, Membership, Contact, Associations, Cor House, Booking, Privacy, Accessibility, News list/detail, Events list/detail, and 404 routes. Published locale-specific CMS pages, News, Events, booking resources, availability, and booking status are loaded from public APIs.
- **Data evolution:** Eight ordered MongoDB migrations and development seed tooling exist. The seed creates permissions and a Super Admin but not the complete required role set.
- **Delivery:** GitHub Actions builds all packages, runs backend checks/tests, and audits production dependencies. Admin tests exist locally but are not currently run by CI. The public frontend has no automated tests.

## Verification Performed

The following passed against the audited worktree:

- Backend type check
- Backend production build
- Backend tests: 12 suites, 48 tests
- Admin production build
- Admin tests: 7 suites, 15 tests
- Public frontend production build

The backend HTTP suite uses service doubles. Release v0.6 was additionally verified against local MongoDB and SMTP through create, conflict, availability, edit, approve, public-status, history, cancel, slot-release, and notification flows. Browser-level automation is still absent.

## Technical Debt and Risks

- Password reset, account recovery, MFA, login lockout, and broader refresh-token family reuse handling are absent.
- Only the Super Admin system role is seeded; required role definitions are not established as deployable policy.
- Generic content is monolingual while News and Events embed separate bilingual fields, creating inconsistent translation architecture.
- Admin interface strings are not localized, locale selection is not persisted, and slugs are shared rather than language-specific.
- CMS publication state is limited to draft/published; review, approval, archive, restore, and preview are absent.
- Media uses external URLs. There is no media library, upload validation, usage tracking, or storage abstraction.
- News and Events services coordinate writes across collections without transactions, allowing partial failures.
- Deleting generic content also deletes version history, conflicting with stronger audit/record-retention expectations.
- List pagination/filtering conventions exist but are not consistently applied to admin APIs; some public services load all matching records before slicing.
- Events do not implement capacity, accessibility details, standard registration, add-to-calendar files, or change notifications.
- Booking lacks student accounts, self-service cancellation, reminders, notification retry state, automated retention/anonymization, and browser-level accessibility tests.
- Several later modules are visible in administration as placeholders despite having no backend implementation.
- Test coverage lacks real MongoDB integration, frontend component coverage, browser E2E journeys, bilingual journey checks, and accessibility automation.
- CI does not run the existing admin test suite.
- No deployment environments, monitoring, alerting, backup/restore validation, rollback automation, or incident-response implementation is present.
- GDPR processing records, retention policies/jobs, data-subject workflows, exports, deletion/anonymization, and legal holds are absent.
- WCAG 2.1 AA conformance has not been established through automated and manual testing.
- Some Events implementation files are highly compressed, which increases maintenance and review risk despite passing type checks and tests.

## Recommended Next Epic

**Epic 3 — Bilingual Content and Localization**

Epic 3 should be completed before adding Epic 8 or further content modules. News, Events, generic CMS content, the public application, and the admin application currently use inconsistent localization patterns. The next delivery should establish:

1. One translation storage and revision strategy for managed content.
2. English/Swedish admin UI localization and validation messages.
3. Translation completeness, review, and stale-source indicators.
4. Persisted locale selection and correct document language metadata.
5. Localized slug/URL and alternate-language metadata policy.
6. Bilingual email and critical-journey test fixtures.

After Epic 3, complete the missing shared portions of Epics 4 and 5 before extending into Epic 8.

## Tracking Document Authority

- `docs/PROJECT_STATUS.md` is the current implementation-status record.
- `docs/TASK_BACKLOG.md` remains the canonical scope and acceptance-criteria document.
- `docs/PROJECT_MASTER_SPEC.md` remains the product requirements source.
- `docs/GAP_ANALYSIS.md` is a deprecated historical baseline.
- `docs/ARCHITECTURE_STATUS.md` is a deprecated historical status snapshot.
- `roadmap.md` is a deprecated original sequencing document and must not be used for completion reporting.
