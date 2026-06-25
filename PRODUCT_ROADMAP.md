# ASK Platform Product Roadmap

**Roadmap date:** 2026-06-25

**Baseline:** 19% complete at audited commit `f055c2b`

**Product scope:** bilingual public website, student self-service, secure backoffice, and operational modules for Arcada Student Union – ASK

## 1. Roadmap Principles

This roadmap converts `docs/PROJECT_MASTER_SPEC.md`, `docs/TASK_BACKLOG.md`, and `docs/PROJECT_AUDIT_REPORT.md` into a value-based delivery sequence.

The releases are outcome-based rather than calendar commitments. A feature belongs in a release only when its English and Swedish experiences, backend permissions, validation, accessibility, privacy behavior, audit requirements, documentation, and automated tests satisfy the project Definition of Done.

Delivery priorities are:

1. Make ASK's essential information reliable and easy to publish.
2. Help students discover services, events, benefits, and activity at Cor.
3. Reduce manual work through booking and self-service.
4. Give board members and representatives traceable governance and continuity tools.
5. Add specialized operational modules only after shared foundations are stable.

Accessibility, GDPR, security, testing, and operations are release gates for every phase, not deferred standalone work.

## 2. Current Product Baseline

### Implemented and usable foundations

- Public Home page
- Public News list and detail pages
- Public Events list and detail pages
- Public not-found page
- Public header, language switcher, footer, and contact section
- Secure admin login, session refresh, logout, and password change
- Admin dashboard shell with permission-aware navigation
- User and role management
- Generic CMS list and editor
- News administration
- Events administration
- Public and administrative Booking workflows
- Backend health/readiness, migrations, seed, and CI foundations

### Present only as placeholders or previews

- What's Happening at Cor
- Collaborations
- Governance
- Platform settings

### Not yet implemented as product capabilities

- Complete bilingual CMS and admin interface
- Full editorial workflow and media library
- Public service and institutional information architecture
- Student self-service accounts
- Tutor operations
- Student representative management
- Knowledge transfer
- AI-assisted translation
- GDPR operational tooling
- Production deployment, observability, backup, and recovery

## 3. Required Website Page Inventory

The page inventory separates public information pages from authenticated self-service routes. All public content and system states must be available in English and Swedish.

### 3.1 Global and Utility Pages

| Page | Purpose | Target release |
| --- | --- | --- |
| Home | Main entry point with current News, Events, Cor activity, services, and calls to action | MVP |
| Site search | Search published pages, News, Events, services, collaborations, and public governance records | MVP |
| Search results | Filtered, paginated results with clear empty and error states | MVP |
| Contact | General contact details, location, channels, and anti-harassment contact | MVP |
| About ASK | Mission, organization, people, and how ASK serves students | MVP |
| Accessibility statement | Accessibility status, known issues, and feedback route | MVP |
| Privacy and data protection | General privacy notice and links to service-specific notices | MVP |
| Cookie/analytics information | Explain non-essential processing if analytics or optional cookies are used | MVP when applicable |
| Error and status pages | 404, unauthorized, forbidden, service unavailable, and generic error states | MVP |

### 3.2 Student Services and Membership

| Page | Purpose | Target release |
| --- | --- | --- |
| Services landing | Searchable overview of ASK services and support | MVP |
| Service detail | Structured description, eligibility, instructions, contact, and related content | MVP |
| Membership | Benefits, eligibility, fees/process where applicable, and external membership action | MVP |
| Student support and advocacy | Guidance, rights, support contacts, and escalation paths | MVP |
| Anti-harassment support | Clear confidential contact and support information | MVP |
| Facilities and Cor | Location, opening information, accessibility, facilities, and practical guidance | MVP |

### 3.3 News and Blog

| Page | Purpose | Target release |
| --- | --- | --- |
| News list | Published and scheduled-visible articles with search, category, tag, and pagination | MVP |
| News article | Bilingual article, author, dates, media, SEO metadata, and related content | MVP |
| News category archive | Articles filtered by category | MVP |
| News tag archive | Articles filtered by tag | MVP |
| Article preview | Authorized preview of unpublished content | MVP |

