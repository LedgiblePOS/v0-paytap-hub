
# Resolving Case Sensitivity Issues in TypeScript Projects

## Overview

Case sensitivity issues are common in TypeScript projects, especially when working across different operating systems. Windows is case-insensitive, while Linux and macOS are case-sensitive. This can lead to errors where files exist with both uppercase and lowercase variants (e.g., `dialogs` vs `Dialogs`).

## Common Case Sensitivity Errors

```
error TS1149: File name '/path/Component.tsx' differs from already included file name '/path/component.tsx' only in casing.
```

This error occurs when TypeScript tries to import the same file with different casing, which is ambiguous on case-insensitive file systems but problematic on case-sensitive ones.

## Best Practices for Preventing Case Sensitivity Issues

### 1. Establish and Follow Directory and File Naming Conventions

For our project, follow these conventions:
- **React Components**: PascalCase (`Button.tsx`, `UserProfile.tsx`)
- **Feature Directories**: PascalCase (`UserManagement/`, `ProductCatalog/`)
- **Utility Files**: camelCase (`formatDate.ts`, `apiClient.ts`)
- **Configuration Files**: kebab-case (`tsconfig.json`, `eslint-config.js`)

### 2. Use Git Configuration to Enforce Case Sensitivity

Add this to your git configuration to detect case sensitivity issues:

```bash
git config --global core.ignorecase false
```

This makes Git track case changes in file names, even on Windows.

### 3. Add ESLint Rules for Import Paths

Add these ESLint rules to catch import path mismatches early:

```javascript
{
  "rules": {
    "import/no-unresolved": "error",
    "import/extensions": ["error", "ignorePackages"]
  }
}
```

### 4. Use Path Mapping in tsconfig.json

Using path aliases provides consistent imports and makes it easier to refactor:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 5. Implement Project-Specific Linting Hooks

Add a pre-commit hook that checks for case-sensitivity issues:

```bash
#!/bin/sh
# pre-commit hook to check for case-sensitivity issues
git ls-files --exclude="*.ts" --exclude="*.tsx" | sort -f | uniq -i -d | sed 's/^/Duplicate file (case-insensitive): /'
```

## How to Fix Existing Case Sensitivity Issues

1. **Identify the Problem Files**: 
   - Look for duplicate files with different casing
   - Check imports that reference the same file with different casing

2. **Choose a Convention**:
   - Decide on the correct casing convention (see above)
   - Be consistent across the entire codebase

3. **Fix the Issue**:
   - If on Windows/macOS, rename files using Git:
     ```bash
     git mv dialogs Dialogs
     ```
   - Update all imports to use the correct casing
   - Fix all exports to match the imports

4. **Verify the Fix**:
   - Run TypeScript compiler (`tsc --noEmit`)
   - Ensure all imports use the correct casing

## Special Considerations for Monorepos

- Use path mapping consistently across all packages
- Consider using tools like ESLint with Monorepo plugins
- Implement shared linting rules for consistent naming

By following these practices, we can minimize case sensitivity issues in our TypeScript projects and prevent similar errors in the future.
