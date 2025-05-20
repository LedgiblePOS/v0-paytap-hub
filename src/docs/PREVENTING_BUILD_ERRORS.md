
# Preventing Common Build Errors

This document outlines strategies for preventing common build errors encountered in our project.

## Common Error: Cannot find module or its corresponding type declarations

Example: `error TS2307: Cannot find module '@/types/cart'`

### Prevention:

1. **Check file existence before importing**: 
   - Ensure the file exists at the specified path
   - Verify the casing (e.g., `ThemeContext.tsx` vs `themeContext.tsx`) - imports are case-sensitive

2. **Module vs. Export Mismatch**:
   - Ensure exports are properly defined in the source file
   - Check that you're importing what is actually exported (named vs. default exports)

3. **Path Aliases**:
   - Verify that path aliases like `@/` are properly configured in tsconfig.json
   - Double-check that the import path uses the correct alias format

### Example Fix:

```typescript
// WRONG - importing from non-existent file
import { ThemeProvider } from '@/contexts/ThemeContext';

// RIGHT - create the file first, then import
// src/contexts/ThemeContext.tsx must exist with proper exports
import { ThemeProvider } from '@/contexts/ThemeContext';
```

## Common Error: Module has no exported member

Example: `error TS2305: Module './authApi' has no exported member 'fetchUserProfile'`

### Prevention:

1. **Check export definitions**:
   - Verify that the referenced member is actually exported from the module
   - Look for typos in export/import names

2. **Named vs. Default Exports**:
   - Distinguish between named exports (`export const something`) and default exports (`export default something`)
   - Use curly braces for named exports: `import { something } from './module'`
   - Don't use curly braces for default exports: `import something from './module'`

3. **Circular Dependencies**:
   - Be cautious of circular imports which can cause exported members to be undefined
   - Refactor code to eliminate circular dependencies

### Example Fix:

```typescript
// In authApi.ts - CORRECT
export const getUserData = async () => { /* ... */ };

// In another file - CORRECT
import { getUserData } from './authApi';

// INCORRECT
import { fetchUserProfile } from './authApi'; // This export doesn't exist
```

## Recommended Build Error Prevention Workflow

1. **Run TypeScript checks frequently**:
   ```bash
   npm run type-check
   ```

2. **Use Editor Integration**:
   - Configure VSCode or other editors to show TypeScript errors in real-time
   - Don't ignore squiggly red lines - they help prevent build errors

3. **Review imports after refactoring**:
   - After renaming or moving files, update all imports
   - Use search functionality to find all references to the moved/renamed file

4. **Document API changes**:
   - When changing function signatures or exports, document them
   - Update all call sites when changing exported functions

5. **Use consistent naming conventions**:
   - Maintain consistent naming for files and exports
   - Follow PascalCase for React components and camelCase for utilities

By following these practices, we can significantly reduce build errors in our project.