### 3.4 Events

| Page | Purpose | Target release |
| --- | --- | --- |
| Events list | Upcoming and past events with date, category, and location filtering | MVP |
| Event detail | Dates, location, organizer, accessibility, capacity, status, registration, and calendar action | MVP |
| Event calendar | Calendar-oriented view of published events | MVP |
| Event registration handoff/status | Registration link or confirmation/status page depending on the configured workflow | MVP |
| Event preview | Authorized preview of unpublished events | MVP |

### 3.5 What's Happening at Cor

| Page | Purpose | Target release |
| --- | --- | --- |
| Cor activity feed | Current, upcoming, pinned, and recently completed activity | MVP |
| Cor activity detail | Optional detail view when an entry requires more than the feed card | MVP |

### 3.6 Collaborations and Benefits

| Page | Purpose | Target release |
| --- | --- | --- |
| Collaborations directory | Active partners and student benefits with filtering | MVP |
| Collaboration detail | Description, benefits, validity, accessible logo, and secure external link | MVP |

### 3.7 Booking and Student Self-Service

| Page | Purpose | Target release |
| --- | --- | --- |
| Booking landing | Explain available resources, eligibility, rules, and booking process | Version 1.0 |
| Resource directory | Search and filter bookable rooms, facilities, or equipment | Version 1.0 |
| Resource detail | Capacity, accessibility, rules, price/eligibility, and availability | Version 1.0 |
| Availability search | Date/time availability across eligible resources | Version 1.0 |
| Booking form | Create a conflict-checked booking request | Version 1.0 |
| Booking confirmation | Show confirmed or pending state and next actions | Version 1.0 |
| My bookings | Authenticated list of current and historical personal bookings | Version 1.0 |
| Booking detail | Booking status, resource, time, policy, and audit-safe actions | Version 1.0 |
| Cancel booking | Confirm cancellation and show policy consequences | Version 1.0 |
| Student sign-in | Authenticate students for self-service capabilities | Version 1.0 |
| Account recovery/reset | Recover access without administrator intervention | Version 1.0 |
| Account/profile | Minimum necessary identity and communication preferences | Version 1.0 |

### 3.8 Governance and Representation

| Page | Purpose | Target release |
| --- | --- | --- |
| Governance landing | Explain ASK governance and expose public bodies, meetings, decisions, and policies | Version 1.0 |
| Boards and committees directory | Browse governance bodies and current terms | Version 1.0 |
| Governance body detail | Mandate, membership, term, meetings, and public documents | Version 1.0 |
| Meetings list | Browse public meetings by body, date, and status | Version 1.0 |
| Meeting detail | Agenda, approved minutes, decisions, and public attachments | Version 1.0 |
| Decisions directory | Search approved public decisions | Version 1.0 |
| Decision detail | Decision text, approval metadata, source meeting, and attachments | Version 1.0 |
| Policies and documents | Search public policies and approved governance records | Version 1.0 |
| Policy/document detail | Current approved version and superseded-version context | Version 1.0 |
| Student representatives directory | Browse current representatives by organization/body | Version 1.0 |
| Representative position detail | Role, term, vacancy state, and appropriate contact route | Version 1.0 |
| Representative vacancies | Open positions and application/onboarding entry points | Version 1.0 |
| Representative self-service | Authenticated assignments, reports, onboarding, and term actions | Version 1.0 |

### 3.9 Tutor Services

| Page | Purpose | Target release |
| --- | --- | --- |
| Tutor information | Public explanation of tutoring, support, and contact paths | Version 1.5 |
| Tutor resources landing | Authenticated entry point for assigned tutors | Version 1.5 |
| My tutor groups | Assigned cohorts/groups with scoped access | Version 1.5 |
| Tutor group detail | Schedule, tasks, announcements, and minimum necessary student information | Version 1.5 |
| Tutor tasks | Assigned work, deadlines, and completion status | Version 1.5 |
| Tutor resources | Guides, documents, and role material | Version 1.5 |
| Tutor handover | Assigned handover package and acknowledgment | Version 1.5 |

