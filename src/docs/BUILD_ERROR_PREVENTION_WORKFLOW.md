
# Build Error Prevention Workflow

This document outlines best practices for preventing common build errors in our POS system.

## Common TypeScript Errors and Solutions

### 1. "Spread types may only be created from object types"

**Issue:** This occurs when using the spread operator (`...`) on a value that might be `null` or `undefined`.

**Solution:** Always provide a fallback object when spreading potentially undefined values:

```typescript
// Problematic code
const updatedData = { ...obj?.nestedProperty };

// Fixed code
const updatedData = { ...(obj?.nestedProperty || {}) };
```

### 2. React Import Errors

**Issue:** Components using React hooks or JSX fail with "React is not defined" errors.

**Solution:** Always include React imports in files with JSX or hooks:

```typescript
import React from 'react';
// For TypeScript files using hooks
import React, { useState, useEffect } from 'react';
```

### 3. Type Instantiation Excessively Deep Error

**Issue:** TypeScript compiler error TS2589 occurs when the compiler attempts to recursively instantiate a type.

**Solution:** Break the type instantiation by using type assertions with `unknown`:

```typescript
// Problematic code - might cause deep instantiation
const settingData = data as SystemSetting;

// Fixed code - breaks the deep instantiation
const settingData = data as unknown as SystemSetting;
```

### 4. Permission Type Mismatch

**Issue:** Passing a single Permission enum value to a function expecting an array of UserRoles.

**Solution:** Always ensure you're passing the correct type format:

```typescript
// Problematic code - passing a single Permission enum
const canAccess = hasPermission(Permission.VIEW_DASHBOARD);

// Fixed code - passing an array as expected
const canAccess = hasPermission([Permission.VIEW_DASHBOARD]);
```

### 5. Module Organization Best Practices

- Split large files (>200 lines) into smaller, focused components
- Use index files to re-export from module directories
- Use explicit imports rather than importing entire modules
- Organize related functionality into feature folders
- Extract complex logic to custom hooks

## Code Review Checklist

Before submitting code for review, check for:

- [ ] Type safety for all function parameters and returns
- [ ] Proper null/undefined handling with fallbacks
- [ ] React imports in all files using JSX or hooks
- [ ] Components split into logical, focused pieces
- [ ] No circular dependencies
- [ ] Consistent error handling patterns
- [ ] Files kept under 200 lines of code

## Module Structure

Our recommended module structure for features:

```
src/components/FeatureName/
  ├── index.ts              # Re-exports components
  ├── FeatureName.tsx       # Main component
  ├── hooks/                # Feature-specific hooks
  │   └── useFeature.ts     # Custom hook for feature logic
  ├── components/           # Sub-components
  │   ├── ComponentA.tsx    # Component A
  │   └── ComponentB.tsx    # Component B
  ├── types.ts              # TypeScript interfaces
  └── utils.ts              # Helper functions
```

## Testing Strategy

- Unit test all utility functions
- Component tests for UI behavior
- Integration tests for complete features
- Add console.logs for debugging but remove before production

