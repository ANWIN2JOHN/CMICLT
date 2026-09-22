MOBILE UX AUDIT — CMICLT

Now perform a dedicated, systematic mobile UX audit of the entire CMICLT application.

Do NOT redesign the application from scratch.

Do NOT change the information architecture.

Do NOT add new features.

Do NOT introduce desktop layouts.

The purpose of this pass is to identify and fix mobile usability, responsiveness, spacing, overflow, hierarchy, interaction, and accessibility problems while preserving the established CMICLT design system.

TARGET DEVICES

Audit at minimum:

- 360 × 800
- 390 × 844

Treat these as real mobile viewport constraints.

GLOBAL MOBILE REQUIREMENTS

1. ZERO HORIZONTAL OVERFLOW

No screen should require horizontal scrolling unless horizontal scrolling is intentionally part of a specific content pattern such as a carousel.

Check every screen for:

- overflowing cards
- clipped badges
- clipped text
- fixed-width elements
- oversized buttons
- overflowing filters
- overflowing headers
- overflowing dialogs
- overflowing bottom sheets
- images exceeding containers
- tables that should become mobile cards
- long names and titles

2. SAFE AREAS

Respect:

- top safe area
- Dynamic Island/notch
- bottom home indicator
- bottom navigation

No important content should be hidden behind system areas or the application's bottom navigation.

3. TOUCH TARGETS

Interactive elements should have at least 44 × 44 px touch targets.

Check:

- buttons
- navigation items
- icons
- filters
- search
- cards
- back buttons
- close buttons
- toggles
- checkboxes
- radio controls
- bottom sheets
- list actions

4. TYPOGRAPHY

Check every screen for:

- text clipping
- awkward wrapping
- overly large headings
- overly small secondary text
- inconsistent line heights
- poor hierarchy
- titles colliding with icons
- long names breaking layouts

Do not solve layout problems by making text unnecessarily tiny.

5. MOBILE NAVIGATION

Verify the bottom navigation:

Home
Members
Events
Institutions
More

Check:

- active state
- inactive state
- labels
- icon alignment
- touch targets
- safe-area padding
- content clearance above the navigation

6. HEADER AUDIT

Check every mobile header for:

- title visibility
- back button
- action buttons
- filters
- search controls
- calendar/list controls
- notification icon
- Dynamic Island overlap
- insufficient horizontal space

Headers must adapt rather than forcing content underneath the Dynamic Island.

7. FORMS

Audit:

- Sign In
- Password
- Account activation
- OTP
- Forgot password
- Settings
- Admin forms
- Member editing

Check:

- input height
- labels
- placeholder visibility
- keyboard-friendly spacing
- error messages
- password visibility controls
- button placement
- disabled states
- loading states
- validation feedback

8. MEMBER EXPERIENCE

Audit:

- Member directory
- Search
- Filters
- Member cards
- Member profile
- Member details
- Recent searches
- Empty search results

Member cards must always fit within the viewport.

Long names, roles, houses and locations must wrap naturally.

9. EVENTS

Audit:

- Event list
- Event filters
- Calendar/list controls
- Event cards
- Event details

Make sure no event title or location is clipped.

10. INSTITUTIONS

Audit:

- Search
- Category filters
- Province filters
- Institution cards
- Institution details

Filter chips may scroll horizontally ONLY inside their dedicated filter area if necessary. The overall page must never horizontally overflow.

11. HOME

Audit:

- Header
- Announcement card
- Quick actions
- Birthday cards
- Feast days
- News/content sections
- Notification controls

Make sure content does not disappear behind bottom navigation.

12. MORE

Audit:

- Profile summary
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

Every item must be reachable and visually clear.

13. AUTHENTICATION

Verify the simplified authentication flow:

Sign In
→ Email/phone
→ Continue
→ account status detection
→ Password OR Account Activation

The initial Sign In screen must remain minimal.

There must be NO:

- Prototype account shortcuts
- Demo controls
- Sample-data labels
- Verify Membership
- Public registration

14. DARK MODE

Repeat the mobile audit in dark mode.

Check:

- contrast
- borders
- cards
- inputs
- buttons
- icons
- navigation
- badges
- disabled states
- error states
- announcement cards

15. ACCESSIBILITY

Maintain WCAG 2.2 AA principles.

Check:

- contrast
- touch targets
- readable typography
- semantic labels
- focus states
- keyboard accessibility where applicable
- meaningful accessible names for icon-only buttons

16. CONTENT STATES

Every major screen should handle:

- normal
- loading
- empty
- error
- success
- disabled
- selected
- pressed

Do not allow any state to cause layout overflow.

17. IMPORTANT DESIGN RULE

Preserve the established CMICLT visual language:

- Emerald
- Warm cream
- Gold accent
- Existing typography
- Existing card style
- Existing spacing
- Existing icons
- Existing navigation

Fix usability problems without unnecessarily changing the visual identity.

18. DO NOT TOUCH UNRELATED ARCHITECTURE

Do not rebuild Phase 1 or Phase 2.

Do not change routing unless required to fix an actual navigation problem.

Do not introduce new dependencies unless absolutely necessary.

19. FINAL VERIFICATION

After completing the audit:

- Test 360 × 800
- Test 390 × 844
- Test light mode
- Test dark mode
- Test authentication
- Test bottom navigation
- Test back navigation
- Test major member flows
- Test events
- Test institutions
- Test More
- Test My Account
- Test Settings

Run the production build again.

Report:

1. Problems found
2. Problems fixed
3. Files/components changed
4. Any remaining known issues
5. Build result