### 3.10 Knowledge and Continuity

| Page | Purpose | Target release |
| --- | --- | --- |
| Knowledge library | Authenticated search across guides, checklists, templates, and lessons learned | Version 1.5 |
| Knowledge record | Current approved content, owner, review date, tags, and revision context | Version 1.5 |
| Handover package | Role-specific transition package with acknowledgment | Version 1.5 |
| My acknowledgments | Outstanding and completed required reading | Version 1.5 |

### 3.11 Data Rights

| Page | Purpose | Target release |
| --- | --- | --- |
| Service-specific privacy notice | Explain data use at every personal-data collection point | With the relevant service |
| Data request form/status | Request access, correction, export, restriction, or deletion | Version 1.0 |
| Consent/preferences | Manage only consent-based processing and communication preferences | Version 1.0 when applicable |

## 4. Required Admin Module Inventory

### 4.1 Platform Administration

| Module | Core responsibilities | Target release |
| --- | --- | --- |
| Dashboard | Role-specific workload, publishing, operational alerts, and shortcuts | MVP |
| Users | Accounts, status, roles, scoped assignments, and session revocation | MVP |
| Roles and permissions | Required role templates and backend permission mappings | MVP |
| Authentication security | Password reset, recovery, MFA, lockout controls, and session management | MVP |
| Audit log | Search and review authentication, permission, publishing, download, and sensitive-data events | MVP |
| Settings | Languages, contact details, organization metadata, time zone, feature settings, and integrations | MVP |
| Navigation and redirects | Public menus, footer links, URL redirects, and retired routes | MVP |
| Notifications | Bilingual templates, delivery status, preferences, and retry/failure handling | Version 1.0 |

### 4.2 Shared Content Operations

| Module | Core responsibilities | Target release |
| --- | --- | --- |
| Pages/CMS | Bilingual structured landing and service pages | MVP |
| Editorial workflow | Draft, review, approve, schedule, publish, archive, restore, and preview | MVP |
| Translation workflow | Side-by-side editing, completeness, review, and stale-source indicators | MVP |
| Media library | Upload, validation, alternative text, reuse, ownership, and usage references | MVP |
| Taxonomies | Shared categories, tags, and controlled vocabularies | MVP |
| SEO and metadata | Titles, descriptions, social images, canonical URLs, alternate languages, and sitemap inclusion | MVP |
| Site search management | Search indexing status, synonyms, promoted results, and diagnostics | MVP |

### 4.3 Public Content Modules

| Module | Core responsibilities | Target release |
| --- | --- | --- |
| News and Blog | Bilingual articles, authors, taxonomy, scheduling, related content, and archive | MVP |
| Events | Event details, capacity, accessibility, registration, scheduling, status, and calendar output | MVP |
| Cor Activities | Timed entries, pinning, ordering, visibility windows, and related links | MVP |
| Collaborations | Partner profiles, benefits, validity, expiry review, and public visibility | MVP |
| Services | Structured student services and support information | MVP |

### 4.4 Operational Modules

| Module | Core responsibilities | Target release |
| --- | --- | --- |
| Booking resources | Resources, capacity, accessibility, eligibility, pricing, and policies | Version 1.0 |
| Booking availability | Opening hours, recurring rules, blackout periods, and conflict prevention | Version 1.0 |
| Booking operations | Requests, approval, cancellation, no-show/completion, calendar/list views, and audit | Version 1.0 |
| Governance | Bodies, terms, memberships, meetings, agendas, minutes, decisions, policies, and access levels | Version 1.0 |
| Student representatives | Organizations, positions, assignments, vacancies, onboarding, reports, transitions, and exports | Version 1.0 |
| Tutor management | Tutor profiles, cohorts, groups, assignments, schedules, tasks, announcements, and handovers | Version 1.5 |
| Knowledge transfer | Guides, handbooks, checklists, templates, review dates, versions, access, and acknowledgments | Version 1.5 |

