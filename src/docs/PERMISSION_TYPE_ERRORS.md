
# Resolving Permission Type Errors

This document outlines common permission-related TypeScript errors in our application and how to solve them.

## Common Issues

### 1. Type Mismatch: `Permission` vs `UserRole`

**Error:**
```
error TS2322: Type 'Permission.VIEW_SYSTEM_SETTINGS' is not assignable to type 'UserRole'.
```

**Cause:**
This happens when we pass a `Permission` enum value to a function expecting a `UserRole` enum, or vice versa. The application has two distinct permission systems:

1. **Role-based** - Using the `UserRole` enum (SUPER_ADMIN, MERCHANT, etc.)
2. **Permission-based** - Using the `Permission` enum (VIEW_SYSTEM_SETTINGS, MODIFY_SYSTEM_SETTINGS, etc.)

**Solution:**
- Make sure the `hasPermission` function signature accepts both `Permission[]` and `UserRole[]`:
  ```typescript
  hasPermission: (permissions: Permission[] | UserRole[]) => boolean;
  ```
- Update the implementation to handle both types correctly
- Use the correct permission type when checking access

### 2. Deep Type Instantiation

**Error:**
```
error TS2589: Type instantiation is excessively deep and possibly infinite.
```

**Cause:**
This typically occurs when TypeScript tries to infer complex nested types, especially with database responses and complex object structures.

**Solution:**
- Avoid direct type assertion of complex objects
- Use explicit type declarations for intermediate variables
- Break down complex type conversions into simpler steps
- Access properties directly without trying to convert the whole object:

```typescript
// Instead of this (problematic):
const settingData = data as SystemSetting;
if (settingData.value) { ... }

// Do this (safer):
const key = data.key as string;
const value = data.value as Record<string, any>;
if (value) { ... }
```

### 3. Property Access on Unknown Types

**Error:**
```
error TS2339: Property 'x' does not exist on type 'y'.
```

**Cause:**
This happens when we try to access properties that TypeScript cannot confirm exist on an object, especially when dealing with database responses.

**Solution:**
- Use optional chaining (`?.`) for potentially undefined properties
- Add proper type assertions or narrowing before accessing properties
- Use explicit type declarations for intermediate variables
- Add runtime checks before accessing properties:

```typescript
// Safe property access
if (data && typeof data === 'object' && 'key' in data) {
  const key = data.key;
}
```

## Best Practices

1. **Be explicit about types** - Don't rely on TypeScript to infer complex types
2. **Use type guards** - Check object shapes before accessing properties
3. **Break down complex operations** - Handle type conversions in multiple steps
4. **Document function signatures** - Make it clear what types are expected
5. **Update interfaces when changing functions** - Ensure type definitions stay in sync with implementations
