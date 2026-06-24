# Shared Platform Data Model

## Identity Entities

- **User:** unique normalized email, name, bcrypt password hash, active/disabled status, role references, password-change time, timestamps, schema version.
- **Role:** unique key, display name, description, system-role marker, and permission references.
- **Permission:** unique action key and description.
- **Refresh session:** user reference, SHA-256 token hash, expiry, revocation and last-use times, IP, and user agent.
- **Audit event:** immutable actor, action, target, timestamp, IP, user agent, and non-secret metadata.

Users and roles form a many-to-many relationship through `User.roleIds`; roles and permissions form a many-to-many relationship through `Role.permissionIds`. Backend middleware resolves current permissions from MongoDB for every protected request.

## CMS Entities

- **Content:** type, title, type-scoped unique slug, draft/published status, current version, publication timestamp, creator/updater references, timestamps, and schema version.
- **Content section:** content reference, ordered position, section type, structured data, timestamps, and schema version.
- **Content version:** immutable snapshot of content metadata and sections, version number, actor reference, publication state, and creation time.

Supported content types are Page, News, Event, Cor Activity, Governance Document, and Collaboration. All types share the same workflow and section model so later domain-specific modules can extend the CMS without duplicating persistence or publishing logic.

Saving content increments its optimistic-lock version and returns it to draft state. Publishing also increments the version and records `publishedAt`. Slugs are unique within a content type, allowing different types to reuse a human-readable slug. Deleting content also removes its sections and version history.

Structured section types are Hero, Text, Image, CTA, and FAQ. Section positions are unique and contiguous from zero.

## News and Blog Entities

- **News article:** one-to-one specialization of a CMS `Content` record. It stores English and Swedish title, summary, body, image metadata, category references, tag references, featured state, and optional scheduled publication time.
- **News category:** unique slug and required English/Swedish labels.
- **News tag:** unique slug and required English/Swedish labels.
- **News article version:** immutable snapshot of localized article metadata and taxonomy aligned with the CMS content version.

CMS content remains the source of truth for slug, draft/published lifecycle, optimistic version number, and publication timestamp. Public queries require `status=published` and `publishedAt` not later than the current time. Generic CMS mutation routes reject News records so specialized metadata cannot be bypassed.

## Event Entities

- **Event:** one-to-one CMS specialization with bilingual title, description, organizer, location, and image alternative text; shared image, start/end timestamps, Kide.app URL, featured state, operational status, and category reference.
- **Event category:** unique slug with English and Swedish labels.
- **Event version:** immutable event metadata snapshot aligned with CMS versions.

Publication status remains in CMS. Event operational status is `scheduled`, `postponed`, or `cancelled`; upcoming/past status is derived from the end timestamp. Epic 6 records use `cmsevents` to avoid modifying an existing legacy `events` collection.
