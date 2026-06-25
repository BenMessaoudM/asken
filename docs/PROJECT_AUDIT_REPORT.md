# ASK Platform Project Audit Report

**Audit date:** 2026-06-25
**Audited commit:** `f055c2b` (`main`, matching `origin/main`)
**Audit scope:** repository state, implemented code, builds, tests, local runtime, authentication, CMS, public News and Events, documentation, security, and Epic completion
**Change policy:** no application code was changed; only this report was added

## Executive Summary

**Estimated overall completion: 19%.**

The repository contains a working three-application foundation, MongoDB-backed administration authentication and authorization, a generic CMS foundation, bilingual News and Events administration, and public Home, News, and Events pages. Builds and current automated tests pass. Live local verification also passed for backend startup/readiness, local CORS, secure-cookie login and refresh, protected administration access, CMS publishing/version history, public News, and public Events.

The product is not production-ready against `PROJECT_MASTER_SPEC.md`. Only Epic 1 is sufficiently complete to classify as delivered. Identity, localization, public website, CMS, News, Events, accessibility, and delivery operations are partial. Epics 8–16 do not exist as usable product capabilities.

The 19% result uses the midpoint of each estimate in `docs/TASK_BACKLOG.md`, multiplied by the audited completion percentage for that Epic:

- Earned weighted points: **88.1**
- Total weighted points: **456**
- Completion: **19.3%**, rounded to **19%**

This agrees with `docs/PROJECT_STATUS.md`. That document is substantially accurate for the audited commit, although its test count is stale: the backend now has 38 passing tests rather than 35.

## Repository State

| Check | Result |
| --- | --- |
| Branch | `main` |
| Upstream state | `HEAD`, `origin/main`, and `origin/HEAD` all at `f055c2b` |
| Initial worktree | Clean |
| Initial uncommitted changes | None |
| Latest commit | `f055c2b` — 2026-06-24 — `fix: configure local CORS and complete public website foundation` |
| Previous commits | `d8b5aba`, `1ce1379`, `3548942`, `4897e48`, `293250e`, `5a9044b`, `7e9a6b9` |
| Runtime used | Node.js `v22.14.0`, npm `11.6.0` |
| Local database | MongoDB active on `127.0.0.1:27017` |
| Dependency installation | `node_modules` present in backend, admin, and frontend |

### Package Scripts

**Backend**

- `npm run build` — TypeScript production build
- `npm run typecheck` — TypeScript validation without output
- `npm start` — run compiled backend
- `npm run dev` — run backend with `backend/.env`
- `npm test` — Jest test suite
- `npm run migrate` — MongoDB migrations
- `npm run seed` — development permissions and Super Admin seed
- `npm run smtp:dev` — local SMTP sink

