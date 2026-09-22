CMICLT — CMI ST. THOMAS PROVINCE CALICUT

MASTER PRODUCT, UI/UX, DESIGN SYSTEM AND PROTOTYPE SPECIFICATION

You are designing a complete, production-quality mobile and tablet application called:

CMICLT
CMI St. Thomas Province Calicut

Your task is to create a polished, coherent, high-fidelity, touch-first application experience with a strong design system, consistent components, clear navigation, complete authentication flows, member directory, province information, events, institutions, and a powerful but simple administrator experience.

This is a serious institutional application for a Catholic religious province.

The final experience must feel:

CALM
ELEGANT
TRUSTWORTHY
MODERN
WARM
SECURE
SPIRITUAL
PROFESSIONAL
ACCESSIBLE
EASY TO USE

Do not make it look like a banking app, corporate CRM, generic admin dashboard, social media application, or website.

==================================================
01 — CRITICAL PLATFORM REQUIREMENT
==================================================

CMICLT IS A MOBILE AND TABLET APPLICATION ONLY.

MOBILE IS THE PRIMARY DESIGN TARGET.

TABLET IS THE SECONDARY DESIGN TARGET.

DO NOT DESIGN DESKTOP.

DO NOT CREATE DESKTOP SCREENS.

DO NOT CREATE DESKTOP BREAKPOINTS.

DO NOT CREATE DESKTOP SIDEBARS.

DO NOT CREATE DESKTOP DASHBOARDS.

DO NOT CREATE LAPTOP LAYOUTS.

DO NOT CREATE 1440px desktop frames.

DO NOT CREATE MOUSE-DEPENDENT INTERACTIONS.

DO NOT USE HOVER AS A REQUIRED INTERACTION.

The supported design sizes are:

MOBILE:
- 360 × 800
- 390 × 844

TABLET PORTRAIT:
- 768 × 1024
- 834 × 1194

TABLET LANDSCAPE:
Create appropriate landscape tablet layouts based on the same design system.

Every interaction must work with touch.

Minimum interactive target:
44 × 44 px.

The mobile experience must feel like a purpose-built native application rather than a responsive website.

==================================================
02 — IMPORTANT EXECUTION PRINCIPLE
==================================================

Do not make arbitrary product decisions when the specification already provides a requirement.

When requirements are explicit, follow them exactly.

When a detail is not specified, choose the simplest solution that:

1. preserves the established CMICLT design language,
2. improves usability,
3. maintains accessibility,
4. works well on mobile,
5. works well on tablet,
6. does not introduce unnecessary features.

Do not invent major features.

Do not add social networking functionality.

Do not add public registration.

Do not add unnecessary gamification.

Do not add unnecessary analytics.

Do not add unnecessary badges.

Do not add unnecessary dashboards.

Do not change the core information architecture.

==================================================
03 — MOST IMPORTANT AUTHENTICATION RULE
==================================================

THERE IS NO "VERIFY MEMBERSHIP" FEATURE.

Do NOT create:

- Verify Membership button
- Verify Membership page
- Membership verification menu
- "Are you a member?" question
- Separate membership verification workflow

The user simply uses the normal Sign In experience.

The system determines membership/account status automatically based on the information the user enters.

The user should not need to understand the underlying membership validation process.

The user experience should be:

OPEN APP
→ SIGN IN
→ ENTER EMAIL OR REGISTERED PHONE
→ SYSTEM CHECKS ACCOUNT/MEMBER STATUS
→ AUTHENTICATE OR ACTIVATE ACCOUNT
→ ENTER APPLICATION

==================================================
04 — PRODUCT PURPOSE
==================================================

CMICLT combines:

A. Province information

B. Private CMI member directory

C. Events and important dates

D. Institutions and houses

E. News and media

F. Vocation information

G. Chavarul reflections

H. Secure administration

The application should allow CMI members to easily:

- Find members
- View member profiles
- Find houses
- Find institutions
- View assignments
- View birthdays
- View feast days
- View events
- Read province news
- Read Chavarul reflections
- Learn about the province
- View administration
- Contact the province

