# CMICLT — Implementation Plan (Figma Make React App)

## Context

CMICLT (CMI St. Thomas Province Calicut) is a mobile- and tablet-only institutional
application for a Catholic religious province. The deliverable is **the actual running
React + Vite + Tailwind v4 application inside Figma Make** — not Figma design files.
Every Figma-design-tool requirement in the master spec is translated to its running-code
equivalent (components→React components, variants→props/state, variables→design tokens,
Auto Layout→Flexbox/Grid, prototype links→React navigation).

The current scaffold is empty (`src/App.tsx` renders an empty div). This plan builds the
complete product from scratch, phased, on one cohesive design system.

**Non-negotiables (carried through both phases):**
mobile + tablet only · no desktop layouts/breakpoints/sidebar/dashboard · touch-first ·
≥44×44px targets · no "Verify Membership" feature · no public registration · account/member
status auto-detected from email/phone during Sign In · reusable components + tokens ·
EN + Malayalam-ready · light + dark mode · WCAG 2.2 AA · simulated auth + realistic mock data
(never claimed production-secure) · one coherent emerald/gold identity across both phases.

---

## 1. Application Architecture

- **Stack:** React 19 + Vite + Tailwind v4. No backend; all data is in-memory mock modules.
- **Routing:** Add `react-router-dom` (hash or memory router acceptable in the Make preview)
  for real navigation, deep-linkable screens, and back-stack behavior matching the prototype
  flows. Follow the `react-router` skill when wiring.
- **State (client-only, no external state lib needed):**
  - `AuthContext` — current user, role (`member` | `superadmin`), auth phase state machine,
    sign-in / activation / OTP / reset flows against mock data.
  - `ThemeContext` — `light | dark | system` (persisted to `localStorage`, respects
    `prefers-color-scheme` and `prefers-reduced-motion`).
  - `LocaleContext` — `en | ml`, string lookup, `dir`/font handling.
- **Data layer:** `src/data/*` mock modules (members, institutions, events, news, gallery,
  chavarul, vocation, admin metrics, audit logs, leadership). Simple async wrappers with
  artificial latency so loading skeletons are real. A `mockAuth` service encapsulates the
  account-status decision logic.
- **File organization:**
  ```
  src/
    main.tsx, App.tsx            # providers + router shell
    index.css                    # tokens, fonts, base layer
    tokens/                      # ts token maps mirroring CSS vars
    lib/                         # auth service, i18n, hooks (useMediaQuery, useLockBodyScroll)
    contexts/                    # Auth, Theme, Locale
    data/                        # mock data + types
    components/ui/               # design system primitives
    components/patterns/         # composite (MemberCard, EventCard, BottomSheet, ...)
    layouts/                     # AppShell, MobileTabBar, TabletRail, AuthLayout
    screens/auth|member|province|admin|account/
    i18n/en.ts, ml.ts
  ```

## 2. Mobile-First Information Architecture

Primary tab bar (5 destinations, icon + label, active clearly marked, safe-area padded):
**Home · Members · Events · Institutions · More**.
- **More** is a menu screen fanning out to: Province Home, About, Administration (leadership),
  News, Gallery, Vocation, Chavarul, Contact, My Account, Settings, and (role-gated) Admin.
- Home is editorial/card-based (NOT a dashboard): greeting + date + avatar + notifications,
  then province announcement → ≤4 quick actions → birthdays → feast days → upcoming events →
  latest news → province highlights → recently viewed members. Progressive disclosure.

## 3. Tablet Adaptation Strategy

Tablet is an **expansion of the same screens**, never a redesign. Same components, same
content model, more columns / larger media. Mechanism: a `useBreakpoint()` hook + container
layout props. The mobile bottom tab bar is replaced by a **collapsible left navigation rail**
(logo, the 5 destinations, Admin when applicable, user/role, sign out). No layout logic forks
into a "desktop" path — the widest layout is tablet-landscape, capped in max content width.

## 4. Complete Navigation Structure

- **AppShell** chooses `MobileTabBar` (<768px) vs `TabletRail` (≥768px) from one nav model.
- Stack navigation for detail screens (member profile, institution, event, article, reading).
- Modal layer: bottom sheets (mobile) / side panel or centered dialog (tablet) for filters,
  confirmations, pickers.
