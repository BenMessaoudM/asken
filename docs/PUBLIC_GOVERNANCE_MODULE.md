# Public Governance Module

## Purpose

Offentlig styrning / Public Governance publishes public ASK governance documents with a focus on Fullmäktige / Student Council documents. ASK's Swedish stadgar och reglemente are the primary authority; English content is support translation.

This is a public document metadata and link module. It stores URLs and publication metadata only. It is not a board management system, voting system, or media library.

## Bylaws Basis

The module reflects that Fullmäktige is ASK's highest decision-making body. Fullmäktige protocols are public, but parts can be withheld when they contain private-person information or material that should not be published. Public governance documents should be accessible where appropriate, while Board/internal documents remain outside this module.

## Included Documents

- Kallelse / Meeting notice
- Föredragningslista / Agenda
- Protokoll / Minutes
- Stadgar / Statutes
- Reglemente / Regulations
- Verksamhetsberättelse / Annual report
- Bokslut / Financial statements
- Policy / Policy
- Other public governance documents

## Excluded

- No board meeting management
- No board agendas or protocols
- No internal board notes
- No internal votes or tasks
- No HR/private documents
- No confidential real estate/business documents
- No documents about private individuals unless explicitly approved for publication
- No file storage or Media Library
- No automatic OCR/import

## Backend Models

`GovernanceDocument` stores localized title/description/tags, slug, document type, governance body, meeting/publish/document dates, year, document language, file/external URLs, file metadata, public/published flags, display order, created/updated actor metadata, and timestamps.

`GovernanceSettings` stores localized intro text, document policy text, contact email, visibility, and update timestamp.

## APIs

Public:

- `GET /api/v1/governance`
- `GET /api/v1/governance/documents`
- `GET /api/v1/governance/documents/:slug`
- `GET /api/v1/governance/fullmaktige`
- Compatibility alias: `/api/public/governance/...`

Admin:

- `/api/v1/admin/governance/documents`
- `/api/v1/admin/governance/settings`
- Compatibility alias: `/api/admin/governance/...`

Public document list filters: `documentType`, `year`, `governanceBody`, and `language`.

## Permissions

- `governance.read` allows viewing admin governance documents/settings.
- `governance.write` allows creating, updating, publishing, unpublishing, and archiving governance documents and settings.

No separate `governance.publish` permission exists yet; publishing uses `governance.write` and is documented as such.

## Public Pages

- `/styrning`
- `/governance`
- `/styrning/fullmaktige`
- `/styrning/dokument/:slug`

The Swedish route is primary. The English-friendly route aliases the overview.

## Admin Pages

Admin route: `/governance`.

Tabs:

- Dokument / Documents
- Fullmäktige
- Inställningar / Settings

Admin can manage document metadata, URL, public/published flags, dates, year, language, and settings. Swedish fields are shown before English fields. Dates are entered/displayed as DD.MM.YYYY.

## Privacy and Publication Boundary

Public APIs only expose documents where `isPublic` and `isPublished` are both true. Archiving unpublishes and hides a document from public APIs. Admin-only drafts and private documents are never returned by public endpoints.

## Migration

Migration `015-public-governance` creates indexes, seeds Swedish-first settings, and adds `governance.read` / `governance.write` permissions.

Run:

```bash
cd backend
npm run migrate
```

## Future Work

- Replace manual URLs with Media Library-managed files when Media Library is implemented.
- Add browser E2E coverage for public filters, document detail, and admin publishing.
- Add richer related-document grouping and document versioning if ASK needs it.