Super Administrators should be able to:

- Manage members
- Manage users
- Manage content
- Import data
- Manage security
- Review audit logs
- Manage backups
- Manage annual versions

==================================================
05 — USER ROLES
==================================================

ROLE 1:
CMI MEMBER

Permissions:

- Access province information
- Search members
- View member profiles
- View registered contact information
- View houses
- View institutions
- View birthdays
- View feast days
- View events
- Read news
- View gallery
- Read vocation information
- Read Chavarul
- View contact information

Cannot:

- Manage users
- Edit member records
- Manage security
- Manage backups
- Access audit logs
- Manage content

ROLE 2:
SUPER ADMINISTRATOR

Has all CMI Member permissions plus:

- Manage user accounts
- Add members
- Edit members
- Archive members
- Restore members
- Manage assignments
- Manage institutions
- Manage events
- Manage news
- Manage gallery
- Manage vocation content
- Manage Chavarul
- Import Excel/CSV
- Review audit logs
- Manage OTP settings
- Manage sessions
- Manage failed login attempts
- Manage security
- Manage backups
- Manage annual versions

==================================================
06 — DESIGN PHILOSOPHY
==================================================

The application should feel like a modern Catholic institutional application.

The visual personality should combine:

FAITH
+
COMMUNITY
+
SERVICE
+
TRUST
+
SIMPLICITY

Use spiritual identity subtly.

Do not use excessive religious decoration.

Do not use overly ornate Catholic graphics.

Do not make every screen green.

Use whitespace generously.

Use photography carefully.

Use gold only as an accent.

The overall visual language should feel premium but approachable.

==================================================
07 — BRAND COLOUR SYSTEM
==================================================

PRIMARY DARK EMERALD
#064E3B

PRIMARY EMERALD
#0D684F

SECONDARY EMERALD
#15805F

LIGHT EMERALD
#ECF8F2

ACCENT GOLD
#D7A33D

LIGHT GOLD
#FFF6DF

MAIN BACKGROUND
#F6F8F5

CARD BACKGROUND
#FFFFFF

PRIMARY TEXT
#17211D

SECONDARY TEXT
#647068

BORDER
#DDE5E0

SUCCESS
#16875B

WARNING
#C98616

ERROR
#C94747

Gold should be used sparingly for:

- Feast days
- Important celebrations
- Special highlights
- Important calls to action
- Spiritual accents

Do not overuse gold.

==================================================
08 — TYPOGRAPHY
==================================================

Use:

HEADINGS:
Lora or Merriweather

INTERFACE:
Inter

Suggested sizes:

Display:
36–44 px

Page title:
28–32 px

Section title:
20–24 px

Body:
16 px

Secondary:
14 px

Caption:
12 px

Typography must remain readable on 360px-wide screens.

Malayalam must also be supported without breaking layouts.

Use flexible text containers.

Never create fixed-width text containers that could break with Malayalam.

==================================================
09 — DESIGN TOKENS
==================================================

Use an 8-point spacing system.

Spacing:

4
8
12
16
24
32
40
48

Mobile horizontal padding:
16 px

Tablet horizontal padding:
24 px

Card radius:
20–24 px

Input radius:
12–16 px

Buttons:
minimum 44 px height

Touch targets:
minimum 44 × 44 px

Use subtle shadows.

Avoid heavy elevation.

==================================================
10 — GLOBAL MOBILE NAVIGATION
==================================================

Use five primary destinations:

1. HOME
2. MEMBERS
3. EVENTS
4. INSTITUTIONS
5. MORE

Use icon + text label.

Do not use icon-only primary navigation.

The active destination must be visually obvious.

Bottom navigation must respect mobile safe areas.

Do not allow content to be hidden behind the bottom navigation.

==================================================
11 — TABLET NAVIGATION
==================================================

On tablets, use a collapsible navigation rail.

Include:

- CMICLT logo
- Home
- Members
- Events
- Institutions
- More
- Admin section when applicable
- User profile
- Role
- Sign out

Tablet landscape may expand the rail to show labels.

