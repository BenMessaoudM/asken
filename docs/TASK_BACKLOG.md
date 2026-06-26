# Arcada Student Union – ASK Platform Agile Task Backlog

This backlog translates `PROJECT_MASTER_SPEC.md` and `GAP_ANALYSIS.md` into implementable product work. Epics are ordered broadly by dependency. Estimates include implementation, tests, documentation, accessibility, and bilingual completion.

**Status authority:** This document defines canonical Epic numbering, scope, and acceptance criteria. Current implementation status and completion estimates are maintained in `PROJECT_STATUS.md`.

## Audited Status Summary — 2026-06-26

| Epic | Status |
| --- | --- |
| Epic 1 — Platform Foundation and API Standards | Mostly complete |
| Epic 2 — Identity, Authentication, and Authorization | Partial |
| Epic 3 — Bilingual Content and Localization | Shared foundation complete; workflow follow-ups remain |
| Epic 4 — ASK Design System and Public Website | Partial |
| Epic 5 — Backoffice Content Management | Partial |
| Epic 6 — News and Blog | Partial |
| Epic 7 — Events | Partial |
| Epic 8 — What's Happening at Cor | Placeholder only |
| Epic 9 — Collaborations | Placeholder/static only |
| Epic 10 — Booking System | Substantial, not production-complete |
| Epic 11 — Tutor Module | Not started |
| Epic 12 — Governance Portal | Placeholder/static only |
| Epic 13 — Student Representative Management | Not started |
| Epic 14 — Knowledge Transfer System | Not started |
| Epic 15 — AI-Assisted Translation | Not started |
| Epic 16 — GDPR and Data Governance | Foundational only |
| Epic 17 — WCAG 2.1 AA Accessibility | Partial/informal |
| Epic 18 — Testing, Delivery, and Production Operations | Partial |

Current full-project audit: docs/PROJECT_ADVANCEMENT_AUDIT.md. Overall completion is estimated at 35%, with booking at 84%, public website at 58%, admin backoffice at 55%, backend/API at 64%, multilingual foundation at 68%, and production readiness at 28%.

Partial implementations do not satisfy the complete acceptance criteria or the master specification's Definition of Done. Placeholder UI, static content, and documentation-only capabilities are not counted as complete product implementation.

**Estimate scale:** 1 story point (SP) is roughly one focused developer day. Estimates are planning ranges, not commitments.

## Epic 1 — Platform Foundation and API Standards

**User Story — PLAT-001:** As a development team, we want a stable, versioned platform foundation so that features can be delivered consistently and deployed safely.

**Acceptance Criteria**

- Backend, public frontend, and admin frontend build and run from documented commands.
- Existing backend compile errors are resolved and CI rejects build or test failures.
- APIs use a documented versioning strategy, standard error envelope, validation format, filtering, sorting, and pagination.
- Database schema changes use a documented migration or versioning process.
- Shared entities are defined for users, roles, translations, media, audit events, and notifications.
- Environment configuration is validated without committing secrets.

**Technical Notes**

- Keep the three-package architecture.
- Add health/readiness endpoints and align `API_CONTRACT.md` with implementation.
- Establish development seed data and non-production fixtures.

**Estimated Effort:** 15–20 SP

## Epic 2 — Identity, Authentication, and Authorization

**User Story — IAM-001:** As an administrator, I want secure account access and role-based permissions so that users can only perform authorized actions.

**Acceptance Criteria**

- Users are persisted with unique identities and securely hashed passwords.
- Login, logout, session expiry, password reset, and account recovery work end to end.
- Protected APIs reject missing, malformed, expired, or unauthorized credentials.
- Roles support visitor, student, tutor, representative, editor, module manager, and administrator permissions.
- Backend authorization is enforced for every protected action.
- Authentication, permission, and account-management events are audited.
- Privileged accounts can be configured for multi-factor authentication.

**Technical Notes**

- Replace client-only admin authentication.
- Prefer secure, HTTP-only cookie sessions or document the chosen token strategy and CSRF controls.
- Add rate limiting, password policy, lockout safeguards, and session revocation.

