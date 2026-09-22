TABLET UX AUDIT — CMICLT

Now perform a dedicated tablet UX audit of the complete CMICLT application.

The mobile experience has already been audited and corrected. Do NOT undo or regress any mobile fixes.

Do NOT rebuild the application.
Do NOT redesign the product from scratch.
Do NOT add new features.
Do NOT introduce desktop layouts.

CMICLT supports MOBILE + TABLET ONLY.

The goal is to make the existing mobile-first design adapt intelligently to tablet while preserving the same visual identity, information architecture, components, and interaction language.

==================================================
TARGET TABLET SIZES
==================================================

Audit at:

- 768 × 1024
- 834 × 1194
- Tablet landscape

The application must work naturally in both portrait and landscape orientations.

==================================================
1. TABLET NAVIGATION
==================================================

Verify the tablet navigation rail.

Check:

- correct width
- safe-area handling
- icon alignment
- labels
- active state
- inactive state
- touch targets
- visual hierarchy
- content clearance
- scrolling behavior

The navigation rail should feel intentionally designed for tablet, not like a stretched mobile bottom bar.

Do not introduce a desktop-style navigation system.

==================================================
2. APP SHELL
==================================================

Check:

- top header
- navigation rail
- main content area
- page margins
- maximum content width
- safe areas
- scrolling
- dark mode
- orientation changes

The main content must never be awkwardly stretched across the entire tablet width.

Use appropriate content widths and spacing while preserving the established design language.

==================================================
3. HOME
==================================================

Audit the Home screen on tablet.

Check:

- profile/header area
- announcement card
- quick actions
- birthdays
- feast days
- news/content sections
- notification button

Use additional tablet space intelligently.

Where appropriate, related content can use:

- two-column layouts
- wider cards
- balanced grids

Do NOT simply stretch mobile cards across the entire tablet.

==================================================
4. MEMBERS
==================================================

Audit:

- member search
- recent searches
- filter chips
- member results
- member cards
- member profile

Use tablet width intelligently.

A two-column member grid is acceptable where it improves usability.

Ensure:

- names remain readable
- roles remain readable
- locations remain readable
- badges do not collide with content
- no horizontal page overflow
- adequate spacing between cards

The member detail experience should remain easy to navigate.

==================================================
5. EVENTS
==================================================

Audit:

- event filters
- calendar/list controls
- event list
- event cards
- event detail

Use the additional tablet space appropriately.

Where suitable, event cards can use a wider layout or two-column presentation.

Do not make the interface feel like a desktop calendar application.

==================================================
6. INSTITUTIONS
==================================================

Audit:

- search
- filter chips
- institution cards
- institution details

The institution grid should take advantage of tablet width.

Use an appropriate two-column or multi-column card layout where it improves usability.

Images must maintain consistent aspect ratios.

Text must not be clipped or unnecessarily truncated.

==================================================
7. MORE
==================================================

Audit:

- profile summary
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

Use tablet space intelligently while keeping the same navigation hierarchy.

==================================================
8. AUTHENTICATION
==================================================

Check all authentication screens at tablet sizes:

- Sign In
- Password
- Account activation
- OTP
- Create password
- Forgot password
- Error states
- Success states

The authentication experience should remain intentionally compact and focused.

Do NOT add unnecessary tablet-specific fields or panels.

Do NOT restore prototype controls or sample-data labels.

The initial Sign In screen remains:

CMICLT

Email address or registered phone number

Continue

Nothing unnecessary.

==================================================
9. ADMINISTRATOR EXPERIENCE
==================================================

Audit the Super Administrator suite on tablet.

Check:

- Admin dashboard
- User accounts
- Member management
- Member editing
- Content management
- Data import wizard
- Audit logs
- Security settings
- Backups
- Annual versions

Tablet can use additional space for:

- wider forms
- two-column form layouts
- structured lists
- richer data tables
- side-by-side information where appropriate

However:

Do NOT turn the interface into a desktop dashboard.

Keep it touch-first.

Interactive controls must remain comfortable for touch.

==================================================
10. RESPONSIVE COMPONENTS
==================================================

Check all reusable components at tablet sizes:

- Cards
- Buttons
- Inputs
- Search
- Filter chips
- Dialogs
- Bottom sheets
- Toasts
- Dropdowns
- Tabs
- Accordions
- Timelines
- Lists
- Tables
- Image galleries

Components must adapt without clipping or excessive empty space.

==================================================
11. TOUCH INTERACTION
==================================================

Maintain:

- minimum 44 × 44 px touch targets
- comfortable spacing between controls
- clear pressed states
- clear selected states
- accessible labels

Do not make tablet controls smaller simply because there is more screen space.

==================================================
12. LANDSCAPE
==================================================

Pay particular attention to tablet landscape.

Check:

- header height
- navigation rail
- content width
- two-column layouts
- forms
- dialogs
- bottom sheets
- scrolling
- keyboard/input layouts
- modal positioning

No important content should be hidden or clipped.

==================================================
13. DARK MODE
==================================================

Repeat the tablet audit in dark mode.

Check:

- contrast
- cards
- borders
- navigation
- forms
- badges
- announcements
- dialogs
- admin tables/lists

==================================================
14. DESIGN CONSISTENCY
==================================================

Preserve the established CMICLT design system:

- Emerald
- Warm cream
- Gold accent
- Typography
- Spacing
- Card styling
- Icons
- Buttons
- Navigation
- Shadows/borders
- Dark mode

Tablet should feel like the same CMICLT application, not a different product.

==================================================
15. IMPORTANT — NO DESKTOP
==================================================

CMICLT is NOT a desktop application.

Do not create:

- desktop breakpoint
- desktop sidebar
- desktop dashboard
- desktop navigation
- desktop-specific components
- mouse-first interactions

Tablet is the largest supported experience.

==================================================
16. REGRESSION CHECK
==================================================

After the tablet changes, verify that mobile remains correct at:

- 360 × 800
- 390 × 844

Specifically verify:

- zero unintended horizontal overflow
- bottom navigation
- safe areas
- member cards
- authentication
- Home announcement
- filter chips

Do not regress the fixes from the previous mobile audit.

==================================================
17. BUILD
==================================================

Run:

pnpm build

Do not make unrelated TypeScript changes.

The two existing tsc warnings in Input.tsx and MediaPages.tsx can remain unless they directly affect the tablet implementation.

Report:

1. Tablet problems found
2. Tablet problems fixed
3. Files/components changed
4. Any remaining issues
5. Mobile regression results
6. Build result