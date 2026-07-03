# Website Theme Manager - Postponed

Status: postponed. The Website Theme Manager is not active in the current product.

The active backend/admin/frontend implementation has been removed for now: no Appearance / Website Themes admin page, no Theme Manager sidebar item, no mounted public or admin theme APIs, no active theme resolver in product code, no public theme fetch, and no public announcement/homepage decoration layer. The normal ASK website design, ASK colors, bilingual frontend/backoffice, and core modules remain in place.

## Reason

Theme Manager is not a core priority right now, and activation/rendering created confusion while Organization, Booking, Governance, Student Representatives, and Collaborations are still being completed. The idea should return only after the core platform is stable.

## Data and Migrations

The previous `018-website-themes` migration and active seed path are no longer part of the active migration list. Existing production or development databases may still contain old `websitethemes` records and `themes.read` / `themes.write` permissions if the old migration already ran. Those records are intentionally left unused; no destructive cleanup or rollback is performed.

## Future Scope Retained

Future work may revisit a governed campaign/theme system with:

- Gulis/Freshers duck theme
- recruitment campaign themes
- seasonal campaign presentation
- media governance before any mascot or theme assets are committed or uploaded
- route/page preview before activation

## ASKungen Future Chatbot Identity

ASKungen remains a future mascot/chatbot identity concept based on:

- yellow duck mascot
- friendly student union helper tone
- bilingual Swedish/English support
- optional future connection to student support, recruitment, and navigation workflows

No ASKungen chatbot, mascot runtime, uploaded asset storage, animation engine, or active website theme feature exists in the current product.