The navigation must remain touch-friendly.

==================================================
12 — AUTHENTICATION EXPERIENCE
==================================================

SCREEN 1:
SPLASH

Include:

CMICLT logo

St. Thomas Province Calicut

Elegant emerald background

Subtle spiritual visual treatment

Keep the screen minimal.

--------------------------------------------------

SCREEN 2:
SIGN IN

This is the primary authentication screen.

Include:

Email address or registered phone number

Password

Show/hide password

Forgot password?

Sign In

There should NOT be a Verify Membership button.

There should NOT be a Register button.

The user should not be asked whether they are a member.

--------------------------------------------------

ACCOUNT STATUS LOGIC

If the entered email/phone belongs to an existing active account:

Continue with normal authentication.

If it belongs to a registered CMI member who does not yet have an active CMICLT account:

Continue to account activation.

If it does not correspond to a registered member/account:

Show:

"We could not find an active CMICLT account with the information provided. Please check your details or contact the administrator."

Do not reveal unnecessary information about the database.

==================================================
13 — FIRST-TIME ACCOUNT ACTIVATION
==================================================

The activation process must feel like part of Sign In.

Do not call it registration.

Use:

"Activate your CMICLT account"

Flow:

Enter email/phone
→ System checks member record
→ Additional registered information if required
→ OTP
→ Create password
→ Confirm password
→ Account activated
→ Member Home

Do not create a separate "membership verification" concept.

==================================================
14 — OTP
==================================================

Create a polished OTP interface.

Include:

Six-digit OTP

Countdown

Resend OTP

Change contact information

Verify

States:

- Default
- Entering
- Invalid
- Expired
- Resending
- Success

Make the OTP experience extremely simple on mobile.

==================================================
15 — PASSWORD CREATION
==================================================

Include:

New password

Confirm password

Show/hide password

Password strength

Password requirements

Complete activation

Use real-time validation.

==================================================
16 — FORGOT PASSWORD
==================================================

Flow:

Forgot Password
→ Email/Phone
→ Account validation
→ OTP
→ New password
→ Confirm password
→ Success
→ Sign In

==================================================
17 — AUTHENTICATION STATES
==================================================

Design:

- Loading
- Invalid credentials
- Account not found
- Inactive account
- Locked account
- OTP expired
- Invalid OTP
- Resend OTP
- Password creation
- Password reset
- New device verification
- Session expired
- No internet
- Sign out confirmation

Every error must explain what the user can do next.

==================================================
18 — HOME EXPERIENCE
==================================================

The Home screen must be the most polished screen in the application.

Do not make it look like an analytics dashboard.

Use an editorial/card-based layout.

Header:

Greeting

Member name

Profile avatar

Notification icon

Current date

Example:

Good morning, Fr. John

Sunday, September 20

Then prioritize:

1. Province announcement

2. Quick actions

3. Upcoming birthdays

4. Feast days

5. Upcoming events

6. Latest news

7. Province highlights

8. Recently viewed members

Do not show too much information at once.

Use progressive disclosure.

==================================================
19 — QUICK ACTIONS
==================================================

Use a maximum of four primary quick actions.

Recommended:

Find Member

Events

Institutions

My Profile

Use clear icons.

==================================================
20 — MEMBER DIRECTORY
==================================================

Create a highly usable member directory.

Search by:

- Name
- Role
- House
- Institution
- Zone
- Country
- Assignment

Search field:

"Search members..."

Include:

- Filter
- Sort
- Search result count
- Recent searches

The search experience must be fast and simple.

==================================================
21 — MEMBER FILTER
==================================================

Mobile:

Use a bottom sheet.

Filters:

- Zone
- House
- Institution
- Country
- Role
- Birthday month
- Feast-day month

Actions:

Apply Filters

Clear All

Show active filter count.

Example:

Filters 3

Tablet:

Use a side panel where appropriate.

==================================================
22 — MEMBER RESULTS
==================================================

Use premium member cards.

Show:

- Photograph or initials
- Full name
- Current role
- Current house
- Zone

Do NOT show:

