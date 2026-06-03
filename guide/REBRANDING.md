# EnategaDeliveriesStoreApp Rebranding Guide

This guide is the standard flow to prepare `EnategaDeliveriesStoreApp` for a new client.

## 1) Branch Strategy

1. Start from `main` and create a dedicated client branch.
2. Use naming like `client/<client-name>`.
3. Keep client-specific customizations only in that branch.
4. Continue fixing shared bugs in `main`, then merge `main` into each client branch.

## 2) Rebranding Inputs (Collect Before Changes)

Collect these from client/backend/devops first:

1. App name, slug, bundle/package ID:
   - App display name
   - Expo slug
   - iOS bundle identifier
   - Android package name
2. Expo project:
   - Expo project ID
   - Expo updates URL
3. Environment + backend:
   - `EXPO_PUBLIC_API_BASE_URL`
   - `EXPO_PUBLIC_SOCKET_URL`
   - `EXPO_PUBLIC_SOCKET_PATH` (if backend uses a custom socket path)
4. Firebase/Google services files:
   - Android `google-services.json`
   - iOS `GoogleService-Info.plist` (only if iOS Firebase services are used)
5. Branding:
   - App icon, adaptive icon, splash icon, favicon
   - Primary color
   - Secondary color
   - Optional tertiary surface/accent color
6. Legal/business:
   - Support/help URL
   - About URL
   - Privacy policy URL
   - Support email if shown in client copy

## 3) Update Environment Variables

Edit [`.env`](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesStoreApp/.env) with client values:

1. `EXPO_PUBLIC_API_BASE_URL`
2. `EXPO_PUBLIC_SOCKET_URL`
3. Optional:
   - `EXPO_PUBLIC_SOCKET_PATH`
   - `EXPO_PUBLIC_EAS_PROJECT_ID`

Notes:

1. `EXPO_PUBLIC_API_BASE_URL` is required by [apiConfig.ts](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesStoreApp/src/api/apiConfig.ts).
2. `EXPO_PUBLIC_SOCKET_URL` is required by [storeOrdersSocket.ts](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesStoreApp/src/socket/storeOrdersSocket.ts).
3. `EXPO_PUBLIC_EAS_PROJECT_ID` is a useful fallback for Expo push token resolution in [useExpoPushToken.ts](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesStoreApp/src/hooks/useExpoPushToken.ts).

## 4) Update Expo App Identity

Edit [app.config.js](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesStoreApp/app.config.js):

1. `expo.name`
2. `expo.slug`
3. `expo.ios.bundleIdentifier`
4. `expo.android.package`
5. `expo.updates.url`
6. `expo.extra.eas.projectId`

Important:

1. `updates.url` and `extra.eas.projectId` should match the client’s Expo project, not the base store app project.
2. If a new Expo project is created for the client, update both values together.

## 5) Replace Platform Config Files

1. Replace [google-services.json](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesStoreApp/google-services.json) with the client’s Android Firebase config.
2. Confirm the `package_name` in that file matches `expo.android.package`.
3. If iOS Firebase is required, add `GoogleService-Info.plist` to the app and wire it in Expo config.

## 6) Replace Branding Assets

Replace:

1. [icon.png](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesStoreApp/assets/icon.png)
2. [adaptive-icon.png](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesStoreApp/assets/adaptive-icon.png)
3. [splash-icon.png](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesStoreApp/assets/splash-icon.png)
4. [favicon.png](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesStoreApp/assets/favicon.png)

## 7) Apply Client Theme Colors

Adjust theme tokens in [colors.ts](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesStoreApp/src/theme/colors.ts):

1. `primary`
2. `secondary`
3. Supporting neutrals or soft surfaces if client wants a more specific brand pattern

Recommended mapping:

1. Use the client’s strongest brand color as `primary`.
2. Use the accent/highlight color as `secondary`.
3. If the client provides a tertiary soft color, use it for subtle surfaces, chips, or backgrounds where needed.

## 8) Update Client-Facing Text and Links

At minimum update:

1. App name:
   - [en.ts](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesStoreApp/src/localization/en.ts)
   - [fr.ts](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesStoreApp/src/localization/fr.ts)
2. External support/legal links in sidebar:
   - [useSidebar.ts](/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesStoreApp/src/hooks/useSidebar.ts)

Links to verify:

1. Privacy Policy
2. About Us
3. Help / Support

## 9) Validate Before Build

1. Start app once:
   - `npm start`
