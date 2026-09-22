# CMICLT — GLOBAL SAFE-AREA / DYNAMIC ISLAND FIX

## ⚠️ CRITICAL: PATCH ONLY — DO NOT REDESIGN

The existing CMICLT application is already working correctly.

This task is ONLY to fix a global **top safe-area / Dynamic Island / status-bar spacing issue**.

### DO NOT:

* redesign any screen
* change any screen layout
* change colors
* change typography
* change font sizes
* change card sizes
* change buttons
* change icons
* change navigation
* change bottom navigation
* change tablet navigation
* change authentication
* change routes
* change Member/Admin logic
* change Supabase/data logic
* change existing functionality
* change existing animations
* change existing spacing except the top safe-area offset required for this fix
* manually reposition individual screen elements
* duplicate safe-area padding across components
* create a new design system

This is a **GLOBAL SAFE-AREA BUG FIX ONLY.**

The existing UI must look exactly the same after the fix, except that content must no longer be hidden behind the device status bar or Dynamic Island.

---

# 1. THE PROBLEM

On iPhone-style devices with a Dynamic Island, some existing screen content is positioned too close to the top of the physical display.

For example, on the Home screen:

```text
Good Afternoon
Fr. Thomas Kattady CMI
Tuesday, September 22
```

the title area can overlap or visually pass underneath the Dynamic Island.

The same problem may occur on other screens.

The issue is NOT with the individual screen designs.

The issue is with the **global top safe-area/content positioning**.

---

# 2. REQUIRED RESULT

Every screen must have enough space at the top for the system UI.

The visual hierarchy should be:

```text
┌───────────────────────────────┐
│                               │
│  SYSTEM STATUS BAR / SAFE AREA│
│                               │
│     Time                      │
│                    Signal     │
│                    Battery    │
│                               │
│        Dynamic Island         │
│                               │
├───────────────────────────────┤
│                               │
│      APPLICATION CONTENT      │
│                               │
│      Existing UI              │
│      Existing UI              │
│      Existing UI              │
│                               │
└───────────────────────────────┘
```

Application content must begin **below the effective top safe area**.

---

# 3. IMPORTANT: DO NOT MOVE THE DESIGN MANUALLY

Do NOT do this:

```text
Home.tsx
    padding-top: 30px

More.tsx
    padding-top: 25px

Members.tsx
    padding-top: 35px

Events.tsx
    padding-top: 28px
```

This would create inconsistent layouts.

Instead, find the **shared source of the screen/header layout** and fix the safe-area behavior there.

---

# 4. FIRST: AUDIT THE EXISTING IMPLEMENTATION

Before changing anything, inspect the existing codebase.

Find:

* AppShell
* Screen component
* shared screen header
* global layout
* safe-area implementation
* `--safe-top`
* top padding calculations
* viewport handling
* CSS environment variables
* `env(safe-area-inset-top)`
* Dynamic Island handling
* status-bar handling
* mobile layout wrapper
* tablet layout wrapper

Determine exactly where the application's top content position is controlled.

### DO NOT CREATE A SECOND SAFE-AREA SYSTEM

If a safe-area system already exists, improve/fix it.

For example, if the application already has:

```text
--safe-top
```

reuse it.

Do NOT create:

```text
--safe-top-new
--dynamic-island-padding
--iphone-top-padding
```

unless absolutely necessary.

---

# 5. USE THE EXISTING SAFE-AREA SYSTEM

If the project already uses something similar to:

```css
env(safe-area-inset-top)
```

continue using it.

The safe area should be based on the actual device/browser viewport rather than an arbitrary hard-coded value.

Preferred principle:

```css
padding-top:
    env(safe-area-inset-top)
```

or the existing equivalent already used by CMICLT.

Do not hard-code an iPhone-specific pixel value as the primary solution.

---

# 6. DYNAMIC ISLAND

The Dynamic Island is part of the device's top unsafe area.

The application must never place important content underneath it.

The following must always remain completely readable:

* page titles
* user names
* greetings
* back buttons
* profile information
* action buttons
* headers
* important notifications
* search fields
* tabs
* any interactive control

The Dynamic Island should never overlap application content.

---

# 7. STATUS BAR

The application must also leave room for the system status bar.

The top region must accommodate:

* time
* signal strength
* Wi-Fi
* battery
* system indicators

Do not treat the Dynamic Island as the only top obstruction.

The complete effective safe area must be respected.

---

# 8. SHARED HEADER

If the existing `Screen` component/shared header already handles:

```text
--safe-top
```

verify that the padding is actually applied to the correct parent/container.