**Estimated Effort:** 20–30 SP

## Epic 3 — Bilingual Content and Localization

**User Story — I18N-001:** As an English- or Swedish-speaking user, I want the complete platform in my preferred language so that I can use every service equally.

**Acceptance Criteria**

- All public and backoffice navigation, forms, validation, statuses, emails, metadata, and system messages exist in English and Swedish.
- Managed content stores separate English and Swedish values with translation status.
- Editors can compare languages side by side and identify incomplete or stale translations.
- Language selection persists and produces correct document language metadata.
- Language-specific URLs or slugs resolve correctly and have appropriate alternate-language metadata.
- Missing translations follow a documented fallback policy without exposing raw keys.

**Technical Notes**

- 2026-06-26 foundation: Swedish-first shared language constants/helpers, fallback rules, translation status metadata, admin language ordering, scoped Finnish booking/contract support, booking email templates, SEO alternate helper, shared DD.MM.YYYY/24-hour presentation helpers, and docs/MULTILINGUAL_ARCHITECTURE.md are in place. Full admin UI localization, backend validation localization, persisted review workflow, stale automation, and localized URL migration remain.
- Expand the existing i18next setup into namespaced resources.
- Model translations as structured fields or related records with revision metadata.
- Add automated checks for missing keys and bilingual critical journeys.

**Estimated Effort:** 15–22 SP

## Epic 4 — ASK Design System and Public Website

**User Story — WEB-001:** As a public visitor, I want a modern, responsive ASK website so that I can discover services and information on any device.

**Acceptance Criteria**

- The design system uses `#A32F8E`, `#CB52B5`, `#F1E4E8`, `#E0C13D`, and `#23212B` through reusable tokens.
- Contrast-safe typography, spacing, controls, cards, alerts, navigation, focus states, and breakpoints are documented.
- The site includes responsive header, navigation, search, language switcher, footer, contact details, and core landing pages.
- Pages expose human-readable URLs, SEO metadata, social metadata, sitemap entries, and optimized media.
- Loading, empty, validation, error, success, and not-found states are consistent.
- Mobile and desktop performance targets are defined and verified.

**Technical Notes**

- Extend Tailwind with named brand and semantic tokens rather than raw colors.
- Build shared accessible components before feature-specific screens.
- Use structured content blocks instead of hard-coded page content.

**Estimated Effort:** 25–35 SP

## Epic 5 — Backoffice Content Management

**User Story — CMS-001:** As an editor, I want a secure bilingual backoffice so that I can manage and publish content without developer assistance.

**Acceptance Criteria**

- Role-specific dashboards and module navigation are available after secure login.
- Editors can create, edit, preview, review, approve, schedule, publish, archive, restore, filter, and search content.
- Translation completeness and review state are visible for both languages.
- The media library supports upload, metadata, alternative text, reuse information, and safe file validation.
- Lists support pagination and appropriate bulk actions.
- Publishing and sensitive content changes create immutable audit records.
- Unauthorized users cannot access content or actions outside their role.

**Technical Notes**

- Implement a reusable editorial state machine.
- Use optimistic concurrency or revision checks to prevent accidental overwrites.
- Separate media metadata from storage-provider concerns.

**Estimated Effort:** 25–35 SP

## Epic 6 — News and Blog

**User Story — NEWS-001:** As an editor, I want to publish bilingual news and blog articles so that ASK can communicate timely information.

**Acceptance Criteria**

- Articles support bilingual title, summary, body, author, category, tags, hero media, dates, SEO metadata, and language-specific slugs.
- Draft, preview, scheduled, published, archived, and restored states work.
- Public users can browse article lists, details, categories, tags, related content, and pagination.
- Scheduled articles are not public before publication time.
- Archived or unpublished articles are excluded from public search and sitemap results.
- Article workflows, permissions, translations, and scheduled publishing are tested.

**Technical Notes**

