# Type Conversion Best Practices

This document outlines best practices for handling type conversions between database entities and application models to prevent common TypeScript errors.

## Common Type Conversion Errors

### 1. Missing Type Exports

**Problem:**
```
error TS2614: Module '"@/services/errorTrackingService"' has no exported member 'ErrorMetrics'
```

**Solution:**
- Always export interfaces and types that will be used outside the module
- Use explicit named exports for types

**Example:**
```typescript
// BAD - Interface defined but not exported
interface ErrorMetrics {
  errorCount: number;
}

// GOOD - Interface properly exported
export interface ErrorMetrics {
  errorCount: number;
}
```

### 2. Type Incompatibility in Entity/Model Conversions

**Problem:**
```
error TS2345: Argument of type '{ business_logo: string; ... }' is not assignable to parameter of type 'Merchant'.
Types of property 'subscription_tier' are incompatible.
```

**Solution:**
- Create distinct type definitions for database entities and application models
- Use converter functions to handle type transformations
- Normalize string enums from database to typed enums in the application
- Add validation/normalization in converter functions

**Example:**
```typescript
// Database entity (as stored in database)
interface MerchantEntity {
  subscription_tier: string; // Stored as string in DB
}

// Application model (used in components)
interface MerchantModel {
  subscriptionTier: SubscriptionTier; // Typed enum in application
}

// Converter function with normalization
function toMerchantModel(entity: MerchantEntity): MerchantModel {
  return {
    subscriptionTier: normalizeSubscriptionTier(entity.subscription_tier),
    // other properties...
  };
}
```

## Best Practices

### 1. Maintain Separate Types for Database and Application

- **Database Entity Types**: Should match exactly how data is stored in the database
  - Use snake_case property names
  - Use primitive types (string, number, boolean)
  - Don't include computed properties

- **Application Model Types**: Optimized for use in the application
  - Use camelCase property names
  - Use refined types (enums, unions)
  - Can include computed properties

### 2. Centralize Type Definitions

- Create dedicated type files (e.g., `types/merchant.ts`, `types/subscription.ts`)
- Re-export from a central `index.ts` file
- Group related types together

### 3. Create Robust Converter Functions

- Always validate data coming from external sources
- Provide fallback values for missing or invalid data
- Add type guards where appropriate
- Document expected input and output formats

### 4. Use Type Guards for Runtime Validation

```typescript
function isValidSubscriptionTier(tier: string): tier is SubscriptionTier {
  return ['FREE', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE'].includes(tier);
}
```

### 5. Handle Database NULL Values Properly

- Use optional properties (e.g., `businessLogo?: string`) for nullable fields
- Provide default values in converters (`businessLogo: entity.business_logo || null`)

## Preventing Type Errors in CI/CD

1. **Run TypeScript Checks in CI/CD**
   ```bash
   tsc --noEmit
   ```

2. **Add ESLint Rules for Type Safety**
   - `@typescript-eslint/no-explicit-any` - Discourage use of `any`
   - `@typescript-eslint/explicit-module-boundary-types` - Enforce return types

3. **Review Type Interfaces When Database Schema Changes**
   - Update entity types when database schema changes
   - Check converter functions for compatibility

By following these practices, we can prevent common type conversion errors and improve the reliability of our application.
