UPDATE THE CMICLT AUTHENTICATION BRANDING USING THE PROVIDED CMI EMBLEM

I have uploaded the official CMI emblem PNG. Use this uploaded image as the exact emblem/logo for the authentication screens.

IMPORTANT:
Do NOT redraw, recreate, stylize, simplify, recolor, trace, or modify the emblem.
Use the uploaded CMI emblem exactly as provided.

Update the authentication screens to use the following branding:

CMI ST THOMAS PROVINCE
KOZHIKODE

Use this exact wording and capitalization.

==================================================
1. SIGN-IN IDENTIFIER SCREEN
==================================================

Update the current initial Sign-In screen.

At the top of the content area, display:

[OFFICIAL CMI EMBLEM]

CMI ST THOMAS PROVINCE
KOZHIKODE

Then below the branding:

Enter your email or registered phone to continue

Then retain the existing:

Email address or registered phone number
[input field]
Continue

The emblem and the two-line province name must be horizontally centered.

The province name must be centered relative to the authentication content width.

Use:

CMI ST THOMAS PROVINCE
KOZHIKODE

as two centered lines, with appropriate spacing between the emblem and text.

==================================================
2. PASSWORD / WELCOME-BACK SCREEN
==================================================

Update the existing password screen to use the same official CMI emblem and province branding.

At the top:

[OFFICIAL CMI EMBLEM]

CMI ST THOMAS PROVINCE
KOZHIKODE

Below the branding, show the existing authenticated account content.

IMPORTANT:

The following MUST be CENTER ALIGNED:

Welcome back

and

Fr. Jose Chirayath CMI

The "Welcome back" heading and the member name must share the same centered horizontal axis.

Do NOT left-align either of these two elements.

The rest of the password form should remain functional and visually consistent with the existing design.

Keep:

- registered email display
- Change action
- Password field
- Forgot password?
- Sign In button

==================================================
3. VISUAL HIERARCHY
==================================================

Use the uploaded emblem as the primary visual identity.

Recommended hierarchy:

Official CMI emblem
↓
CMI ST THOMAS PROVINCE
KOZHIKODE
↓
screen-specific content

For the password screen:

Official CMI emblem
↓
CMI ST THOMAS PROVINCE
KOZHIKODE
↓
Welcome back
↓
Fr. Jose Chirayath CMI
↓
account/password form

Maintain a calm, premium, institutional CMI visual style.

Do not make the emblem excessively large.

Do not let the branding consume too much vertical space on small screens.

==================================================
4. ALIGNMENT
==================================================

SIGN-IN SCREEN:

- emblem centered
- province title centered
- subtitle centered
- input/form can retain the existing form alignment

PASSWORD SCREEN:

- emblem centered
- province title centered
- "Welcome back" centered
- "Fr. Jose Chirayath CMI" centered
- account/password form can remain left-aligned within its existing content container

The "Welcome back" and member name must NEVER become left-aligned at mobile or tablet widths.

==================================================
5. RESPONSIVE BEHAVIOR
==================================================

Preserve the existing mobile/tablet-only architecture.

Verify the layout at:

360×800
390×844
768×1024
834×1194
tablet landscape

The emblem and centered branding must remain properly positioned at all sizes.

Do not introduce a desktop breakpoint.

Do not create horizontal overflow.

Do not distort the emblem.

Preserve the emblem's aspect ratio.

==================================================
6. DO NOT CHANGE
==================================================

Do NOT change:

- authentication logic
- authentication routing
- back navigation
- account detection
- password flow
- OTP flow
- Forgot Password flow
- activation flow
- light/dark architecture
- navigation
- design tokens
- existing form behavior
- touch-target behavior

Do NOT add:

- Verify Membership
- public registration
- demo credentials
- prototype credentials
- demo OTP codes
- Malayalam
- language switching

==================================================
7. IMPLEMENTATION
==================================================

Use the uploaded emblem as a reusable asset/component rather than duplicating the image unnecessarily.

If there is already a shared authentication branding component, update that component so the branding remains consistent across:

- Sign In
- Password
- Activate
- Forgot Password
- OTP screens

However, do not change the functional structure of those screens.

Use the existing typography and spacing tokens.

Do not hardcode unnecessary viewport-specific offsets.

==================================================
8. FINAL CHECK
==================================================

After implementation:

1. Verify the uploaded emblem is actually being used.
2. Verify the exact text is:

CMI ST THOMAS PROVINCE
KOZHIKODE

3. Verify "Welcome back" is CENTER ALIGNED.
4. Verify "Fr. Jose Chirayath CMI" is CENTER ALIGNED.
5. Verify the emblem remains undistorted.
6. Verify mobile/tablet responsiveness.
7. Run:

pnpm build

Report:
- files changed
- where the emblem asset is stored
- which shared/component branding was updated
- build result
- any remaining issues

Make no unrelated changes.