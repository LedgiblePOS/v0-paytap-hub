
# Build Error Resolution Guide

This document provides solutions to common build errors encountered in our project and explains how to prevent them in the future.

## Import/Export Mismatches

### Error Pattern 1: Default vs Named Export Mismatch

```
error TS2613: Module 'X' has no default export. 
Did you mean to use 'import { X } from "Y"' instead?
```

**Root Cause:**
This occurs when you try to import a named export as if it were a default export.

**Solution:**
- Check how the module exports its members:
  - For named exports: `import { ComponentName } from './path'`
  - For default exports: `import ComponentName from './path'`

**Prevention:**
- Be consistent with export patterns
- Use IDEs with TypeScript support to suggest correct imports
- Run `tsc --noEmit` before committing changes

### Error Pattern 2: Misnamed Exports

```
error TS2614: Module 'X' has no exported member 'Y'.
```

**Root Cause:**
Trying to import a symbol that doesn't exist or has a different name.

**Solution:**
- Verify the exact export name in the source file
- Check for typos in the import statement
- Consider using auto-import features in your IDE

## Type Safety Issues

### Error Pattern 1: Undefined Property Access

```
error TS2339: Property 'X' does not exist on type 'Y'.
```

**Root Cause:**
Attempting to access a property that doesn't exist according to the type definition.

**Solution:**
- Check the type definition to confirm available properties
- Use optional chaining (`?.`) for potentially undefined properties
- Add proper type assertions or type guards if needed

### Error Pattern 2: Spreading Non-Object Types

```
error TS2698: Spread types may only be created from object types.
```

**Root Cause:**
Using the spread operator (`...`) on a value that might be `null` or `undefined`.

**Solution:**
- Add a fallback when spreading possibly undefined values:
  ```typescript
  const updatedData = { 
    ...(originalData || {}),
    newProperty: value
  };
  ```
- Use nullish coalescing with spread:
  ```typescript
  const result = { ...(data?.property ?? {}) };
  ```

### Error Pattern 3: Enum Value Errors

```
error TS2551: Property 'X' does not exist on type 'typeof Enum'.
```

**Root Cause:**
Referring to an enum value that doesn't exist or has been renamed.

**Solution:**
- Check the enum definition for the correct values
- Use IDE autocompletion to see available enum values
- Consider using string literal unions instead of enums for better type safety

## Best Practices for Preventing Build Errors

### 1. Use Consistent Export Patterns

- Components: Use default exports
  ```typescript
  export default function Component() { /* ... */ }
  ```
- Utilities, hooks, and types: Use named exports
  ```typescript
  export function useHook() { /* ... */ }
  export type MyType = { /* ... */ };
  ```

### 2. Type Check Before Commits

Add this command to your workflow:
```bash
npm run type-check
# Or directly:
tsc --noEmit
```

### 3. Nullish Value Handling

Always assume values may be undefined:
```typescript
// Safe property access
const name = user?.profile?.name ?? "Unknown";

// Safe spreading
const updatedData = { ...(data || {}) };
```

### 4. Interface Documentation

Document complex interfaces, especially those representing API responses:
```typescript
/**
 * System settings as returned from the database
 * @property {string} key - The setting identifier
 * @property {Record<string, any>} value - The setting value object
 */
interface SystemSetting {
  key: string;
  value: Record<string, any>;
}
```

### 5. Type Guards for Runtime Checks

```typescript
function isSystemSetting(data: any): data is SystemSetting {
  return (
    typeof data === 'object' &&
    data !== null &&
    'key' in data &&
    'value' in data &&
    typeof data.key === 'string'
  );
}

// Usage
if (isSystemSetting(response.data)) {
  // Type-safe access
  console.log(response.data.value);
}
```

## Common Errors and Quick Fixes

| Error | Quick Fix |
|-------|-----------|
| Module has no default export | Change to `import { X } from './Y'` |
| Property does not exist on type | Use optional chaining: `obj?.prop` |
| Spread types may only be created from object types | Add fallback: `{ ...(obj || {}) }` |
| Type instantiation is excessively deep | Add explicit type annotations |
| No overload matches this call | Check function parameters and types |

By following these guidelines and using the provided solutions, we can reduce build errors and maintain a more stable codebase.
