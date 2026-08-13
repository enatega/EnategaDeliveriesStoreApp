# Invoice Printing Implementation

## What was implemented

- Added a **Print Invoice** action to each received order card.
- Added Bluetooth permissions, paired-printer discovery, saved-printer reuse, reconnect, and retry handling.
- Added an 80 mm invoice with order, customer, fulfillment, items/options, totals, and notes.
- Added the existing Cylia PNG logo to the captured invoice; the printer encoder converts the final base64 PNG to monochrome thermal pixels.
- Added English and French printer states and errors.
- Added the Android socket/error patch used by the working Yalla implementation.

## Packages

- `react-native-thermal-receipt-printer-image-qr@0.1.12`
- `react-native-ping@1.2.8` (runtime import required by the printer package)
- `react-native-view-shot@4.0.3`
- `patch-package@8.0.0`

The printer package has outdated React Native peer declarations. The repository's `.npmrc` enables npm's legacy peer resolver, and `postinstall` reapplies the native patch automatically.

## Main files

- `src/components/orders/InvoicePrintButton.tsx` — printer UI and workflow.
- `src/services/printer.ts` — native Bluetooth operations.
- `src/utils/orderInvoice.ts` — receipt formatting.
- `patches/react-native-thermal-receipt-printer-image-qr+0.1.12.patch` — native connection/error fixes.
- `app.config.js` — Android and iOS Bluetooth permissions.

## Runtime requirements

- Pair the printer in the phone's Bluetooth settings before scanning.
- Use a fresh development or production native build; printing does not work in Expo Go.
- The receipt is configured for an 80 mm printer.

## Verification completed

- TypeScript: `npm run typecheck`
- Receipt formatter sample assertion
- Expo permission configuration: `npx expo config --type public`
- Android Metro bundle: `npx expo export --platform android`
- Patch application: `npx patch-package`
- Android native compilation: `./gradlew :app:compileDebugJavaWithJavac`

All checks passed on August 12, 2026.