"Verified Member"

Do NOT use unnecessary badges.

Tap anywhere on the card to open the profile.

==================================================
23 — MEMBER PROFILE
==================================================

Create a strong profile experience.

Header:

Large photograph

Full name

Current role

Current house

Province zone

Actions:

Call

Email

Information sections:

CONTACT

- Phone
- Email

PERSONAL

- Birthday
- Feast day
- Diocese
- Parish

RELIGIOUS

- Profession date
- Ordination date

ASSIGNMENT HISTORY

Use a vertical timeline.

Use expandable sections if necessary.

The screen must remain easy to scan.

==================================================
24 — HOUSES AND INSTITUTIONS
==================================================

Institutions home:

Search

Category filters

Zone filters

Card/list switch

Categories:

- Religious houses
- Educational institutions
- Social apostolate
- Healthcare
- Pastoral centres
- Missions

==================================================
25 — INSTITUTION PROFILE
==================================================

Include:

Institution name

Type

Address

Zone

Telephone

Email

Year established

Apostolates

Head of institution

Residents

Actions:

Call

Email

Open Map

==================================================
26 — EVENTS
==================================================

Create a polished Events experience.

Views:

Calendar

List

Month selector

Categories:

- Birthdays
- Feast days
- Province events
- Anniversaries
- Jubilees

Make dates visually prominent.

Do not rely only on colour to communicate categories.

==================================================
27 — EVENT DETAILS
==================================================

Include:

Title

Date

Time

Location

Description

Actions:

Add to Calendar

Reminder

Share

Use sticky bottom actions when useful.

==================================================
28 — PROVINCE HOME
==================================================

Create an editorial-style province experience.

Hero:

"Faith, service and community"

Include:

Province introduction

Latest news

Province events

Birthdays

Feast days

Provincial Desk

Spiritual quotation

Media highlights

==================================================
29 — ABOUT THE PROVINCE
==================================================

Include:

Introduction

History

Founder

Mission

Spiritual heritage

Use a beautiful vertical timeline.

Break long text into digestible sections.

==================================================
30 — ADMINISTRATION
==================================================

Leadership cards:

Provincial

Vicar Provincial

Councillors

Auditor

Cards:

Photo

Name

Role

Short information

Tap for details.

==================================================
31 — NEWS
==================================================

News home:

Featured article

Latest news

Categories

Search

Cards should include:

Image

Category

Headline

Date

Short summary

Article detail:

Hero image

Category

Title

Date

Author if available

Content

Related articles

Share

Prioritize reading comfort.

==================================================
32 — GALLERY
==================================================

Gallery:

Albums

Photos

Videos

Mobile:

2-column grid

Tablet:

Larger responsive grid

Full-screen viewer:

Swipe

Close

Share

==================================================
33 — VOCATION
==================================================

Create a welcoming vocation experience.

Sections:

DISCERN

CONNECT

BEGIN

Include:

Formation stages

Vocation information

Vocation-team contact

Enquiry form

Use warm imagery.

==================================================
34 — CHAVARUL
==================================================

Create a peaceful reading experience.

Include:

Featured reflection

Categories

Read mode

Bookmark

Share

Reading screen:

Comfortable typography

Good line height

Minimal distractions

==================================================
35 — CONTACT
==================================================

Include:

Provincial House address

Phone

Email

Map

Contact form

Office hours

Contact form:

Name

Email

Subject

Message

Send

Success confirmation after submission.

==================================================
36 — SUPER ADMINISTRATOR
==================================================

Administrator UI must still be mobile/tablet only.

Do not create a desktop admin dashboard.

Use:

Cards

Tabs

Bottom sheets

Full-screen forms

Expandable sections

Search

Filters

Step-by-step workflows

==================================================
37 — ADMIN DASHBOARD
==================================================

Show:

Active members

Pending activations

Locked accounts

Failed login attempts

Houses/institutions

Upcoming events

Recent changes

Data-quality warnings

Use compact statistic cards.

Avoid corporate dashboard styling.

==================================================
38 — USER ACCOUNTS
==================================================

