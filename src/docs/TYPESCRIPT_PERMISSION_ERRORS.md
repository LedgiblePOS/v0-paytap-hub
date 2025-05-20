
# TypeScript Permission and Type Instantiation Errors

This document outlines common TypeScript errors related to permissions and type instantiation with solutions to prevent them in future builds.

## Permission Type Mismatch Error

### Error
```
error TS2322: Type 'Permission.VIEW_SYSTEM_SETTINGS' is not assignable to type 'UserRole'.
```

### Cause
This error occurs when a Permission enum value is incorrectly passed to a function that expects a UserRole enum value. Most commonly, this happens with the `hasPermission` function, which may have different implementations across the application.

### Solution
1. Check the signature of the `hasPermission` function being used:
   - Some implementations expect `Permission` values
   - Others expect `UserRole` values
   - Some newer implementations expect an array of values

2. For the AuthContext implementation:
```typescript
// Correct usage
const canManagePaymentSettings = hasPermission([Permission.VIEW_SYSTEM_SETTINGS]);
```

3. For the permissions utility implementation:
```typescript
// Correct usage
const canManagePaymentSettings = hasPermission(user, Permission.VIEW_SYSTEM_SETTINGS);
```

### Prevention
- Always check the implementation of the authentication function you're using
- Use TypeScript hover information to verify parameter types
- Consider standardizing hasPermission implementations across the application

## Excessive Type Instantiation Error

### Error
```
error TS2589: Type instantiation is excessively deep and possibly infinite.
```

### Cause
This error typically occurs when TypeScript encounters recursive type definitions or when complex nested type conversions are performed without proper type assertions. Common causes include:
1. Circular type references
2. Nested generic types with complex constraints
3. Deep type instantiations with object literals

### Solution
1. Break the type recursion by using type assertions:
```typescript
// Instead of
const settingData = data as unknown as SystemSetting;

// Use a direct assertion if the structure is known
const settingData = data as SystemSetting;
```

2. Avoid deep nested generic types where possible

3. Use intermediate type assertions to guide the TypeScript compiler:
```typescript
// For complex nested objects
const rawData = data as Record<string, any>;
const processedData: ExpectedType = {
  ...rawData,
  specificField: rawData.specificField as SpecificType
};
```

### Prevention
- Keep type definitions simple and avoid circular references
- Use explicit type annotations for complex objects
- Break down complex type conversions into multiple steps
- Consider using type guards instead of type assertions when possible
