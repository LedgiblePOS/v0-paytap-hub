
# Entity-Model Type Consistency Guide

## Problem: Type Definition Mismatch

We encountered build errors due to a mismatch between type definitions in different parts of our codebase:

```
error TS2345: Argument of type 'import("/dev-server/src/types/index").Customer' is not assignable 
to parameter of type 'import("/dev-server/src/utils/modelConversions/customerConverters").Customer'.
Property 'created_at' is optional in type 'Customer' but required in type 'Customer'.
```

The same entity (`Customer`) was defined slightly differently in two locations:
- Global type in `src/types/index.ts` had `created_at` as optional (`created_at?`)
- Converter type in `src/utils/modelConversions/customerConverters.ts` had it as required (`created_at`)

## Root Cause

This inconsistency happens when:
1. Type definitions for the same entity exist in multiple files
2. One definition is updated without updating all related definitions
3. Type changes at the global level aren't propagated to specialized utility files

## Solution

We fixed this by:
1. Making the converter's Customer type definition match the global one
2. Making `created_at` and `updated_at` optional in the converter type
3. Adding null/undefined handling in the conversion functions

## Best Practices for Preventing Type Mismatches

### 1. Single Source of Truth

Ideally, use only ONE definition for each entity type:

```typescript
// In src/types/index.ts
export interface Customer {
  // All properties defined here
}

// In converter file
import { Customer } from "@/types";
// Use the imported type rather than redefining
```

### 2. When Multiple Definitions Are Necessary

If you must define the same entity type in multiple places:

```typescript
// In converter file
import { Customer as GlobalCustomer } from "@/types";

// Extend the global type if you need to add converter-specific properties
export interface Customer extends GlobalCustomer {
  // Additional properties if needed
}

// Or use type aliases
export type Customer = GlobalCustomer;
```

### 3. Consistent Property Optionality

Be consistent with property nullability. If a property can be null/undefined in one place, it should be marked optional everywhere:

```typescript
// Consistent usage of optional properties
export interface Customer {
  id: string;           // Always required
  email?: string;       // Always optional
  created_at?: string;  // Always optional
}
```

### 4. Type Checks Before Major Changes

When modifying entity types:
1. Search the codebase for all definitions of that type
2. Update all locations consistently
3. Run TypeScript checks (`tsc --noEmit`) to catch missed instances

## Real Example of Proper Type Consistency

```typescript
// In src/types/index.ts
export interface Customer {
  id: string;
  merchant_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

// In src/utils/modelConversions/customerConverters.ts
import { Customer } from "@/types";

// No need to redefine, just use the imported type
export function toCustomerModel(customer: Customer): CustomerModel {
  // Conversion logic
}
```

Remember: Type definitions should be maintained in one place when possible. When multiple definitions are unavoidable, ensure they're kept in sync.