- Auth screens use a separate `AuthLayout` (no tab bar/rail).
- Admin lives under `/admin/*`, gated by role; entered via More → Admin and rail Admin section.

## 5. Authentication & Account Activation Flow

Single entry, status auto-detected — **no Verify Membership, no Register**.
**Progressive flow: never show a password field before the path is known.**
```
Splash → Sign In (step 1: email/phone ONLY + "Continue")
  → mockAuth.lookup(identifier):
     • active account          → step 2: reveal password → Sign In (+ optional OTP) → Home
     • member, no account yet  → "Activate your CMICLT account" → required validation
                                 → OTP → Create Password → Success → Home
     • unknown/ineligible      → neutral error (no DB details leaked)
```
- Activation is framed as part of Sign In, never "registration".
- **OTP:** 6-digit, countdown, resend, change contact; states default/entering/invalid/expired/resending/success.
- **Password creation:** new + confirm, show/hide, live strength + requirements checklist.
- **Forgot password:** email/phone → validate → OTP → new password → success → Sign In.
- **Auth states to design:** loading, invalid credentials, account not found, inactive, locked,
  OTP expired/invalid, resend, new-device verification, session expired, no internet, sign-out confirm.
  Every error states the next action. Mock users cover each branch (active member, admin,
  pending-activation member, locked, unknown).

## 6. Member Experience (Phase 1)

- **Directory:** search ("Search members…"), filter (bottom sheet: zone/house/institution/
  country/role/birthday month/feast month + active count + Apply/Clear), sort, result count,
  recent searches.
- **Results:** premium member cards (photo/initials, name, role, house, zone) — no verified
  badges; whole card is tappable.
- **Profile:** large photo header (name/role/house/zone) + Call/Email actions; sections
  Contact, Personal, Religious, and an **assignment-history vertical timeline**; expandable sections.

## 7. Province / Public-Content Experience (Phase 1)

- **Province Home** (editorial hero "Faith, service and community"): intro, latest news,
  province events, birthdays, feast days, Provincial Desk, spiritual quotation, media highlights.
- **About:** intro/history/founder/mission/spiritual heritage on a vertical timeline, chunked text.
- **Administration:** leadership cards (Provincial, Vicar, Councillors, Auditor) → detail.
- **Institutions:** search, category filters (religious houses, educational, social apostolate,
  healthcare, pastoral, missions), zone filters, card/list toggle → **Institution profile**
  (type, address, zone, phone, email, year, apostolates, head, residents; Call/Email/Open Map).
- **Events:** calendar + list views, month selector, categories (birthdays/feast/province/
  anniversaries/jubilees) using icon+shape+label not color alone → **Event details** (title/date/
  time/location/description; Add to Calendar/Reminder/Share; sticky bottom actions).
- **News:** featured + latest + categories + search → article (hero, category, title, date,
  author, content, related, share). **Gallery:** albums/photos/videos, 2-col mobile / larger
  tablet grid, full-screen swipe viewer. **Vocation:** Discern/Connect/Begin, formation stages,
  team contact, enquiry form. **Chavarul:** peaceful reading (featured, categories, read mode,
  bookmark, share). **Contact:** address/phone/email/map/office hours + form with success.
- **My Account** + **Settings** (Appearance light/dark/system, Language EN/ML, Notifications).

## 8. Super Administrator Experience (Phase 2)

Same shell, tokens, cards, sheets, forms — mobile/tablet only, no corporate dashboard styling.
- **Admin dashboard:** compact stat cards (active members, pending activations, locked accounts,
  failed logins, houses/institutions, upcoming events, recent changes, data-quality warnings).
- **User accounts:** tabs Active/Pending/Inactive/Locked; actions activate/deactivate/unlock/
  reset password/resend activation/login history.
- **Member management:** search/filter/list; add/edit/archive/restore; photo upload;
  change assignment; update contact. **Member edit:** accordion sections + validation + sticky
  Save Draft / Publish Changes.
- **Content management** (news/events/gallery/vocation/chavarul/contact; Draft/Scheduled/Published).
- **Data import wizard:** 7 steps (upload → map → validate → dedupe → errors → review → confirm) with progress.
- **Audit logs** (user/action/record/date/time/device; filters; export; stacked cards mobile,
  structured list tablet). **Security** (OTP config, failed-login limit, session duration,
  new-device verification, password policy, admin 2FA; destructive = confirm).
  **Backups & annual versions** (last backup, create/restore, compare years, publish; confirm gates).

