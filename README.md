# asken

ASKen is a monorepo that houses the server and client applications for the project.
It includes an Express/TypeScript backend and two Vite + React frontends.

- `frontend/` – user-facing application.
- `admin/` – administrative interface with basic authentication and management dashboard.
- `backend/` – REST API and business logic.

## Overview

The backend exposes endpoints used by both the user and admin clients.  Each
frontend is built with Vite and communicates with the backend through the
configured URLs.  Development servers run locally, while production builds can be
served from any static host.

## Installation

### Prerequisites
- Node.js (version 18 or later)
- npm

### Environment variables
Configuration for all components is defined in `.env`.

1. Copy the example file and adjust values as needed:
   ```sh
   cp .env.example .env
   ```
2. The file covers server ports and URLs for the backend, user frontend and
   admin dashboard, along with database, authentication, email and contact
   settings.  For a complete list see [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md).

### Backend
```sh
cd backend
npm install
npm run dev    # starts the API with ts-node
```
For a production build:
```sh
npm run build
npm start
```

### Frontend
```sh
cd frontend
npm install
npm run dev    # starts the user-facing site
```

### Admin
```sh
cd admin
npm install
npm run dev    # starts the admin dashboard
```

## Documentation
- Project requirements: [docs/ASKen_Cahier_des_Charges_v1.1.pdf](docs/ASKen_Cahier_des_Charges_v1.1.pdf)
- Additional documentation can be found in the `docs/` directory, including
  [ARCHITECTURE](docs/ARCHITECTURE.md) and [API contract](docs/API_CONTRACT.md).

## License
This project is licensed under the [MIT License](LICENSE).

