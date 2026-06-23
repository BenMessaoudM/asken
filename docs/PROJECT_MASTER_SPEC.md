# Arcada Student Union – ASK Platform Master Specification

## 1. Purpose

The Arcada Student Union – ASK platform is a modern, bilingual digital service for Arcada students, ASK staff, tutors, elected representatives, partners, and other stakeholders. It combines a public website with a secure backoffice and purpose-built operational modules.

The platform must be easy to maintain, accessible on mobile and desktop, privacy-conscious, and available in English and Swedish. English and Swedish content have equal status; neither language may be treated as optional.

## 2. Product Principles

- **Bilingual by design:** navigation, system messages, metadata, forms, emails, and managed content support English and Swedish.
- **Accessible by default:** all public and authenticated interfaces meet WCAG 2.1 AA.
- **One source of truth:** structured content is created once, translated, reviewed, published, and reused across relevant views.
- **Role-based access:** users only see data and actions required for their responsibilities.
- **Privacy by design:** collect the minimum personal data, define retention periods, and record access to sensitive information.
- **Mobile first:** core tasks must work on small screens without reduced functionality.

## 3. Brand and Visual System

The ASK color palette is:

| Token | Value | Intended use |
| --- | --- | --- |
| Primary | `#A32F8E` | Brand actions, links, active states |
| Primary light | `#CB52B5` | Highlights and supporting accents |
| Surface | `#F1E4E8` | Soft backgrounds and cards |
| Accent | `#E0C13D` | Notices, selected highlights, decorative accents |
| Ink | `#23212B` | Primary text and dark surfaces |

Color combinations must be contrast-tested. Meaning must never be communicated by color alone. The design system must also define typography, spacing, focus states, form controls, status styles, breakpoints, and reusable components.

## 4. Users and Permissions

The authorization model must support at least:

- **Public visitor:** reads public content and submits permitted forms or booking requests.
- **Student:** manages personal bookings and accesses eligible student services.
- **Tutor:** accesses tutor resources, assigned groups, tasks, and handover material.
- **Student representative:** manages assignments, reports, meetings, and continuity records.
- **Editor:** creates and translates content without managing system configuration.
- **Module manager:** manages one or more operational modules.
- **Administrator:** manages users, roles, settings, audit access, and all content.

Permissions must be enforced by the backend, not only hidden in the user interface.

## 5. Public Website

The public website must provide:

- Responsive global navigation, search, language switching, footer, and contact information.
- Structured landing pages and reusable content blocks.
- News, events, collaborations, services, governance, tutor, and booking entry points.
- Search-engine metadata, social sharing metadata, sitemap, and human-readable URLs.
- Published, scheduled, draft, archived, and preview content states.
- Clear empty, loading, validation, error, and success states.

## 6. Content Modules

### 6.1 News & Blog

Editors can create bilingual articles with title, summary, body, author, category, tags, hero media, publication date, and SEO metadata. Articles support drafts, previews, scheduled publishing, archiving, related content, and language-specific slugs.

### 6.2 Events

Events include bilingual title and description, start and end time, location, organizer, capacity, registration link or workflow, accessibility information, image, and status. Public views include upcoming and past events, filtering, calendar-friendly dates, and add-to-calendar links.

### 6.3 What's Happening at Cor

This section presents timely activity at Cor through a curated feed or schedule. Entries include bilingual content, date and time, location, category, visibility window, and optional link to an event or article. Editors can pin urgent or high-value items.

### 6.4 Collaborations

Collaboration profiles include bilingual name, description, logo, link, collaboration type, validity period, benefits, and visibility status. Expired collaborations must be automatically hidden or flagged for review.

## 7. Operational Modules

### 7.1 Booking System

The booking system manages bookable resources, availability rules, capacity, opening hours, blackout periods, pricing or eligibility, booking status, cancellations, and notifications. It must prevent conflicts and provide staff with calendar and list views. Personal data and booking history must follow explicit retention rules.

### 7.2 Tutor Module

The tutor module supports tutor profiles, cohorts or groups, assignments, schedules, tasks, resources, announcements, and handovers. Managers can assign tutors and monitor operational progress. Tutors only access groups and student information necessary for their assignment.

### 7.3 Governance Portal

The governance portal manages boards, committees, terms, meetings, agendas, minutes, decisions, policies, and public or restricted documents. It must preserve document versions and clearly distinguish approved records from drafts.

### 7.4 Student Representative Management

The module records representative positions, organizations or bodies, term dates, assigned students, contact preferences, status, reports, and vacancies. It supports onboarding, reminders, term transitions, and exportable administrative summaries.

### 7.5 Knowledge Transfer System

The knowledge system preserves operational continuity through bilingual guides, role handbooks, checklists, templates, decisions, lessons learned, and handover packages. Content has owners, review dates, version history, tags, access levels, and acknowledgment status where required.

## 8. Backoffice

The backoffice must provide:

- Secure authentication, password management, session expiry, and optional multi-factor authentication.
- Role-based dashboards and module navigation.
- Bilingual editing with translation completeness indicators and side-by-side review.
- Media library with accessible alternative text and usage information.
- Draft, review, approve, schedule, publish, archive, and restore workflows.
- Filtering, search, pagination, bulk actions, import, and export where operationally useful.
- Immutable audit records for authentication, permissions, publishing, and sensitive-data actions.

## 9. AI-Assisted Translation

AI translation may generate English or Swedish drafts from approved source content. It must:

- Clearly mark machine-generated text as awaiting human review.
- Preserve headings, links, structured fields, names, and formatting.
- Never publish automatically without an authorized reviewer.
- Avoid sending sensitive or restricted content to an external provider without an approved data-processing basis.
- Record source language, target language, provider, timestamp, reviewer, and approval state.
- Allow editors to reject, regenerate, or manually edit suggestions.

## 10. Accessibility

WCAG 2.1 AA is the release minimum. Requirements include semantic landmarks and headings, full keyboard operation, visible focus, skip navigation, correctly associated labels, meaningful link text, text alternatives, captions where applicable, zoom and reflow support, accessible validation, status announcements, reduced-motion support, and tested color contrast.

Automated checks must be complemented by keyboard, screen-reader, zoom, and high-contrast manual testing. Accessibility acceptance criteria apply to both the public website and backoffice.

## 11. GDPR, Security, and Data Governance

The platform must document lawful purpose, data categories, owners, processors, recipients, retention, and deletion behavior for every module. It must provide appropriate privacy notices, consent only where consent is the valid legal basis, data access and correction processes, deletion or anonymization workflows, and export support for data-subject requests.

Security controls include TLS, secure password hashing, least privilege, protected secrets, input validation, output encoding, CSRF and rate-limit protections where applicable, secure cookies or token handling, dependency monitoring, backups, restore testing, audit logging, and incident procedures. Production data must not be used in development without approved anonymization.

## 12. Technical and Quality Requirements

- Maintain separate public frontend, admin frontend, and backend services with documented APIs.
- Use structured persistence with migrations or versioned schema changes.
- Validate all inbound data and return consistent error responses.
- Provide automated unit and integration tests for permissions, workflows, validation, and conflict rules.
- Test critical user journeys end to end in both languages.
- Monitor availability, errors, performance, security events, and scheduled jobs.
- Define backup, recovery, deployment, rollback, and content migration procedures.
- Target responsive, performant pages with optimized media and sensible caching.

## 13. Definition of Done

A capability is complete only when its English and Swedish experiences, permissions, validation, error handling, accessibility, privacy behavior, audit needs, documentation, and automated tests are implemented and accepted. Placeholder screens, client-only authorization, and untranslated content do not satisfy completion.

