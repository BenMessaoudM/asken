# Website Theme Manager MVP

## Purpose

The Website Theme Manager lets admins activate seasonal, recruitment, and campaign presentation layers across the public website without replacing ASK's core brand identity.

ASK brand colors remain the primary website identity:

- Primary: `#A32F8E`
- Secondary: `#CB52B5`
- Lavender blush: `#F1E4E8`
- Sunflower gold: `#E0C13D`
- Rich charcoal: `#23212B`

Themes add announcements, small banners, decorations, accent colors, and campaign CTAs. They must not recolor the whole platform.

## Backoffice Management

Admin route: `/appearance`

Sidebar labels:

- Swedish: Utseende
- English: Appearance

Tabs:

- Teman / Themes
- Aktivt tema / Active theme
- Inställningar / Settings

Admins with `themes.read` can view themes and active resolution. Admins with `themes.write` can create, update, and archive themes.

Content fields are Swedish-first in both admin languages:

1. Swedish
2. English

## Active Theme Resolution

Only themes with `enabled: true` and `status: active` can appear publicly.

Resolution order:

1. Manual override themes can activate without schedule.
2. Automatic activation uses the current date in `Europe/Helsinki` by default.
3. Recurring yearly themes use `MM-DD` ranges, such as `08-20` to `09-30`.
4. If multiple themes are active, highest priority wins.
5. If priority is equal, the most recently updated theme wins.
6. Draft, inactive, archived, and disabled themes never activate.
7. If no theme is active, the public API returns `null` and the website keeps normal ASK styling.

## Seeded Themes

Migration `018-website-themes` seeds editable records:

- Gulistema / Freshers Theme
- Tutorrekrytering / Tutor Recruitment
- Styrelserekrytering / Board Recruitment
- Fullmäktigeval / Student Council Election
- Jul / Christmas
- Nyår / New Year
- Vappen
- Prideveckan / Pride Week
- Halloween
- Svenska dagen / Swedish Day in Finland
- Självständighetsdagen / Independence Day
- Midsommar / Midsummer
- Anpassat tema / Custom Theme

The Gulis/Freshers theme is seeded with recurring yearly dates `08-20` to `09-30`, duck decorations, ASK sunflower gold accent, and Swedish/English campaign copy. Other themes are seeded as inactive/editable starting points.

## Public Theme Application

Public endpoint:

- `GET /api/v1/themes/active`
- Alias: `GET /api/public/themes/active`

The frontend fetches the active theme and fails closed. If the API fails or returns no theme, the website renders with the default ASK design.

Current MVP public application:

- announcement bar
- homepage campaign card
- CSS-only duck decoration for the Gulis/Freshers theme
- subtle accent glow using configured accent colors
- reduced-motion respect for decorative motion

The public response is localized. The site shows selected language only and never labels such as `Gulistema / Freshers Theme`.

## Gulis/Freshers Duck Rules

The yellow duck mascot represents gulis/freshers and prepares a visual identity for future ASKungen use.

Rules:

- Duck visuals are decorative/personality elements only.
- ASK purple remains the main brand color.
- Sunflower gold can be used for duck decoration and small accents.
- Academic ribbon/medal colors are small accent details only.
- No uploaded mascot photo is committed by this MVP.
- Image fields are URL-based until a governed Media Library exists.

## Recruitment Themes

Recruitment themes can show campaign cards and CTAs. Links are configured fields, so Lime CRM or other application URLs can be added without code changes.

This MVP does not implement recruitment applications or form workflows.

## Accessibility

Theme visuals must not reduce contrast or obscure content. Motion uses subtle CSS only and respects `prefers-reduced-motion` when enabled by the theme settings.

## ASKungen Future Chatbot Identity

ASKungen is planned as a future chatbot identity based on:

- yellow duck mascot
- ASK academic ribbon/medal accent
- ASK purple as the primary brand environment

This MVP only prepares mascot-related theme fields, including `chatbotMascotAssetUrl`, and documents the visual identity direction.

No AI endpoints, chatbot UI, model integration, chat storage, or automation are implemented.

## Included

- WebsiteTheme backend model
- public active theme API
- admin theme CRUD/archive API
- active theme resolution helper
- Appearance admin page
- public announcement/homepage theme layer
- seed migration for editable default themes
- permissions `themes.read` and `themes.write`

## Explicit Exclusions

- No AI chatbot
- No Media Library
- No custom uploaded asset storage
- No per-page layout builder
- No full animation engine
- No Live at Cor integration
- No recruitment application workflow
