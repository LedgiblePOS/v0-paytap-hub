# Export and Import Best Practices

This document outlines best practices for handling exports and imports in our application to prevent common errors such as "doesn't provide an export named X".

## Common Export/Import Issues

### 1. Missing or Incorrect Exports

**Problem:** Attempting to import something that isn't exported, or is exported differently.

**Example Error:**
```
SyntaxError: The requested module '../utils/appErrorHandler.ts' doesn't provide an export named 'AppError'
```

**Solution:**
- Always ensure the named export exists in the source file
- Check if you're importing a type-only export vs a value export
- Verify that interfaces and classes with the same name are properly distinguished

### 2. Type vs Value Exports

**Problem:** TypeScript allows you to export both types and values with the same name, which can lead to confusion.

**Best Practice:**
```typescript
// INCORRECT - Exporting only interface but trying to use as value
export interface AppError { /* ... */ }

// CORRECT - Export both interface and class implementation
export interface AppError { /* ... */ }
export class AppError implements AppError { /* ... */ }
```

### 3. Export Consistency

**Pattern to Follow:**

For shared utilities that have both type and implementation:

```typescript
// 1. Define and export the interface
export interface AppError {
  message: string;
  type: ErrorType;
  // other properties
}

// 2. Implement and export the class with the same name
export class AppError extends Error implements AppError {
  // implementation
}

// 3. Export factory functions if needed
export const createAppError = (): AppError => {
  // implementation
}
```

## Best Practices for Preventing Export/Import Issues

### 1. Use Barrel Files for Feature Modules

Consolidate and re-export from an `index.ts` file:

```typescript
// src/utils/errors/index.ts
export * from './appError';
export * from './errorHandlers';
```

### 2. Explicit Export Statements

Use named exports with explicit statements rather than default exports:

```typescript
// RECOMMENDED
export class AppError { /* ... */ }
export function handleError() { /* ... */ }

// AVOID when possible
export default class AppError { /* ... */ }
```

### 3. Consistent Import Styles

Use consistent import styles:

```typescript
// For named exports
import { AppError, handleError } from '@/utils/appErrorHandler';

// For default exports
import AppError from '@/utils/AppError';
```

### 4. Type-Only Imports When Applicable

When only importing types, use the `import type` syntax:

```typescript
import type { AppError } from '@/utils/appErrorHandler';
```

### 5. Avoid Circular Dependencies

Ensure your module structure doesn't create circular dependencies, which can cause exports to be undefined.

### 6. Testing Exports

Include simple tests that verify exports are available:

```typescript
import * as ErrorModule from '@/utils/appErrorHandler';

test('ErrorModule exports required elements', () => {
  expect(typeof ErrorModule.AppError).toBe('function');
  expect(typeof ErrorModule.handleError).toBe('function');
  expect(ErrorModule.ErrorType).toBeDefined();
});
```

By following these practices, we can significantly reduce runtime errors related to missing exports in our application.
