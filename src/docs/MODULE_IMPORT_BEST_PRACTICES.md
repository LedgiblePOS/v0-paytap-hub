
# Module Import Best Practices

This document outlines best practices for importing modules and handling dependencies in our React application to prevent common errors like "React is not defined" and similar reference errors.

## Common Import Errors and How to Prevent Them

### 1. "React is not defined" Error

**Cause**: This error typically occurs when:
- A file uses React features (like hooks, JSX, or React components) but doesn't import React
- In files that export React hooks or components without importing React

**Prevention**:
- Always include `import React from 'react'` at the top of files that:
  - Use JSX syntax
  - Use React hooks (useState, useEffect, etc.)
  - Define React components
  - Export custom hooks that use React's hooks internally

**Example**:
```typescript
// CORRECT
import React, { useState, useEffect } from 'react';

export const useCustomHook = () => {
  const [value, setValue] = useState(null);
  // ...
};

// INCORRECT - Missing React import even though we're using React features
export const useCustomHook = () => {
  const [value, setValue] = useState(null); // This will fail
  // ...
};
```

### 2. Module Extension Mismatch

**Cause**: TypeScript files containing JSX need to use the `.tsx` extension, not `.ts`.

**Prevention**:
- Use `.tsx` extension for any file that includes JSX syntax
- Use `.ts` for regular TypeScript files without JSX
- When renaming or moving files, ensure the extension is appropriate for the content

**Example**:
```
// CORRECT file naming
MyComponent.tsx  // For files with JSX
utilities.ts     // For files without JSX

// INCORRECT file naming
MyComponent.ts   // Will cause errors if it contains JSX
```

### 3. Missing Dependencies in Hook Dependencies Arrays

**Cause**: When React hooks don't properly list their dependencies, it can lead to stale closures.

**Prevention**:
- Always include all referenced values in useEffect/useCallback/useMemo dependency arrays
- Use ESLint rules to help identify missing dependencies
- Consider extracting complex logic outside of component functions if they don't need to be recreated

**Example**:
```typescript
// CORRECT
const MyComponent = ({ productId }) => {
  useEffect(() => {
    fetchProduct(productId);
  }, [productId]); // Correctly includes productId dependency
};

// INCORRECT
const MyComponent = ({ productId }) => {
  useEffect(() => {
    fetchProduct(productId);
  }, []); // Missing dependency will cause stale closure
};
```

## Import Best Practices Checklist

1. **Always Import React**
   - Include React import in all files that use React features
   - For TypeScript files with JSX, use the `.tsx` extension

2. **Consistent Import Style**
   - Use named imports for specific React features: `import { useState, useEffect } from 'react'`
   - Use default import for React itself: `import React from 'react'`
   - Consider using an import sorter to maintain consistency

3. **Module Organization**
   - Group imports logically (React, third-party libraries, internal modules)
   - Import only what you need to reduce bundle size

4. **Path Aliasing**
   - Use path aliases (like `@/components/...`) consistently
   - Ensure tsconfig.json properly configures path aliases

5. **Lazy Loading**
   - For large components, consider using React.lazy() with dynamic imports
   - Implement code splitting for performance improvements

6. **Circular Dependencies**
   - Avoid circular dependencies by restructuring modules
   - Watch for warning signs like "Cannot access X before initialization"

## Testing for Import Issues

To verify your imports are working correctly:

1. **TypeScript Checking**
   - Run `tsc --noEmit` to check for TypeScript errors without building
   - Fix any reported import errors

2. **Linting**
   - Use ESLint with appropriate React rules
   - Configure rules to catch missing React imports

3. **Pre-Commit Hooks**
   - Add import validation to pre-commit hooks
   - Automate checks for circular dependencies

By following these best practices, we can prevent common import-related errors and improve the stability of our application.
