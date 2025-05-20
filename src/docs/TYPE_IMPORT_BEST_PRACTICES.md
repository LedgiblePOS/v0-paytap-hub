
# Type Import Best Practices

This document provides guidance on preventing common type import errors and maintaining type consistency across the codebase.

## Common Type Import Errors and Solutions

### 1. Missing Type Exports

**Error:**
```
Module '@/types' has no exported member 'UserRole'.
```

**Solution:**
- Ensure all types used across the application are properly exported from your type files
- Check that you're importing from the correct location

**Example:**
```typescript
// src/types/index.ts
export * from './user';
export * from './merchant';

// Add direct exports for common types
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}
```

### 2. Type vs Value Usage

**Error:**
```
'SubscriptionTier' only refers to a type, but is being used as a value here.
```

**Solution:**
- Convert type aliases to enums when values are needed
- Export constants alongside types

**Example:**
```typescript
// Wrong approach - type can't be used as value
export type SubscriptionTier = 'FREE' | 'PREMIUM';

// Correct approach - enum can be used as both type and value
export enum SubscriptionTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM'
}
```

### 3. Missing Properties in Interfaces

**Error:**
```
Property 'description' does not exist on type 'SubscriptionPlan'.
```

**Solution:**
- Keep interface definitions complete and up-to-date
- Consider using optional properties for backward compatibility

**Example:**
```typescript
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  description?: string; // Optional for backward compatibility
}
```

## Best Practices

### Single Source of Truth
- Define each type in exactly one place
- Group related types in domain-specific files

### Type Organization
```
src/
  types/
    index.ts      # Re-exports all types
    user.ts       # User-related types
    merchant.ts   # Merchant-related types
    subscription.ts # Subscription-related types
```

### Import Patterns
```typescript
// Preferred: Import from the root types directory
import { UserRole, MerchantModel } from '@/types';

// Acceptable: Direct import for specialized cases
import { SubscriptionPlan } from '@/types/subscription';

// Avoid: Importing specific properties from complex objects
import { user.role } from '@/store'; // BAD
```

### Type vs. Interface
- Use `interface` for objects that will be extended/implemented
- Use `type` for unions, primitives, or objects that won't be extended
- Use `enum` when you need both type checking and runtime values

### Type Checking Process
1. Review all imports at the top of each file
2. Ensure enums are used for values that need runtime representation
3. Verify that all required properties are defined in interfaces
4. Check that types are exported from their source files

By following these practices, you can significantly reduce type-related errors in your TypeScript codebase.
