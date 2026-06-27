# Organization Module v0.7

## Public Page Structure

- `/organisation` - Organisation / Organization landing page.
- `/organisation/styrelsen` - Styrelsen / Board.
- `/organisation/fullmaktige` - Fullmäktige / Student Council.
- `/organisation/kommitteer` - Kommittéer / Committees.
- `/organisation/tutoring` - Tutoring.
- `/organisation/personal` - Personal / Staff.
- `/organisation/engagera-dig` - Engagera dig / Get Involved.
- `/alumner` and `/organisation/alumner` - Alumner / Alumni.

The Alumni page includes ASK Alumni information, benefits, alumni events/network/support sections, and a Cor House booking CTA using `/booking?category=alumni`.

## Admin Page Structure

The admin backoffice has an `Organisation` module with tabs:

- Översikt / Overview
- Personer / People
- Rollmärken / Role Badges
- Kommittéer / Committees
- Fullmäktige / Student Council
- Rekrytering / Recruitment
- Alumner / Alumni

Editors manage image URLs directly. v0.7 does not introduce a media library.

## Backend Models

- `OrganizationPerson`: public profiles for board, staff, council, committee, alumni, and other contacts.
- `OrganizationRoleBadge`: configurable role badges.
- `OrganizationCommittee`: public committee information and contact references.
- `OrganizationStudentCouncilSettings`: public Fullmäktige settings, members, and document links.
- `OrganizationRecruitmentCampaign`: public recruitment campaigns and status.
- `OrganizationAlumniPageContent`: editable Alumni page content.

All content fields are Swedish-first `sv/en` structures. Finnish is intentionally not part of Organization v0.7.

## API Routes

Public:

- `GET /api/v1/organization`
- `GET /api/v1/organization/board`
- `GET /api/v1/organization/staff`
- `GET /api/v1/organization/committees`
- `GET /api/v1/organization/student-council`
- `GET /api/v1/organization/get-involved`
- `GET /api/v1/organization/alumni`

Admin:

- `/api/v1/admin/organization/people`
- `/api/v1/admin/organization/role-badges`
- `/api/v1/admin/organization/committees`
- `/api/v1/admin/organization/student-council`
- `/api/v1/admin/organization/recruitment-campaigns`
- `/api/v1/admin/organization/alumni`

## Permissions

- `organization.read` allows viewing the admin Organization module.
- `organization.write` allows creating, updating, publishing, and archiving public organization content.

Public APIs do not require authentication. Admin APIs use the existing authentication and permission middleware.

## Multilingual Behavior

- Svenska (`sv`) is the source/default language.
- English (`en`) is secondary.
- Public locale resolution supports `sv` and `en`.
- Fallback order is selected language, Swedish, English, matching the shared localization helpers.
- Admin forms present Swedish fields before English fields.

Dates shown in public and admin UI use shared DD.MM.YYYY helpers. Times use 24-hour helpers where displayed.

## Included

- Public Organization landing and subpages.
- Board and Staff public profile lists.
- Committee public list.
- Public Fullmäktige information.
- Tutoring information page.
- Public Get Involved recruitment campaign list.
- Alumni page and Cor House alumni booking CTA.
- Admin editing for people, role badges, committees, Fullmäktige, recruitment campaigns, and Alumni content.
- Migration `011-organization-v07` with indexes and default public content.
- Default role badge: Skyddsperson mot trakasserier / Anti-Harassment Contact Person.

## Excluded

- No board meeting management.
- No board agendas/protocols.
- No internal board votes/tasks.
- No full alumni CRM.
- No Media Library.
- No Collaborations module.
- No Live at Cor module.
- No Theme Manager.

Fullmäktige may expose public document links, but v0.7 does not implement election management or private governance workflows.

## Future Improvements

- Richer edit screens with inline update for every record, pagination, and search.
- Localized URL migration and language-specific slugs.
- Full admin shell localization.
- Media Library integration for profile and hero images.
- Alumni CRM or mailing-list integration.
- Recruitment application integration status callbacks from Lime CRM or another external system.
- Browser E2E coverage for the new public/admin pages.

## Bylaws Alignment: Äldres Råd / Elders' Council

Organisation v0.7 now includes Äldres Råd as a separate advisory body, based on ASK's Swedish stadgar och reglemente as primary authority.

Äldres Råd is not the Board, staff, a committee, or Alumni CRM. It is an advisory body of the Student Union. It is appointed by Fullmäktige and consists of nine members with a three-year mandate. Fullmäktige supplements outgoing members annually at the autumn meeting. Members may be graduates from Arcada or other people with good insight into ASK's activities.

Public information is available at `/organisation/aldres-rad`. Admin editing is available under Organisation -> Äldres Råd and through `/api/v1/admin/organization/elders-council` with `organization.read` / `organization.write` permissions. Public API access is available at `/api/v1/organization/elders-council` and the compatibility alias `/api/public/organization/elders-council` through the existing public organization router alias.

Default contact email: `aldresrad@asken.fi`.

Migration `013-organization-bylaws-alignment` seeds default visible content and no fake members.

## v0.8 Foundation: Studeranderepresentanter / Student Representatives

Organisation now includes a separate Studeranderepresentanter / Student Representatives section based on ASK's Swedish stadgar och reglemente. It is a public/admin information module for förtroendeuppdrag in Arcada bodies, not an election system.

Public pages:

- `/organisation/studeranderepresentanter`
- `/organisation/studeranderepresentanter/:slug`

Admin route:

- `/representatives` with tabs for Organ, Representanter, and Utlysningar.

APIs:

- Public: `/api/v1/representatives/bodies`, `/bodies/:slug`, `/current`, `/calls`
- Admin: `/api/v1/admin/representatives/bodies`, `/people`, `/calls`

Migration `014-student-representatives` seeds the seven bylaws-listed Arcada bodies and `representatives.read` / `representatives.write` permissions. No fake student representatives are seeded. Public representative emails remain private unless an admin explicitly enables public contact visibility.

See `docs/STUDENT_REPRESENTATIVES_MODULE.md` for the full v0.8 scope, exclusions, privacy rules, APIs, and migration notes.

## Public Governance Links

Fullmäktige public information now links to the Public Governance document module for meeting notices, agendas, and minutes. Public routes are `/styrning/fullmaktige` and `/styrning/dokument/:slug`. Board documents and internal governance workflows remain excluded from the Organisation module.
