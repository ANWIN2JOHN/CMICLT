# CMICLT — MORE MENU ORGANIZATION & UI MODIFICATION

## CRITICAL: MODIFY ONLY WHAT IS REQUESTED

The existing CMICLT application is already fully designed and functional.

**DO NOT redesign the entire application.**

**DO NOT modify existing screens other than the More screen and the new secondary pages required by this task.**

The current design system, components, navigation, authentication, Member experience, Admin experience, colors, typography, spacing, dark mode, mobile layout and tablet layout are already approved and working.

This task is ONLY to improve the organization of the **More** section.

Think:

> **Modify and extend — do not rebuild.**

---

# 1. EXISTING MORE SCREEN

The current More screen contains:

* Member profile card
* Province Home
* About the Province
* Administration
* News
* Gallery
* Vocation
* Chavarul
* Contact
* My Account

The More screen currently uses the existing CMICLT design language.

**Preserve the existing visual style.**

Do not redesign the profile card.

Do not redesign the bottom navigation.

Do not redesign the existing Administration functionality.

Do not redesign My Account.

---

# 2. REMOVE THESE ITEMS FROM THE MORE SCREEN

Remove these individual entries from the More screen:

* Province Home
* News
* Gallery
* Chavarul
* Contact

Do not delete their underlying functionality or screens if they are used elsewhere.

This task only means:

> **Remove them from the More menu.**

Do NOT delete their code or functionality unless specifically required elsewhere.

---

# 3. KEEP THESE ITEMS

Keep:

### Profile Card

The existing member profile card at the top.

Example:

```text
JC

Fr. Jose Chirayath CMI
CMI Member
                                      ›
```

Keep its existing design.

---

### Administration

Keep the existing Administration entry.

IMPORTANT:

It must remain visible **ONLY to users with the Admin/Superadmin role**.

Normal Members must NOT see Administration.

Do not change the existing role-based authorization.

Do not create a second Admin login.

Do not create a separate Admin application.

---

### Vocation

Keep the existing Vocation entry.

Do not redesign the Vocation functionality.

---

### My Account

Keep the existing My Account entry.

Do not redesign the existing My Account functionality.

---

# 4. NEW MORE MENU STRUCTURE

Replace the removed individual information items with these grouped categories:

## CMI INFORMATION

### 1. Leadership & Administration

### 2. Church & Dioceses

### 3. Houses & Institutions

### 4. Members & Formation

### 5. Province Information

Keep:

### 6. Vocation

Then:

### ADMINISTRATION

Only for Admin/Superadmin users:

### 7. Administration

Then:

### ACCOUNT

### 8. My Account

---

# 5. FINAL MEMBER MORE SCREEN

For a normal Member, the More screen should approximately become:

```text
More

┌─────────────────────────────────────┐
│                                     │
│   JC    Fr. Jose Chirayath CMI    › │
│         CMI Member                  │
│                                     │
└─────────────────────────────────────┘


CMI INFORMATION

┌─────────────────────────────────────┐
│  Leadership & Administration       ›│
├─────────────────────────────────────┤
│  Church & Dioceses                 ›│
├─────────────────────────────────────┤
│  Houses & Institutions             ›│
├─────────────────────────────────────┤
│  Members & Formation               ›│
├─────────────────────────────────────┤
│  Province Information              ›│
├─────────────────────────────────────┤
│  Vocation                          ›│
└─────────────────────────────────────┘


ACCOUNT

┌─────────────────────────────────────┐
│  My Account                         ›│
└─────────────────────────────────────┘
```

Do NOT literally copy this ASCII design.

Use the existing CMICLT components and visual language.

---

# 6. ADMIN MORE SCREEN

For Admin/Superadmin users, show:

```text
More

[ Existing Profile Card ]


CMI INFORMATION

Leadership & Administration      ›
Church & Dioceses                ›
Houses & Institutions             ›
Members & Formation               ›
Province Information              ›
Vocation                          ›


ADMINISTRATION

Administration                    ›


ACCOUNT

My Account                        ›
```

The Administration item must NOT appear for normal Members.

---

# 7. GROUP 1 — LEADERSHIP & ADMINISTRATION

Create a secondary screen:

```text
Leadership & Administration
```

Use the existing CMICLT page structure.

Include:

1. CMI General Administration
2. St. Thomas Province Administration
3. CMI Provincial Administrations
4. Coordinators Abroad, Regional & Sub-regional Superiors
5. Department Councils
6. Zones of St. Thomas Province
7. Kristu Raja Sub-Region

Use a clean list layout.

Each item should have:

