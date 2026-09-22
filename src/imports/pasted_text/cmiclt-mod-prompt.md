# CMICLT — MINIMAL UI/UX MODIFICATION PROMPT

## CRITICAL INSTRUCTION

Modify the **existing CMICLT application only where required by the new Member/Admin architecture described below.**

**DO NOT redesign the entire application.**

The current CMICLT application already has working screens, navigation, components, authentication flows, layouts, responsive behavior and functionality.

**All existing working functionality must remain intact.**

Your task is to make **targeted modifications only**.

---

# 1. DO NOT BREAK THE EXISTING APPLICATION

The existing application is already functional.

Therefore:

### DO NOT:

* rewrite the application
* rebuild existing screens from scratch
* replace working components
* replace the existing design system
* change existing colors unnecessarily
* change typography unnecessarily
* change existing spacing unnecessarily
* change existing navigation unnecessarily
* remove working screens
* remove working components
* rename working routes unnecessarily
* change working authentication flows unnecessarily
* remove existing functionality
* introduce unnecessary new dependencies
* restructure files unnecessarily
* replace working mock/data logic unless specifically required
* change the existing mobile layout
* change the existing tablet layout
* change the existing splash screen unless specifically required
* introduce desktop layouts
* introduce public screens

**The current application must continue to work exactly as it does before these modifications.**

Think of this task as:

> **PATCH AND EXTEND — NOT REBUILD.**

---

# 2. EXISTING APPLICATION IS THE SOURCE OF TRUTH

Treat the current CMICLT codebase and Figma design as the source of truth.

Before making any modification:

1. Inspect the existing screens.
2. Inspect the existing navigation.
3. Inspect existing components.
4. Inspect the existing authentication flow.
5. Inspect existing Member functionality.
6. Inspect existing Admin functionality.
7. Identify what is already working.
8. Preserve all working functionality.

Only modify something when the requested architecture actually requires it.

If something already works correctly, **leave it unchanged.**

---

# 3. ONLY REQUIRED ARCHITECTURAL CHANGE

The required change is the access model.

CMICLT has:

### MEMBER

Authenticated Member users can access the existing Member application.

### ADMIN

Authenticated Admin users can access:

**Existing Member application + Admin functionality**

Therefore:

```text
                    CMICLT
                      │
                   Sign In
                      │
              Authentication
                      │
             Role determination
                      │
             ┌────────┴────────┐
             │                 │
          MEMBER             ADMIN
             │                 │
             ▼                 ▼
       Existing Member   Existing Member
          screens            screens
                                +
                           Admin screens
```

There is **NO PUBLIC APPLICATION**.

---

# 4. DO NOT CREATE PUBLIC SCREENS

Do not add:

* Public Home
* Public News
* Public Events
* Public Gallery
* Public Member Directory
* Public Province
* Public Institutions

The application is authenticated.

Existing authentication screens should remain exactly as they are unless a small change is specifically necessary.

---

# 5. MEMBER EXPERIENCE

The existing Member experience is already working.

**Keep it unchanged.**

Do not redesign the Member screens.

Do not change:

* Home
* Profile
* Province
* Institutions
* Events
* News
* Gallery
* Notifications
* Existing navigation
* Existing bottom navigation
* Existing tablet navigation rail

unless a change is strictly required to support the new role-based access model.

---

# 6. ADMIN EXPERIENCE

The existing Admin functionality should remain available.

The only required UX clarification is:

### Admin users are also Members.

Therefore, after signing in:

```text
ADMIN USER
    ↓
Existing Member Application
    ↓
Admin access available
```

Do NOT create a completely separate Admin application.

Do NOT create a separate Admin login.

Do NOT force Admin users into a different application shell.

Instead, add an appropriate **Administration entry point** to the existing authenticated experience.

---

# 7. ADMIN ENTRY POINT

Only users with the Admin role should see the Administration entry point.