- Reuse shared editorial, translation, media, and audit services.
- Sanitize rich content and validate link and media references.

**Estimated Effort:** 12–18 SP

## Epic 7 — Events

**User Story — EVENT-001:** As a student, I want to discover upcoming ASK events so that I can plan and participate.

**Acceptance Criteria**

- Events support bilingual title and description, start/end time, timezone, location, organizer, capacity, accessibility details, image, registration, and status.
- Public users can view upcoming and past events and filter by date, category, and location.
- Event pages use accessible date formats and provide add-to-calendar links.
- Editors can draft, schedule, publish, update, cancel, archive, and duplicate events.
- Capacity and registration links or workflows are handled consistently.
- Changes to published event time, location, or cancellation can trigger notifications where configured.

**Technical Notes**

- Store timestamps in UTC and render in the configured local timezone.
- Reuse publishing, translations, media, and notifications.
- Define recurrence only if validated as an operational requirement.

**Estimated Effort:** 15–22 SP

## Epic 8 — What's Happening at Cor

**User Story — COR-001:** As a visitor, I want a current view of activity at Cor so that I know what is happening now and soon.

**Acceptance Criteria**

- Entries support bilingual content, date/time, location, category, visibility window, priority, and optional event or article link.
- Editors can schedule, pin, reorder, publish, expire, and archive entries.
- Public views distinguish current, upcoming, and recently completed activity.
- Entries outside their visibility window are automatically hidden.
- Empty states clearly direct users to other ASK events or information.
- Pinning and expiration behavior is deterministic and tested.

**Technical Notes**

- Consider a lightweight content type that references shared events and articles.
- Use scheduled jobs or query-time visibility rules with monitoring.

**Estimated Effort:** 8–12 SP

## Epic 9 — Collaborations

**User Story — COLLAB-001:** As a student, I want to browse current ASK collaborations so that I can understand available partners and benefits.

**Acceptance Criteria**

- Profiles support bilingual name, description, benefits, collaboration type, logo, external link, validity dates, and status.
- Editors can draft, preview, publish, archive, and renew collaborations.
- Public users can browse and filter active collaborations.
- Expired collaborations are hidden automatically or flagged for editorial review according to configuration.
- External links are labeled and handled securely.
- Logo alternative text and image usage meet accessibility requirements.

**Technical Notes**

- Reuse media, translation, publication, and audit infrastructure.
- Add an expiry job or deterministic active-status query.

**Estimated Effort:** 8–12 SP

## Epic 10 — Booking System

**User Story — BOOK-001:** As an eligible user, I want to book ASK resources so that I can reserve available facilities without conflicts.

**Acceptance Criteria**

- Staff can manage resources, capacity, opening hours, availability rules, blackout periods, eligibility, and optional price information.
- Users can search availability, create a booking, view personal bookings, and cancel within configured rules.
- The backend prevents overlapping or over-capacity bookings under concurrent requests.
- Booking states include pending, confirmed, cancelled, completed, rejected, and no-show where applicable.
- Confirmations, reminders, changes, and cancellations generate bilingual notifications.
- Staff have accessible calendar and list views with filtering and audit history.
- Personal data, exports, and booking history follow documented retention and deletion rules.
- Conflict, eligibility, authorization, timezone, and cancellation scenarios are covered by integration tests.

**Technical Notes**

- Use database-level safeguards or transactions for conflict prevention.
- Store timezone-aware rules and UTC timestamps. Render all user-facing dates through shared DD.MM.YYYY and 24-hour helpers.
- Paid booking requests and paid contract generation require complete billing name, address, postal code, city, and country; free bookings do not.
- Separate resource policy, availability calculation, booking lifecycle, and notification services.

**Estimated Effort:** 35–50 SP

## Epic 11 — Tutor Module

**User Story — TUTOR-001:** As a tutor, I want access to my assigned groups, tasks, resources, and handover information so that I can support students effectively.

**Acceptance Criteria**

