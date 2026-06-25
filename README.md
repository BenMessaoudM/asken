# Arcada Student Union – ASK

The Arcada Student Union – ASK platform contains an Express/TypeScript backend, a bilingual public React website, and a React administration application.

## Setup

Prerequisites: Node.js 20+, npm, MongoDB, and SMTP.

```sh
cp .env.example .env
cd backend && npm ci && npm run migrate && npm run seed
cd ../frontend && npm ci
cd ../admin && npm ci
```

Use strong independent JWT secrets and a policy-compliant initial Super Admin password in `.env`. Start each package with `npm run dev` from its directory.

## Public website

Release v0.5 provides the bilingual public website. Release v0.6 replaces the Booking placeholder with a resource catalogue, availability, request, confirmation, and status workflow; see `docs/BOOKING_SYSTEM.md`. Published CMS pages use locale-specific slugs such as `home-en` and `home-sv`; see `docs/PUBLIC_WEBSITE.md`.

## Authentication

The admin application uses HttpOnly access and rotating refresh cookies. Tokens are not stored in localStorage. Users, roles, permissions, refresh sessions, and audit events are persisted in MongoDB. See `docs/AUTHENTICATION.md` and `docs/API_CONTRACT.md`.

## Validation

```sh
cd backend && npm run typecheck && npm test && npm run build
cd ../frontend && npm run build
cd ../admin && npm test && npm run build
```

GitHub Actions also runs production dependency audits. The project is licensed under the [MIT License](LICENSE).
