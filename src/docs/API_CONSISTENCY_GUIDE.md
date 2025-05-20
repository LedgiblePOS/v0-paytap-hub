
# API Consistency Guide

## Overview

This guide addresses how to maintain consistent API usage across service interfaces, focusing on preventing TypeScript errors that occur when method names don't match their implementations.

## Recent Issue: Property 'isBridgeEnabled' Missing

We encountered a TypeScript error in the Payments page:

```
src/pages/Payments/Index.tsx(30,47): error TS2551: Property 'isBridgeEnabled' does not exist on type 'CheckoutService'. Did you mean 'isCBDCEnabled'?
```

### Root Cause Analysis

1. The error occurred because we were calling `checkoutService.isBridgeEnabled()` but the method wasn't defined in the service itself.

2. While the `checkoutService` had a `toggleBridgeMode()` method to enable/disable the bridge, it didn't expose a corresponding getter method (`isBridgeEnabled`) to check the current state.

3. The code was trying to access a method that doesn't exist while a similar method (`isCBDCEnabled`) was available, causing TypeScript to suggest it as an alternative.

### Solution

Two approaches to fixing this issue:

1. **Method Implementation Approach**: Update the `checkoutService` to include the missing method.
   ```typescript
   // In checkoutService.ts
   public isBridgeEnabled(): boolean {
     return localStorage.getItem("USE_FASSTAP_BRIDGE") === "true";
   }
   ```

2. **Client-side Workaround**: Read directly from the same storage location.
   ```typescript
   // In component
   const bridgeEnabled = localStorage.getItem("USE_FASSTAP_BRIDGE") === "true";
   ```

For our immediate fix, we chose to implement the getter in the service to maintain API consistency.

## Best Practices for Service API Consistency

### 1. Follow the Getter/Setter Pattern

When implementing a toggle or setter method, always include a corresponding getter:

```typescript
// GOOD
toggleFeature(enabled: boolean): void { ... }
isFeatureEnabled(): boolean { ... }

// BAD
toggleFeature(enabled: boolean): void { ... }
// Missing isFeatureEnabled method!
```

### 2. Maintain Interface-Implementation Alignment

Ensure your implementation matches any interface definitions:

```typescript
// Interface
interface PaymentService {
  isBridgeEnabled(): boolean;
  toggleBridgeMode(enabled: boolean): void;
}

// Implementation must match
class CheckoutService implements PaymentService {
  isBridgeEnabled(): boolean { ... }
  toggleBridgeMode(enabled: boolean): void { ... }
}
```

### 3. Use Type Checking During Development

Use TypeScript's static analysis tools during development:

```bash
# Run TypeScript compiler in watch mode
npx tsc --watch --noEmit
```

### 4. Document Service API Changes

When modifying service interfaces, update documentation:

```typescript
/**
 * Checks if the bridge mode is enabled
 * @returns {boolean} True if bridge mode is enabled, false otherwise
 */
public isBridgeEnabled(): boolean {
  return localStorage.getItem("USE_FASSTAP_BRIDGE") === "true";
}
```

## Service Refactoring Best Practices

### 1. Single Responsibility Principle

Each service file should have a single responsibility:
- `credentialsManager.ts` - Manages API credentials
- `settingsManager.ts` - Handles feature toggles and settings
- `paymentService.ts` - Processes payments
- `transactionService.ts` - Handles transaction operations

### 2. File Size Thresholds

Files exceeding 200 lines of code should be considered for refactoring:
- Split by functionality
- Create specialized services
- Extract common utilities

### 3. Service Composition

Services should be composed of smaller services:
```typescript
// Main service delegates to specialized services
class CheckoutService {
  constructor(
    private credentialsManager: CredentialsManager,
    private settingsManager: SettingsManager,
    private paymentProcessor: PaymentProcessor
  ) {}

  // Methods delegate to specialized services
}
```

### 4. Consistent Singleton Pattern

When using the singleton pattern, be consistent across services:
```typescript
// Private constructor + getInstance pattern
class MyService {
  private static instance: MyService;
  
  private constructor() {}
  
  public static getInstance(): MyService {
    if (!MyService.instance) {
      MyService.instance = new MyService();
    }
    return MyService.instance;
  }
}

// Or factory function approach for simpler services
class MyService {
  // Service implementation
}

export default new MyService();
```

## Implementation Checklist for Service Methods

Before merging changes:

- [ ] Every setter has a corresponding getter
- [ ] Method names follow consistent naming conventions
- [ ] Methods are properly documented with JSDoc comments
- [ ] Methods are properly typed (parameters and return values)
- [ ] Changes are reflected in any relevant interface definitions
- [ ] Changes pass TypeScript compilation
- [ ] Service file size is reasonable (<200 lines)
- [ ] Service has a single responsibility

By following these practices, we can minimize TypeScript errors related to missing methods or API inconsistencies.
