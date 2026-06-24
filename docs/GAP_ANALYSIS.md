# Arcada Student Union – ASK Platform Gap Analysis

> **Deprecated — historical baseline only (2026-06-24).**
>
> This document describes the repository before the current identity, CMS, News, and Events implementation. Its implementation claims and priorities are stale. Use `docs/PROJECT_STATUS.md` for audited current status, `docs/TASK_BACKLOG.md` for canonical Epic acceptance criteria, and `docs/PROJECT_MASTER_SPEC.md` for product requirements.

## 1. Executive Summary

The repository provides a useful technical scaffold but not yet a production platform. It has separate TypeScript packages for a public React frontend, React admin frontend, and Express backend. Basic English/Swedish localization, environment validation, JWT middleware, MongoDB initialization, email delivery, and a protected admin route are present.

Most product capabilities in `PROJECT_MASTER_SPEC.md` remain unimplemented. The largest gaps are the domain model and APIs, real authentication and authorization, content management, operational modules, GDPR controls, accessibility verification, automated coverage, and production operations.

Status definitions:

- **Partial:** a foundation exists, but the required workflow is incomplete.
- **Missing:** no meaningful implementation was found.
- **At risk:** existing code or documentation conflicts with production requirements.

## 2. Current Baseline

| Area | Evidence | Assessment |
| --- | --- | --- |
| Architecture | `backend/`, `frontend/`, and `admin/` are separate packages | Partial foundation |
| Public site | `frontend/src/pages/Home.tsx` contains one welcome view | Missing product experience |
| Localization | i18next loads `en` and `sv`; two strings exist | Partial |
| Backoffice | Login and management screens exist | At risk: authentication is client-only |
| Backend | MongoDB connection, JWT middleware, and `/message` endpoint | Partial technical spike |
| Testing | Environment and Zod validation unit tests | Partial, very limited |
| Documentation | Architecture, API, and environment documents exist | Partial |
| Accessibility | Language switcher and focus CSS show intent | Partial, unverified |

## 3. Capability Gap Matrix

| Required capability | Status | Primary gap | Priority |
| --- | --- | --- | --- |
| Modern bilingual ASK platform | Partial | No shared design system, complete navigation, content model, or bilingual workflow | Critical |
| English and Swedish support | Partial | Only two sample strings; admin, backend messages, metadata, content, and emails are not localized | Critical |
| Public website | Missing | Only a placeholder home page and route exist | Critical |
| Backoffice | Partial | No real server login, persisted session, roles, content tools, audit log, or module management | Critical |
| News & Blog | Missing | No schema, API, editor, publishing workflow, or public views | High |
| Events | Missing | No event model, registration, calendar, filters, or management workflow | High |
| What's Happening at Cor | Missing | No feed, scheduling, categories, pinning, or public display | High |
| Collaborations | Missing | No partner model, validity workflow, editor, or public directory | Medium |
| Booking System | Missing | No resources, availability, conflict rules, bookings, cancellations, or notifications | Critical |
| Tutor Module | Missing | No tutor, group, assignment, task, resource, or handover model | High |
| Governance Portal | Missing | No board, meeting, agenda, minutes, decision, policy, or document workflow | High |
| Student Representative Management | Missing | No position, term, assignment, vacancy, report, or reminder workflow | High |
| Knowledge Transfer System | Missing | No versioned knowledge records, ownership, review dates, access levels, or acknowledgment | High |
| AI-assisted Translation | Missing | No provider integration, draft/review states, safeguards, or translation audit metadata | Medium |
| GDPR compliance | Missing | No processing register, retention automation, privacy workflows, consent records, or data-subject tooling | Critical |
| WCAG 2.1 AA | Partial | No formal audit, component standard, accessibility tests, or complete user journeys | Critical |
| ASK color palette | Missing | Current UI uses generic blue/gray Tailwind colors; no brand tokens or contrast specification | High |

## 4. Architecture and Data Gaps

The backend has no application domain models beyond opening a MongoDB connection. Each required module needs documented entities, relationships, lifecycle states, indexes, validation, permissions, retention rules, and APIs. Cross-cutting models are also needed for users, roles, translations, media, audit events, notifications, and publication workflow.

API behavior is currently documented only for login and `/message`, while no login endpoint is implemented in `backend/src/index.ts`. A versioned API contract, consistent error envelope, pagination, filtering, idempotency strategy, and authorization policy are required.

The current backend entry point also contains apparent invalid source text around JWT decoding. This analysis does not change code, but the backend build should be treated as unverified until corrected and tested.

## 5. Security and Privacy Gaps

The admin `AuthContext` accepts any submitted credentials and stores authentication only in React memory. Protected routing is therefore cosmetic, and the admin interface must not be considered secure. There is no demonstrated password hashing, user store, role enforcement, token refresh or secure-cookie strategy, logout invalidation, rate limiting, account recovery, MFA, security headers, or audit trail.

GDPR readiness requires a data inventory and decisions before module implementation. Booking, tutor, representative, governance, and AI translation features may process personal or sensitive organizational information. Each needs a lawful purpose, access policy, retention schedule, deletion or anonymization behavior, processor review, privacy notice, and data-subject request process.

## 6. Accessibility and Design Gaps

The current language switcher uses an accessible component library and global focus styling, but this is insufficient evidence of WCAG 2.1 AA conformance. Forms lack visible labels, validation behavior is not demonstrated, and there are no automated accessibility checks or documented manual audits.

The required ASK colors are not represented as reusable tokens. Before broad UI work, contrast-safe foreground/background pairings, focus states, typography, spacing, components, and responsive patterns should be established for both public and admin applications.

## 7. Testing and Operations Gaps

Current tests cover environment presence and a standalone Zod schema. There are no API integration tests, database tests, authorization tests, frontend component tests, end-to-end tests, bilingual journey tests, accessibility tests, booking conflict tests, or privacy workflow tests. No coverage target is defined.

The repository does not demonstrate CI checks, migrations, seed data, deployment automation, observability, backup and restore procedures, incident response, scheduled jobs, or rollback plans. These are release prerequisites for a platform handling accounts and operational data.

## 8. Recommended Delivery Sequence

### Phase 0 — Stabilize the Foundation

Confirm the backend builds and tests, align documentation with implementation, define API conventions, choose authentication and session handling, establish database migration practices, add CI, and create ASK design tokens with accessibility checks.

### Phase 1 — Identity, Content, and Public Website

Implement users, roles, backend-enforced permissions, secure admin authentication, bilingual content primitives, media management, editorial workflow, public navigation, search, News & Blog, Events, Cor updates, and Collaborations.

### Phase 2 — Booking and Notifications

Implement resources, availability, conflict prevention, booking lifecycle, eligibility, confirmations, cancellations, staff calendar views, retention, and audit records.

### Phase 3 — Organizational Modules

Deliver Tutor, Governance, Student Representative, and Knowledge Transfer modules using shared permissions, documents, notifications, versioning, and bilingual content services.

### Phase 4 — AI Translation and Hardening

Add human-reviewed AI translation after content governance is stable. Complete GDPR assessment, accessibility audit, penetration testing, performance validation, disaster recovery testing, analytics governance, and production readiness review.

## 9. Immediate Next Deliverables

1. Domain model and data-classification document.
2. Role-permission matrix covering every module and action.
3. Information architecture and bilingual content model.
4. Authentication/session architecture decision.
5. Design tokens and WCAG-tested component inventory.
6. Versioned API specification with standard errors and pagination.
7. Phased backlog with acceptance criteria derived from the master specification.