- Managers can create tutor profiles, cohorts, groups, assignments, schedules, tasks, resources, and announcements.
- Tutors can access only their active assignments and the minimum necessary student information.
- Managers can monitor assignment and task status without exposing unrelated personal data.
- Tutor handovers preserve relevant history, ownership, and acknowledgment.
- Notifications support assignment changes, deadlines, and announcements.
- Retention and access rules apply when a tutor's term or assignment ends.
- Permission boundaries and term transitions are tested.

**Technical Notes**

- Model tutor roles separately from general account roles and scope access by assignment.
- Reuse notifications, documents, audit events, and knowledge records.

**Estimated Effort:** 25–35 SP

## Epic 12 — Governance Portal

**User Story — GOV-001:** As a governance participant, I want organized meetings, decisions, and documents so that official work is transparent and traceable.

**Acceptance Criteria**

- Authorized users can manage boards, committees, memberships, terms, meetings, agendas, minutes, decisions, policies, and attachments.
- Records distinguish draft, reviewed, approved, superseded, archived, public, and restricted states.
- Approved records retain immutable versions and approval metadata.
- Public governance material is available bilingually without exposing restricted documents.
- Participants can locate records by body, term, meeting, document type, status, and date.
- Permission, approval, publication, and document-download actions are audited.
- Versioning and restricted-access scenarios are tested.

**Technical Notes**

- Define formal approval state machines and immutable approved revisions.
- Use object-level permissions for restricted bodies and documents.
- Apply malware scanning and safe content-disposition rules to uploads.

**Estimated Effort:** 30–45 SP

## Epic 13 — Student Representative Management

**User Story — REP-001:** As a coordinator, I want to manage student representative positions and terms so that vacancies, assignments, and continuity remain visible.

**Acceptance Criteria**

- Coordinators can manage organizations, bodies, positions, term dates, representatives, contact preferences, status, and vacancies.
- Students can complete an appropriate onboarding or acceptance workflow.
- The system supports reminders, reports, term transitions, replacement, and historical records.
- Authorized users can export administrative summaries with only necessary personal data.
- Representatives see only information required for their assignments.
- Expiring terms and vacancies are surfaced on dashboards and through notifications.
- Access, export, retention, and transition behavior is tested.

**Technical Notes**

- Model positions independently from people to preserve history.
- Reuse users, roles, notifications, documents, and audit services.

**Estimated Effort:** 22–32 SP

## Epic 14 — Knowledge Transfer System

**User Story — KNOW-001:** As an ASK role holder, I want current guides and handover material so that knowledge survives staff and representative transitions.

**Acceptance Criteria**

- Users can manage bilingual guides, handbooks, checklists, templates, decisions, lessons learned, and handover packages.
- Every record has an owner, status, tags, access level, review date, revision history, and optional acknowledgment requirement.
- Authorized users can search and filter by role, topic, owner, status, and review date.
- Owners receive reminders for overdue reviews or stale material.
- Handover packages can be assigned and acknowledged without changing approved source records.
- Restricted knowledge is protected by backend permissions and audited.
- Version, review, acknowledgment, and access rules are tested.

**Technical Notes**

- Reuse governance-grade document versioning where practical.
- Index bilingual titles, summaries, and tags for search.
- Store acknowledgments as separate immutable events.

**Estimated Effort:** 25–38 SP

## Epic 15 — AI-Assisted Translation

**User Story — AI18N-001:** As an editor, I want AI-generated translation drafts so that bilingual publishing is faster while remaining human-controlled.

**Acceptance Criteria**

- Editors can request an English or Swedish draft from approved source content.
- Generated translations preserve structure, links, names, fields, and formatting.
- AI output is clearly marked as unreviewed and cannot publish automatically.
- Authorized reviewers can edit, reject, regenerate, approve, and compare suggestions with the source.
- Audit metadata records source and target language, provider, model or version where available, timestamp, requester, reviewer, and approval state.
- Sensitive or restricted content is blocked unless an approved processing basis and provider policy allow it.
- Provider failure, timeout, quota, and partial translation states are handled safely.

**Technical Notes**