## 9. Reusable Design System & Component Architecture

Built **before** screens (Phase 1, foundation step). All Auto-Layout equivalents via flex/grid,
all states via props.
- **Primitives (`components/ui`):** Button (primary/secondary/outline/text/icon), TextInput,
  PasswordInput, PhoneInput, SearchField, OtpInput, Dropdown/Select, FilterChip, StatusChip,
  Avatar, CalendarTile, BottomSheet, Dialog, Toast, Skeleton, EmptyState, ErrorState, SuccessState,
  Badge-free by default.
- **Patterns:** InfoCard, MemberCard, InstitutionCard, EventCard, NewsCard, GalleryCard, StatCard,
  AdminActionCard, SectionHeader, Timeline, Accordion, StickyActionBar.
- **States per interactive component:** default/pressed/focused/selected/disabled/loading/error/
  success. **No hover-dependent behavior** (pressed/active only; hover is decorative enhancement).

## 10. Responsive Behavior

Single source of truth via `useBreakpoint`; only these tiers exist (no desktop):
- **360×800:** single column, 16px h-padding, compact cards, full-width inputs, bottom nav, readability first.
- **390×844:** single column, 16–20px padding, comfier spacing, larger previews.
- **768×1024:** nav rail, two-column cards, two-column forms, expanded content.
- **834×1194:** nav rail, two/three-column, larger media, list/detail layouts.
- **Tablet landscape:** expanded rail (labels), two/three-column grids, list/detail, larger content —
  content max-width capped so it never becomes a desktop layout.
Acceptance: no horizontal overflow, no clipped content, no <44px controls at any tier.

## 11. Light & Dark Mode

- Tokens defined as CSS custom properties in `index.css`, themed via a `.dark` class on `<html>`
  (Tailwind v4 `@custom-variant dark`). Mirrored in `tokens/` for JS use.
- Light base `#F6F8F5`, cards `#FFFFFF`; dark is intentionally designed (deep emerald-tinted
  neutrals, not inverted), preserving emerald identity and ≥4.5:1 text contrast. Gold stays a
  sparing accent (feast days, key CTAs, spiritual highlights) in both modes.
- Palette tokens: dark-emerald `#064E3B`, emerald `#0D684F`, secondary `#15805F`, light-emerald
  `#ECF8F2`, gold `#D7A33D`, light-gold `#FFF6DF`, text `#17211D`/`#647068`, border `#DDE5E0`,
  success `#16875B`, warning `#C98616`, error `#C94747`. Spacing 4/8/12/16/24/32/40/48; card
  radius 20–24, input 12–16; subtle shadows only.

## 12. English & Malayalam Localization

- All UI copy through i18n dictionaries (`en.ts`, `ml.ts`); no hardcoded strings in components.
- **No fixed-width text containers** — flex containers wrap/grow; nav labels, buttons, chips tested
  with longer Malayalam strings. Malayalam-capable webfont loaded (e.g. Noto Sans Malayalam) with
  Inter/Lora fallback stack; headings Lora/Merriweather, interface Inter — all via Google Fonts CSS2
  `@import` at top of `index.css`.

## 13. Accessibility (WCAG 2.2 AA)

≥4.5:1 text contrast, ≥44×44 targets, semantic landmarks/headings, labeled form controls,
visible focus states, error text **plus icon**, respects increased text size (rem units),
`prefers-reduced-motion`, screen-reader-friendly names, never essential text baked into images.

## 14. Prototype Flows (all clickable)

1 First-time activation · 2 Returning member · 3 Member search→profile→call/email ·
4 Event→reminder · 5 Institution→call/email/map · 6 News→article→share ·
7 Admin→user accounts→unlock→confirm · 8 Admin→member edit→save→success ·
9 Admin→data import→…→confirm→success. All implemented as real React navigation + interactions.

## 15. "Figma Page" Organization → App Structure

The 13 spec pages map to `screens/` folders + route groups (auth, member, province, admin,
account) and the `components/ui` + `components/patterns` library. Prototype Flows = the wired
router; Developer Handoff = component structure conventions below.

## 16. Developer Handoff Requirements

Typed component props, centralized tokens (CSS vars + `tokens/`), consistent naming, one card/
button/input/nav implementation reused everywhere (§64), colocated screen files, mock-data types
that mirror real entities so a future backend swaps the data layer only.