Tabs:

Active

Pending

Inactive

Locked

Actions:

Activate

Deactivate

Unlock

Reset password

Resend activation

View login history

==================================================
39 — MEMBER MANAGEMENT
==================================================

Include:

Search

Filters

Member list

Add member

Edit member

Archive

Restore

Upload photo

Change assignment

Update contact information

==================================================
40 — MEMBER EDIT
==================================================

Sections:

Personal details

Religious details

Contact information

Assignment

House/institution

Dates

Photograph

Validation

Actions:

Save Draft

Publish Changes

On mobile use:

Accordion sections

Progressive disclosure

Sticky action area

==================================================
41 — CONTENT MANAGEMENT
==================================================

Manage:

News

Events

Gallery

Vocation

Chavarul

Contact information

Statuses:

Draft

Scheduled

Published

==================================================
42 — DATA IMPORT
==================================================

Create a guided wizard.

Step 1:
Upload Excel/CSV

Step 2:
Map columns

Step 3:
Validate

Step 4:
Detect duplicates

Step 5:
Review errors

Step 6:
Review changes

Step 7:
Confirm import

Show progress throughout.

==================================================
43 — AUDIT LOGS
==================================================

Include:

User

Action

Record

Date

Time

Device/session

Filters

Export

Mobile:
Stacked cards

Tablet:
Structured list/table when readable

==================================================
44 — SECURITY
==================================================

Include:

OTP configuration

Failed-login limit

Session duration

New-device verification

Password policy

Administrator two-factor authentication

Destructive changes require confirmation.

==================================================
45 — BACKUPS
==================================================

Include:

Last backup

Create backup

Restore backup

Annual versions

Compare years

Publish current version

Require confirmation for restore/publish actions.

==================================================
46 — MY ACCOUNT
==================================================

Include:

Profile photo

Name

Role

House

Contact information

Account status

Security

Actions:

Change password

Update permitted information

Sign out

==================================================
47 — SETTINGS
==================================================

Sections:

Appearance

Language

Notifications

Security

Appearance:

Light

Dark

System

Language:

English

Malayalam

Notifications:

Events

Birthdays

Feast days

Announcements

==================================================
48 — DESIGN SYSTEM
==================================================

Create a complete reusable design system before creating large numbers of screens.

Components:

- App logo
- Mobile header
- Tablet navigation rail
- Bottom navigation
- Primary button
- Secondary button
- Outline button
- Text button
- Icon button
- Text input
- Password input
- Phone input
- Search
- OTP
- Dropdown
- Filter chip
- Status chip
- Information card
- Member card
- Institution card
- Event card
- News card
- Gallery card
- Statistics card
- Admin action card
- Avatar
- Calendar tile
- Bottom sheet
- Dialog
- Toast
- Loading skeleton
- Empty state
- Error state
- Success state

Every reusable component should use consistent Auto Layout.

==================================================
49 — COMPONENT STATES
==================================================

Create variants:

Default

Pressed

Focused

Selected

Disabled

Loading

Error

Success

Do not create hover-dependent components.

==================================================
50 — ACCESSIBILITY
==================================================

Follow WCAG 2.2 AA principles.

Ensure:

Minimum 4.5:1 text contrast

Minimum 44 × 44 touch targets

Clear labels

Logical hierarchy

Screen-reader-friendly naming

Accessible forms

Visible focus states where relevant

Error text + icon

Support increased text size

Reduced motion

Never place essential text inside images

==================================================
51 — DARK MODE
==================================================

Create complete dark mode support.

Maintain:

Emerald identity

Readable contrast

Comfortable backgrounds

Accessible text

Do not simply invert colours.

Dark mode should feel intentionally designed.

==================================================
52 — MALAYALAM SUPPORT
==================================================

Support:

English

Malayalam

Layouts must accommodate longer text.

Use flexible Auto Layout.

Do not use fixed-width text boxes.

Test navigation labels and buttons with longer Malayalam text.

==================================================
53 — MOTION
==================================================

Use subtle motion.

Examples:

Screen transitions

