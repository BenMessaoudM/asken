# Arcada Student Union – ASK Platform Roadmap

> **Deprecated as a project tracker (2026-06-24).**
>
> This original sequencing plan is retained for historical context. Its quick wins, phase state, and completion estimate are stale. Use `docs/PROJECT_STATUS.md` for current implementation status and `docs/TASK_BACKLOG.md` for the canonical delivery backlog.

This roadmap converts the findings in `docs/GAP_ANALYSIS.md` into an implementation sequence. Estimates assume a small product team and require all features to support English and Swedish, WCAG 2.1 AA, backend-enforced permissions, and documented GDPR behavior.

## 1. Quick Wins (Less Than 1 Day Each)

- Confirm the backend builds and record existing compile or test failures.
- Align `docs/API_CONTRACT.md` with endpoints that actually exist.
- Define ASK palette values as documented design tokens and identify contrast-safe pairings.
- Create a role-permission matrix for administrators, editors, managers, tutors, representatives, students, and visitors.
- Document a standard API error envelope, pagination format, and validation response.
- Inventory personal data planned for each module, including owner, purpose, access, and retention.
- Expand the translation key structure beyond the two placeholder strings.
- Add visible labels and autocomplete attributes to the admin login form specification.
- Define acceptance checklists for bilingual content, accessibility, privacy, testing, and audit logging.
- Create an initial domain diagram covering users, roles, translations, media, content, and audit events.

## 2. Phase 1 Critical Features

**Goal:** establish a secure, accessible foundation and launch the core public publishing platform.

1. Stabilize backend compilation, tests, configuration, and API documentation.
2. Implement persisted users, secure password hashing, login/logout, session expiry, and account recovery.
3. Enforce role-based authorization in backend APIs and add immutable security audit events.
4. Define versioned schemas and migration practices for shared domain models.
5. Build ASK design tokens and accessible reusable components for public and admin applications.
6. Implement complete English/Swedish UI localization, content fields, validation messages, metadata, and emails.
7. Build public navigation, responsive layouts, search, contact information, SEO metadata, and standard UI states.
8. Build backoffice dashboards, media management, translation status, previews, and draft/review/publish/archive workflows.
9. Deliver News & Blog, Events, What's Happening at Cor, and Collaborations.
10. Add CI checks, unit and API integration tests, accessibility checks, and critical bilingual end-to-end journeys.
11. Establish privacy notices, data inventory, retention rules, security headers, rate limiting, backups, and restore procedures.

**Exit criteria:** authorized editors can securely manage and publish accessible bilingual content, and public users can browse it reliably in both languages.

## 3. Phase 2 Core Features

**Goal:** deliver the platform's primary student and organizational operations.

1. Implement the Booking System with resources, opening hours, availability, blackout periods, eligibility, capacity, and conflict prevention.
2. Add booking confirmations, cancellations, reminders, staff calendar views, audit records, and retention automation.
3. Implement the Tutor Module with profiles, cohorts, assignments, schedules, tasks, announcements, resources, and handovers.
4. Implement the Governance Portal with boards, committees, terms, meetings, agendas, minutes, decisions, policies, restricted files, and version history.
5. Implement Student Representative Management with positions, assignments, term transitions, vacancies, reminders, reports, and exports.
6. Implement the Knowledge Transfer System with owners, review dates, tags, templates, checklists, versioning, access levels, and acknowledgments.
7. Add shared notifications, document handling, filtering, pagination, import/export, and scheduled jobs.
8. Expand automated coverage to permissions, booking conflicts, lifecycle transitions, privacy workflows, and all critical module journeys.

**Exit criteria:** operational teams can run bookings, tutoring, governance, representative work, and handovers without relying on parallel unmanaged systems.

## 4. Phase 3 Advanced Features

**Goal:** improve editorial efficiency and prepare the complete platform for production assurance.

1. Add AI-assisted English/Swedish translation with provider governance, protected-data rules, preserved formatting, review states, and full audit metadata.
2. Add translation quality reporting, stale-translation detection, regeneration, and approval metrics.
3. Introduce optional multi-factor authentication and stronger controls for privileged roles.
4. Add advanced search, related-content recommendations, operational dashboards, and privacy-conscious analytics.
5. Complete data-subject access, correction, export, deletion, and anonymization workflows.
6. Perform formal WCAG 2.1 AA testing across public and backoffice journeys using automated and manual methods.
7. Complete penetration testing, dependency review, performance testing, monitoring, alerting, disaster-recovery exercises, and rollback validation.
8. Conduct production readiness, GDPR, accessibility, content governance, and operational ownership reviews.

**Exit criteria:** AI assistance is human-controlled, compliance controls are operational, and the platform has passed security, accessibility, recovery, and production-readiness reviews.

## 5. Estimated Current Completion

**Deprecated estimate: 12%.**

The audited completion estimate as of 2026-06-24 is maintained in `docs/PROJECT_STATUS.md`. Do not use the figures below for current reporting.

The estimate reflects available scaffolding rather than production readiness:

| Area | Approximate completion |
| --- | ---: |
| Package architecture and tooling | 45% |
| Public website | 5% |
| Backoffice | 8% |
| Bilingual support | 15% |
| Content modules | 0% |
| Booking and organizational modules | 0% |
| Security, GDPR, and audit controls | 5% |
| Accessibility assurance and design system | 10% |
| Testing and production operations | 8% |

The repository already separates the backend, public frontend, and admin frontend and includes basic localization, environment validation, JWT middleware, MongoDB setup, and limited tests. However, almost every user-facing and operational capability remains missing, and the existing admin authentication is not secure. The percentage should be recalculated after each phase using accepted capabilities rather than file count or code volume.