* appropriate existing icon style
* title
* chevron
* comfortable touch target
* divider where appropriate

Do not create large cards for every item.

Prefer the existing CMICLT grouped-list pattern.

---

# 8. GROUP 2 — CHURCH & DIOCESES

Create:

```text
Church & Dioceses
```

Include:

1. CMI Dioceses
2. CMI Bishops
3. Dioceses in the Province Territory

Use the same secondary-page layout as Leadership & Administration.

Consistency is extremely important.

---

# 9. GROUP 3 — HOUSES & INSTITUTIONS

Create:

```text
Houses & Institutions
```

Include:

1. Common Houses & Institutions
2. CMI Houses & Institutions Abroad
3. Status of the Houses & Title of the Heads

Use the same list pattern.

Do not create a new visual design.

---

# 10. GROUP 4 — MEMBERS & FORMATION

Create:

```text
Members & Formation
```

Include:

1. Scholastics
2. Members Under Formation
3. Members Working/Studying in India
4. Members under Prior General
5. Members Abroad
6. Seniority List of Members
7. Our Departed Members

Use the same list pattern.

Because this is a larger section, maintain excellent spacing and hierarchy.

Do not make the screen visually crowded.

---

# 11. GROUP 5 — PROVINCE INFORMATION

Create:

```text
Province Information
```

Include:

1. History of Provincial Administration

This section should be designed so additional province information can be added later without changing the layout.

For example:

```text
Province Information

History of Provincial Administration        ›
```

Do not add fictional content.

---

# 12. VOCATION

Keep the existing Vocation item and existing Vocation screen.

Do NOT redesign it.

Only ensure it remains correctly positioned in the More screen after the new grouping.

---

# 13. ADMINISTRATION

Keep the existing Administration entry and existing Admin screens.

IMPORTANT:

Do not redesign:

* Admin Dashboard
* Users
* Members
* Content
* Imports
* Audit
* Security
* Backups

The only change is its position within the More screen if necessary.

Role behavior must remain:

```text
Member
  ↓
No Administration item

Admin/Superadmin
  ↓
Administration item visible
```

---

# 14. MY ACCOUNT

Keep the existing My Account item and screen.

Do not redesign it.

---

# 15. NAVIGATION

When the user taps:

```text
Leadership & Administration
```

open:

```text
Leadership & Administration
```

When the user taps:

```text
Church & Dioceses
```

open:

```text
Church & Dioceses
```

etc.

Every secondary screen must have normal back navigation.

Example:

```text
More
  ↓
Members & Formation
  ↓
Senioriy List
```

The user must be able to return naturally:

```text
‹ Members & Formation
```

and:

```text
‹ More
```

Use the existing CMICLT navigation/back pattern.

Do not invent a new navigation system.

---

# 16. MOBILE DESIGN

Use the existing CMICLT mobile design.

The More screen must remain:

* clean
* scrollable
* comfortable to touch
* uncluttered
* visually consistent

Do not allow the More screen to become excessively long.

The grouping approach is specifically intended to keep the main More screen short.

---

# 17. TABLET DESIGN

The same functionality must work on the existing CMICLT tablet layout.

Do not create a separate tablet design language.

Use the existing tablet navigation rail and content layout.

Secondary pages should use the existing tablet content width and spacing rules.

Do not stretch narrow mobile lists unnecessarily across the entire tablet screen.

---

# 18. ICONS

Use the existing CMICLT icon library/style.

Suggested semantic icons:

### Leadership & Administration

Organization / hierarchy / people icon

### Church & Dioceses

Church / landmark icon

### Houses & Institutions

Building / institution icon

### Members & Formation

People / group icon

### Province Information

Information / book icon

### Vocation

Existing Vocation icon

### Administration

Existing Administration icon

### My Account

Existing account icon

Do not introduce a completely different icon style.

If existing CMICLT icons are already available, **reuse them**.

---

# 19. VISUAL DESIGN

Preserve the current CMICLT appearance.

Continue using:

* existing background
* existing green/CMI accent
* existing typography
* existing rounded cards
* existing divider style
* existing icon containers
* existing chevrons
* existing spacing
* existing shadows
* existing light mode
* existing dark mode

The new grouped items should look as though they have always been part of CMICLT.

---

# 20. GROUPED LIST DESIGN

The main More screen should use the same visual grouping style as the existing screen.

For example:

```text
CMI INFORMATION

┌─────────────────────────────────┐
│  Leadership & Administration › │
├─────────────────────────────────┤
│  Church & Dioceses            › │
├─────────────────────────────────┤
│  Houses & Institutions        › │
├─────────────────────────────────┤
│  Members & Formation          › │
├─────────────────────────────────┤
│  Province Information         › │
├─────────────────────────────────┤
│  Vocation                     › │
└─────────────────────────────────┘
```

