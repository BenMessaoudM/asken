# Naming Fix Report

## Naming Standard

- Swedish: **Arcada Studerandekår – ASK**
- English: **Arcada Student Union – ASK**
- Short name: **ASK**

No application behavior was changed. Updates are limited to visible organization names, localized copy, document titles, metadata, license attribution, and seeded descriptive text.

## Changed Files

- `admin/index.html` — updated the English backoffice title and description metadata.
- `admin/src/components/AdminLayout.tsx` — replaced the incorrect sidebar organization name with the English full name.
- `admin/src/pages/Login.tsx` — replaced the incorrect login branding with the English full name.
- `frontend/index.html` — set Swedish default title and description metadata.
- `frontend/src/locales/en/translation.json` — added the English organization name and metadata strings.
- `frontend/src/locales/sv/translation.json` — added the Swedish organization name and metadata strings.
- `frontend/src/pages/Home.tsx` — displays the localized organization name and synchronizes localized page metadata.
- `README.md` — updated the project title and introduction with the English full name.
- `docs/PROJECT_MASTER_SPEC.md` — updated the English title and platform introduction.
- `docs/GAP_ANALYSIS.md` — updated the English document title.
- `docs/TASK_BACKLOG.md` — updated the English document title.
- `roadmap.md` — updated the English document title.
- `LICENSE` — updated the Swedish organization attribution.
- `backend/src/database/seed.ts` — updated the seeded Super Admin role description with the English full name.

## Verification

Repository-wide checks confirm that the prohibited spellings are absent. Existing standalone **ASK** references remain unchanged where the short name is appropriate.

- Backend typecheck and build passed.
- Admin production build passed.
- Public frontend production build passed.
- Local seed refresh completed successfully.