Bottom sheets

Card press feedback

OTP success

Save success

Loading transitions

Use short, smooth animations.

No excessive animations.

Respect reduced motion.

==================================================
54 — EMPTY STATES
==================================================

Create useful empty states.

Examples:

"No members match your search."

"Try removing a filter or checking the spelling."

"No upcoming events."

"No birthdays found."

"No news available."

"No gallery items."

"No audit records found."

Each empty state should provide a useful next action when appropriate.

==================================================
55 — ERROR STATES
==================================================

Use calm, understandable language.

Example:

"We couldn't complete this request."

Action:

Try Again

Never expose technical backend errors to normal users.

==================================================
56 — LOADING
==================================================

Create:

Member skeleton

Institution skeleton

Event skeleton

News skeleton

Profile skeleton

Dashboard skeleton

Button loading

Avoid unnecessary full-screen loading.

==================================================
57 — SUCCESS STATES
==================================================

Create:

Account activation success

Password reset success

Profile update success

Member update success

Content publish success

Import success

Contact form success

Use subtle success animation.

==================================================
58 — FIGMA ORGANIZATION
==================================================

Organize the project into:

PAGE 01 — Mobile Design System

PAGE 02 — Tablet Design System

PAGE 03 — Mobile Authentication

PAGE 04 — Mobile Member Experience

PAGE 05 — Mobile Province Experience

PAGE 06 — Mobile Administration

PAGE 07 — Tablet Authentication

PAGE 08 — Tablet Member Experience

PAGE 09 — Tablet Province Experience

PAGE 10 — Tablet Administration

PAGE 11 — Component Library

PAGE 12 — Prototype Flows

PAGE 13 — Developer Handoff

NO DESKTOP PAGE.

==================================================
59 — RESPONSIVE RULES
==================================================

360 × 800:

Single column

16px horizontal padding

Compact cards

Full-width inputs

Bottom navigation

Prioritize readability

390 × 844:

Single column

16–20px horizontal padding

Comfortable spacing

Larger content previews

768 × 1024:

Navigation rail

Two-column cards

Two-column forms

Expanded content

834 × 1194:

Navigation rail

Two/three-column layouts

Larger media

List/detail layouts

Tablet landscape:

Expanded navigation rail

Two/three-column grids

List/detail interfaces

Larger content areas

Never turn tablet into desktop.

==================================================
60 — TOUCH-FIRST REQUIREMENTS
==================================================

The application must be comfortable to operate by touch.

Use:

Large touch targets

Clear pressed states

Adequate spacing

Bottom sheets

Sticky actions

Swipe where appropriate

Full-screen detail views where useful

Never depend on:

Hover

Right-click

Mouse positioning

Tiny controls

==================================================
61 — PROTOTYPE FLOWS
==================================================

FLOW 1:
FIRST-TIME ACCOUNT ACTIVATION

Splash
→ Sign In
→ Email/Phone
→ Automatic account/member lookup
→ Additional validation if required
→ OTP
→ Create Password
→ Confirm Password
→ Account Activated
→ Member Home

FLOW 2:
RETURNING MEMBER

Splash
→ Sign In
→ Email/Phone
→ Password
→ Optional OTP
→ Member Home

FLOW 3:
MEMBER SEARCH

Home
→ Members
→ Search
→ Filter
→ Results
→ Member Profile
→ Call/Email

FLOW 4:
EVENT

Home
→ Events
→ Event Details
→ Add Reminder

FLOW 5:
INSTITUTION

Home
→ Institutions
→ Category
→ Institution
→ Call/Email/Map

FLOW 6:
NEWS

Home
→ News
→ Article
→ Share

FLOW 7:
ADMIN

Sign In
→ Admin Dashboard
→ User Accounts
→ Unlock Account
→ Confirmation

FLOW 8:
MEMBER EDIT

Admin
→ Member Management
→ Search
→ Member
→ Edit
→ Save
→ Success

FLOW 9:
DATA IMPORT

Admin
→ Data Import
→ Upload
→ Map
→ Validate
→ Review
→ Confirm
→ Success

