# API Contract

All supported endpoints use `/api/v1`. Responses include `X-Request-Id`. Successful responses use `{ "data": ... }`; errors use `{ "error": { "code", "message", "details?", "requestId" } }`.

## Authentication Cookies

Successful login and refresh responses set:

- `ask_access`: HttpOnly access JWT, path `/`, default lifetime 15 minutes.
- `ask_refresh`: HttpOnly rotating refresh JWT, path `/api/v1/auth`, default lifetime 7 days.

Both cookies are SameSite=Lax and Secure in production. Browser clients must send requests with credentials enabled. Bearer access tokens remain supported for non-browser clients.

## Authentication Endpoints

- `POST /api/v1/auth/login` authenticates credentials and sets both cookies.
- `POST /api/v1/auth/refresh` rotates the refresh token and returns the current user.
- `POST /api/v1/auth/logout` revokes the current refresh session and clears cookies.
- `GET /api/v1/auth/me` returns the authenticated user, roles, and permissions.
- `POST /api/v1/auth/change-password` validates policy, changes the password, and revokes sessions.

## Administrative Endpoints

Every endpoint below requires authentication and backend permission middleware.

| Method and path | Permission | Purpose |
| --- | --- | --- |
| `GET /api/v1/admin/users` | `users.read` | List users and assigned roles |
| `POST /api/v1/admin/users` | `users.write` | Create a user with bcrypt-hashed password |
| `PATCH /api/v1/admin/users/:id` | `users.write` | Change roles or active/disabled status |
| `GET /api/v1/admin/roles` | `roles.read` | List roles and mapped permissions |
| `POST /api/v1/admin/roles` | `roles.write` | Create a role |
| `PUT /api/v1/admin/roles/:id/permissions` | `roles.write` | Replace role-permission mappings |
| `GET /api/v1/admin/permissions` | `roles.read` | List available permissions |
| `GET /api/v1/admin/content?type=:type` | `content.read` | List content, optionally filtered by type |
| `POST /api/v1/admin/content` | `content.write` | Create a draft content item |
| `GET /api/v1/admin/content/:id` | `content.read` | Read content and structured sections |
| `PUT /api/v1/admin/content/:id` | `content.write` | Save a new draft version |
| `DELETE /api/v1/admin/content/:id` | `content.write` | Delete content, sections, and versions |
| `POST /api/v1/admin/content/:id/publish` | `content.write` | Publish the expected version |
| `GET /api/v1/admin/content/:id/versions` | `content.read` | List immutable version metadata |

Content types are `page`, `news`, `event`, `cor_activity`, `governance_document`, and `collaboration`. Create and update requests include `contentType`, `title`, optional `slug`, and structured `sections`. Updates and publishing require `expectedVersion`; stale writes return `409 VERSION_CONFLICT`.

## Public CMS Pages

- `GET /api/v1/pages/:slug` returns one published generic CMS page with ordered sections. It requires no authentication and only exposes `page` records whose `publishedAt` is not in the future. Release v0.5 uses locale-specific slugs such as `home-en` and `home-sv`.

## Operational Endpoints

- `GET /api/v1/health` returns liveness.
- `GET /api/v1/readiness` returns MongoDB readiness.

## Messages

`POST /api/v1/messages` requires authentication. Request: `{ "message": "Hello" }`. The legacy `/message` path remains deprecated.

## News and Blog Endpoints

Administrative News endpoints require authentication. Read operations require `news.read`; create, edit, delete, publish, scheduling, featured state, and taxonomy changes require `news.write`.

| Method and path | Purpose |
| --- | --- |
| `GET /api/v1/admin/news` | List draft, scheduled, and published articles |
| `POST /api/v1/admin/news` | Create a bilingual draft article |
| `GET /api/v1/admin/news/:id` | Read an article for editing |
| `PUT /api/v1/admin/news/:id` | Save a new article version |
| `DELETE /api/v1/admin/news/:id` | Delete an article and its News versions |
| `POST /api/v1/admin/news/:id/publish` | Publish immediately or at `publishAt` |
| `PATCH /api/v1/admin/news/:id/featured` | Toggle featured placement |
| `/api/v1/admin/news/categories` | List and manage bilingual categories |
| `/api/v1/admin/news/tags` | List and manage bilingual tags |

Public endpoints require no authentication:

- `GET /api/v1/news` lists published articles and supports `locale`, `q`, `category`, `tag`, `featured`, `page`, and `limit`.
- `GET /api/v1/news/search` provides the same filters as an explicit search endpoint.
- `GET /api/v1/news/categories` lists bilingual category labels.
- `GET /api/v1/news/:slug?locale=sv` returns one published localized article.

Scheduled articles are stored with a future publication timestamp and remain absent from public APIs until that time.

## Events Endpoints

Event administration requires `events.read`; mutations require `events.write`. `/api/v1/admin/events` supports list, create, detail, update, delete, publish, and featured toggling. `/api/v1/admin/events/categories` supports bilingual category CRUD.

Public endpoints are unauthenticated: `GET /api/v1/events` and `/search` support `locale`, `q`, `category`, `period=upcoming|past`, `featured`, pagination, and date ranges. `GET /api/v1/events/calendar` returns up to 100 published events for calendar ranges. `GET /api/v1/events/:slug` returns localized detail.