Do not create separate large cards for every menu item.

The purpose is to reduce visual clutter.

---

# 21. SECONDARY PAGE DESIGN

All secondary category pages should follow one reusable pattern:

```text
←  Page Title

┌─────────────────────────────────┐
│  Item                           ›│
├─────────────────────────────────┤
│  Item                           ›│
├─────────────────────────────────┤
│  Item                           ›│
└─────────────────────────────────┘
```

Use the existing CMICLT list/card components.

Do not create a different layout for each category.

This keeps the application consistent and easier to maintain.

---

# 22. EMPTY / LOADING STATES

Do not invent data.

If a secondary destination does not yet have actual content, preserve the existing application's loading/empty state conventions.

For example:

```text
No information available yet.
```

Only use this where an actual content screen needs an empty state.

Do not put fake content into the design.

---

# 23. DO NOT DELETE FUNCTIONALITY

Removing an item from the More menu does NOT mean deleting its underlying feature.

Specifically:

```text
Province Home
News
Gallery
Chavarul
Contact
```

are only being removed from the More menu.

Do NOT delete their screens, components, routes or functionality if they are used elsewhere.

---

# 24. DO NOT MODIFY EXISTING SCREENS

Outside of:

* More screen
* new More category screens
* necessary navigation connections

DO NOT modify anything.

Do not touch:

* Home
* Members
* Events
* Institutions
* Profile
* Authentication
* Splash
* Admin screens
* Vocation screen
* My Account
* Theme
* Design tokens
* Bottom navigation
* Tablet navigation

unless technically necessary to connect the new More menu.

---

# 25. DO NOT CHANGE THE APP ARCHITECTURE

The existing Member/Admin access architecture is already correct.

Keep:

```text
Member
    ↓
Member App


Admin
    ↓
Member App
    +
Admin Area
```

Do not introduce:

* Public App
* Public routes
* separate Admin login
* separate Admin application
* new role system
* new authentication system

---

# 26. PROTOTYPE THE FOLLOWING FLOWS

Create clickable prototype interactions for:

### Flow 1

```text
More
 ↓
Leadership & Administration
 ↓
CMI General Administration
```

### Flow 2

```text
More
 ↓
Church & Dioceses
 ↓
CMI Bishops
```

### Flow 3

```text
More
 ↓
Houses & Institutions
 ↓
CMI Houses & Institutions Abroad
```

### Flow 4

```text
More
 ↓
Members & Formation
 ↓
Seniority List of Members
```

### Flow 5

```text
More
 ↓
Province Information
 ↓
History of Provincial Administration
```

### Flow 6 — Admin only

```text
More
 ↓
Administration
 ↓
Existing Admin Dashboard
```

---

# 27. DESIGN SYSTEM SAFETY

Reuse existing components wherever possible.

Before creating a new component, check whether an existing component already provides the required functionality.

Do NOT create duplicate:

* buttons
* cards
* list items
* icons
* headers
* navigation
* dialogs

unless absolutely necessary.

---

# 28. FINAL MORE SCREEN STRUCTURE

### NORMAL MEMBER

```text
More

Profile Card

CMI INFORMATION
├── Leadership & Administration
├── Church & Dioceses
├── Houses & Institutions
├── Members & Formation
├── Province Information
└── Vocation

ACCOUNT
└── My Account
```

### ADMIN / SUPERADMIN

```text
More

Profile Card

CMI INFORMATION
├── Leadership & Administration
├── Church & Dioceses
├── Houses & Institutions
├── Members & Formation
├── Province Information
└── Vocation

ADMINISTRATION
└── Administration

ACCOUNT
└── My Account
```

---

# 29. FINAL SAFETY RULE

This is a **small, targeted modification**.

The goal is NOT to make CMICLT look different.

The goal is simply:

**Make the More screen shorter, cleaner and better organized by grouping the new CMI information into logical categories.**

If something already works:

> **LEAVE IT ALONE.**

If a screen is not part of this task:

> **DO NOT MODIFY IT.**

If a component already exists:

> **REUSE IT.**

If a route already works:

> **DO NOT RENAME IT.**

If functionality is not being removed from the More menu:

> **DO NOT DELETE IT.**

If there is uncertainty:

> **Prefer preserving the existing implementation rather than changing it.**

The final result should look like the existing CMICLT application with a **cleaner and more organized More section**, not like a newly redesigned application.
