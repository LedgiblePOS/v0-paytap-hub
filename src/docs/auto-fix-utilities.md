
# Model Conversion Auto-Fix Utilities

This document explains how to use the auto-fix utilities to help prevent and debug TypeScript errors related to model/entity property access.

## Purpose

The auto-fix utilities provide runtime warnings and fixes for common model/entity property access errors. They're designed to:

1. Help developers identify incorrect property access patterns
2. Provide automatic conversion when possible
3. Serve as a teaching tool for proper model usage

> **Note:** These utilities are primarily for development and debugging. For production code, proper type usage should be enforced through TypeScript and code reviews.

## Available Utilities

### 1. Model/Entity Proxies

These proxies wrap your data objects and intercept property access, warning when incorrect properties are accessed but still allowing your code to work:

```typescript
import { createModelEntityProxy } from '@/utils/autoModelFix';

// Wrap your object in a proxy
const safeUser = createModelEntityProxy(user);

// If you try to access the wrong property format, you'll get a warning
// but the code will still work by accessing the correct property
const name = safeUser.firstName; // Works even if user has first_name instead
```

### 2. Type-Specific Proxies

For common types, we provide specialized proxies that can automatically convert entities to models:

```typescript
import { 
  createUserProxy, 
  createMerchantProxy, 
  createProductProxy 
} from '@/utils/autoModelFix';

// These will automatically convert entities to models if needed
const safeUser = createUserProxy(userObject);
const safeMerchant = createMerchantProxy(merchantObject);
const safeProduct = createProductProxy(productObject);

// Now you can safely use model properties
console.log(safeUser.firstName);
console.log(safeMerchant.businessName);
console.log(safeProduct.inStock);
```

## How to Use in Development

### For Debugging TypeScript Errors

When you encounter property access errors in TypeScript, you can use these utilities to help identify the issue:

```typescript
// If you're getting errors on user.firstName
import { createUserProxy } from '@/utils/autoModelFix';

function getUserName(user: any) {
  // Wrap the user object to see what's happening
  const safeUser = createUserProxy(user);
  
  // This will work and give warnings if there's a problem
  return `${safeUser.firstName} ${safeUser.lastName}`;
}
```

### In Development Environment

You can add this to components that frequently have type issues:

```typescript
import { createModelEntityProxy } from '@/utils/autoModelFix';

function CustomerDetails({ customer }: { customer: Customer | CustomerModel }) {
  // In development only
  if (process.env.NODE_ENV === 'development') {
    customer = createModelEntityProxy(customer, 'Customer');
  }
  
  return (
    <div>
      <h2>{customer.firstName} {customer.lastName}</h2>
      <p>Email: {customer.email}</p>
    </div>
  );
}
```

## Warning Display

When an incorrect property access is detected, a console warning will be shown:

```
TypeScript Error Prevention: Attempted to access 'firstName' on a entity object.
Did you mean to use 'first_name'? Consider using proper model conversion functions.
```

## Limitations

These utilities:

1. Only work at runtime, not during compilation
2. Add overhead and should not be used in production code
3. Can't detect all potential issues
4. Might have false positives for objects with unconventional property names

## Best Practices

1. Use these utilities for debugging and development only
2. Fix the root issues by properly using model conversion functions
3. Add explicit type annotations to help TypeScript catch errors
4. Write automated tests to verify correct type usage
5. Consider using ESLint rules to enforce proper type usage

## Example: Adding to a Development Environment

Here's how you might add these utilities to your development environment:

```typescript
// src/utils/devHelpers.ts
import { 
  createUserProxy, 
  createMerchantProxy, 
  createProductProxy 
} from './autoModelFix';

export function wrapModels<T>(data: T): T {
  if (process.env.NODE_ENV !== 'development') {
    return data;
  }
  
  // Skip undefined/null values
  if (!data) return data;
  
  // Handle arrays recursively
  if (Array.isArray(data)) {
    return data.map(wrapModels) as unknown as T;
  }
  
  // Only process objects
  if (typeof data !== 'object') return data;
  
  // Check for common object types
  if ('first_name' in data || 'firstName' in data) {
    return createUserProxy(data as any) as unknown as T;
  }
  
  if ('business_name' in data || 'businessName' in data) {
    return createMerchantProxy(data as any) as unknown as T;
  }
  
  if ('in_stock' in data || 'inStock' in data) {
    return createProductProxy(data as any) as unknown as T;
  }
  
  // Generic object
  return createModelEntityProxy(data, 'Object') as T;
}
```

By using these utilities during development, you can catch and fix model conversion issues early.
