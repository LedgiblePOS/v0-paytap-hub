
# TypeScript Error Prevention Guide

## Common Error Patterns and How to Avoid Them

### 1. Database Entity vs UI Model Format Issues

The most common error in our codebase is the mismatch between database entity field names (snake_case) and UI model field names (camelCase).

#### Error Types:

- **Property does not exist errors**:
  ```
  error TS2551: Property 'firstName' does not exist on type 'User'. Did you mean 'first_name'?
  ```

- **Object literal may only specify known properties**:
  ```
  error TS2561: Object literal may only specify known properties, but 'merchantId' does not exist in type 'Product'. Did you mean to write 'merchant_id'?
  ```

- **Type assignment compatibility errors**:
  ```
  error TS2322: Type '{ id: string; userId: string; }' is not assignable to type 'Merchant'. Property 'user_id' is missing.
  ```

#### Solution:

We've implemented a clear separation between:
- **Database Entities**: Use snake_case (e.g., `user_id`, `first_name`)
- **UI Models**: Use camelCase (e.g., `userId`, `firstName`)

Always use the converters in `/src/utils/modelConversions.ts` to translate between these formats:

```typescript
// Convert from database entity to UI model
const userModel = toUserModel(userEntity);

// Convert from UI model back to database entity
const userEntity = toUserEntity(userModel);
```

#### Where to Apply Conversions:

1. **API Boundaries**: When fetching data from Supabase or any API, convert to models immediately
2. **Before UI Rendering**: Ensure components only receive and use model data
3. **Before Database Operations**: Convert models back to entities before saving

### 2. Array or String Type Issues

When dealing with properties that could be either strings or arrays:

```typescript
// This will cause errors if features is a string
features.map(feature => /* ... */);
```

#### Solution:

```typescript
// Always check the type before using array methods
if (Array.isArray(features)) {
  features.map(feature => /* ... */);
} else if (typeof features === 'string') {
  try {
    // Try parsing if it's a JSON string
    const parsedFeatures = JSON.parse(features);
    if (Array.isArray(parsedFeatures)) {
      parsedFeatures.map(feature => /* ... */);
    }
  } catch {
    // Handle as a single item
    [features].map(feature => /* ... */);
  }
}
```

### 3. Enum Type Issues

When using enums, TypeScript enforces type safety:

```typescript
// Error: Argument of type 'string' is not assignable to parameter of type 'SubscriptionTier'
setSubscriptionTier(data.tier);
```

#### Solution:

```typescript
// Explicitly cast to the enum type
setSubscriptionTier(data.tier as SubscriptionTier);

// Or validate before assignment
if (isValidSubscriptionTier(data.tier)) {
  setSubscriptionTier(data.tier);
}

// Helper function
function isValidSubscriptionTier(tier: any): tier is SubscriptionTier {
  return Object.values(SubscriptionTier).includes(tier);
}
```

### 4. Function Return Type Issues

```typescript
// Error: An expression of type 'void' cannot be tested for truthiness
if (signIn(email, password)) { 
  // ...
}
```

#### Solution:

```typescript
// Correct approach - check the returned result properly
const result = await signIn(email, password);
if (result && result.success) { 
  // ...
}

// Or use try/catch for functions that throw errors
try {
  await signIn(email, password);
  // Success handling
} catch (error) {
  // Error handling
}
```

## Best Practices for Error Prevention

1. **Use Type Assertions Sparingly**: While `as` can solve immediate problems, it bypasses TypeScript's safety checks

2. **Create Type Guards**: For complex conditionals, create dedicated type guard functions

3. **Establish Clear Data Boundaries**: Define where database entities are converted to UI models

4. **Use Nullish Coalescing and Optional Chaining**: 
   ```typescript
   const name = user?.firstName ?? 'Anonymous';
   ```

5. **Add Proper JSDoc Comments**: Document complex types for better IDE support

6. **Use TypeScript's Utility Types**: Like `Partial<T>`, `Pick<T>`, `Omit<T>` when appropriate

## Debugging Type Errors

1. **Check the Error Message Carefully**: TypeScript errors often indicate the solution

2. **Use VS Code Hover Info**: Hovering over variables shows their inferred types

3. **Add Explicit Type Annotations**: When in doubt, specify types explicitly

4. **Isolate the Problem**: Create minimal reproductions of complex type issues

5. **Use `console.log(typeof variable, variable)` to check runtime types

## System-Wide Solutions

1. **Strict Typing in New Code**: All new features must use strict typing

2. **Code Reviews**: Check specifically for type safety issues

3. **Automated Tests**: Unit tests can catch type mismatches at runtime

4. **Common Patterns Library**: Use shared utilities for common operations

By following these guidelines, we can significantly reduce TypeScript errors in the codebase.
