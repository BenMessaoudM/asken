# Pull Request Summary — Epic 4 ASK Design System and Public Website

## Summary

Turns the public frontend into a useful, mobile-first ASK website built around the existing News and Events APIs. The implementation adds a reusable public shell, a modern bilingual homepage, consistent ASK design tokens, contact and membership entry points, and a public 404 page.

Epic 8 is not included. The Cor and Collaborations homepage areas are presentation-only previews with no new domain models, APIs, administration workflows, or publication behavior.

## Public Website

- Replaced the placeholder homepage with a complete student-oriented landing page.
- Added a responsive main navigation with mobile menu, active route states, language switcher, and membership CTA.
- Added a reusable public footer with navigation, general contact, harassment contact, Instagram, and Cor House location.
- Added a membership section linking to Kide.app.
- Added a contact section using current ASK contact channels.
- Added a bilingual 404 page and wildcard route.
- Applied the shared public layout to Home, News, News Detail, Events, and Event Detail.

## Homepage

- Added a modern hero with direct membership and event actions.
- Added latest News cards backed by the existing public News API.
- Added upcoming Event cards backed by the existing public Events API.
- Added independent loading, empty, and failure states so one unavailable feed does not break the homepage.
- Added a clearly labelled “What’s Happening at Cor” preview that links to existing Events.
- Added a clearly labelled Collaborations preview that links to Contact.
- Added stable homepage section definitions and source metadata so sections can later be replaced by CMS-managed content without coupling layout to the current data source.

## ASK Design System

- Added named ASK palette tokens:
  - `#A32F8E`
  - `#CB52B5`
  - `#F1E4E8`
  - `#E0C13D`
  - `#23212B`
- Added reusable containers, cards, buttons, headings, shadows, and branded gradient treatments.
- Added reusable brand mark, icons, section headings, public header, footer, and layout components.
- Added automatic dark-mode styling through the user’s system preference.
- Added reduced-motion handling and consistent visible focus states.

## Accessibility

- Added a skip-to-content link and semantic page landmarks.
- Added accessible navigation labels, mobile menu state, form labels, loading announcements, and alert states.
- Preserved localized document language behavior.
- Added alt-text handling for API-backed images and non-image visual fallbacks.
- Maintained keyboard-operable navigation and controls.

## API Integration

- Reused `/api/v1/news` and `/api/v1/events`; no backend feature changes were required.
- Added optional API limits for homepage previews.
- Kept News and Events list/detail pages connected to their existing localized public APIs.

## Metadata

- Updated the bilingual homepage title and description.
- Added theme-color, color-scheme, and baseline Open Graph metadata.

## Verification

- Public frontend: `npm run build` — passed.
- Backend: `npm test` — 10 suites, 35 tests passed.
- Admin: `npm test` — 6 suites, 11 tests passed.
- Admin: `npm run build` — passed.

## Scope Boundary

- No generic CMS page renderer was added.
- No site-wide search backend was added.
- Cor Activities remains a placeholder; Epic 8 was not started.
- Collaborations remains a placeholder; Epic 9 was not started.
