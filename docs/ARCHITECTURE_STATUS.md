# Architecture Status

## Current Completion

**Estimated project completion: 23%.**

This is a weighted product-readiness estimate, not a count of files or epics. The platform foundation and core administration security are now substantial, but the public experience, bilingual content system, publishing modules, operational modules, compliance workflows, and production operations remain largely unimplemented.

## Completed Epics

### Epic 1 — Platform Foundation and API Standards

Implemented versioned APIs, standard response and error conventions, request IDs, environment validation, health and readiness endpoints, MongoDB migrations, seed tooling, shared entity contracts, package locks, CI checks, tests, and build documentation.

### Epic 2 — Identity, Authentication, and Authorization

Implemented MongoDB-backed users, roles, permissions, role-permission mappings, bcrypt password hashing, JWT access and rotating refresh tokens, HttpOnly cookies, protected routes, permission middleware, login, logout, refresh, password changes, Super Admin seeding, audit logging, session persistence, route guards, permission guards, and user/role management screens.

## Remaining Epics

1. Epic 3 — Bilingual Content and Localization
2. Epic 4 — ASK Design System and Public Website
3. Epic 5 — Backoffice Content Management
4. Epic 6 — News and Blog
5. Epic 7 — Events
6. Epic 8 — What's Happening at Cor
7. Epic 9 — Collaborations
8. Epic 10 — Booking System
9. Epic 11 — Tutor Module
10. Epic 12 — Governance Portal
11. Epic 13 — Student Representative Management
12. Epic 14 — Knowledge Transfer System
13. Epic 15 — AI-Assisted Translation
14. Epic 16 — GDPR and Data Governance
15. Epic 17 — WCAG 2.1 AA Accessibility
16. Epic 18 — Testing, Delivery, and Production Operations

## Technical Debt

- Epic 2 does not yet provide password-reset/account-recovery or multi-factor authentication.
- Mongo-backed service behavior is covered through HTTP service doubles, but dedicated database integration tests are still needed.
- Admin pages have production builds but no component or browser end-to-end tests.
- Refresh-token reuse detection revokes the matching session but not a wider token family.
- Audit events are persisted, but no audit-log administration page or retention policy exists.
- API list endpoints do not yet apply the shared pagination convention.
- `GAP_ANALYSIS.md` and `roadmap.md` still contain pre-Epic-1 completion assumptions.
- Accessibility automation, observability, backup testing, rollback automation, and deployment environments remain incomplete.

## Risks

- Starting content modules before Epic 3 would create duplicated or incompatible translation storage.
- Cookie authentication requires correct HTTPS, proxy, domain, SameSite, and CORS configuration in every deployment.
- The initial Super Admin credentials must be replaced and rotated securely after seeding.
- GDPR requirements are not yet modeled for identity audit retention, exports, deletion, or legal holds.
- Lack of browser-level tests leaves session-refresh and administrative workflow regressions possible.
- Most user-facing value remains absent despite the stronger technical foundation.

## Recommended Next Epic

**Epic 3 — Bilingual Content and Localization.**

Epic 3 is the highest-priority dependency because every public page, backoffice workflow, managed content type, email, metadata field, and later AI translation feature must support English and Swedish. Establishing translation storage, lifecycle states, locale persistence, URL strategy, fallback behavior, and completeness validation now prevents extensive schema and UI rework in Epics 4–9 and 15.

Epic 3 should also define bilingual test fixtures and critical journey checks, while leaving visual-system and publishing workflow implementation to their respective later epics.
