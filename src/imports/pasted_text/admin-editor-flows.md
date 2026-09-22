COMPLETE THE THREE ADMIN EDITOR FLOWS — FUNCTIONAL IMPLEMENTATION

The current New Member, Edit Member, and New Content actions are placeholder/toast-only actions.

Do not merely wire the buttons to empty screens.

I want the actual existing editor functionality to open and work.

IMPORTANT:
First inspect the existing codebase and identify which editor components, routes, forms, validation logic, and reusable UI components already exist.

REUSE existing implementations wherever possible.

Do NOT create duplicate editors.

==================================================
1. MEMBER CREATION
==================================================

New Member must open the actual Member Editor.

The editor must support the member-management requirements already defined in the application:

- Personal details
- Photograph
- Religious details
- Contact information
- Assignment
- House
- Institution
- Zone
- Relevant dates
- Validation

Actions:

- Save Draft
- Publish Changes

Use the existing accordion/section structure if already implemented.

The Save Draft and Publish Changes actions must produce the appropriate success state and return/update the member-management list appropriately.

==================================================
2. MEMBER EDITING
==================================================

Selecting an existing member for editing must open the same Member Editor in EDIT mode.

Populate the form with that member's existing data.

Support:

- editing personal details
- editing religious details
- editing contact information
- changing assignment
- changing house/institution/zone
- photograph handling
- validation
- Save Draft
- Publish Changes

Do not create a separate edit form.

Reuse the same Member Editor with create/edit state.

==================================================
3. MEMBER MANAGEMENT ACTIONS
==================================================

Verify that the existing member-management screen supports the intended actions:

- Add member
- Edit member
- Archive member
- Restore member
- Upload photograph
- Change assignment
- Update contact information

If an action is already implemented, do not rewrite it.

Only complete missing functionality.

==================================================
4. CONTENT CREATION
==================================================

New Content must open the existing Content Editor.

The Content Editor must support the content-management types already defined:

- News
- Events
- Gallery
- Vocation
- Chavarul
- Contact information

Support content lifecycle states:

- Draft
- Scheduled
- Published

The editor should dynamically show the appropriate fields for the selected content type.

Reuse existing content components and data structures wherever available.

==================================================
5. NEWS EDITOR
==================================================

Where applicable, support:

- Title
- Category
- Featured image
- Author
- Date
- Article content
- Related content
- Status
- Save Draft
- Schedule
- Publish

==================================================
6. EVENT EDITOR
==================================================

Where applicable, support:

- Event title
- Date
- Time
- Location
- Description
- Event category
- Reminder-related information
- Status
- Save Draft
- Schedule
- Publish

==================================================
7. CONTENT EDITING
==================================================

If existing content items can be selected from Content Management, verify that selecting/editing an existing item opens the same Content Editor in EDIT mode.

Existing content data must be populated.

Do not create a separate editor for editing.

==================================================
8. NAVIGATION
==================================================

The flows must be:

New Member
→ Member Editor

Edit Member
→ Member Editor with existing data

New Content
→ Content Editor

Edit Content
→ Content Editor with existing data

Back from editor
→ previous management screen

Successful Save/Publish
→ appropriate success confirmation
→ return/update the management list

Remove placeholder-only behavior such as:

“New member form opened”

“New content editor opened”

A toast may still be used as confirmation, but it must accompany the actual operation rather than replace it.

==================================================
9. MOBILE + TABLET
==================================================

All editors must work at:

360×800
390×844
768×1024
834×1194
tablet landscape

Preserve the existing mobile/tablet architecture.

Do not introduce desktop layouts.

Use:

- mobile stacked forms
- accordion sections where appropriate
- sticky bottom action bar on mobile
- appropriate expanded layout on tablet

Maintain minimum 44×44 touch targets.

==================================================
10. DATA
==================================================

This is still a prototype/mock-data application.

Use the existing mock data/context/state architecture.

Do not introduce a real backend or database.

However, actions should behave realistically within the prototype:

- create member
- update member
- save draft
- publish
- create content
- update content
- change status

The updated state should be reflected when returning to the relevant list.

==================================================
11. DO NOT CHANGE
==================================================

Do NOT change:

- authentication
- routing architecture
- existing design system
- navigation architecture
- splash screen
- branding
- light/dark mode
- mobile/tablet-only requirement
- English-only requirement
- existing working features

Do NOT add:

- Verify Membership
- public registration
- Malayalam
- desktop layouts
- unrelated features

==================================================
12. FINAL VERIFICATION
==================================================

Test these flows:

1. New Member
→ editor opens
→ fill required fields
→ Save Draft
→ return to list
→ new member appears

2. Edit Member
→ select existing member
→ editor opens populated
→ modify field
→ Publish Changes
→ updated data appears

3. New Content
→ editor opens
→ select content type
→ enter required information
→ Save Draft / Schedule / Publish
→ return to content list
→ item appears with correct status

4. Edit Content
→ existing item
→ editor opens populated
→ modify
→ save/publish
→ updated item appears

5. Back navigation works from every editor.

Run:

pnpm build
tsc --noEmit

Both must pass with zero errors.

Report:
- existing editor components discovered
- files changed
- functionality completed
- routes/navigation wired
- data/state behavior
- build result
- tsc result

Make no unrelated changes.