### 4.5 Compliance and Automation

| Module | Core responsibilities | Target release |
| --- | --- | --- |
| Data governance register | Purpose, legal basis, data categories, owners, processors, recipients, and retention | MVP baseline; complete by Version 1.0 |
| Data-subject requests | Access, correction, export, restriction, deletion, and anonymization workflow | Version 1.0 |
| Retention and legal holds | Policy execution, exceptions, auditable jobs, and deletion/anonymization results | Version 1.0 |
| AI translation | Provider abstraction, safe eligibility checks, generation, human review, approval, and audit metadata | Version 2.0 |
| Operations console | Health, job status, integration failures, and operational diagnostics | Version 1.0 |

## 5. Release Roadmap

## MVP — Reliable Bilingual Communications Platform

### Product outcome

Students can reliably find ASK information, services, current News, Events, activity at Cor, and partner benefits in English or Swedish. Editors can maintain the website without developer intervention. The platform can be deployed and operated safely.

### Included scope

- Complete Epic 2 security gaps required for editors and administrators:
  - password reset and account recovery
  - least-privilege seeded roles
  - privileged-account MFA
  - account lockout/progressive protection
  - documented CSRF and session-revocation policy
- Complete Epic 3 bilingual foundation:
  - shared translation model
  - bilingual admin interface
  - persisted locale
  - localized URLs/slugs
  - translation completeness and review state
  - bilingual system messages and emails
- Complete shared portions of Epics 4 and 5:
  - accessible design system
  - complete public navigation and information architecture
  - service, contact, about, privacy, and accessibility pages
  - site search
  - media library
  - editorial review/approval/preview/archive/restore
  - SEO, social metadata, canonical URLs, and sitemap
- Finish News and Events against their acceptance criteria.
- Implement What's Happening at Cor.
- Implement Collaborations.
- Add the Services content module.
- Establish GDPR records and privacy notices for all MVP data.
- Add MongoDB integration tests, public/admin component tests, bilingual browser E2E, and accessibility checks.
- Add repeatable deployment/rollback, monitoring, and backup/restore procedures.

### MVP release gate

- Every MVP public page works in English and Swedish.
- An editor can create, review, preview, schedule, publish, archive, and restore content.
- Critical public and admin journeys pass browser E2E and accessibility checks.
- Production monitoring, backup, rollback, and incident ownership are documented and exercised.

## Version 1.0 — Student Self-Service and Governance

### Product outcome

Students can book ASK resources and manage their bookings. Board members, representatives, and the public can find authoritative governance records, while restricted material remains protected.

### Included scope

- Student authentication and minimum profile/self-service capability.
- Complete Booking System:
  - resources and policies
  - availability and blackout rules
  - concurrency-safe conflict prevention
  - requests, confirmations, cancellations, and staff operations
  - bilingual notifications
  - retention and booking-history controls
- Complete Governance Portal:
  - bodies, memberships, terms, meetings, agendas, minutes, decisions, policies, and attachments
  - approval and immutable-version workflows
  - public/restricted access boundaries
- Complete Student Representative Management:
  - positions, assignments, vacancies, onboarding, term transitions, reports, reminders, and exports
- Shared notification service for booking, governance, and representative workflows.
- Data-subject request management, retention execution, anonymization, and legal holds.
- Operations console and scheduled-job monitoring.

### Version 1.0 release gate

- Booking conflict and capacity rules pass database-level concurrency tests.
- Public governance records cannot expose restricted documents.
- Approved governance records retain immutable revisions and approval metadata.
- Representative and booking personal data follow tested access and retention rules.
- Student and board-member critical journeys pass in both languages.

## Version 1.5 — Tutor Operations and Organizational Continuity

### Product outcome

