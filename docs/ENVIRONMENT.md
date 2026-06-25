# Environment Variables

Copy `.env.example` to `.env`. Never commit real credentials. The backend validates configuration before connecting.

## Backend

| Variable | Default | Requirement |
| --- | --- | --- |
| `NODE_ENV` | `development` | `development`, `test`, or `production` |
| `PORT` | `3000` | Port from 1 to 65535 |
| `MONGO_URI` | None | Required MongoDB connection string |
| `JWT_ACCESS_SECRET` | None | Required independent secret, at least 32 characters |
| `JWT_REFRESH_SECRET` | None | Required independent secret, at least 32 characters |
| `ACCESS_TOKEN_TTL_SECONDS` | `900` | 300–3600 seconds |
| `REFRESH_TOKEN_TTL_DAYS` | `7` | 1–30 days |
| `BCRYPT_ROUNDS` | `12` | Cost from 10–14 |
| `COOKIE_SECURE` | `false` | Set `true` behind HTTPS; production forces secure cookies |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed public-client origin |
| `ADMIN_URL` | `http://localhost:5174` | Allowed admin-client origin |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | None | Required SMTP configuration |

## Initial Super Admin

`npm run seed` requires `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD`. `SUPER_ADMIN_NAME` defaults to `Super Admin`. The password must contain 12–128 characters, uppercase, lowercase, number, and special character. Seeding is idempotent and never overwrites an existing password.

## Admin Client

Set `VITE_API_URL` to the versioned API root, normally `http://localhost:3000/api/v1`. Authentication tokens are never exposed to client JavaScript; the browser sends HttpOnly cookies with credentialed requests.


## Public Client

Set `VITE_API_URL` to the versioned API root, normally `http://localhost:3000/api/v1`. Set `VITE_SITE_URL` to the canonical public origin; it is used for canonical and Open Graph URLs. Published CMS pages use locale-specific slugs documented in `PUBLIC_WEBSITE.md`.