2. Validate:
   - App launches
   - Login works
   - Store orders socket connects
   - Notifications permission flow works on physical device
   - Sidebar links open correctly
3. Run native builds:
   - `npx expo run:android`
   - `npx expo run:ios`

## 10) Submission Checklist

1. Confirm IDs are unique per client:
   - iOS bundle identifier
   - Android package
   - Expo project ID
2. Confirm production URLs are production-ready.
3. Confirm Firebase config matches the final Android/iOS app IDs.
4. Confirm app icon/splash are client-specific.
5. Confirm support/about/privacy links are client-specific.
6. Commit changes with message:
   - `chore(client): rebrand <client-name> store app baseline config`

## 11) Recommended Operational Improvement

Current store app setup is simple, but for future client work prefer:

1. `.env.template` with required keys only
2. `.env.client-<name>` per client
3. A small setup script later to switch env and Expo identity values quickly

## 12) Client Intake Form (Fill This First)

Use this exact format. Developer fills it once, then AI agent uses it to apply changes in `.env`, `app.config.js`, assets, theme, Firebase config, and support/legal links.

```md
# Client Rebranding Intake - EnategaDeliveriesStoreApp

## Client Identity
CLIENT_NAME=EatMile
CLIENT_BRANCH=client/EatMile
APP_DISPLAY_NAME=EatMile Store
EXPO_SLUG=eatmile-store
IOS_BUNDLE_IDENTIFIER=com.eatmile.store
ANDROID_PACKAGE_NAME=com.eatmile.store

## Expo Project
EXPO_PROJECT_ID=b5571cc2-e82c-4d16-903f-a966fdd922fc
EXPO_UPDATES_URL=https://u.expo.dev/b5571cc2-e82c-4d16-903f-a966fdd922fc
EXPO_PUBLIC_EAS_PROJECT_ID=b5571cc2-e82c-4d16-903f-a966fdd922fc

## Backend and Socket URLs
EXPO_PUBLIC_API_BASE_URL=https://eatmile.chickenkiller.com/api/v1
EXPO_PUBLIC_SOCKET_URL=https://eatmile.chickenkiller.com
EXPO_PUBLIC_SOCKET_PATH=/socket.io

## Branding and Design
PRIMARY_COLOR=#020201
SECONDARY_COLOR=#FEDB03
TERTIARY_COLOR=#FFF8CB

## Legal and Support Links
PRIVACY_POLICY_URL=https://multivendor.enatega.com/terms
ABOUT_US_URL=https://multivendor.enatega.com/about
HELP_URL=https://ninjascode.com/
SUPPORT_EMAIL=Eatmileadmin@gmail.com

## Files Provided
ANDROID_GOOGLE_SERVICES_JSON_PATH=/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesStoreApp/google-services.json
IOS_GOOGLE_SERVICE_INFO_PLIST_PATH=/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesStoreApp/GoogleService-Info.plist
ICON_PATH=/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesStoreApp/assets/icon.png
ADAPTIVE_ICON_PATH=/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesStoreApp/assets/adaptive-icon.png
SPLASH_ICON_PATH=/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesStoreApp/assets/splash-icon.png
FAVICON_PATH=/Users/muhammadali/Desktop/Projects/super-app/EnategaDeliveriesStoreApp/assets/favicon.png

## Notes
CUSTOM_CLIENT_REQUIREMENTS=
```

## 13) Rebranding Progress Tracker (Tick as Completed)

Mark each step with `✅` when done.

- ✅ 1. Client branch created from `main`
- ✅ 2. Intake form completed and validated
- ✅ 3. `.env` values replaced from intake form
- ✅ 4. `app.config.js` identity updated (`name`, `slug`, bundle/package)
- ✅ 5. `updates.url` and `extra.eas.projectId` updated for client Expo project
- ✅ 6. `google-services.json` replaced and package verified
- ✅ 7. iOS `GoogleService-Info.plist` added/configured (if needed)
- ✅ 8. Branding assets replaced (`icon`, `adaptive-icon`, `splash`, `favicon`)
- ✅ 9. Theme colors updated in `colors.ts`
- ✅ 10. App name/support/legal links updated
- ⬜ 11. Smoke test passed (`npm start`)
- ⬜ 12. Android native run passed (`npx expo run:android`)
- ⬜ 13. iOS native run passed (`npx expo run:ios`)
- ⬜ 14. Final QA checklist passed for submission
- ⬜ 15. Commit created: `chore(client): rebrand <client-name> store app baseline config`