Tutors and ASK role holders can perform assigned work with scoped access, and organizational knowledge survives annual staff, tutor, board, and representative transitions.

### Included scope

- Complete Tutor Module:
  - profiles, cohorts, groups, assignments, schedules, tasks, resources, announcements, and handovers
  - assignment-scoped access to minimum necessary student data
- Complete Knowledge Transfer System:
  - guides, handbooks, checklists, templates, decisions, lessons learned, and handover packages
  - ownership, review dates, version history, tags, access levels, and acknowledgment
- Connect representative, governance, and tutor transitions to reusable handover packages.
- Add stale-content reminders and ownership dashboards.
- Expand reporting and exports for operational managers.
- Improve cross-module search across governance, knowledge, services, News, and Events.

### Version 1.5 release gate

- Tutor access boundaries and term transitions pass integration and E2E tests.
- Restricted knowledge records are permission-protected and audited.
- Handover assignments and acknowledgments preserve immutable source records.
- Overdue reviews and transition tasks generate reliable bilingual reminders.

## Version 2.0 — Assisted Workflows and Platform Optimization

### Product outcome

ASK can scale bilingual content and operations with controlled automation, mature governance, and measurable service quality.

### Included scope

- AI-assisted translation:
  - approved provider abstraction
  - content eligibility and redaction rules
  - English/Swedish draft generation
  - human review, rejection, regeneration, and approval
  - provider/model/request/reviewer audit metadata
  - no automatic publishing
- Advanced workflow automation across publishing, reminders, expirations, and reviews.
- Advanced search relevance, recommendations, and related-content management.
- Operational analytics with privacy-respecting measurement.
- Mature service-level indicators, alerting, capacity planning, and recurring disaster-recovery exercises.
- Policy-driven lifecycle management across all modules.
- Optional future integrations validated by actual operational need.

### Version 2.0 release gate

- AI translation cannot process restricted data without an approved policy and cannot publish without human approval.
- Automation failures are observable, recoverable, and audited.
- Platform-wide retention and data-subject workflows cover every active module.
- Availability, latency, error, and job-health objectives are measured and reviewed.

## 6. Recommended Implementation Order

The sequence below maximizes early student value while avoiding rework in later modules.

1. **Bilingual content foundation**
   - Unify translation storage, review state, locale persistence, localized URLs, and admin localization.
   - Reason: every public and operational module depends on this contract.

2. **Editorial workflow and media**
   - Add preview, review, approval, scheduling, archive/restore, media management, and immutable audit behavior.
   - Reason: News, Events, Cor, Collaborations, Services, Governance, and Knowledge all reuse it.

3. **Accessibility, test, and production gates**
   - Add browser E2E, MongoDB integration tests, accessibility automation/manual checks, deployment, monitoring, rollback, and backup.
   - Reason: expanding scope before these controls increases regression and operational risk.

4. **Complete the public information architecture**
   - Deliver About, Services, Membership, Support, Contact, Privacy, Accessibility, search, metadata, and sitemap.
   - Student value: essential information becomes discoverable without staff assistance.

5. **Finish News and Events**
   - Close the remaining workflow, metadata, pagination, accessibility, capacity, registration, and calendar gaps.
   - Student value: reliable current communications and participation information.

6. **Deliver Cor Activities and Collaborations**
   - These are small, high-visibility modules that reuse the completed content foundation.
   - Student value: immediate campus awareness and tangible member benefits.

7. **Complete identity for student self-service and notifications**
   - Add student roles, recovery, scoped profiles, notification preferences, and reusable bilingual delivery.
   - Dependency: required before Booking and representative self-service.

8. **Implement Booking**
   - Build resource policy and availability first, then conflict-safe lifecycle, staff operations, and student pages.
   - Student value: substantial reduction in manual coordination and direct self-service benefit.

9. **Implement Governance**
   - Build bodies/terms, then meetings, documents, decisions, approval/versioning, and public publication.
   - Board value: authoritative records, traceability, and reduced document fragmentation.