**Admin**

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm test`

**Frontend**

- `npm run dev`
- `npm run build`
- `npm run preview`

The public frontend has no test script.

## Verification Results

| Area | Result | Evidence and limitation |
| --- | --- | --- |
| Backend typecheck | Pass | `tsc --noEmit` |
| Backend build | Pass | `tsc` |
| Backend tests | Pass | 10 suites, 38 tests |
| Admin build | Pass | TypeScript and Vite production build |
| Admin tests | Pass | 6 suites, 11 tests; Vite emitted non-failing deprecated esbuild-option warnings |
| Frontend build | Pass | TypeScript and Vite production build |
| Frontend tests | Not available | No test script or frontend test files |
| Production dependency audit | Pass | Zero known vulnerabilities in all three packages |
| Backend startup | Pass | Listening on port 3000 |
| Liveness | Pass | `/api/v1/health` returned 200 |
| Readiness | Pass | `/api/v1/readiness` returned 200 with MongoDB connected |
| Admin route availability | Pass | `/login` returned 200 from Vite |
| Public route availability | Pass | `/`, `/news`, and `/events` returned 200 from Vite |
| Local CORS | Pass | Credentialed origins for both `127.0.0.1` and `localhost` frontend/admin ports are configured; preflight returned 204 |
| Unknown CORS origin | Pass | Response omitted `Access-Control-Allow-Origin` |
| Protected API | Pass | Unauthenticated admin CMS request returned 401 |
| Authentication | Pass | Login, `/auth/me`, refresh rotation, authorized admin request, and logout passed against MongoDB |
| Cookie controls | Pass | Both session cookies were `HttpOnly` and `SameSite=Lax`; production forces `Secure` |
| CMS | Pass with scope limits | Live create, publish, detail, and two-entry version history passed; temporary content was deleted |
| News | Pass with scope limits | Live bilingual create/publish, Swedish detail, English search, and cleanup passed |
| Events | Pass with scope limits | Live bilingual create/publish, Swedish detail, English search, calendar query, and cleanup passed |

The live checks verify HTTP APIs and route availability. They do not verify rendered browser behavior, keyboard interaction, responsive layout, or accessibility because no browser end-to-end suite is installed.

## Implemented Features Confirmed in Code

### Platform Foundation

- Separate Express backend, React admin, and React public frontend packages
- Versioned `/api/v1` API
- Standard success/error envelopes and request IDs
- Environment validation with Zod
- MongoDB migrations and development seed
- Health and readiness endpoints
- Helmet, request size limit, authentication rate limiting, and explicit CORS policy
- GitHub Actions builds all packages and runs backend checks

### Authentication and Authorization

- MongoDB-backed users, roles, permissions, refresh sessions, and audit events
- bcrypt password hashing and password policy
- Short-lived access JWT and rotating refresh JWT
- HttpOnly cookies and Bearer-token support
- Login, refresh, logout, current-session, and password-change endpoints
- Backend-enforced permission middleware
- Admin user and role management
- Session revocation when users are disabled or passwords change
- Last-Super-Admin protection

### CMS

- Generic typed content records
- Hero, text, image, call-to-action, and FAQ sections
- Draft and published states
- Optimistic version checks
- Immutable version snapshots while a record exists
- Admin list/editor screens and permission-aware controls
- Audit records for create, update, publish, and delete

### News

- English and Swedish title, summary, body, image URL, and image alternative text
- Categories, tags, featured state, draft, immediate publish, and scheduled visibility
- Admin list/editor and taxonomy management
- Public list, search, category filtering, detail, and localized content
- Version snapshots and permission checks

### Events

- English and Swedish title, description, organizer, location, and image alternative text
- Start/end timestamps, category, event status, featured state, image, and Kide.app URL
- Admin list/editor and category management
- Public upcoming/past list, search, category/date filtering, detail, and calendar API
- Version snapshots and permission checks

### Public Website

- Responsive Home, News list/detail, Events list/detail, and not-found pages
- ASK brand colors and reusable public layout styles
- Header, mobile navigation, language switcher, footer, contact details, skip link, and loading/empty/error states
- Home-page News and Events integration
- Dynamic document language and basic title/description updates

## Epic Status

| Epic | Status | Completion | Audited assessment |
| --- | --- | ---: | --- |
| 1 — Platform Foundation and API Standards | **Completed** | 85% | Working architecture, API conventions, environment validation, migrations, seed, CI, tests, and builds. Shared entities and list conventions are incomplete but do not prevent foundation use. |
| 2 — Identity, Authentication, and Authorization | Partial | 70% | Core secure authentication and backend RBAC work. Recovery, reset, MFA, account lockout, full role seed, and database integration coverage are missing. |
| 3 — Bilingual Content and Localization | Partial | 35% | Public News/Events and public UI strings are bilingual. Generic CMS and admin UI are mostly English-only; localized slugs, review state, persistence, and bilingual emails are missing. |
| 4 — ASK Design System and Public Website | Partial | 25% | Stronger public foundation now exists, but platform search, complete information architecture, sitemap, social metadata, optimized media policy, and measured performance are missing. |
| 5 — Backoffice Content Management | Partial | 40% | Secure editors, sections, drafts, publishing, and versions work. Preview, review/approval, archive/restore, media library, pagination, bulk actions, and translation status are missing. |
| 6 — News and Blog | Partial | 65% | The central bilingual administration and public workflows work. Author, SEO, localized slugs, preview, archive/restore, related content, UI pagination, and complete workflow tests are missing. |
| 7 — Events | Partial | 50% | Central bilingual administration and public discovery work. Capacity, accessibility details, general registration, add-to-calendar files, scheduling, archive/duplicate, location filtering, and notifications are missing. |
| 8 — What's Happening at Cor | Missing | 0% | Public preview text and admin placeholder only; no model, API, workflow, or public feed. |
| 9 — Collaborations | Missing | 0% | Public preview text, permission, generic type, and admin placeholder only; no product workflow. |
| 10 — Booking System | Missing | 0% | Permission/navigation placeholder only. |
| 11 — Tutor Module | Missing | 0% | No usable implementation. |
| 12 — Governance Portal | Missing | 0% | Permission/navigation placeholder and generic content type only. |
| 13 — Student Representative Management | Missing | 0% | No usable implementation. |
| 14 — Knowledge Transfer System | Missing | 0% | No usable implementation. |
| 15 — AI-Assisted Translation | Missing | 0% | No provider, review workflow, safeguards, or audit metadata. |
| 16 — GDPR and Data Governance | Missing | 2% | Security/audit foundations exist, but no processing register, retention policy execution, privacy notices, subject rights, exports, deletion/anonymization, or legal holds. |
| 17 — WCAG 2.1 AA Accessibility | Partial | 8% | Several useful semantic and focus practices exist, but there is no automated or documented manual conformance verification. |
| 18 — Testing, Delivery, and Production Operations | Partial | 25% | Builds, locks, CI, unit/HTTP tests, migrations, and local docs exist. Browser E2E, real database integration tests, accessibility gates, deployment, rollback, observability, backup/restore, and incident operations are absent. |

### Completed Epics

- Epic 1 — Platform Foundation and API Standards

### Partially Completed Epics

- Epic 2 — Identity, Authentication, and Authorization
- Epic 3 — Bilingual Content and Localization
- Epic 4 — ASK Design System and Public Website
- Epic 5 — Backoffice Content Management
- Epic 6 — News and Blog
- Epic 7 — Events
- Epic 17 — WCAG 2.1 AA Accessibility
- Epic 18 — Testing, Delivery, and Production Operations

### Missing Epics

- Epic 8 — What's Happening at Cor
- Epic 9 — Collaborations
- Epic 10 — Booking System
- Epic 11 — Tutor Module
- Epic 12 — Governance Portal
- Epic 13 — Student Representative Management
- Epic 14 — Knowledge Transfer System
- Epic 15 — AI-Assisted Translation
- Epic 16 — GDPR and Data Governance

## Comparison With Project Documents

### `docs/PROJECT_MASTER_SPEC.md`

The implementation satisfies only the foundation and initial content slices of the master specification. It does not satisfy the specification's Definition of Done because complete bilingual behavior, editorial workflow, accessibility, privacy behavior, operational modules, and end-to-end testing are absent.

### `docs/PROJECT_STATUS.md`

This is the most accurate existing status document and its 19% estimate remains valid. Corrections from this audit:

- Backend tests are now **38**, not 35.
- The public Home/header/footer foundation is materially implemented, but this does not complete Epic 4.
- Live MongoDB-backed workflows were verified during this audit; the automated backend HTTP tests still use service doubles.

### `docs/GAP_ANALYSIS.md`

The document correctly marks itself deprecated. Its claims that authentication, News, Events, and the public site are missing are stale and must not be used for current planning.

### `docs/TASK_BACKLOG.md`

This remains the correct source for Epic scope and acceptance criteria. The implementation status summary in it is consistent with this audit.

### Environment Documentation

Environment requirements are documented, and the checked-out workspace starts successfully. However, clean-clone instructions are inconsistent:

- `README.md` says to copy root `.env.example` to root `.env`.
- Backend scripts load `backend/.env` because `--env-file=.env` is evaluated from the backend directory.
- `docs/LOCAL_DEVELOPMENT_REPORT.md` correctly describes `backend/.env`.
- Vite package-local environment loading is not clearly documented for production admin/frontend builds.

Following only the README on a clean clone can therefore leave backend commands without the expected file. The current local secret file is correctly ignored by Git and has mode `600`.

## Broken or Risky Areas

- No browser end-to-end tests exist for login, admin editing, public News, or public Events.
- Backend automated HTTP tests use service doubles; Mongoose service behavior is not covered by an automated integration suite.
- The public frontend has no automated tests.
- CI does not run the existing admin tests.
- Generic CMS content is monolingual while News and Events use embedded bilingual records.
- News and Events coordinate writes across generic content and specialized collections without MongoDB transactions. Partial failures can create inconsistent records.
- Generic content deletion also deletes version history, weakening audit and retention guarantees.
- Admin list APIs return full collections; pagination/filtering conventions are not applied consistently.
- Public News and Events services load matching records and paginate in application memory.
- Later modules appear in navigation as protected placeholders, which can be mistaken for implemented capabilities.
- Event source files are heavily compressed, reducing readability and reviewability.
- Public metadata is basic and client-side only. Sitemap, canonical URLs, social metadata, alternate-language links, and server-rendered metadata are absent.
- Public language choice defaults to Swedish on each load and is not persisted.
- Event detail labels `Start` and `End` are hard-coded English strings.
- API fallback URLs assume port 3000 on the browser hostname; production configuration must explicitly provide `VITE_API_URL`.
- Local setup documentation points to conflicting `.env` locations.

## Technical Debt

- Establish one bilingual content/revision model across generic CMS, News, and Events.
- Add a reusable editorial state machine: draft, review, approved, scheduled, published, archived, restored.
- Add localized slugs and language-alternate URL policy.
- Replace external image URLs with a media service/library, validation, usage tracking, and storage abstraction.
- Add database transactions or compensating reconciliation for cross-collection writes.
- Preserve required audit/version records instead of deleting them with content.
- Apply database-side pagination, filtering, sorting, and indexes consistently.
- Expand seed policy beyond one unrestricted Super Admin role.
- Localize the admin application and backend-facing validation/status messages.
- Decompress and format Events implementation files.
- Add frontend/admin component tests, MongoDB integration tests, and bilingual browser E2E tests.
- Run admin tests and accessibility checks in CI.
- Document deployment, rollback, monitoring, backup, restore, and incident procedures.

## Security Concerns

### Positive controls verified

- Passwords use configurable bcrypt hashing.
- JWT secrets are independently validated at a minimum length.
- Access and refresh tokens use HttpOnly cookies.
- Production forces secure cookies.
- Refresh tokens are stored as hashes and rotated.
- Backend permissions are authoritative.
- Authentication endpoints are rate-limited.
- Helmet security headers and a 1 MB JSON limit are enabled.
- Local secret files are ignored by Git; `backend/.env` has mode `600`.
- Current production dependency audits report zero known vulnerabilities.

### Gaps and risks

- No password reset or account recovery workflow.
- No MFA for privileged accounts.
- No account-specific lockout, progressive delay, or credential-stuffing controls beyond a shared IP rate limit.
- No explicit CSRF token/origin-check middleware. `SameSite=Lax` and strict CORS reduce risk but are not a complete documented CSRF strategy for every deployment topology.
- Rotated refresh-token replay is rejected but does not revoke the whole token family or raise a dedicated security event.
- Existing access tokens remain valid until their short expiry after password change or administrative revocation.
- Only the unrestricted `super_admin` system role is seeded; required least-privilege roles are not deployable defaults.
- Audit events are stored, but there is no audit administration UI, retention policy, tamper-evident storage, or export/review workflow.
- Media is accepted as external URLs with no upload scanning, host policy, or usage governance.
- No security-focused database integration tests, browser security tests, penetration test, or documented incident process.
- No GDPR retention, anonymization, subject-access, or legal-hold controls.
- No backup encryption/restore evidence or production secret-management/deployment implementation.

## Recommended Next Epic

**Epic 3 — Bilingual Content and Localization**

Epic 3 should be completed before adding Cor, Collaborations, Booking, or other modules. Current public strings and News/Events records are bilingual, but generic CMS, admin UI, URLs, workflow state, metadata, and emails use inconsistent models. Extending this inconsistency into more modules would create expensive migration and editorial debt.

The next delivery should establish:

1. One translation storage and revision strategy.
2. English/Swedish admin navigation, forms, validation, statuses, and system messages.
3. Translation completeness, review, and stale-source indicators.
4. Persisted locale selection and correct language metadata.
5. Localized slugs, canonical URLs, and alternate-language metadata.
6. Bilingual email templates and automated critical-journey checks.

After Epic 3, complete the shared editorial and public-site gaps in Epics 4, 5, 17, and 18 before implementing Epic 8.

## Exact Verification Commands

Commands were run from `/home/mbenm097/asken` unless a package directory is shown.

### Repository and documentation inspection

```sh
git status --short
git branch --show-current
git log -8 --oneline --decorate
git log -8 --date=iso-strict --pretty=format:'%h %ad %d %s'
git diff --stat
git diff --name-only
rg --files -g 'package.json' -g '!**/node_modules/**' -g 'docs/*.md' -g 'TASK_BACKLOG.md' -g '.env*' -g 'README*'
rg --files backend/src admin/src frontend/src | sort
find backend/src admin/src frontend/src -type f \( -name '*.test.*' -o -name '*.spec.*' \) -print | sort
sed -n '1,320p' docs/PROJECT_MASTER_SPEC.md
sed -n '1,320p' docs/PROJECT_STATUS.md
sed -n '1,320p' docs/GAP_ANALYSIS.md
sed -n '1,760p' docs/TASK_BACKLOG.md
sed -n '1,260p' README.md
sed -n '1,320p' docs/ENVIRONMENT.md
sed -n '1,320p' docs/LOCAL_DEVELOPMENT_REPORT.md
sed -n '1,360p' docs/AUTHENTICATION.md
sed -n '1,360p' docs/API_CONTRACT.md
```

Relevant backend, admin, frontend, model, route, service, validation, test, migration, seed, and CI files were inspected with `sed`, `rg`, and `for` loops over the file lists.

### Toolchain and local services

```sh
systemctl is-active mongod
ss -ltnp | rg ':(1025|27017|3000|5173|5174)\b'
node --version
npm --version
test -d backend/node_modules
test -d admin/node_modules
test -d frontend/node_modules
```

### Builds and tests

```sh
cd backend && npm run typecheck
cd backend && npm test
cd backend && npm run build
cd admin && npm test
cd admin && npm run build
cd frontend && npm run build
```

### Dependency security checks

```sh
cd backend && npm audit --omit=dev
cd admin && npm audit --omit=dev
cd frontend && npm audit --omit=dev
```

### Database setup and service startup

```sh
cd backend && npm run migrate
cd backend && npm run seed
cd backend && npm run smtp:dev
cd backend && npm run dev
cd admin && npm run dev -- --host 127.0.0.1
cd frontend && npm run dev -- --host 127.0.0.1
```

### Health and route checks

```sh
curl -fsS http://127.0.0.1:3000/api/v1/health
curl -fsS http://127.0.0.1:3000/api/v1/readiness
curl -fsSI http://127.0.0.1:5173/
curl -fsSI http://127.0.0.1:5174/
curl -sS -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/api/v1/admin/content

