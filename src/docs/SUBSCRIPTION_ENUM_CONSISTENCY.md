
# Subscription Tier Enum Consistency Guidelines

This document explains how to maintain consistency when working with the `SubscriptionTier` enum throughout the application.

## Current Enum Definition

As defined in `src/types/subscription.ts`:

```typescript
export enum SubscriptionTier {
  FREE = "FREE",
  STARTER = "STARTER",
  BUSINESS = "BUSINESS", 
  GO_GLOBAL = "GO_GLOBAL",
  PROFESSIONAL = "PROFESSIONAL",
  ENTERPRISE = "ENTERPRISE"
}
```

## Best Practices for Using Enums

1. **Always Import the Enum**:
   ```typescript
   import { SubscriptionTier } from "@/types/subscription";
   // or
   import { SubscriptionTier } from "@/types";
   ```

2. **Use Enum Values, Not String Literals**:
   ```typescript
   // CORRECT
   if (tier === SubscriptionTier.PROFESSIONAL) { /* ... */ }
   
   // AVOID
   if (tier === 'PROFESSIONAL') { /* ... */ }
   ```

3. **In Objects and Records**:
   ```typescript
   // CORRECT
   const tierConfig = {
     [SubscriptionTier.FREE]: { /* config */ },
     [SubscriptionTier.PROFESSIONAL]: { /* config */ }
   };
   
   // Access using enum values
   const config = tierConfig[SubscriptionTier.PROFESSIONAL];
   ```

4. **For Component Props**:
   ```typescript
   interface Props {
     tier: SubscriptionTier;  // Use the enum type
   }
   ```

5. **Making Changes to Enum Values**:
   - When adding or removing enum values, update all switch statements and objects that use the enum as keys
   - Check for type errors throughout the codebase after any enum changes
   - Consider using TypeScript's exhaustiveness checking for switch statements

## Common Issues and Solutions

1. **Property Missing from Enum**:
   ```
   Property 'SOME_VALUE' does not exist on type 'typeof SubscriptionTier'.
   ```
   
   Solution: 
   - Check if you're using the correct enum value from `SubscriptionTier`
   - Update component to use only valid enum values

2. **Type Safety for Dynamic Usage**:
   
   When working with values that might not be valid enum members:
   ```typescript
   // Check if a string is a valid enum value
   function isValidTier(tier: string): tier is SubscriptionTier {
     return Object.values(SubscriptionTier).includes(tier as SubscriptionTier);
   }
   
   // Usage
   if (isValidTier(someTier)) {
     // TypeScript now knows this is a valid SubscriptionTier
   }
   ```

By following these guidelines, we can maintain consistency and type safety when working with enums throughout the application.
