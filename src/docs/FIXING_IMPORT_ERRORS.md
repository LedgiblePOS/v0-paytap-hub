
# Fixing Component Import Errors

This document outlines common import-related errors and their solutions in our TypeScript React application.

## Common Error Types and Solutions

### 1. "Module has no default export"

```
error TS2613: Module '/src/hooks/useAuth' has no default export.
```

**Problem:** Trying to import a named export as a default export.

**Solution:**
```typescript
// Wrong
import useAuth from '@/hooks/useAuth';

// Correct
import { useAuth } from '@/hooks/useAuth';
```

**Best Practice:** Check how the module exports its functionality:
- Named exports use curly braces: `import { Something } from './something'`
- Default exports don't use curly braces: `import Something from './something'`

### 2. "Module has no exported member"

```
error TS2614: Module '@/contexts/AuthContext' has no exported member 'useAuth'.
```

**Problem:** Trying to import something that isn't exported by the module.

**Solution:**
1. Check the actual exports in the source file
2. Import from the correct location
3. Add the export to the source file if needed

```typescript
// In source file
export const useAuth = () => { /* ... */ };

// In importing file
import { useAuth } from '@/hooks/useAuth'; // Correct path
```

### 3. Cannot find module errors

```
error TS2307: Cannot find module '../UserDetailsSection' or its corresponding type declarations.
```

**Problem:** The module doesn't exist at that path or has a different name/case.

**Solution:**
1. Check if the file exists
2. Check the file path and name (case sensitive!)
3. Create the module if it doesn't exist

### 4. Case Sensitivity Issues

```
error TS1149: File name '/src/components/ui/pagination.tsx' differs from already included file name '/src/components/ui/Pagination.tsx' only in casing.
```

**Problem:** Different imports reference the same file with different casing, causing conflicts.

**Solution:**
1. Standardize on a single casing for each file
2. Use consistent naming patterns:
   - Components: PascalCase (e.g., `Button.tsx`)
   - Utilities: camelCase (e.g., `userUtils.ts`)

## Best Practices for Import Management

### 1. Consistent Export Patterns

Choose a consistent pattern for exporting components and utilities:

```typescript
// Option 1: Named exports for multiple exports from a file
export const ComponentA = () => { /* ... */ };
export const ComponentB = () => { /* ... */ };

// Option 2: Default export for main component, named exports for utilities
const MainComponent = () => { /* ... */ };
export const useHelperHook = () => { /* ... */ };
export default MainComponent;
```

### 2. Consistent Import Paths

Use consistent import paths with path aliases:

```typescript
// Prefer
import { Button } from '@/components/ui/button';

// Over
import { Button } from '../../../components/ui/button';
```

### 3. Barrel Exports for Related Components

Use index.ts files to consolidate exports:

```typescript
// src/components/ui/index.ts
export * from './button';
export * from './pagination';
export * from './card';

// Importing
import { Button, Pagination, Card } from '@/components/ui';
```

### 4. Export Type Consistency

When offering both named and default exports, be explicit:

```typescript
// Providing both for backward compatibility
export const useAuth = () => { /* ... */ };
export default useAuth; // Same function as default export
```

### 5. Include Type Exports

Export types alongside components:

```typescript
export interface ButtonProps { /* ... */ }
export const Button: React.FC<ButtonProps> = (props) => { /* ... */ };
```

By following these guidelines, we can minimize import-related errors throughout the codebase.