- Introduce a provider abstraction and avoid coupling content models to one AI service.
- Apply field-level eligibility and redaction checks before external processing.
- Store prompts and outputs only according to the approved privacy policy.

**Estimated Effort:** 18–28 SP

## Epic 16 — GDPR and Data Governance

**User Story — GDPR-001:** As a data subject and platform owner, I want personal data governed transparently so that the platform meets GDPR obligations.

**Acceptance Criteria**

- Every module documents purpose, legal basis, data categories, owner, processors, recipients, access, retention, and deletion behavior.
- Privacy notices are available at relevant collection points in both languages.
- Consent is recorded only where consent is the valid legal basis and can be withdrawn.
- Authorized staff can process access, correction, export, restriction, deletion, and anonymization requests.
- Retention jobs delete or anonymize eligible records and produce auditable results.
- Production data is not used in development without approved anonymization.
- Processor agreements and AI-provider data handling are documented before activation.
- Data-subject and retention workflows are tested.

**Technical Notes**

- Create a data inventory linked to domain entities and retention policies.
- Separate legal holds from normal retention processing.
- Design exports in structured, portable formats.

**Estimated Effort:** 25–40 SP

## Epic 17 — WCAG 2.1 AA Accessibility

**User Story — A11Y-001:** As a user with accessibility needs, I want all public and backoffice workflows to be perceivable, operable, understandable, and robust.

**Acceptance Criteria**

- Pages use semantic landmarks, logical headings, skip navigation, meaningful labels, and correct document language.
- Every function is keyboard operable with visible focus and no keyboard trap.
- Text, controls, status indicators, and focus states meet contrast requirements; color is not the sole signal.
- Forms provide associated labels, clear instructions, accessible validation, and announced status messages.
- Media includes appropriate alternatives or captions.
- Interfaces support zoom, reflow, reduced motion, and common screen readers.
- Automated accessibility tests run in CI, and critical journeys pass documented keyboard, screen-reader, zoom, and high-contrast reviews.
- Known exceptions have owners, severity, remediation dates, and approval.

**Technical Notes**

- Add accessibility checks at component, page, and end-to-end levels.
- Test both languages because text length and language metadata affect conformance.
- Maintain an accessibility statement and audit record.

**Estimated Effort:** 20–30 SP initially, plus 10–15% of every feature

## Epic 18 — Testing, Delivery, and Production Operations

**User Story — OPS-001:** As a platform owner, I want automated quality controls and reliable operations so that releases are safe, observable, and recoverable.

**Acceptance Criteria**

- CI runs type checks, builds, unit tests, integration tests, accessibility checks, and dependency/security scans.
- Critical journeys have bilingual end-to-end coverage.
- Tests cover permissions, validation, publication states, booking conflicts, privacy workflows, and scheduled jobs.
- Deployment and rollback procedures are documented and repeatable.
- Availability, errors, latency, security events, queues, and scheduled jobs are monitored with actionable alerts.
- Backups are encrypted, retained appropriately, and restored successfully in scheduled exercises.
- Incident response, ownership, escalation, recovery objectives, and post-incident review processes are documented.
- Release readiness requires passing quality gates and approved migration plans.

**Technical Notes**

- Use isolated test databases and deterministic fixtures.
- Define service-level indicators before selecting alert thresholds.
- Treat restore tests and rollback validation as recurring operational work.

**Estimated Effort:** 25–40 SP initially, then ongoing

## Suggested Delivery Order

1. Epics 1–3: platform, identity, and bilingual foundations.
2. Epics 4–5, 17–18: design, public site, backoffice, accessibility, and delivery controls.
3. Epics 6–9: public content modules.
4. Epic 10: booking.
5. Epics 11–14: organizational modules.
6. Epics 15–16: AI translation and full data-governance workflows.

GDPR, accessibility, security, testing, and operations are continuous requirements rather than final-stage tasks. Each feature is complete only when its permissions, bilingual experience, privacy behavior, audit needs, accessibility, documentation, and automated tests meet the master specification.