10. **Implement Student Representative Management**
    - Reuse identity, governance bodies, notifications, audit, and exports.
    - Student and board value: visible vacancies, controlled assignments, and reliable term transitions.

11. **Implement Knowledge Transfer**
    - Establish reusable approved records, review dates, ownership, and acknowledgment before tutor handovers.
    - Board value: continuity through annual transitions.

12. **Implement Tutor Module**
    - Reuse scoped identity, notifications, documents, and knowledge handovers.
    - Student value: better organized tutor support with minimum necessary data access.

13. **Add AI-assisted translation**
    - Introduce only after translation, review, privacy, and audit models are stable.
    - Value: editorial efficiency without weakening human approval or data protection.

## 7. Module Dependencies

### Shared dependency layers

| Foundation | Direct dependents | Dependency reason |
| --- | --- | --- |
| Identity and RBAC | All admin modules, Booking, Tutor, Governance, Representatives, Knowledge | Authentication, backend permissions, scoped access, and actor identity |
| Bilingual content model | Pages, News, Events, Cor, Collaborations, Governance, Knowledge, notifications, AI translation | Equal English/Swedish content, revision tracking, and fallback rules |
| Editorial workflow | Pages, News, Events, Cor, Collaborations, Governance, Knowledge | Shared review, approval, scheduling, publishing, archive, and restore states |
| Media library | Pages, News, Events, Collaborations, Governance, Knowledge | Safe files, alternative text, reuse, usage tracking, and storage policy |
| Audit service | Identity, CMS, Booking, Governance, Representatives, Tutor, Knowledge, GDPR, AI | Traceability for sensitive and authoritative actions |
| Notification service | Events, Booking, Representatives, Tutor, Knowledge | Bilingual confirmations, reminders, changes, and failure handling |
| Search/indexing | Public site, Governance, Knowledge, Services | Cross-content discovery and consistent visibility rules |
| GDPR/retention framework | Identity, Booking, Representatives, Tutor, Governance, Knowledge, AI | Purpose, access, retention, deletion/anonymization, and subject rights |
| Testing/accessibility/operations | Every module | Definition of Done and safe release operation |

### Operational dependency rules

- **Cor Activities** depends on bilingual content, editorial workflow, and optional News/Event references.
- **Collaborations** depends on bilingual content, media, editorial workflow, and expiry handling.
- **Booking** depends on student identity, notifications, audit, retention, time-zone rules, and transaction-safe persistence.
- **Governance** depends on identity, object-level permissions, media/documents, editorial approval, immutable versions, audit, and public publishing.
- **Student Representatives** depends on users, governance bodies/terms, notifications, audit, exports, and retention.
- **Knowledge Transfer** depends on governance-grade versioning, scoped permissions, search, notifications, and acknowledgment events.
- **Tutor** depends on scoped identity, notifications, knowledge records, retention, and assignment-based permissions.
- **AI Translation** depends on the final bilingual content model, human review workflow, audit metadata, provider governance, and data-classification rules.

## 8. Scope Controls

The following rules prevent releases from becoming collections of incomplete placeholders:

- Do not begin a new domain module until its required shared foundations are production-ready.
- Do not expose placeholder modules in production navigation.
- Do not treat a public page as complete when only an API or admin screen exists.
- Do not treat client-side permission hiding as authorization.
- Do not release personal-data workflows without privacy notices, retention behavior, exports, and tested access boundaries.
- Do not introduce AI translation before human review and data-governance controls exist.
- Do not classify a release as complete without bilingual E2E and accessibility evidence for its critical journeys.

## 9. Recommended Next Delivery

Start the MVP with **Epic 3 — Bilingual Content and Localization**, followed immediately by the shared editorial workflow, media, accessibility, testing, and production-operation work from Epics 5, 17, and 18.

This order creates a stable platform for completing News and Events and then delivering Cor Activities, Collaborations, Booking, and Governance without duplicating translation, publication, permission, media, or audit logic.
