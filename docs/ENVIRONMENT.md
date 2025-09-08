# Environment Variables

This project uses environment variables to configure the backend API, the
frontend client and the admin dashboard. Copy `.env.example` to `.env` and
adjust the values as needed.

## Backend

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `NODE_ENV` | `development` | Node.js runtime environment |
| `PORT` | `3000` | Port for the backend API |
| `BASE_URL` | `http://localhost:3000` | Public URL for the backend API |
| `MONGO_URI` | `mongodb://localhost:27017/asken` | MongoDB connection string |
| `JWT_SECRET` | `replace_me` | Secret for signing JWT tokens |
| `SMTP_HOST` | `replace_me` | SMTP server host |
| `SMTP_PORT` | `587` | SMTP server port |
| `SMTP_USER` | `replace_me` | SMTP authentication user |
| `SMTP_PASS` | `replace_me` | SMTP authentication password |
| `CONTACT_GENERAL` | `info@asken.fi` | Address for general inquiries |
| `CONTACT_ANTIHARASSMENT` | `hello@asken.fi` | Address for anti-harassment contact |
| `HSL_STOPS` | `[{"id":"HSL:12345","label":"Arabia / Arcada","max":6}]` | Default HSL stops list |

## Frontend

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `FRONTEND_PORT` | `5173` | Port for the frontend dev server (Vite default) |
| `FRONTEND_URL` | `http://localhost:5173` | URL where the frontend is served |

## Admin

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `ADMIN_PORT` | `5174` | Port for the admin panel dev server |
| `ADMIN_URL` | `http://localhost:5174` | URL where the admin panel is served |

