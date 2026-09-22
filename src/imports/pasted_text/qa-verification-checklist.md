FINAL QA — LIVE VIEWPORT AND INTERACTION VERIFICATION

The visual polish pass is complete. Do NOT make another broad visual redesign.

The purpose of this task is now verification, with focused fixes only if a genuine defect is discovered.

Before testing, hard-reload the running preview to clear any Vite/browser cache.

Verify the application in:

MOBILE
- 360×800
- 390×844

TABLET PORTRAIT
- 768×1024
- 834×1194

TABLET LANDSCAPE
- appropriate tablet landscape viewport

Test BOTH:
- Light mode
- Dark mode

==================================================
1. GLOBAL LAYOUT
==================================================

Verify every major screen for:

- zero unintended horizontal page overflow
- no clipped text
- no clipped icons
- no content hidden behind the bottom navigation
- no content hidden behind the tablet navigation rail
- correct top safe-area handling
- correct bottom safe-area handling
- consistent page padding
- correct scrolling behavior
- no accidental desktop layout
- no mouse-dependent interaction

==================================================
2. TOUCH INTERACTION
==================================================

Verify that all interactive controls have comfortable touch targets.

Pay particular attention to:

- header buttons
- back buttons
- icon-only buttons
- filter chips
- segmented controls
- switches/toggles
- bottom navigation
- tablet navigation rail
- list/card actions
- dialog actions
- bottom-sheet actions

Minimum target: 44×44 px.

Do not visually enlarge controls merely to achieve the target if a transparent hit-area wrapper already provides the correct target.

==================================================
3. AUTHENTICATION WALKTHROUGH
==================================================

Test:

Sign In:
identifier → Continue → password → Sign In

Admin:
identifier → Continue → password → OTP → Sign In
OTP Back → password

Activate:
identifier → Continue → Activate account → validation → OTP → password → success
OTP Back → intro
Password Back → OTP
Intro Back → Sign In

Forgot Password:
identify → OTP → password
OTP Back → identify
Password Back → OTP
Identify Back → previous route

Also verify:

- unknown identifier shows neutral error
- locked/inactive account behavior remains correct
- incorrect password error remains correct
- invalid OTP behavior
- expired OTP behavior
- resend OTP behavior
- password creation behavior
- sign-out returns to Sign In

Do NOT reintroduce prototype credentials or demo OTP codes.

==================================================
4. PRIMARY APPLICATION FLOW
==================================================

Verify:

Home
→ Members
→ Member Profile
→ Events
→ Institutions
→ More
→ Settings

Check that navigation works and the selected navigation state is visually correct.

Verify:

- member search
- member filters
- member profile actions
- event interactions
- institution phone/email/map actions
- news/content navigation
- settings controls
- theme switching

==================================================
5. ADMIN FLOW
==================================================

Verify:

Admin Dashboard
→ User Accounts
→ Member Management
→ Member Edit
→ Content Management
→ Import Wizard
→ Audit Logs
→ Security
→ Backups/Annual Versions

Check:

- tabs
- accordions
- forms
- sticky actions
- dialogs
- switches
- tablet navigation
- scrolling

Do not redesign the admin experience.

==================================================
6. DARK MODE
==================================================

Verify major screens in dark mode.

Pay special attention to:

- emerald accents
- gold accents
- muted text
- cards
- borders
- badges
- charts
- dialogs
- bottom navigation
- tablet navigation rail

Confirm there are no low-contrast or visually broken states.

==================================================
7. RESPONSIVE CHECK
==================================================

Confirm:

360×800:
- no overflow
- no cramped controls
- no clipped content

390×844:
- comfortable spacing
- no excessive empty space

768×1024:
- tablet layout activates correctly
- navigation rail works
- content remains centered

834×1194:
- tablet layout remains balanced
- no excessive stretching

Tablet landscape:
- no desktop conversion
- content remains usable
- navigation remains touch-first

==================================================
8. ONLY FIX REAL DEFECTS
==================================================

If a genuine rendering or interaction defect is found:

- fix only that specific issue
- preserve the existing design
- preserve the existing architecture
- do not refactor unrelated code
- do not add features

If everything passes, make NO code changes.

==================================================
9. FINAL BUILD
==================================================

Run:

pnpm build

Confirm:

- build succeeds
- no TypeScript errors
- no build errors

Then report:

1. Viewports tested
2. Light/dark modes tested
3. Authentication paths tested
4. Main application paths tested
5. Admin paths tested
6. Any defects found
7. Any focused fixes made
8. Final build result
9. Any remaining issues, if any

IMPORTANT:
If the live preview cannot actually be interacted with or rendered at the requested viewports, explicitly say which verification could not be performed rather than claiming it passed.