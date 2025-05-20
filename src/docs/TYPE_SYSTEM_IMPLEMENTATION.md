
# Type System Implementation Guide

## Core Type Structure

Our application uses a two-tier type system to handle data:

1. **Database Entities** (snake_case): `UserData`, `AuditLogData`, etc.
2. **UI Models** (camelCase): `UserModel`, `AuditLogModel`, etc.

## Enums

All enums are defined in `src/types/enums.ts` and exported from there. 
**Important**: Never redefine enums in other files.

```typescript
// CORRECT - Import from enums.ts
import { UserRole } from '@/types/enums';
// or
import { UserRole } from '@/types'; // via barrel file

// INCORRECT - Redefining locally
enum UserRole { ... } // Don't do this
```

## Type Conversions

Always use conversion utilities when crossing boundaries:

```typescript
// Database to UI
import { toUserModel } from '@/utils/userTypeConverters';
const userModel = toUserModel(userData);

// UI to Database
import { toUserData } from '@/utils/userTypeConverters';
const userData = toUserData(userModel);
```

## Import Best Practices

1. **Import from barrel files** when possible:
   ```typescript
   import { UserModel, UserRole } from '@/types';
   ```

2. **Use direct imports** when barrel files cause conflicts:
   ```typescript
   import { UserModel } from '@/types/user';
   import { UserRole } from '@/types/enums';
   ```

3. **Never use `export *` for types** defined in multiple files

## Common Error Patterns

### 1. Ambiguous Exports 

Error: `Module contains ambiguous star export`

Solution: Remove duplicate type definitions and ensure each type is defined in exactly one place.

### 2. Missing Exports

Error: `Module does not provide an export named 'X'`

Solution: Check that the type is properly exported from its source file and from any barrel file.

### 3. Type Compatibility Issues

Error: `Type 'X' is not assignable to type 'Y'`

Solution: Use proper conversion functions between UI models and database entities.

## TypeScript Best Practices

1. **Use type guards** to safely narrow types:
   ```typescript
   if (isUserModel(user)) {
     console.log(user.firstName);
   } else if (isUserData(user)) {
     console.log(user.first_name);
   }
   ```

2. **Keep interfaces in sync** - When changing one type, update related types

3. **Document type conversion points** with comments:
   ```typescript
   // Convert from DB entity to UI model
   const userModel = toUserModel(userData);
   ```

4. **Use function return type annotations**:
   ```typescript
   function fetchUser(id: string): Promise<UserModel> {
     // ...
   }
   ```

By following these guidelines consistently, we can avoid most common type-related errors in the codebase.
