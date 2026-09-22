FINAL VISUAL POLISH AUDIT — CMICLT MOBILE/TABLET APP

The functional/authentication cleanup is complete and the build is clean.

Now perform a careful visual and interaction polish pass across the existing CMICLT application.

IMPORTANT:
This is NOT a redesign.
Do NOT change the information architecture, navigation structure, authentication flow, data model, routing, or feature set.

The goal is to make the existing app feel like a polished, native-quality institutional mobile/tablet application.

==================================================
1. GLOBAL VISUAL CONSISTENCY
==================================================

Review the entire application for consistency in:

- spacing
- padding
- margins
- typography hierarchy
- font sizes and weights
- line heights
- border radii
- card proportions
- icon sizing
- icon alignment
- button heights
- input heights
- section spacing
- divider usage
- badge/chip proportions
- shadows
- background surfaces
- text contrast

Use the existing CMICLT design tokens and visual language.

Do not introduce a new design system.

Make small, deliberate corrections only where something visibly feels inconsistent.

==================================================
2. MOBILE — 360×800 AND 390×844
==================================================

Audit every major screen at:

- 360×800
- 390×844

Check especially for:

- horizontal overflow
- clipped text
- awkward wrapping
- cards becoming too tall
- excessive empty space
- cramped content
- buttons below the fold unnecessarily
- bottom navigation safe-area behavior
- header safe-area behavior
- touch target sizes
- icon/button alignment
- filter-chip scrolling
- dialogs and bottom sheets
- keyboard/input layouts

All interactive targets should remain at least 44×44 px.

Nothing should require precision mouse interaction.

Do not introduce horizontal page scrolling.

==================================================
3. TABLET — PORTRAIT AND LANDSCAPE
==================================================

Audit:

- 768×1024
- 834×1194
- tablet landscape

The application must remain tablet-first rather than becoming a desktop web application.

Preserve the existing tablet navigation rail.

Check:

- content width
- maximum content width
- visual centering
- navigation rail proportions
- card/grid balance
- excessive whitespace
- header alignment
- dialogs/bottom sheets
- landscape composition

Do NOT introduce:

- desktop breakpoints
- desktop sidebar dashboards
- desktop-only layouts
- mouse-first controls

==================================================
4. HOME
==================================================

Polish:

- greeting/header hierarchy
- quick actions
- announcements
- upcoming events
- statistics/cards
- section spacing
- CTA hierarchy

Pay particular attention to the Province announcement card.

Ensure:

- headline has strong contrast
- description is readable
- Read more action is visually clear
- gold/emerald treatment remains restrained and institutional

Do not change the Home information architecture.

==================================================
5. MEMBERS
==================================================

Review:

- search field
- filter chips
- member cards
- avatars
- name/role hierarchy
- zone/province badges
- chevrons
- card spacing
- tablet grid

Ensure long member names never cause horizontal overflow.

Preserve the current corrected mobile layout:

name/role content must remain flexible and the zone/province information should remain on its own row where necessary.

==================================================
6. MEMBER PROFILE
==================================================

Polish:

- profile header
- avatar
- role/house information
- contact actions
- attendance history
- risk/trend visualization
- information hierarchy
- bottom sheets/drawers

Ensure important information is immediately scannable.

Do not add new functionality.

==================================================
7. EVENTS
==================================================

Review:

- segmented control
- event cards
- date/time hierarchy
- reminders
- status indicators
- spacing
- calendar/list presentation

Keep the segmented control touch-friendly.

Make event information easy to scan quickly.

==================================================
8. INSTITUTIONS
==================================================

Review:

- institution cards
- institution metadata
- phone/email/map actions
- tablet grid
- spacing
- action hierarchy

Make the primary information immediately readable without making cards unnecessarily tall.

==================================================
9. MORE / CONTENT
==================================================

Audit:

- More menu
- Province Home
- About
- Administration
- News
- Gallery
- Vocation
- Chavarul
- Contact
- My Account
- Settings

Ensure these screens share the same visual rhythm.

Remove visual inconsistencies between content-heavy and utility screens.

==================================================
10. ADMIN EXPERIENCE
==================================================

Polish the existing admin screens without changing functionality:

- dashboard
- user accounts
- member management
- member edit
- content management
- import wizard
- audit logs
- security
- backups/annual versions

Check:

- hierarchy
- tables/lists
- tabs
- accordions
- forms
- sticky actions
- dialogs
- tablet layout

Admin should feel like the same CMICLT application, but appropriately information-dense.

Do not turn it into a desktop admin dashboard.

==================================================
11. AUTHENTICATION SCREENS
==================================================

Do NOT change authentication behavior.

Only visually polish:

- Splash
- Sign In
- Activate
- Forgot Password
- OTP
- password creation
- error states
- locked/inactive states

Preserve the intentionally minimal initial Sign In screen:

CMICLT branding
→ email/registered phone
→ Continue

Do not reintroduce:

- prototype credentials
- demo buttons
- OTP demo codes
- Verify Membership
- public registration
- membership verification UI

==================================================
12. DARK MODE
==================================================

Review all major screens in dark mode.

Check:

- contrast
- card surfaces
- borders
- muted text
- icons
- emerald/gold accents
- charts
- badges
- dialogs
- bottom navigation
- tablet navigation rail

Dark mode should feel intentionally designed rather than simply inverted.

Do not introduce new colors outside the established design tokens unless absolutely necessary for accessibility.

==================================================
13. ACCESSIBILITY
==================================================

During the visual pass, verify:

- WCAG 2.2 AA contrast principles
- minimum 44×44 touch targets
- visible focus/pressed states where applicable
- readable text sizes
- meaningful icon buttons
- no color-only communication
- sufficient spacing between interactive controls

Do not sacrifice the existing visual language.

==================================================
14. FINAL QUALITY BAR
==================================================

Before making changes, identify only genuine visual/UX inconsistencies.

Then make the smallest set of changes necessary.

DO NOT:

- redesign screens
- add features
- remove features
- change navigation
- change authentication architecture
- change database/data structures
- add Malayalam
- add desktop layouts
- add Verify Membership
- add public registration
- add prototype/demo controls
- change the CMICLT branding
- replace the existing component architecture

After the polish pass:

1. Run:
   pnpm build

2. Confirm there are no build/type errors.

3. Verify the application at:
   - 360×800
   - 390×844
   - 768×1024
   - 834×1194
   - tablet landscape

4. Check both:
   - light mode
   - dark mode

5. Report:
   - files changed
   - visual/UX issues found
   - corrections made
   - build result
   - any remaining issues that should be handled in the final QA pass

Keep this pass focused and conservative.