For normal Members:

```text
Member UI
   ↓
No Administration option
```

For Admins:

```text
Member UI
   ↓
Administration
```

The Administration entry point should use the **existing CMICLT components and design language**.

Do not introduce a new visual style.

Possible locations should follow the existing application structure rather than forcing a new navigation pattern.

If the current Profile/More/settings area is already suitable, prefer using that existing location.

---

# 8. ADMIN SCREENS

Existing Admin screens are already working.

**Do not redesign them unless absolutely necessary.**

Preserve existing:

* Admin Dashboard
* User Management
* Member Management
* Content Management
* Imports
* Audit Logs
* Security
* Backups
* Existing Admin forms
* Existing Admin navigation

Only adjust their accessibility/entry point if required.

---

# 9. ROLE-BASED ACCESS

The important new behavior is:

```text
Authenticated Member
        │
        ▼
Member screens only
```

and:

```text
Authenticated Admin
        │
        ▼
Member screens
        +
Admin screens
```

The UI must not merely hide Admin buttons.

The application should conceptually follow role-based authorization.

The database/backend will ultimately enforce permissions using Supabase Row Level Security.

Do not expose Admin functionality to Member accounts.

---

# 10. EXISTING UI MUST REMAIN VISUALLY CONSISTENT

Do not create a new design system.

Reuse the existing:

* Buttons
* Cards
* Inputs
* Bottom sheets
* Dialogs
* Navigation
* Typography
* Colors
* Icons
* Status chips
* Avatars
* Form components
* Spacing
* Border radius
* Shadows
* Dark mode
* Tablet layouts

If an existing component can perform the required task, **reuse it instead of creating a new component.**

---

# 11. RESPONSIVE DESIGN

Do not change the existing responsive behavior.

The application remains:

* Mobile
* Tablet

It is NOT a desktop application.

Keep the current:

### Mobile

Existing bottom navigation and mobile layouts.

### Tablet

Existing tablet navigation rail and tablet layouts.

Do not redesign these systems.

Only make the smallest necessary adjustment for Admin access.

---

# 12. AUTHENTICATION

The current authentication flow is already working.

Keep it.

Do not replace:

* Sign In
* Account Activation
* OTP
* Password setup
* Forgot Password
* Session handling
* Existing authentication UI

unless a change is absolutely required for role detection.

If role detection needs to be added, add it **without changing the existing visual authentication experience.**

---

# 13. ROLE DETECTION

After successful authentication:

```text
Authentication successful
        ↓
Load authenticated user
        ↓
Determine role
        ↓
       ┌──────────────┐
       │              │
     MEMBER          ADMIN
       │              │
       ▼              ▼
 Member App      Member App
                    +
                Admin Area
```

The role should not require a separate login.

---

# 14. NO UNNECESSARY ROUTING CHANGES

Do not replace the current routing system.

Do not rename existing routes unless required.

Do not change working route paths unnecessarily.

If Admin routes already exist and work:

**Keep them.**

Only add or adjust the role guard if required.

---

# 15. NO UNNECESSARY FILE RESTRUCTURING

The proposed architecture may eventually use:

```text
features/
services/
repositories/
hooks/
```

However, **do not move all existing files simply to match this architecture.**

The existing application works.

Therefore:

> Do not perform a large-scale folder migration as part of this UI/UX task.

Only introduce new folders/files where genuinely necessary.

Avoid breaking imports and dependencies.

---

# 16. SUPABASE PREPARATION

The application is being prepared for a real Supabase data layer.

However:

**Do not replace working UI data with Supabase calls unless explicitly requested.**

For this modification:

* preserve existing UI
* preserve existing screens
* preserve existing interactions
* preserve existing mock data if currently required
* prepare the architecture carefully for future Supabase integration

Do not make a large backend migration during a UI modification.

---

# 17. ENGLISH ONLY

Keep the current English-only configuration.

Do not reintroduce:

* Malayalam
* language switcher
* LocaleContext
* Malayalam translation files

The application remains English-only.

---

# 18. EXISTING DARK MODE

Keep the existing Light/Dark mode exactly as it currently works.

Do not redesign the theme.

Any newly added Administration entry or minor UI elements must automatically follow the existing theme tokens.

---

# 19. EXISTING COMPONENTS

Before creating anything new, check whether an existing component can be reused.

For example:

If the existing application already has:

```text
Button
Card
TextInput
FilterChip
StatusChip
BottomSheet
Dialog
Avatar
ListItem
Navigation
```

reuse those components.

Do not create duplicate versions such as:

```text
AdminButton
AdminCard
AdminInput
AdminNavigation
```

unless there is a genuine functional requirement.

---

# 20. MINIMAL UI CHANGES ONLY

The ONLY UI/UX changes expected are those required to support:

### A. Role-aware application

Members see Member functionality.

Admins see Member functionality + Administration.

### B. Administration entry point

Add or adjust the smallest possible UI element that allows Admins to enter the existing Admin area.

### C. Permission states

If required, add minimal states for:

* Unauthorized
* Session expired
* Account disabled

Reuse existing error/empty/alert components whenever possible.

---

# 21. DO NOT CHANGE THESE

Unless explicitly requested later, leave these untouched:

```text
Splash Screen
Sign In
Account Activation
OTP
Password Setup
Forgot Password
Member Home
Member Profile
Province
Institutions
Events
News
Gallery
Notifications
Existing Admin Dashboard
Existing Admin screens
Existing bottom navigation
Existing tablet rail
Existing theme
Existing typography
Existing components
Existing spacing
Existing colors
Existing icons
Existing animations
Existing working interactions
```

---

# 22. SAFE IMPLEMENTATION RULE

Before modifying a screen, ask:

> "Is this change actually required by the new Member/Admin architecture?"

If the answer is NO:

**Do not change the screen.**

If the answer is YES:

Make the **smallest possible change**.

---

# 23. CRASH PREVENTION

This is extremely important.

Do not introduce modifications that could break the existing application.

After each change:

1. Verify imports.
2. Verify routes.
3. Verify component references.
4. Verify navigation.
5. Verify authentication flow.
6. Verify Member access.
7. Verify Admin access.
8. Verify mobile layout.
9. Verify tablet layout.
10. Verify light mode.
11. Verify dark mode.
12. Verify existing forms.
13. Verify existing buttons/actions.

Do not remove existing code merely because it appears unused unless you have verified that it is genuinely unused.

Do not rename files or exports unnecessarily.

Do not replace working components with new implementations.

---

# 24. EXPECTED RESULT

The final application should look almost identical to the current CMICLT application.

The difference should primarily be in **access and organization**, not visual redesign.

### Member:

```text
Sign In
   ↓
Existing CMICLT Member App
```

### Admin:

```text
Sign In
   ↓
Existing CMICLT Member App
   ↓
Administration
   ↓
Existing Admin functionality
```

The user should feel that this is the **same CMICLT application**, simply with improved role-based access.

---

# 25. FINAL INSTRUCTION

This is a **MODIFICATION TASK, NOT A REDESIGN-FROM-SCRATCH TASK.**

Preserve the existing application.

Preserve existing screens.

Preserve existing functionality.

Preserve existing UI.

Preserve existing navigation.

Preserve existing components.

Preserve existing responsive behavior.

Preserve existing authentication.

Only implement the specific changes required for:

**Authenticated Member + Authenticated Admin**

where:

**Admin = Member access + Admin access**

There is:

**NO PUBLIC SCREEN.**

Do not make broad changes.

Do not refactor unnecessarily.

Do not rewrite working code.

Do not remove working functionality.

Do not introduce unnecessary dependencies.

**Make the smallest safe changes possible and prioritize application stability above architectural purity.**
