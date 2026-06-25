# Public Website — Release v0.5

Release v0.5 provides the production public-site foundation for Arcada Student Union – ASK. It is mobile-first, bilingual in English and Swedish, responsive, and built from reusable React components using the ASK design tokens.

## Public Routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about` | About ASK |
| `/board` | Board |
| `/membership` | Membership |
| `/contact` | Contact |
| `/associations` | Associations |
| `/cor-house` | Cor House |
| `/booking` | Booking information |
| `/privacy` | Privacy policy |
| `/accessibility` | Accessibility statement |
| `/news` and `/news/:slug` | Dynamic News list and detail |
| `/events` and `/events/:slug` | Dynamic Events list and detail |
| all unmatched paths | Bilingual 404 page |

The homepage includes a modern hero, About ASK, student benefits, latest News, upcoming Events, associations, Cor House, membership, contact, and the global footer.

## CMS Page Integration

Published generic CMS pages are exposed read-only at:

```text
GET /api/v1/pages/:slug
```

The endpoint only returns `contentType=page` records whose status is `published` and whose publication time has passed. Authentication and the CMS administration architecture are unchanged.

Because the current generic CMS record is monolingual, Release v0.5 uses one existing CMS page per locale:

| Public page | English CMS slug | Swedish CMS slug |
| --- | --- | --- |
| Home | `home-en` | `home-sv` |
| About | `about-en` | `about-sv` |
| Board | `board-en` | `board-sv` |
| Membership | `membership-en` | `membership-sv` |
| Contact | `contact-en` | `contact-sv` |
| Associations | `associations-en` | `associations-sv` |
| Cor House | `cor-house-en` | `cor-house-sv` |
| Booking | `booking-en` | `booking-sv` |
| Privacy | `privacy-en` | `privacy-sv` |
| Accessibility | `accessibility-en` | `accessibility-sv` |

Create and publish these records through the existing **Content** module in the admin application. Published CMS content replaces the built-in localized page body. If a page is missing, unpublished, empty, or temporarily unavailable, the public site retains safe built-in bilingual content.

### Homepage section convention

The existing section types are used without schema changes:

1. First `hero` section: homepage heading, subheading, image, and primary CTA.
2. First `text` section: About ASK heading and body.
3. Second `text` section: student-benefits heading and introduction.
4. Additional `image`, `cta`, and `faq` sections: rendered after the standard homepage modules.

News and Events always remain dynamic and are loaded from their existing public APIs.

## Accessibility

The release includes:

- semantic landmarks and headings;
- a skip-to-content link;
- keyboard-accessible navigation and language selection;
- visible focus indicators;
- labelled controls and live loading/error states;
- required image alternative text for CMS images;
- responsive reflow from 320 px upward;
- reduced-motion handling;
- no information conveyed by color alone.

WCAG 2.1 AA remains the release target. Automated and manual conformance testing should continue as described in the project backlog.

## SEO

Each route updates its document title, description, Open Graph title/description/URL/locale, canonical URL, and document language. The frontend also ships `robots.txt` and `sitemap.xml`.

Set `VITE_SITE_URL` to the canonical production origin so generated canonical URLs match the deployed site.

## Local Development

Start the backend and frontend from separate terminals:

```sh
cd backend && npm run dev
cd frontend && npm run dev
```

The frontend uses `VITE_API_URL` when configured. Otherwise it connects to port 3000 on the current browser hostname.
