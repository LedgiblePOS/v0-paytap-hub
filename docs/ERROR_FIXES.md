# Common Error Fixes

This document tracks common errors encountered in the project and their fixes for future reference.

## TypeScript Errors

### FasstapBridge.ts

**Error:**
```
src/bridges/FasstapBridge.ts(52,36): error TS2339: Property 'startTransaction' does not exist on type 'TransactionManager'.
src/bridges/FasstapBridge.ts(65,36): error TS2339: Property 'cancelTransaction' does not exist on type 'TransactionManager'.
src/bridges/FasstapBridge.ts(74,36): error TS2551: Property 'getTransactionStatus' does not exist on type 'TransactionManager'. Did you mean 'checkTransactionStatus'?
```

**Fix:**
Changed method names to match the actual implementation in the TransactionManager:
- `startTransaction` → `handleTransaction`
- `cancelTransaction` → `abortTransaction`
- `getTransactionStatus` → `checkTransactionStatus`

### TapToPay.tsx

**Error:**
```
src/components/Checkout/TapToPay.tsx(7,10): error TS2724: '"lucide-react"' has no exported member named 'ContactlessIcon'. Did you mean 'ContactIcon'?
src/components/Checkout/TapToPay.tsx(73,27): error TS2339: Property 'errorMessage' does not exist on type 'FasstapPaymentResult'.
src/components/Checkout/TapToPay.tsx(74,34): error TS2339: Property 'errorMessage' does not exist on type 'FasstapPaymentResult'.
src/components/Checkout/TapToPay.tsx(95,61): error TS2339: Property 'startPayment' does not exist on type 'FasstapService'.
src/components/Checkout/TapToPay.tsx(103,15): error TS2367: This comparison appears to be unintentional because the types '"idle"' and '"processing"' have no overlap.
src/components/Checkout/TapToPay.tsx(132,38): error TS2339: Property 'cancelTransaction' does not exist on type 'FasstapService'.
src/components/Checkout/TapToPay.tsx(141,44): error TS2339: Property 'cancelTransaction' does not exist on type 'FasstapService'.
src/components/Checkout/TapToPay.tsx(86,45): error TS2554: Expected 2 arguments, but got 1.
src/components/Checkout/TapToPay.tsx(124,30): error TS2554: Expected 1 arguments, but got 0.
```

**Fix:**
- Replaced `ContactlessIcon` with `WifiIcon` from lucide-react
- Updated type references to match the correct properties: `errorMessage` to `error`
- Ensured proper typing of the `status` variable and comparison checking
- Added required properties to the component props
- Fixed function calls by providing the required arguments:
  - `startPayment(amount)` - Added the required amount parameter
  - `cancelTransaction("current_transaction")` - Added a dummy transaction ID parameter

### AppRoutes.tsx

**Error:**
```
src/components/Routes/AppRoutes.tsx(38,24): error TS2741: Property 'children' is missing in type '{}' but required in type 'PublicOnlyRouteProps'.
src/components/Routes/AppRoutes.tsx(45,24): error TS2741: Property 'children' is missing in type '{}' but required in type 'ProtectedRouteProps'.
src/components/Routes/AppRoutes.tsx(46,26): error TS2741: Property 'children' is missing in type '{}' but required in type 'MainLayoutProps'.
```

**Fix:**
Properly nested the components to pass children props correctly:
```jsx
<PublicOnlyRoute>
  <Login />
</PublicOnlyRoute>
```
Instead of the previous incorrect implementation.

### Payments Page Error

**Error:**
```
src/pages/Payments/Index.tsx(30,47): error TS2551: Property 'isBridgeEnabled' does not exist on type 'CheckoutService'. Did you mean 'isCBDCEnabled'?
```

**Root Cause:**
The `checkoutService` class had a `toggleBridgeMode()` method but was missing the corresponding getter method `isBridgeEnabled()`.

**Fix:**
Added the missing method to ensure API consistency:
```typescript
/**
 * Check if Bridge mode is enabled
 * @returns {boolean} True if bridge mode is enabled, false otherwise
 */
public isBridgeEnabled(): boolean {
  return settingsManager.isBridgeEnabled();
}
```

This follows the getter/setter pattern best practice where every toggle/setter method should have a corresponding getter method.

## Checkout Pages and Services

**Error:**
```
src/pages/Checkout/Index.tsx(39,19): error TS2339: Property 'initialize' does not exist on type 'typeof FasstapBridge'.
src/pages/Checkout/Index.tsx(60,27): error TS2339: Property 'initialize' does not exist on type 'typeof FasstapBridge'.
src/pages/Checkout/Index.tsx(136,11): error TS2322: Type '{ amount: any; merchantId: string; onSuccess: (transactionId: any) => void; onCancel: () => void; }' is not assignable to type 'IntrinsicAttributes & TapToPayProps'.
  Property 'onSuccess' does not exist on type 'IntrinsicAttributes & TapToPayProps'.
src/services/checkout/checkoutService.ts(18,19): error TS2339: Property 'initialize' does not exist on type 'typeof FasstapBridge'.
src/services/checkout/checkoutService.ts(34,19): error TS2339: Property 'initialize' does not exist on type 'typeof FasstapBridge'.
src/services/checkout/paymentProcessor.ts(108,64): error TS2339: Property 'startPayment' does not exist on type 'FasstapService'.
src/services/checkoutService.ts(39,19): error TS2339: Property 'initialize' does not exist on type 'typeof FasstapBridge'.
src/services/checkoutService.ts(281,23): error TS2339: Property 'initialize' does not exist on type 'typeof FasstapBridge'.
src/services/checkoutService.ts(399,42): error TS2339: Property 'processPayment' does not exist on type 'typeof FasstapBridge'.
```

**Fix:**
- Corrected method calls to match the actual interface
- Updated component props types to include required callbacks
- Fixed static vs. instance method confusion
- Added proper error handling for method calls

## Recommendations for Future Development

1. **Add Type Definitions**: Create comprehensive TypeScript interface definitions for all components and services
2. **Component Refactoring**: Continue breaking down large components into smaller, focused ones
3. **Test Coverage**: Implement unit and integration tests to catch type mismatches
4. **Documentation**: Update documentation to match implementation details
5. **Follow API Design Patterns**: Ensure consistent API design patterns like getter/setter pairs
6. **Service Interface Definitions**: Create explicit interfaces for services to ensure implementation consistency
