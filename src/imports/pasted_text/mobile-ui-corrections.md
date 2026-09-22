IMPORTANT — MOBILE UI CORRECTIONS

I reviewed the current CMICLT mobile preview. Make the following three corrections only. Do NOT rebuild the application and do NOT change the overall CMICLT visual identity or information architecture.

==================================================
1. MEMBERS SCREEN — REMOVE HORIZONTAL OVERFLOW
==================================================

The Members screen currently does not fit within the mobile viewport.

The member cards extend beyond the right edge of the screen, forcing horizontal scrolling to see the complete content.

This must be fixed completely.

Requirements:

- The Members screen must NEVER require horizontal scrolling.
- The entire member card must fit within the viewport at:
  - 360 × 800
  - 390 × 844
- Member cards must use width: 100% of the available content area.
- Respect the screen's horizontal padding.
- Do not use fixed widths that exceed the available viewport.
- Prevent horizontal overflow at the page/container level.
- Member names must wrap naturally when necessary.
- Member role and institution/location must wrap naturally.
- The province/location badge currently positioned on the far right must NOT be clipped.
- If the location/province badge cannot fit beside the member information, move it to a second row or use another responsive arrangement.
- Do NOT reduce the text to an unreadably small size just to make it fit.
- Do NOT make the user horizontally scroll.
- Ensure cards remain visually balanced and polished.

The final result should look like a properly designed native mobile list.

==================================================
2. HOME SCREEN — FIX PROVINCE ANNOUNCEMENT READABILITY
==================================================

The Province announcement card on the Home screen has poor text contrast.

The headline:

"Province celebrates 70 years of service in Malabar"

is currently dark text on a dark emerald background and is difficult to read.

Fix the announcement card so that all text has strong accessible contrast.

Requirements:

- Keep the emerald CMICLT announcement-card background.
- Change the announcement headline to a light/high-contrast colour, preferably white or warm cream.
- The supporting description must also have strong contrast.
- "Read more" should use the established gold accent while remaining clearly readable.
- The "Province announcement" badge should remain visually distinct.
- Preserve the existing card shape, spacing, hierarchy and overall visual style.
- Follow WCAG 2.2 AA contrast principles.
- Do not change the content itself.

The announcement should immediately look readable and premium on a mobile screen.

==================================================
3. LOGIN SCREEN — REMOVE EXCESS UI
==================================================

The current login screen contains too much developer/prototype information.

REMOVE the following completely from the user-facing Sign In screen:

- "Prototype accounts — tap to fill..."
- Member button
- Super Admin button
- Activate account button
- Locked account button
- Any other prototype-account shortcuts
- Any developer/testing helper text
- "Prototype — sample data" footer from the authentication screens

These must NOT be visible anywhere in the normal authentication experience.

The Sign In screen should be extremely clean and simple.

Use this structure:

CMICLT logo/icon

CMICLT

Enter your email or registered phone to continue

[ Email address or registered phone number ]

[ Continue ]

That's all that should be visible in the main sign-in form.

Do not add unnecessary cards, shortcuts, explanations, prototype controls or extra sections.

The screen should feel like a professional production mobile application.

==================================================
AUTHENTICATION FLOW — KEEP THE APPROVED LOGIC
==================================================

Do NOT remove the progressive authentication architecture.

The first screen should only ask for:

Email address OR registered phone number

Then:

[ Continue ]

After Continue, the system determines the account status.

EXISTING ACTIVE ACCOUNT:

Email/phone
→ Continue
→ Password screen
→ Sign In
→ Home

REGISTERED MEMBER WITHOUT ACTIVE ACCOUNT:

Email/phone
→ Continue
→ Activate CMICLT account
→ Required validation
→ OTP
→ Create password
→ Home

UNKNOWN IDENTIFIER:

Email/phone
→ Continue
→ Neutral error message

There must still be:

- NO "Verify Membership" feature
- NO "Verify Membership" button
- NO public registration
- NO prototype account shortcuts

The password field should therefore NOT be placed on the initial email/phone screen.

The password screen can remain a separate screen after account identification.

==================================================
AUTHENTICATION VISUAL DESIGN
==================================================

Keep the existing CMICLT visual language:

- Emerald
- Warm cream
- Gold accent
- Existing typography
- Existing logo
- Existing spacing system
- Existing button style
- Existing input style

But simplify the authentication experience substantially.

The goal is:

Clean
Minimal
Professional
Trustworthy
Institutional
Easy to understand

Do not overcrowd the screen.

==================================================
RESPONSIVE REQUIREMENTS
==================================================

After making these corrections, verify the affected screens at:

360 × 800
390 × 844

Also ensure the same components remain compatible with:

768 × 1024
834 × 1194
tablet landscape

CMICLT remains MOBILE + TABLET ONLY.

Do not introduce desktop layouts.

==================================================
FINAL CHECK
==================================================

After implementing the corrections:

1. Confirm Members has ZERO horizontal overflow.
2. Confirm every member card fits completely within the viewport.
3. Confirm the Province announcement headline is clearly readable.
4. Confirm the login screen contains no prototype/testing controls.
5. Confirm the initial login screen only asks for email/registered phone.
6. Confirm password appears only after the account is identified.
7. Confirm there is no Verify Membership feature.
8. Confirm there is no public registration.
9. Confirm the authentication flow still works.
10. Run the build/typecheck.

Do not make unrelated changes.
Do not redesign the entire application.
Focus on these three corrections and preserve everything else that is already working.