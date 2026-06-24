# Database Migrations and Seed Data

MongoDB changes are versioned in `backend/src/database/migrations/`; applied IDs are recorded in `_migrations`.

```sh
cd backend
npm run migrate
npm run seed
```

- `001-platform-foundation` creates shared platform indexes.
- `002-identity-rbac` adds identity, refresh-session, and audit indexes.
- `003-cms-foundation` created the original page-only CMS collections.
- `004-generic-content-foundation` migrates existing pages, sections, and versions into typed content collections and adds generic CMS indexes.
- `005-news-blog` adds localized News article, category, tag, scheduling, search, and version indexes.
- `006-events-management` adds event, category, date, featured, search, calendar, and version indexes.

Migration 004 preserves existing identifiers and classifies migrated page records as `page`. New slugs are unique per content type.

The seed command requires `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD`. It creates permissions, maps them to the system `super_admin` role, and creates or updates the initial administrator's role assignment. It is idempotent and does not overwrite an existing password.

Never edit an applied migration. Add a new migration for every stored-data or index change. Do not place real credentials in committed seed files.
