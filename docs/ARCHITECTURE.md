# System Architecture

## Packages

- `backend/` — Express 5 and TypeScript API, MongoDB persistence, migrations, and email integration.
- `frontend/` — public React, Vite, TypeScript, React Query, and i18next application.
- `admin/` — separate React and Vite backoffice application.
- `docs/` — contracts, environment, data model, migration, product, and delivery documentation.

The clients communicate with the backend through versioned JSON APIs. They remain independently buildable and deployable.

## Backend Structure

- `src/app.ts` creates the HTTP application without connecting or listening, enabling isolated tests.
- `src/server.ts` validates configuration, connects to MongoDB, configures SMTP, and starts HTTP.
- `src/http/` contains shared error and list-query conventions.
- `src/domain/entities.ts` defines cross-cutting entity contracts.
- `src/database/` contains migration and development seed tooling.

Liveness is exposed at `/api/v1/health`; readiness at `/api/v1/readiness` reflects MongoDB connectivity. API errors use a standard envelope and request ID.

## Schema Evolution

MongoDB changes use ordered migrations recorded in `_migrations`. Shared baseline collections are users, roles, translations, media, audit events, and notifications. Later epics own feature-specific schemas and behavior.

## Internationalization and Accessibility

The public frontend initializes English and Swedish through i18next, with Swedish as default and English as fallback. Language resources live under `frontend/src/locales/<locale>/translation.json`.

WCAG 2.1 AA is the project release target. Current components are only a foundation; each feature must add automated and manual accessibility verification under its own acceptance criteria.

## Delivery

GitHub Actions builds all packages. Backend CI also type-checks and runs Jest tests. Local and CI installs use committed package locks and Node.js 20 or later.