==================================================
62 — DESIGN QUALITY RULES
==================================================

Every screen must have:

Clear hierarchy

Clear primary action

Consistent spacing

Consistent typography

Consistent card styling

Consistent iconography

Consistent navigation

Accessible contrast

Touch-friendly controls

Do not overcrowd screens.

Do not create unnecessarily complicated interactions.

Use progressive disclosure.

Prefer one strong primary action over multiple competing actions.

==================================================
63 — CONTENT HIERARCHY
==================================================

Prioritize information in this order:

1. What the user needs now
2. Primary action
3. Important contextual information
4. Secondary information
5. Optional details

Never make the user scan through large blocks of information to find the main action.

==================================================
64 — VISUAL CONSISTENCY
==================================================

Once a component style has been established:

Reuse it.

Do not redesign the same component differently on another screen.

Do not create multiple visually different versions of:

Buttons

Cards

Inputs

Navigation

Filters

Dialogs

Member cards

Event cards

News cards

Maintain one coherent design language throughout the application.

==================================================
65 — PRODUCTION QUALITY
==================================================

The result must not look like an AI-generated generic template.

Avoid:

Generic gradients

Random decorative shapes

Excessive glassmorphism

Excessive shadows

Random colour changes

Inconsistent corner radii

Too many cards

Unnecessary badges

Stock-photo-heavy layouts

Corporate dashboard aesthetics

The design should feel intentionally art-directed.

==================================================
66 — PRIORITY ORDER
==================================================

If you need to make a design decision, follow this priority:

1. Usability
2. Mobile touch experience
3. Information hierarchy
4. Accessibility
5. Design consistency
6. Visual elegance
7. Tablet responsiveness
8. Decorative elements

Never sacrifice usability for visual decoration.

==================================================
67 — FINAL ACCEPTANCE CRITERIA
==================================================

Before considering the application complete, verify:

MOBILE:

360 × 800 works correctly.

390 × 844 works correctly.

No horizontal overflow.

No clipped content.

No tiny controls.

Bottom navigation works.

Forms fit correctly.

Long names work.

Long text works.

Malayalam text does not break layouts.

TABLET:

768 × 1024 works correctly.

834 × 1194 works correctly.

Tablet landscape works.

Navigation rail works.

Two/three-column layouts are balanced.

Touch targets remain large.

AUTHENTICATION:

No Verify Membership feature.

No public registration.

Email/phone determines account/member flow.

First-time activation works.

Returning login works.

OTP works.

Password reset works.

Locked account state exists.

Session expiration exists.

MEMBERS:

Search works.

Filters work.

Results are readable.

Profile is easy to scan.

Call and email actions are clear.

EVENTS:

Calendar works.

List works.

Event details work.

Reminder action exists.

INSTITUTIONS:

Search works.

Filtering works.

Institution details are readable.

Map action exists.

CONTENT:

News works.

Gallery works.

Vocation works.

Chavarul works.

Contact works.

ADMIN:

User management works.

Member management works.

Content management works.

Import workflow works.

Audit logs work.

Security settings work.

Backup workflow exists.

DESIGN SYSTEM:

Components are reusable.

Variants exist.

Auto Layout is used.

Variables are used.

Spacing is consistent.

Typography is consistent.

Colours are consistent.

Dark mode exists.

Accessibility states exist.

==================================================
68 — FINAL PRODUCT EXPERIENCE
==================================================

The final CMICLT application should feel like:

A premium Catholic province application

+

A secure private CMI member directory

+

A modern province information platform

+

A simple event and community application

+

A powerful but approachable administration platform

The application should feel trustworthy from the first screen.

It should feel simple enough for a non-technical user.

It should feel professional enough for institutional use.

It should feel modern enough to be used daily.

It should never feel like a generic template.

==================================================
69 — NON-NEGOTIABLE RULES
==================================================

1. MOBILE + TABLET ONLY.

2. NO DESKTOP.

3. NO DESKTOP BREAKPOINTS.

4. NO DESKTOP SIDEBAR.

5. NO DESKTOP DASHBOARD.

