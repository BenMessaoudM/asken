# Student Representatives Module v0.8

## Purpose

Studeranderepresentanter / Student Representatives is an Organisation-related information and management module for ASK's student representative positions in Arcada bodies. ASK's Swedish stadgar och reglemente are the primary source of truth; English labels are support translations.

The module describes positions of trust, current public representatives, and call-for-applications information. It does not elect representatives and does not replace Fullmäktige or Styrelsen decision-making.

## Bylaws Basis

ASK elects or appoints student representatives to Arcada bodies as one of the Student Union's special duties. The seeded bodies are:

- Yrkeshögskolans styrelse / Board of the University of Applied Sciences
- Omprövningsnämnden / Board of Review
- Branschråd / Sector Councils
- Kvalitetsråd / Quality Council
- Forskningsråd / Research Council
- Pedagogiska rådet / Pedagogical Council
- Rådet för kvalitet och samhällsansvar / Council for Quality and Social Responsibility

Seeded defaults use 24-month terms where specified. Fullmäktige is the default appointing body for the statutory Arcada bodies. Branschråd and Kvalitetsråd descriptions note that seats can vary by call.

## Backend Models

Representative bodies store Swedish/English name, slug, description, category, appointing body, default term length, seat counts, eligibility text, application instructions, visibility, activity, and display order.

Student representatives store the body, name, optional email, optional study programme, role, term dates, status, appointing body, appointment date, public profile flag, email visibility flag, optional photo URL, public description, and display order.

Representative calls store Swedish/English title, optional body, description, opening/closing dates, number of seats, eligibility, application instructions, CTA label/URL, contact email, published/featured flags, and calculated status.

## APIs

Public:

- `GET /api/v1/representatives/bodies`
- `GET /api/v1/representatives/bodies/:slug`
- `GET /api/v1/representatives/current`
- `GET /api/v1/representatives/calls`
- Compatibility alias: `/api/public/representatives/...`

Admin:

- `/api/v1/admin/representatives/bodies`
- `/api/v1/admin/representatives/people`
- `/api/v1/admin/representatives/calls`
- Compatibility alias: `/api/admin/representatives/...`

## Permissions

- `representatives.read` allows viewing the admin representatives module.
- `representatives.write` allows creating, updating, and archiving bodies, people, and calls.

Migration `014-student-representatives` seeds these permissions and grants them to `super_admin` when that role exists.

## Public Pages

- `/organisation/studeranderepresentanter`
- `/organisation/studeranderepresentanter/:slug`

The main page explains the purpose, lists bodies, shows public current representatives grouped by body, and shows published calls. Body detail pages show the body description, mandate, seat counts, eligibility, appointing body, public representatives, and calls for that body.

Organisation landing and footer links include Studeranderepresentanter.

## Admin Structure

Admin route: `/representatives`.

Tabs:

- Organ / Bodies
- Representanter / Representatives
- Utlysningar / Calls

Forms present Swedish fields before English fields and use shared DD.MM.YYYY date helpers for term and call dates.

## Privacy Rules

Emails are not exposed publicly unless the representative is public and `contactPublic` is true. Non-public representatives are excluded from public endpoints. The admin can store operational details, but the module avoids overcollecting sensitive data.

## Explicit Exclusions

- No voting system
- No election counting
- No candidate nomination forms
- No student authentication
- No full application workflow
- No email automation beyond contact/CTA links
- No Collaborations, Live at Cor, Theme Manager, or Media Library work

## Migration

Run:

```bash
cd backend
npm run migrate
```

Migration `014-student-representatives` creates representative indexes, seeds the seven default bodies, and adds RBAC permissions.

## Known Limitations

- Public and admin browser E2E tests are still future work.
- Calls link to external channels such as email, Lime CRM, or forms; applications are not stored in this module.
- Real representatives are not seeded and must be entered by an authorized admin.
- Full Finnish content is not included for this module.
