
# Component Import Best Practices

This document outlines our best practices for importing and using components to prevent the recurring errors we've encountered.

## Import Path Case Sensitivity

**The most common build error in our project** is related to case sensitivity in import paths. Follow these rules to prevent case sensitivity issues:

### 1. Always Use Auto-Import

Configure your IDE to use auto-import features, which will match the correct casing in the filesystem.

### 2. Consistent Directory Structure

Our project follows these directory casing conventions:
- Feature directories: camelCase (`merchant/`, `inventory/`)
- Component files: PascalCase (`Button.tsx`, `UserProfile.tsx`)

### 3. Verify Before Committing

Always run a type check before committing:
```bash
npm run type-check
```

### 4. Use Absolute Imports

Always prefer absolute imports with path aliases over relative imports:

```typescript
// GOOD: Absolute import with path alias
import MerchantModule from '@/components/merchant/MerchantModule';

// AVOID: Relative import (more error-prone)
import MerchantModule from '../../../components/merchant/MerchantModule';
```

## Common Import Errors and Solutions

### Error: Component is not defined

**Problem:**
```
MerchantModulePlaceholder is not defined
```

**Possible causes:**
1. Component wasn't imported at all
2. Import path has incorrect casing
3. Component is not exported from its source file
4. Component name is misspelled

**Solutions:**
1. Check the filesystem for the exact path and casing:
   ```bash
   find src -name "MerchantModulePlaceholder.tsx"
   ```
2. Update the import with the exact path:
   ```typescript
   import MerchantModulePlaceholder from '@/components/merchant/MerchantModulePlaceholder';
   ```

### Error: Cannot find module

**Problem:**
```
Cannot find module '@/components/Merchant/SomeComponent' or its corresponding type declarations
```

**Solutions:**
1. Verify the actual path in the filesystem
2. Update import paths throughout the codebase
3. Consider adding a path alias in tsconfig.json for commonly used directories

## Import Checklist Before Submitting Code

- [ ] All import paths match the exact case of the filesystem
- [ ] No duplicate files with different casing exist
- [ ] Used absolute imports with path aliases for deep imports
- [ ] Ran type checking to verify all imports resolve correctly
- [ ] Checked for and fixed any "Cannot find module" warnings

By following these import practices consistently, we can eliminate the recurring case sensitivity errors that have been disrupting our builds.