6. NO VERIFY MEMBERSHIP FEATURE.

7. NO PUBLIC REGISTRATION.

8. MEMBERSHIP/ACCOUNT STATUS IS DETERMINED AUTOMATICALLY.

9. MOBILE IS THE PRIMARY DESIGN TARGET.

10. TABLET IS AN EXPANSION OF MOBILE.

11. TOUCH-FIRST INTERACTION.

12. MINIMUM 44 × 44 TOUCH TARGETS.

13. USE AUTO LAYOUT.

14. USE REUSABLE COMPONENTS.

15. USE DESIGN VARIABLES.

16. MAINTAIN ONE CONSISTENT DESIGN SYSTEM.

17. SUPPORT ENGLISH AND MALAYALAM.

18. SUPPORT LIGHT AND DARK MODE.

19. FOLLOW WCAG 2.2 AA PRINCIPLES.

20. DO NOT INVENT MAJOR FEATURES.

21. DO NOT CHANGE THE CORE INFORMATION ARCHITECTURE.

22. DO NOT SACRIFICE USABILITY FOR DECORATION.

23. DO NOT MAKE THE APPLICATION LOOK LIKE A WEBSITE.

24. DO NOT MAKE THE APPLICATION LOOK LIKE A CORPORATE DASHBOARD.

25. THE FINAL RESULT MUST FEEL LIKE A PURPOSE-BUILT NATIVE-QUALITY MOBILE AND TABLET APPLICATION.

==================================================
70 — BUILD STRATEGY
==================================================

Before generating the complete application, first establish the design foundation and information architecture.

Do not immediately create dozens of disconnected screens.

First establish:

1. Design tokens
2. Typography
3. Colour system
4. Navigation
5. Core components
6. Card system
7. Form system
8. Authentication pattern
9. Mobile layout pattern
10. Tablet layout pattern

Then use those foundations consistently across all screens.

If Plan Mode is available, use Plan Mode first.

Create a structured implementation plan covering:

- Design system
- Navigation
- Authentication
- Member experience
- Province content
- Events
- Institutions
- Administration
- Responsive behavior
- Accessibility
- Prototype flows

Do not generate the final application until the plan is coherent.

After the foundation is established, build the screens using the same component system.

Do not create isolated one-off visual patterns.

==================================================
71 — FINAL QUALITY AUDIT
==================================================

After building the application, perform a complete internal design audit.

Check every screen for:

- Alignment
- Spacing
- Typography
- Contrast
- Touch targets
- Overflow
- Navigation consistency
- Component consistency
- Empty states
- Loading states
- Error states
- Success states
- Accessibility
- Mobile responsiveness
- Tablet responsiveness
- Malayalam compatibility
- Dark mode

Fix inconsistencies you find.

Do not redesign the established visual identity during the audit.

Preserve the approved design language.

==================================================
72 — FINAL INSTRUCTION
==================================================

Build CMICLT as a cohesive, premium, production-quality mobile and tablet application.

Do not simply generate a collection of screens.

Create a complete product experience with:

A coherent design system

A clear information architecture

Consistent navigation

Complete authentication

Member directory

Member profiles

Events

Institutions

Province information

News

Gallery

Vocation

Chavarul

Contact

Super Administrator tools

Responsive mobile/tablet layouts

Accessible states

Dark mode

English/Malayalam support

Interactive prototype flows

Developer handoff specifications

The result should look intentionally designed by an experienced product design team.

PRIORITIZE:

USABILITY
→ ACCESSIBILITY
→ CONSISTENCY
→ INFORMATION HIERARCHY
→ MOBILE UX
→ TABLET UX
→ VISUAL QUALITY

The final product must be:

POLISHED
COHESIVE
CALM
PREMIUM
TRUSTWORTHY
TOUCH-FIRST
MOBILE-FIRST
TABLET-READY
PRODUCTION-READY

NO DESKTOP.
NO VERIFY MEMBERSHIP FEATURE.
NO PUBLIC REGISTRATION.
NO GENERIC TEMPLATE DESIGN.