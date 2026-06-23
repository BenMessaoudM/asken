# Local CORS Fix Report

## Problem

The admin application was loaded from `http://127.0.0.1:5174`, while the backend CORS configuration only recognized the configured `localhost` origins. The preflight response returned `204` but omitted `Access-Control-Allow-Origin` for `127.0.0.1`, causing the browser to block authentication.

A second local-development risk was that an admin page on `127.0.0.1` called an API on `localhost`. Those are different browser sites, which can prevent SameSite authentication cookies from working even after CORS succeeds.

## Changes

- Added a centralized backend CORS configuration in `backend/src/http/cors.ts`.
- Added these development-only origins:
  - `http://127.0.0.1:5174`
  - `http://localhost:5174`
  - `http://127.0.0.1:5173`
  - `http://localhost:5173`
- Kept production restricted to `FRONTEND_URL` and `ADMIN_URL`; development origins are not added in production.
- Enabled credentials and explicitly allowed standard API methods and request headers.
- Updated the admin API client to use the browser hostname by default:
  - Admin on `127.0.0.1` calls API on `127.0.0.1:3000`.
  - Admin on `localhost` calls API on `localhost:3000`.
- Preserved `VITE_API_URL` as an explicit override.
- Added CORS allowlist unit tests.

## Verification

All required `OPTIONS /api/v1/auth/login` preflights returned `204 No Content` with the matching `Access-Control-Allow-Origin` and `Access-Control-Allow-Credentials: true`.

`POST /api/v1/auth/login` from origin `http://127.0.0.1:5174` returned `200 OK`, returned the matching allow-origin header, and set two HttpOnly session cookies. A subsequent credentialed `GET /api/v1/auth/me` returned the authenticated Super Admin session.

The admin panel returned `200 OK` at `http://127.0.0.1:5174` and the backend was running on port `3000`.

Validation results:

- Backend typecheck: passed.
- Backend tests: 8 suites, 22 tests passed.
- Backend build: passed.
- Admin tests: 3 suites, 6 tests passed.
- Admin build: passed.

## Local URLs

- Admin: `http://127.0.0.1:5174`
- API: `http://127.0.0.1:3000/api/v1`
- API via localhost remains allowed: `http://localhost:3000/api/v1`