for url in \
  http://127.0.0.1:5173/ \
  http://127.0.0.1:5173/news \
  http://127.0.0.1:5173/events \
  http://127.0.0.1:5174/login
do
  code=$(curl -sS -o /dev/null -w '%{http_code}' "$url")
  printf '%s %s\n' "$code" "$url"
done
```

### CORS checks

```sh
curl -sS -D - -o /dev/null \
  -H 'Origin: http://127.0.0.1:5174' \
  http://127.0.0.1:3000/api/v1/health

curl -sS -D - -o /dev/null -X OPTIONS \
  -H 'Origin: http://127.0.0.1:5173' \
  -H 'Access-Control-Request-Method: GET' \
  http://127.0.0.1:3000/api/v1/news

curl -sS -D - -o /dev/null \
  -H 'Origin: http://evil.example' \
  http://127.0.0.1:3000/api/v1/health
```

### Live authentication and feature workflow

The live workflow used a temporary cookie jar and unique timestamped records. Credentials were read from the ignored `backend/.env` without printing them.

```sh
cd backend
SUPER_ADMIN_EMAIL=$(sed -n 's/^SUPER_ADMIN_EMAIL=//p' .env)
SUPER_ADMIN_PASSWORD=$(sed -n 's/^SUPER_ADMIN_PASSWORD=//p' .env)
base=http://127.0.0.1:3000/api/v1
jar=$(mktemp)

