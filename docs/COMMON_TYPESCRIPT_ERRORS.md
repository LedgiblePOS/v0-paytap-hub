
# Common TypeScript Errors in the Project

This document outlines common TypeScript errors encountered in the project and how to address them.

## Property Name Mismatches: Snake Case vs. Camel Case

The most common error pattern in the project is the mismatch between snake_case property names in database types and camelCase property names used in the frontend code.

### Error Pattern:

```typescript
// Error example
error TS2551: Property 'firstName' does not exist on type 'User'. Did you mean 'first_name'?
```

### Solution:

We implemented a model/entity approach:

1. **Database Entities (Snake Case)**: Use snake_case for properties matching database column names.
   ```typescript
   export interface User {
     id: string;
     first_name: string;
     last_name: string;
     // ...
   }
   ```

2. **Frontend Models (Camel Case)**: Use camelCase for UI-friendly property names.
   ```typescript
   export interface UserModel {
     id: string;
     firstName: string;
     lastName: string;
     // ...
   }
   ```

3. **Conversion Functions**: Add utility functions to convert between formats.
   ```typescript
   export function toUserModel(user: User): UserModel {
     return {
       id: user.id,
       firstName: user.first_name,
       lastName: user.last_name,
       // ...
     };
   }
   
   export function toUserEntity(model: UserModel): User {
     return {
       id: model.id,
       first_name: model.firstName,
       last_name: model.lastName,
       // ...
     };
   }
   ```

## Enum Type Mismatches

Errors from using string literals where enum types are expected.

### Error Pattern:

```typescript
error TS2345: Argument of type 'string' is not assignable to parameter of type 'SubscriptionTier'.
```

### Solution:

Ensure value is explicitly cast to the enum type when needed:

```typescript
// Incorrect
setSubscriptionTier(response.tier);

// Correct
setSubscriptionTier(response.tier as SubscriptionTier);
```

## Array vs. String Type Conflicts

When a property might be either an array or a string.

### Error Pattern:

```typescript
error TS2339: Property 'map' does not exist on type 'string'.
```

### Solution:

Always check the type before using array methods:

```typescript
// Incorrect
features.map(feature => /* ... */);

// Correct
Array.isArray(features) 
  ? features.map(feature => /* ... */)
  : typeof features === 'string' 
    ? [features].map(feature => /* ... */)
    : []
```

## Missing Properties in Object Literals

When constructing objects with incorrect property names.

### Error Pattern:

```typescript
error TS2561: Object literal may only specify known properties, but 'merchantId' does not exist in type 'Product'. Did you mean to write 'merchant_id'?
```

### Solution:

Be careful when constructing objects directly:

```typescript
// Incorrect
const product = {
  merchantId: merchantId,
  name: name,
  // ...
};

// Correct
const product = {
  merchant_id: merchantId,
  name: name,
  // ...
};
```

Or better yet, use the conversion functions:

```typescript
const productModel = {
  merchantId: merchantId,
  name: name,
  // ...
};

const product = toProductEntity(productModel);
```

## Function Return Type Mismatches

### Error Pattern:

```typescript
error TS1345: An expression of type 'void' cannot be tested for truthiness.
```

### Solution:

Ensure functions return appropriate values:

```typescript
// Incorrect
if (signIn(email, password)) { /* ... */ }

// Correct
const result = await signIn(email, password);
if (result && !result.error) { /* ... */ }
```

## Best Practices to Avoid These Errors

1. **Use Type Conversion**: Always use the appropriate conversion functions between database entities and frontend models.

2. **Check Array Types**: Always check if a value is an array before using array methods.

3. **Use Explicit Type Annotations**: When dealing with complex or union types, add explicit type annotations.

4. **Avoid Direct Property Access**: Use optional chaining (`?.`) when accessing potentially undefined properties.

5. **Validate Function Returns**: Check function return types and handle appropriately.

6. **Use IDE Features**: Take advantage of TypeScript features in your IDE to catch errors early.

7. **Add Comments**: Document complex types or conversions with clear comments.

By following these guidelines, you can avoid the most common TypeScript errors in the project.
