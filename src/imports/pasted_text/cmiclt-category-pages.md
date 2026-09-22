# CMICLT — POLISH INTERNAL CATEGORY PAGES

## CRITICAL INSTRUCTION

The current CMICLT application is already working correctly.

**DO NOT redesign the application.**

**DO NOT modify the More screen structure.**

**DO NOT modify authentication, routing architecture, Member screens, Admin screens, bottom navigation, tablet navigation, theme, colors, typography system, or existing functionality.**

This task is ONLY to improve the visual presentation of the **internal category pages opened from More**.

The current More screen is already the visual reference.

The internal category pages currently look too plain/dull because they use simple text rows inside a large white container.

Make these internal pages feel as polished as the existing More menu.

---

# 1. VISUAL REFERENCE

Use the existing **More screen** as the primary design reference.

The existing More buttons already have:

* rounded grouped containers
* soft border
* subtle shadow
* generous spacing
* pale green circular icon backgrounds
* green line icons
* strong readable titles
* right-facing chevrons
* clean separators
* premium institutional appearance

The internal category pages should use the same visual language.

Do NOT invent a completely new component style.

---

# 2. CURRENT PROBLEM

Current category page:

```text
Leadership & Administration

┌────────────────────────────────────┐
│ CMI General Administration       › │
├────────────────────────────────────┤
│ St. Thomas Province Administration ›│
├────────────────────────────────────┤
│ CMI Provincial Administrations   › │
├────────────────────────────────────┤
│ Coordinators Abroad...            › │
├────────────────────────────────────┤
│ Department Councils              › │
└────────────────────────────────────┘
```

This looks too plain compared with the More screen.

It feels like a basic settings list rather than part of the polished CMICLT application.

---

# 3. NEW VISUAL DIRECTION

Transform the category items into **rich navigation rows**, similar to the More buttons.

Each item should have:

```text
┌──────────────────────────────────────────┐
│                                          │
│   ◯    CMI General Administration      › │
│        Administrative structure          │
│                                          │
└──────────────────────────────────────────┘
```

The secondary description is optional.

If a meaningful description is not available from the existing data, **DO NOT invent one**.

In that case use:

```text
┌──────────────────────────────────────────┐
│                                          │
│   ◯    CMI General Administration       ›│
│                                          │
└──────────────────────────────────────────┘
```

The important change is the **icon + spacing + visual hierarchy**, not invented content.

---

# 4. ICON CIRCLES

Every category item should have a circular icon container matching the existing More screen.

Use:

* same pale green background
* same green icon color
* same circular shape
* same approximate size
* same icon stroke weight

Example:

```text
       ┌─────────┐
       │   ♙     │
       └─────────┘
```

Do not use random colorful icons.

Keep the existing CMICLT green icon language.

---

# 5. SEMANTIC ICONS

Use appropriate existing icons where possible.

### CMI General Administration

Organization / hierarchy / institutional icon.

### St. Thomas Province Administration

Province / building / institutional icon.

### CMI Provincial Administrations

Organization / multiple buildings / hierarchy icon.

### Coordinators Abroad, Regional & Sub-regional Superiors

People / hierarchy icon.

### Department Councils

Group / people / council icon.

### Zones of St. Thomas Province

Map / location / region icon.

### Kristu Raja Sub-Region

Map / region / community icon.

---

# 6. DO NOT USE ICONS AS DECORATION ONLY

The icons should help users scan the list.

Every icon should have a meaningful relationship with its item.

Do not use the same generic icon for every row.

However, keep the icon family visually consistent.

---

# 7. ROW DESIGN

Each item should become a comfortable touch-friendly navigation row.

Recommended structure:

```text
[Icon Circle]   Title                           [Chevron]
```

Use approximately the same horizontal spacing as the existing More buttons.

The title should have:

* strong readable text
* existing CMICLT typography
* appropriate line height
* enough room for long names

The chevron should use the existing CMICLT chevron style.

---

# 8. LONG TITLES

Some items are long:

> Coordinators Abroad, Regional & Sub-regional Superiors

Do NOT force this into an extremely narrow single line.

Allow:

```text
[Icon]   Coordinators Abroad, Regional &
         Sub-regional Superiors             ›
```

Use a maximum of 2 lines where necessary.

The chevron must remain vertically centered.

Do not truncate important titles with unnecessary ellipses.

---

# 9. GROUPED CARD

Keep the items inside a single elegant grouped container, similar to the existing More menu.

Use:

* rounded corners
* subtle border
* subtle shadow
* internal dividers
* white/surface background
* existing CMICLT theme tokens

Example:

```text
┌─────────────────────────────────────────┐
│                                         │
│  ◯  CMI General Administration        › │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ◯  St. Thomas Province Administration › │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ◯  CMI Provincial Administrations     › │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ◯  Coordinators Abroad...              › │
│                                         │
└─────────────────────────────────────────┘
```

But make each row feel more spacious and polished than the current implementation.

---

# 10. DO NOT MAKE EACH ITEM A SEPARATE CARD

Do NOT do:

```text
┌───────────────┐
│ Item 1        │
└───────────────┘

┌───────────────┐
│ Item 2        │
└───────────────┘

┌───────────────┐
│ Item 3        │
└───────────────┘
```

That would make the screen visually noisy.

Instead use:

**ONE grouped rounded container containing multiple rich rows.**

This should match the More screen.

---

# 11. CATEGORY HEADER

The category page should have a clean navigation header.

Current problem:

The title:

> Leadership & Administration

is colliding with/going underneath the Dynamic Island.