login_payload=$(jq -nc \
  --arg email "$SUPER_ADMIN_EMAIL" \
  --arg password "$SUPER_ADMIN_PASSWORD" \
  '{email:$email,password:$password}')

curl -fsS -c "$jar" \
  -H 'content-type: application/json' \
  -d "$login_payload" \
  "$base/auth/login"

curl -fsS -b "$jar" "$base/auth/me"
curl -fsS -b "$jar" -c "$jar" -X POST "$base/auth/refresh"
curl -fsS -b "$jar" "$base/admin/users"
```

The same authenticated session then called these exact endpoint patterns with schema-valid JSON payloads:

```sh
curl -fsS -b "$jar" -H 'content-type: application/json' \
  -d '{"contentType":"page","title":"Audit Verification Page","slug":"audit-page-<timestamp>","sections":[{"type":"text","position":0,"data":{"heading":"Audit","body":"Runtime CMS verification"}}]}' \
  "$base/admin/content"

curl -fsS -b "$jar" -H 'content-type: application/json' \
  -d '{"expectedVersion":1}' \
  "$base/admin/content/<content-id>/publish"

curl -fsS -b "$jar" "$base/admin/content/<content-id>/versions"

curl -fsS -b "$jar" -H 'content-type: application/json' \
  -d '{"slug":"audit-news-category-<timestamp>","labels":{"en":"Audit News","sv":"Auditnyheter"}}' \
  "$base/admin/news/categories"

