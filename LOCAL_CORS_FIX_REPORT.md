# Local CORS Fix Report

## Cause

The backend was not running on `127.0.0.1:3000`, so the browser's login preflight could not connect and surfaced the failure as CORS. The CORS allowlist already named the required admin origins, but preflight behavior was not covered by an end-to-end regression test.

## Changes

- Kept local development origins explicitly allowed:
  - `http://127.0.0.1:5174`
  - `http://localhost:5174`
- Applied local origins in all non-production environments so integration tests exercise the same behavior.
- Explicitly configured CORS to terminate successful preflights with `204 No Content`.
- Added integration coverage for `OPTIONS /api/v1/auth/login` from both admin origins.
- Kept production restricted to configured `FRONTEND_URL` and `ADMIN_URL`.

## Verification

- Both live preflight requests returned `204`.
- Each response returned its matching `Access-Control-Allow-Origin`.
- Credentialed requests are enabled with `Access-Control-Allow-Credentials: true`.
- Live `POST /api/v1/auth/login` from `http://127.0.0.1:5174` returned `200` and an authenticated Super Admin session.
- Backend CORS/auth tests and typecheck passed.

## Local URLs

- Admin: `http://127.0.0.1:5174`
- API: `http://127.0.0.1:3000/api/v1`
