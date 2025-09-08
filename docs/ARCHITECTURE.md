# System Architecture

## Directory Layout

```
/                      Root of the repository
├── backend/           Node.js API server
├── frontend/          React client application
├── docs/              Project documentation
└── ...
```

## Backend
- **Tech stack:** Node.js, Express, TypeScript, and MongoDB via Mongoose.
- **Location:** `backend/`
- **Entry point:** `backend/src/index.ts`
- **Responsibilities:**
  - Exposes RESTful endpoints for both the public frontend and the admin panel.
  - Handles authentication with JWT tokens.
  - Persists data in MongoDB and triggers side effects such as email sending (Nodemailer).

## Frontend
- **Tech stack:** React, Vite, and TypeScript.
- **Location:** `frontend/`
- **Structure:**
  - `src/pages` contains route-based pages.
  - `src/components` holds reusable UI components.
  - `src/i18n.ts` configures i18next for localisation.
- **Responsibilities:**
  - Renders the user‑facing web experience.
  - Communicates with the backend through JSON APIs using fetch/React Query.

## Admin Panel
- **Tech stack:** React and Vite (mirroring the main frontend).
- **Location:** planned under `frontend/src/admin` or a dedicated `admin/` package.
- **Responsibilities:**
  - Provides management interfaces for administrative users.
  - Uses the same backend APIs with elevated privileges to manage application data.

## Component Communication
- The frontend and admin panel communicate with the backend over HTTP.
- Each client authenticates via JWT and exchanges JSON payloads with the API server.
- The backend interacts with MongoDB for persistence and emits emails where necessary.
- All three parts remain decoupled, enabling independent development and deployment.

## Internationalisation & Accessibility

### Translation workflow
- The React frontend uses [i18next](https://www.i18next.com/) initialised in `frontend/src/i18n.ts`.
- Language resources live under `frontend/src/locales/<lang>/translation.json`; Swedish (`sv`) and English (`en`) files are loaded at start with Swedish as the default and English as the fallback.
- Users can switch language at runtime through `frontend/src/components/LanguageSwitcher.tsx`, which calls `i18n.changeLanguage`.
- To add a new language, create a matching `translation.json` under `frontend/src/locales/<code>`, import it in `i18n.ts`, and extend the language list in `LanguageSwitcher.tsx`.

### WCAG 2.2 AA compliance
- Components rely on semantic HTML, accessible ARIA attributes, and keyboard-friendly widgets (e.g. Headless UI `Listbox`).
- Visual elements are checked for sufficient colour contrast, focus indicators remain visible, and labels use `sr-only` text where appropriate.
- Translations include all user-facing text, ensuring screen readers announce content in the correct language.
