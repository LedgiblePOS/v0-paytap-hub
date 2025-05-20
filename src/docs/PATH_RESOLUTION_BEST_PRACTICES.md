
# Path Resolution Best Practices

This document outlines best practices for resolving path issues and preventing import errors that can cause white page problems or build failures.

## Common Path Resolution Issues

### 1. Incorrect Import Paths

One of the most common causes of build failures is incorrect import paths. This typically happens when:

- A component is moved to a different directory but imports aren't updated
- There's confusion between similarly named components in different directories
- Imports use relative paths (./Component) when absolute paths (@/components/Component) would be more reliable

**Common error messages:**
```
Cannot find module './ComponentName' or its corresponding type declarations
```

### 2. Path Resolution Strategies

#### Use Absolute Imports with Path Aliases

Instead of using relative imports:

```typescript
// ❌ Fragile relative import
import InventoryList from '../../../components/Inventory/InventoryList';
```

Use path aliases:

```typescript
// ✅ Robust absolute import with path alias
import InventoryList from '@/components/Inventory/InventoryList';
```

#### Component Location Conventions

To avoid confusion, follow these conventions:

1. **Page Components**: Place in `/src/pages/[ModuleName]/components/`
   - These are components specific to a particular page

2. **Shared Components**: Place in `/src/components/[ModuleName]/`
   - These are components that can be reused across multiple pages

3. **UI Components**: Place in `/src/components/ui/`
   - These are pure UI components with no business logic

### 3. Module Structure Pattern

For each module:

```
src/
├── components/
│   └── ModuleName/
│       ├── SharedComponent1.tsx
│       └── SharedComponent2.tsx
├── pages/
│   └── ModuleName/
│       ├── Index.tsx
│       └── components/
│           ├── PageSpecificComponent1.tsx
│           └── PageSpecificComponent2.tsx
└── hooks/
    └── useModuleName.ts
```

### 4. Path Verification Steps

Before committing code:

1. Review all imports in modified files
2. Ensure imported files exist at the specified paths
3. Prefer absolute imports with path aliases (@/components/...)
4. Use consistent import patterns across the codebase
5. Run a build test to catch any missed import errors

### 5. Common Path Resolution Errors and Solutions

| Error | Possible Cause | Solution |
|-------|----------------|----------|
| Cannot find module './Component' | Component doesn't exist at that path | Check file location and use absolute paths |
| Cannot find module '@/components/Component' | Path alias not working or component missing | Verify tsconfig.json has correct path aliases |
| Property 'X' does not exist on type 'Y' | Imported wrong component with similar name | Verify you're importing the correct component |

## Debugging Path Resolution Issues

1. Check the file structure to confirm the component exists
2. Verify the component's export statement (default vs. named export)
3. Try using the absolute path with the @/ alias
4. Look for typos in component names or paths
5. Check if the component was recently moved or renamed

By following these path resolution best practices, we can prevent build errors and white page issues caused by incorrect imports.
