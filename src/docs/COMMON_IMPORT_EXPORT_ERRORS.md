
# Common Import/Export Errors and How to Fix Them

This document outlines common import and export errors encountered in our project and provides best practices to prevent them.

## Error: Module has no exported member 'X'

### Example:
```
error TS2614: Module '"@/utils/printer"' has no exported member 'PrinterDevice'.
```

### Cause:
This error occurs when attempting to import something that is not correctly exported from the module, or when using named imports with a default export.

### Solution:

1. **Check the export type in the source file**:
   - Named exports use `export const/class/type/interface`
   - Default exports use `export default`

2. **Use the correct import syntax**:
   - For named exports: `import { PrinterDevice } from '@/utils/printer'`
   - For default exports: `import PrinterDevice from '@/utils/printer'`

3. **Ensure the type or variable is actually exported**:
   - Add the missing export statement if needed
   - Export types explicitly with `export type` or `export interface`

## Error: Cannot find name 'X'

### Example:
```
error TS2552: Cannot find name 'currentVerificationData'. Did you mean 'currentVerification'?
```

### Cause:
This error occurs when using a variable that doesn't exist in the current scope or has a typo.

### Solution:

1. **Check for typos**:
   - The error often suggests the correct name
   - Review variable names carefully in complex destructuring or nested objects

2. **Check variable scope**:
   - Make sure the variable is defined before use
   - Verify variable names in complex nested structures

3. **Use proper object property access**:
   - When accessing nested properties, use proper chaining: `obj?.prop?.nested`
   - Use optional chaining (`?.`) for properties that might be undefined

## Error: Property 'X' does not exist on type 'Y'

### Example:
```
error TS2339: Property 'handleApproveVerification' does not exist on type '{ loading: boolean; approveVerification: (id: string, merchantId: string) => Promise<boolean>; rejectVerification: (id: string, reason: string) => Promise<boolean>; }'.
```

### Cause:
This error occurs when trying to access a property that doesn't exist on an object according to its type definition.

### Solution:

1. **Check the returned object structure**:
   - Review what the hook or function actually returns
   - Update the property access to match the actual structure

2. **Update the function call**:
   - Rename the function call to match the exported function name
   - Make sure argument types match the function signature

3. **Update type definitions if needed**:
   - If the property should exist, update the type definition
   - If the property is dynamic, use indexed access types or generics

## Best Practices for Preventing Import/Export Errors

### 1. Consistent Export Patterns

Choose a consistent pattern for exports:
- Use named exports for utility functions, types, and constants
- Use default exports primarily for main components
- Don't mix default and named exports in the same file unless necessary

### 2. Type Checking Before Commits

Always run TypeScript type checking before committing changes:
```bash
npm run type-check
```

### 3. Use Import Linting Rules

Configure ESLint with rules that enforce consistent imports:
- `import/no-unresolved`
- `import/named`
- `import/default`
- `import/namespace`

### 4. Document Public APIs

For shared utilities, document the exported interface:
- Add JSDoc comments above exports
- Create a clear README for utility modules
- Include usage examples for complex utilities

### 5. Export Types Explicitly

Always export TypeScript types and interfaces explicitly:
```typescript
// Good
export type PrinterDevice = { /* ... */ };

// Bad - might not be available for import
type PrinterDevice = { /* ... */ };
```

### 6. Use Barrel Files for Complex Modules

For modules with many exports, use index.ts barrel files:
```typescript
// utilities/index.ts
export * from './printer';
export * from './formatter';
export * from './validator';
```

By following these practices, we can prevent common import/export errors and improve the maintainability of our codebase.
