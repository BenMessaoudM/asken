# Browser E2E Testing

## Framework

Browser E2E tests use Playwright from the root package.

Tests live in `e2e/` and are intentionally separate from backend/admin/frontend unit tests because they start real local services and require a MongoDB test database.

## Install

From the repository root:

```bash
npm install
npx playwright install
```

## Run

```bash
npm run test:e2e
```

The Playwright config starts:

- backend on `http://127.0.0.1:3000`
- public frontend on `http://127.0.0.1:5173`
- admin frontend on `http://127.0.0.1:5174`

The backend web server drops the configured E2E database, then runs migrations and seeds a dedicated E2E super admin before starting.

## Environment Assumptions

Default MongoDB connection:

```bash
mongodb://127.0.0.1:27017/asken-e2e
```

Override with:

```bash
E2E_MONGO_URI=mongodb://127.0.0.1:27017/asken-e2e npm run test:e2e
```

Seeded admin credentials:

- email: `e2e-admin@example.com`
- password: `StrongPassword1!`

The test database is for local/browser test data only. Do not point E2E at production data.

## Covered Workflows

- Admin can view and edit Collaborations.
- Admin Event editor displays the Collaborations and sponsors section.
- Public Swedish event detail shows visible active collaborations only.
- Public English event detail uses English labels and English collaboration route aliases.
- Hidden/inactive collaborations attached to an event are not exposed publicly.
- Collaboration detail links from event pages do not expose internal notes or relationship owner data.

## Artifacts

Playwright reports, traces, screenshots, and videos are ignored by git:

- `test-results/`
- `playwright-report/`
- `traces/`
- `videos/`
- `screenshots/`

## Limitations

The suite uses API setup for deterministic records and browser assertions for user-facing behavior. It does not yet cover every admin field or every event workflow.
