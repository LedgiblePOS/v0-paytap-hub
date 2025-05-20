
# TypeScript File & Directory Casing Best Practices

## Problem

We recently encountered errors due to casing inconsistencies in our file system:

```
error TS1261: Already included file name differs from file name only in casing.
```

This occurs because TypeScript treats files with the same name but different casing as distinct on case-sensitive file systems (like Linux/macOS), but as the same file on case-insensitive file systems (like Windows). This leads to inconsistent behavior across development environments.

## Best Practices for Consistent File & Directory Naming

### 1. Directory Naming Convention

- **Component Directories**: Use PascalCase for directories containing React components
  ```
  ✅ src/components/UserManagement/
  ❌ src/components/usermanagement/ or src/components/user-management/
  ```

- **Utility/Helper Directories**: Use camelCase for utility/helper directories
  ```
  ✅ src/utils/formatters/
  ❌ src/utils/Formatters/
  ```

### 2. File Naming Convention

- **React Components**: Use PascalCase for React component files
  ```
  ✅ UserProfile.tsx
  ❌ userProfile.tsx or user-profile.tsx
  ```

- **Utility/Helper Files**: Use camelCase for utility files
  ```
  ✅ dateFormatter.ts
  ❌ DateFormatter.ts or date-formatter.ts
  ```

- **Configuration Files**: Use kebab-case for configuration files
  ```
  ✅ jest-setup.ts
  ❌ jestSetup.ts or JestSetup.ts
  ```

### 3. Import Paths

Always use the exact casing that matches the actual file path:

```typescript
// ✅ Correct import - matches actual file path
import UserProfile from './UserProfile';

// ❌ Incorrect import - casing doesn't match
import UserProfile from './userProfile';
```

### 4. Directory Structure Consistency

Maintain consistent depth and structure within the application:

```
✅ src/components/UserManagement/Dialogs/NewUserDialog.tsx
❌ src/components/UserManagement/dialogs/NewUserDialog.tsx
                                 ↑
                              Inconsistent casing
```

### 5. Git Configuration

For teams working across different operating systems, configure Git to maintain case sensitivity:

```bash
git config --global core.ignorecase false
```

### 6. Type Definitions

Follow the same casing rules for type definition files:

```
✅ UserProfile.d.ts
❌ userProfile.d.ts
```

### 7. Build Pipeline Configuration

Include a linting step in your CI/CD pipeline to catch casing inconsistencies before they cause problems.

### 8. Fixing Casing Errors

When encountering casing errors:

1. Identify the inconsistent files/directories
2. Rename with temporary name: `git mv UserManagement temp`
3. Rename to proper casing: `git mv temp UserManagement`
4. Update imports throughout the codebase
5. Commit changes

## Benefits

- Consistent development experience across all operating systems
- Fewer build errors related to file resolution
- Clearer code organization and improved readability
- Easier project navigation

By following these conventions consistently throughout our project, we can avoid casing-related errors that are difficult to debug and can cause significant development overhead.
