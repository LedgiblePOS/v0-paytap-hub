
# Common Error Patterns and Solutions

This document outlines common errors we've encountered in our codebase and how to resolve them.

## 1. Entity/Model Type Mismatch

### Problem

The most common error in our application is the mismatch between database entities (snake_case) and UI models (camelCase).

```
Type 'User[]' is not assignable to type 'UserData[]'.
Property 'first_name' does not exist on type 'User' but required in type 'UserData'.
```

### Solution

1. **Use Conversion Functions**: Always convert between entity and model types using utility functions:
   ```typescript
   // From database entity to UI model
   const userModel = toUserModel(userEntity);
   
   // From UI model to database entity
   const userEntity = toUserEntity(userModel);
   ```

2. **Create Adapter Components**: If you have components that need to work with both entity and model formats, create adapter functions:
   ```typescript
   export const convertUserToEditUserData = (user: any): EditUserData => {
     if ("firstName" in user) {
       return { id: user.id, first_name: user.firstName, ... };
     } else if ("first_name" in user) {
       return user;
     }
   };
   ```

## 2. Supabase Query Errors

### Problem

Supabase queries with complex joins often result in type errors:

```
Property 'id' does not exist on type 'ParserError<"Unable to parse renamed field at `auth:auth.users!id(...)">'
```

### Solution

1. **Simplify Queries**: Avoid complex joins when possible
   ```typescript
   // Instead of complex joins:
   .select(`id, first_name, last_name, auth:auth.users!id(email)`)
   
   // Use simpler queries:
   .select('id, first_name, last_name, email')
   ```

2. **Handle Query Results**: Always check and transform query results to match your expected types
   ```typescript
   const transformedData = data.map(item => ({
     id: item.id,
     first_name: item.first_name || '',
     // ... transform other fields
   }));
   ```

## 3. Component Prop Type Mismatches

### Problem

```
Type '{ onRoleChange: (role: string) => void; }' is not assignable to type 'IntrinsicAttributes & UserFiltersProps'.
Property 'onRoleChange' does not exist on type 'IntrinsicAttributes & UserFiltersProps'.
```

### Solution

1. **Design Flexible Interfaces**: Create components that can handle multiple usage patterns
   ```typescript
   interface UserFiltersProps {
     // New pattern
     roleFilter?: string;
     onRoleChange?: (role: string) => void;
     
     // Legacy pattern
     setFilterRole?: (role: string) => void;
   }
   ```

2. **Use Adapter Functions**: Create functions in your components to handle different prop patterns
   ```typescript
   const handleRoleChange = (value: string) => {
     if (onRoleChange) {
       onRoleChange(value);
     } else if (setFilterRole) {
       setFilterRole(value);
     }
   };
   ```

## 4. Missing Imports

### Problem

```
Module '...' has no default export.
'...' has no exported member named 'X'.
```

### Solution

1. **Use Correct Import Syntax**: 
   ```typescript
   // For default exports:
   import ComponentName from 'path';
   
   // For named exports:
   import { ComponentName } from 'path';
   ```

2. **Check Available Exports**: Always verify what's actually exported from a module
   ```typescript
   // For icons, check docs/use autocomplete:
   import { Shield, Lock } from 'lucide-react';  // Correct
   import { CardIcon } from 'lucide-react';      // Error - doesn't exist
   ```

## Prevention Strategies

1. **Create Strong Type Boundaries**: Clearly define where entity types and model types should be used
2. **Component Documentation**: Document what format each component expects (entity or model)
3. **Centralize Conversions**: Use consistent utility functions for all conversions
4. **Consistent Naming**: Use consistent naming patterns throughout the codebase
5. **Smaller Components**: Break down large components into smaller, focused ones
6. **Regular Refactoring**: Periodically review and refactor code to maintain consistency

By following these patterns, we can significantly reduce the number of TypeScript errors in our codebase.