curl -fsS -b "$jar" -H 'content-type: application/json' \
  -d '{"slug":"audit-news-<timestamp>","translations":{"en":{"title":"Audit News","summary":"Runtime verification","body":"Published audit article"},"sv":{"title":"Auditnyhet","summary":"Körningsverifiering","body":"Publicerad granskningsartikel"}},"categoryIds":["<category-id>"],"tagIds":[],"featured":true}' \
  "$base/admin/news"

curl -fsS -b "$jar" -H 'content-type: application/json' \
  -d '{"expectedVersion":1}' \
  "$base/admin/news/<article-id>/publish"

curl -fsS "$base/news/audit-news-<timestamp>?locale=sv"
curl -fsS "$base/news?locale=en&q=Audit%20News"

curl -fsS -b "$jar" -H 'content-type: application/json' \
  -d '{"slug":"audit-event-category-<timestamp>","labels":{"en":"Audit Events","sv":"Audithändelser"}}' \
  "$base/admin/events/categories"

curl -fsS -b "$jar" -H 'content-type: application/json' \
  -d '{"slug":"audit-event-<timestamp>","translations":{"en":{"title":"Audit Event","description":"Runtime event verification","organizer":"ASK","location":"Cor"},"sv":{"title":"Audithändelse","description":"Verifiering av händelse","organizer":"ASK","location":"Cor"}},"startAt":"2030-06-25T10:00:00.000Z","endAt":"2030-06-25T12:00:00.000Z","categoryId":"<category-id>","eventStatus":"scheduled","featured":true}' \
  "$base/admin/events"

