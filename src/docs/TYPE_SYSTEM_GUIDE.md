
# Type System Guidelines

## Entity-Model Pattern

This application uses a consistent Entity-Model pattern for data handling:

### 1. Database Entities (snake_case)
- Use snake_case properties: `first_name`, `created_at`
- Match database schema structure
- Typically used in API services and database queries
- Named with suffix like `UserData`, `AuditLogData`

```typescript
interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: string;
}
```

### 2. UI Models (camelCase)
- Use camelCase properties: `firstName`, `createdAt`
- Used in components and UI logic
- Named with suffix like `UserModel`, `AuditLogModel` (or no suffix)

```typescript
interface UserModel {
  id: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
}
```

## Type Conversion Functions

Always use conversion functions when crossing boundaries:

```typescript
// Database to UI
const userModel = toUserModel(userData);

// UI to Database
const userData = toUserData(userModel);

// For arrays
const models = toUserModels(dataArray);
```

## Common Errors and Solutions

### 1. Ambiguous Exports

**Error:**
```
SyntaxError: Module contains ambiguous star export: 'UserRole'
```

**Solution:**
- Define each type, class, or enum in exactly one place
- Export explicitly rather than using `export *` for everything
- For common types used across files, define in a dedicated file

### 2. Property Access Errors

**Error:**
```
Property 'firstName' does not exist on type 'UserData'. Did you mean 'first_name'?
```

**Solution:**
- Always convert types before accessing properties
- Use the correct model for your context (entity vs model)

### 3. Type Compatibility Issues

**Error:**
```
Type 'UserModel[]' is not assignable to type 'UserData[]'
```

**Solution:**
- Convert arrays with batch conversion functions
- Verify function parameter and return types

## Best Practices

1. **Single Source of Truth**: Define each type in exactly one file
2. **Consistent Naming**: Use `Data` suffix for database entities and `Model` for UI models
3. **Explicit Exports**: Use named exports and avoid star exports when possible
4. **Conversion at Boundaries**: Convert data when crossing system boundaries
5. **Type Guards**: Use type guards to check data format when needed

```typescript
// Type guard example
function isUserModel(user: any): user is UserModel {
  return user && 'firstName' in user && 'lastName' in user;
}
```

6. **Documentation**: Document the expected data type in function signatures

## Implementation in Code

The `src/types/` directory contains our core type definitions:
- `enums.ts` - Shared enums like UserRole
- `user.ts` - User-related interfaces and conversion functions
- `auditLog.ts` - Audit log interfaces and conversion functions

Utility functions in `src/utils/modelConversions/` help with type conversion.

By following these patterns consistently, we can prevent most type-related errors.