## 17. Quality-Control & Testing Strategy

Per-screen audit: alignment, spacing, typography, contrast, touch targets, overflow, nav/component
consistency, empty/loading/error/success states, dark mode, Malayalam. Manual pass at all five
size tiers via the Make preview. Run `build`/typecheck only when broad changes warrant it. Phase 1
must be fully navigable and polished before Phase 2; Phase 2 reuses the frozen design language
(no restyle).

---

## Build Sequence

**Phase 1 — Foundation → Auth → Member → Province (fully polished, navigable first).**
Order: tokens/theme/i18n/fonts → design-system components → AppShell + nav (mobile tab bar +
tablet rail) → mock data + mockAuth → auth flow (splash, sign-in, activation, OTP, password,
forgot) → Home → Members (directory/search/filter/results/profile) → Institutions → Events →
Province (home/about/admin-leadership/news/gallery/vocation/chavarul/contact) → My Account +
Settings → states pass → responsive + dark + Malayalam audit.

**Phase 2 — Super Administrator**, reusing the exact Phase 1 system (no redesign): admin
dashboard → user accounts → member management/edit → content management → data import wizard →
audit logs → security → backups/annual versions → admin states/workflows → final audit.

## Open Decisions / Assumptions (flag before/at build)

- **Router:** will add `react-router-dom` (memory/hash router for the Make preview). Assumed OK.
- **Malayalam font:** will use Noto Sans Malayalam via Google Fonts unless you prefer another.
- **Mock content depth:** realistic but representative (e.g. ~30–40 members, ~10 institutions,
  ~20 events, ~10 news, sample gallery/chavarul/vocation) — enough to look complete, not exhaustive.
- **Malayalam copy:** UI labels fully translated; long-form body content (news/chavarul/about) may
  ship EN with ML-ready layout and a subset translated unless you want full ML body content.

## Verification

Run the app in the Figma Make preview and walk each prototype flow at 360×800, 390×844, 768×1024,
834×1194, and tablet-landscape widths, in both light and dark mode and both languages, confirming
no overflow/clipping, ≥44px targets, and correct auth branching. Run a production `build` after
each phase to catch type/build errors.

---

## Addendum — Authentication UX Audit (final fix)

### Context
The authentication UX audit (`src/imports/pasted_text/authentication-ux-audit.md`) is essentially
complete: identifier validation, generalized error banner, reachable OTP expired state + resend,
`pw.mismatch` copy, and neutralized prototype references are all in place. The one remaining
audit item is **§11 Back Navigation**. In `Activate.tsx`, `Forgot.tsx`, and `SignIn.tsx`, the OTP
and password sub-steps are internal `step` state within one route, but `AuthLayout`'s back button
hardcodes `nav(-1)`, which pops the entire route back to `/signin` instead of stepping to the
previous sub-step — a navigation trap the audit explicitly forbids.

### Change
Add an optional `onBack?: () => void` to `AuthLayout` (already added) and make its back button
call `onBack` when provided, otherwise fall back to `nav(-1)`. Then pass a per-step `onBack`:

- `src/screens/auth/AuthLayout.tsx` — back button `onClick={onBack ?? (() => nav(-1))}`.
- `src/screens/auth/Activate.tsx` — OTP step `onBack={() => setStep('intro')}`; password step
  `onBack={() => setStep('otp')}`; intro step keeps default (`nav(-1)` → Sign In).
- `src/screens/auth/Forgot.tsx` — OTP step `onBack={() => setStep('identify')}`; password step
  `onBack={() => setStep('otp')}`; identify step keeps default (`nav(-1)`).
- `src/screens/auth/SignIn.tsx` — admin OTP step `onBack={() => setStep('password')}`.

No visual/design changes; no architecture change; no Verify Membership / registration / demo
controls introduced.

### Verification
Run `pnpm build` (must pass), then in preview walk: existing account, activation, unknown
identifier, incorrect password, locked account, forgot password, invalid/expired/resend OTP,
password creation, sign in, and sign-out→sign-in — in light and dark mode at 360×800, 390×844,
768×1024, 834×1194, and tablet landscape. Confirm every OTP/password Back returns to the prior
sub-step (no exit trap) and no prototype credentials/codes appear anywhere.