Fix this.

The title must respect the device safe area.

Use the existing CMICLT header pattern but ensure:

* sufficient top safe-area padding
* title does not touch the Dynamic Island
* back button is clearly visible
* title is readable
* header height is appropriate

---

# 12. LONG CATEGORY PAGE TITLES

For:

**Leadership & Administration**

do not allow the title to overlap the Dynamic Island.

Use either:

### Option A — Compact two-line title

```text
‹

Leadership &
Administration
```

OR, preferably if the existing header supports it:

### Option B — Properly positioned single-line title

```text
‹    Leadership & Administration
```

with enough horizontal and top-safe-area space.

Use the existing header architecture.

Do not create a completely new navigation header.

---

# 13. SAFE AREA

This is important.

The page must respect:

* Dynamic Island
* notch
* status bar
* top safe area
* bottom home indicator
* existing bottom navigation area

The header must never visually collide with the Dynamic Island.

---

# 14. PAGE SPACING

Use the same visual rhythm as the More page.

Recommended hierarchy:

```text
Safe area

Header

Small spacing

Grouped content card

Bottom spacing

Existing bottom navigation
```

Do not leave a huge empty area between the header and the content.

Do not make the list unnecessarily narrow.

---

# 15. CATEGORY PAGE EXAMPLE

For:

### Leadership & Administration

Use:

```text
┌─────────────────────────────────────────┐
│                                         │
│  ‹   Leadership & Administration        │
│                                         │
└─────────────────────────────────────────┘


┌─────────────────────────────────────────┐
│                                         │
│  ◯  CMI General Administration        › │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ◯  St. Thomas Province Administration › │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ◯  CMI Provincial Administrations     › │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ◯  Coordinators Abroad, Regional &    │
│     Sub-regional Superiors             ›│
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ◯  Department Councils                › │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ◯  Zones of St. Thomas Province       › │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ◯  Kristu Raja Sub-Region             › │
│                                         │
└─────────────────────────────────────────┘
```

Again, use the **real existing CMICLT styling**, not the literal ASCII appearance.

---

# 16. APPLY TO ALL FIVE CATEGORY PAGES

Apply this same polished component to:

### Leadership & Administration

* CMI General Administration
* St. Thomas Province Administration
* CMI Provincial Administrations
* Coordinators Abroad, Regional & Sub-regional Superiors
* Department Councils
* Zones of St. Thomas Province
* Kristu Raja Sub-Region

### Church & Dioceses

* CMI Dioceses
* CMI Bishops
* Dioceses in the Province Territory

### Houses & Institutions

* Common Houses & Institutions
* CMI Houses & Institutions Abroad
* Status of the Houses & Title of the Heads

### Members & Formation

* Scholastics
* Members Under Formation
* Members Working/Studying in India
* Members under Prior General
* Members Abroad
* Seniority List of Members
* Our Departed Members

### Province Information

* History of Provincial Administration
* About the Province

Do not change the text.

Do not add fictional descriptions.

---

# 17. ITEM DETAIL / EMPTY STATE

Keep the existing behavior:

```text
Category
 ↓
Item
 ↓
Existing EmptyState
```

Do not invent information.

If the item currently displays:

> No information available yet

keep that functionality.

Only improve the navigation/list presentation.

---

# 18. DO NOT CHANGE THE MORE SCREEN

The current More screen is the reference design.

Do NOT redesign it.

Do NOT change:

* Profile card
* CMI Information grouping
* Administration grouping
* Account grouping
* bottom navigation
* icons
* spacing
* colors
* typography

Only use its visual language as inspiration for the internal category pages.

---

# 19. DARK MODE

The improved category pages must automatically use the existing dark-mode tokens.

Do not create a separate dark-mode design.

Use the same:

* background
* surface
* text
* border
* icon
* accent

tokens already used by More.

---

# 20. TABLET

Apply the same improvement to tablet.

Do not simply stretch the mobile card to the entire tablet width.

Use the existing tablet content width and layout rules.

Keep the existing tablet navigation rail unchanged.

---

# 21. REUSABLE COMPONENT

Create or update ONE reusable component for these category rows.

For example:

```text
MoreCategoryList
MoreCategoryItem
```

All five category pages should use the same component.

Do not duplicate five separate implementations.

The component should inherit/use existing CMICLT design tokens and components.

---

# 22. NO ARCHITECTURAL CHANGES

Do NOT change:

* authentication
* Supabase
* routing architecture
* role system
* Admin authorization
* Member screens
* Admin screens
* navigation architecture
* data architecture
* existing routes
* existing More categories
* existing functionality

This is purely a **visual polish of the internal More category pages**.

---

# 23. FINAL VISUAL GOAL

The More screen currently feels:

**Premium + polished + modern**

The category pages currently feel:

**Plain + generic + unfinished**

Bring the category pages up to the same visual quality as More.

The final relationship should feel like:

```text
MORE
│
├── Leadership & Administration
│       ↓
│   [same polished visual language]
│
├── Church & Dioceses
│       ↓
│   [same polished visual language]
│
├── Houses & Institutions
│       ↓
│   [same polished visual language]
│
├── Members & Formation
│       ↓
│   [same polished visual language]
│
└── Province Information
        ↓
    [same polished visual language]
```

The user should feel that the category pages are a natural continuation of the More screen.

**Do not make it flashy.**

Make it:

**Elegant • Clean • Premium • CMI-branded • Consistent • Touch-friendly • Calm**

Most importantly:

> **Keep everything that already works. Only improve the internal category-page presentation.**