The desired structure is:

```text
Screen
│
├── Safe-area top inset
│
├── Header
│
└── Content
```

NOT:

```text
Screen
│
├── Header
│
└── Safe-area padding
       ↓
    Content
```

The header itself must be below the unsafe system area.

---

# 9. HEADER POSITIONING

For screens with headers:

```text
Safe Area
   ↓
Header
   ↓
Content
```

The back button and title must both be inside the safe area.

For example:

```text
┌───────────────────────────────┐
│     Status / Dynamic Island   │
│                               │
│  ←   Leadership & Admin       │
│                               │
├───────────────────────────────┤
│                               │
│  Existing page content        │
```

Do NOT alter the visual design of the header.

Only correct its vertical position.

---

# 10. HOME SCREEN

The Home screen currently demonstrates the problem.

Current problematic behavior:

```text
Dynamic Island
     ↓
Fr. Thomas Kattady CMI
```

where the name can be partially obscured.

After the fix:

```text
Dynamic Island
     ↓

Good Afternoon
Fr. Thomas Kattady CMI
Tuesday, September 22
```

The exact typography, sizes, spacing between these elements, colors and design must remain unchanged.

Only the **overall top content position** should move down as required by the safe area.

---

# 11. MORE SCREEN

The existing More screen is already visually correct.

Do NOT redesign it.

Do NOT alter:

* profile card
* More title
* CMI Information
* Administration
* Account
* bottom navigation

Only ensure that the More screen's top content also respects the global safe area consistently.

If it already does, **make no changes to it.**

---

# 12. CATEGORY PAGES

The existing category pages already use the shared Screen header.

Do not redesign them.

Only ensure that:

```text
Dynamic Island
      ↓
safe area
      ↓
header
      ↓
content
```

is consistently respected.

The category page title must never overlap the Dynamic Island.

---

# 13. BOTTOM NAVIGATION

DO NOT CHANGE THE BOTTOM NAVIGATION.

The existing bottom navigation already works.

Do not modify:

* height
* icons
* labels
* colors
* spacing
* active state
* positioning

Only verify that the top safe-area fix does not affect the bottom safe-area behavior.

---

# 14. BOTTOM SAFE AREA

Do not accidentally break the existing bottom safe-area handling.

The application must continue to respect:

```text
bottom home indicator
```

and existing bottom navigation spacing.

The fix must be isolated primarily to the **top safe area**.

---

# 15. TABLET

Do not assume that the same hard-coded mobile value applies to tablets.

The implementation should continue using the existing responsive/safe-area mechanism.

The tablet layout must remain visually unchanged.

If the tablet already works correctly:

**Do not modify it.**

---

# 16. ANDROID

The application must continue working correctly on Android.

Do not introduce iPhone-only CSS or layout behavior that breaks Android.

The implementation should use standards-based safe-area handling wherever possible.

The goal is:

```text
iPhone
   ✓ Dynamic Island
   ✓ Notch
   ✓ Status bar

Android
   ✓ Status bar
   ✓ Cutout devices

Tablet
   ✓ Existing layout
```

---

# 17. DO NOT USE A GIANT FIXED TOP PADDING

Do NOT solve the issue by adding something like:

```css
padding-top: 80px;
```

to every screen.

This would:

* waste screen space
* break devices with different safe areas
* create inconsistent layouts
* potentially break tablets
* cause double spacing

Use the existing safe-area mechanism.

---

# 18. AVOID DOUBLE SAFE-AREA PADDING

This is extremely important.

If:

```text
AppShell
```

already applies top safe-area padding and:

```text
Screen
```

also applies it, do not accidentally stack them.

The final layout should have **one effective top safe-area inset**.

Check for:

```text
AppShell
Screen
Header
Page
```

and determine where the safe-area responsibility belongs.

Keep the implementation centralized.

---

# 19. SAFE-AREA RESPONSIBILITY

Prefer this architecture:

```text
App Shell / Shared Screen
          │
          ▼
   Safe-area handling
          │
          ▼
       Header
          │
          ▼
       Content
```

rather than every screen independently calculating its own safe area.

---

# 20. PRESERVE EXISTING SCREEN DESIGN

After the fix, compare before and after.

The following should remain visually identical:

* font
* font weight
* font size
* color
* card size
* card radius
* icon size
* icon position
* button size
* horizontal spacing
* content width
* bottom navigation
* page structure

Only the top-level vertical placement should change where necessary.

---

# 21. SCREEN-BY-SCREEN VERIFICATION

After implementing the shared fix, inspect at minimum:

### Home

Verify:

```text
Good Afternoon
Fr. Thomas Kattady CMI
Tuesday, September 22
```

does not overlap the Dynamic Island.

### Members

Verify the header/content does not overlap the status bar.

### Events

Verify the header/content does not overlap the status bar.

### Institutions

Verify the header/content does not overlap the status bar.

### More

Verify the More title and profile card have appropriate top spacing.

### More Categories

Verify:

```text
‹ Leadership & Administration
```

does not overlap the Dynamic Island.

### Profile / My Account

Verify top content.

### Admin screens

Verify Admin headers.

### Authentication

Do NOT change the existing authentication design unless the same global safe-area issue is demonstrably present there.

---

# 22. DO NOT MODIFY SPLASH UNLESS NECESSARY

The Splash screen may have its own intentional composition.

Do not automatically apply the same content offset to the Splash screen.

Only modify it if it is actually being obscured by system UI.

---

# 23. DO NOT CHANGE THE DESIGN LANGUAGE

The current CMICLT visual language is approved.

Do not change:

* CMI green
* backgrounds
* cards
* shadows
* typography
* icons
* rounded corners
* spacing system

This task is purely about **physical viewport/safe-area positioning**.

---

# 24. ACCESSIBILITY / USABILITY

The safe-area fix must not reduce usable content unnecessarily.

Do not add excessive blank space.

The goal is:

```text
System UI
   ↓
Necessary safe area
   ↓
Existing application UI
```

not:

```text
System UI
   ↓
Huge empty area
   ↓
Application UI
```

Use the minimum correct safe-area inset provided by the platform/browser.

---

# 25. TEST MULTIPLE DEVICE SHAPES

Verify the layout conceptually against:

### iPhone Dynamic Island

* 393 × 852
* 430 × 932

### iPhone with notch

* 390 × 844
* 375 × 812

### Android

Common status-bar/cutout layouts.

### Tablet

Existing CMICLT tablet frame.

The design must remain responsive.

---

# 26. CODE SAFETY

Before modifying code:

1. Identify the shared safe-area implementation.
2. Identify all components that consume it.
3. Make the smallest possible change.
4. Avoid unrelated refactoring.
5. Do not rename files.
6. Do not rename exports.
7. Do not move files.
8. Do not replace components.
9. Do not introduce unnecessary dependencies.

---

# 27. VALIDATION

After the change, run:

```bash
pnpm build
```

and:

```bash
pnpm exec tsc --noEmit
```

Both must pass.

If either fails:

**Fix the regression before completing the task.**

---

# 28. FINAL ACCEPTANCE CRITERIA

The task is complete ONLY if:

### Top Safe Area

* [ ] No important application text is hidden behind Dynamic Island.
* [ ] No header overlaps the status bar.
* [ ] No back button overlaps the status bar.
* [ ] No profile information overlaps the Dynamic Island.
* [ ] Home greeting/name/date are fully visible.
* [ ] More title is fully visible.
* [ ] Category page titles are fully visible.

### Existing UI

* [ ] Existing colors unchanged.
* [ ] Existing typography unchanged.
* [ ] Existing cards unchanged.
* [ ] Existing icons unchanged.
* [ ] Existing navigation unchanged.
* [ ] Existing bottom navigation unchanged.
* [ ] Existing functionality unchanged.
* [ ] Existing Admin/Member behavior unchanged.

### Responsive

* [ ] iPhone Dynamic Island works.
* [ ] iPhone notch works.
* [ ] Android remains functional.
* [ ] Tablet remains functional.
* [ ] Bottom safe area remains correct.

### Technical

* [ ] No duplicated safe-area padding.
* [ ] No hard-coded giant top padding.
* [ ] Shared safe-area implementation used.
* [ ] `pnpm build` passes.
* [ ] `pnpm exec tsc --noEmit` passes.

---

# 29. MOST IMPORTANT INSTRUCTION

**DO NOT TURN THIS INTO A UI REDESIGN.**

The existing CMICLT UI is approved.

The only problem being solved is:

> **Application content is too close to the top of the physical device and can be hidden behind the Dynamic Island/status bar.**

Fix the **shared safe-area positioning once**, so all affected screens automatically receive the correct top spacing.

Do not manually redesign or reposition individual screens.

### Desired result:

```text
BEFORE

Dynamic Island
████████████████
Fr. Thomas Kattady CMI  ← partially hidden


AFTER

Dynamic Island
████████████████

Fr. Thomas Kattady CMI  ← completely visible
```

**One global safe-area fix. Zero unnecessary UI changes. Zero functionality changes.**