curl -fsS -b "$jar" -H 'content-type: application/json' \
  -d '{"expectedVersion":1}' \
  "$base/admin/events/<event-id>/publish"

curl -fsS "$base/events/audit-event-<timestamp>?locale=sv"
curl -fsS "$base/events?locale=en&q=Audit%20Event&period=upcoming"
curl -fsS "$base/events/calendar?locale=en&from=2030-06-01T00:00:00.000Z&to=2030-07-01T00:00:00.000Z"
curl -sS -b "$jar" -X POST "$base/auth/logout"
```

Temporary News, Event, taxonomy, and CMS records were deleted with their corresponding authenticated `DELETE` endpoints. The SMTP, backend, admin, and frontend development processes were stopped with `Ctrl-C`.

### Secret-file checks

```sh
git ls-files backend/.env .env backend/.env.example .env.example
git check-ignore -v backend/.env .env
stat -c '%a %n' backend/.env backend/.env.example .env.example
```

## Final Audit Conclusion

The current codebase is a credible development foundation with working authentication, CMS primitives, News, Events, and a public-site shell. Its current completion remains **19%** because the master specification is dominated by incomplete shared workflows and entirely missing operational modules. The technically correct next move is to complete Epic 3 and then harden the shared CMS/public/testing/accessibility foundations before expanding product scope.
