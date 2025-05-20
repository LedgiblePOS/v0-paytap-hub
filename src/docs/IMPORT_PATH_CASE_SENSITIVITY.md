
# Import Path Case Sensitivity Issues

## Problem

Case sensitivity in import paths is a recurring issue causing build errors. While some operating systems (like Windows) are case-insensitive for file paths, the TypeScript compiler and build tools enforce case sensitivity.

Error example:
```
error TS1261: Already included file name differs from file name only in casing.
```

This happens when:
- A file is imported with a different casing than its actual path on the filesystem
- Multiple imports reference the same file with different casing
- The file exists in the filesystem with both casings (a critical issue to resolve)

## Root Cause Analysis

The primary cause of these errors is inconsistency in our directory naming convention, particularly with the `merchant` vs `Merchant` directory. The filesystem may contain both versions, but TypeScript expects consistency.

## Solution Strategy

### 1. Directory Structure Audit

Before making any changes:
- Run a directory structure audit to identify the actual casing used in the filesystem
- Document the "source of truth" for each directory's casing
- Create a "directory casing map" as a reference for the team

### 2. Consistent Naming Convention

All directories and files should follow this convention:
- **Page components**: PascalCase (e.g., `Dashboard/Index.tsx`)
- **Feature components**: PascalCase (e.g., `Inventory/InventoryList.tsx`)
- **UI components**: PascalCase (e.g., `Button/Button.tsx`)
- **Feature directories**: camelCase (e.g., `merchant/`, `inventory/`)
- **Route directories**: camelCase (e.g., `routes/`, `merchant/`)
- **Utility files**: camelCase (e.g., `utils/formatDate.ts`)

### 3. Fix Import Path Issues

When encountering casing issues:

1. **Check the actual file path in the filesystem** using the command line or file explorer
2. **Update all imports** to match the exact casing of the filesystem
3. **Search the entire codebase** for other occurrences of the same import
4. **Document the correct path** in the project wiki or documentation

### 4. Automated Verification

Implement a pre-commit hook that:
- Scans for import path casing inconsistencies
- Checks against the known directory structure
- Prevents commits with inconsistent casing

### Example: Resolving the MerchantModulePlaceholder Issue

This is how we resolved the specific issue:

1. We determined that `src/components/merchant/` (lowercase) was the correct directory structure in the filesystem
2. Updated import in PlaceholderRoutes.tsx to use this exact casing:
   ```typescript
   import MerchantModulePlaceholder from '@/components/merchant/MerchantModulePlaceholder';
   ```
3. Removed the duplicate file with capitalized directory name
4. Documented this as the canonical path for future reference

## Prevention Checklist

Before submitting code:
- [ ] Verify all import paths match exact filesystem casing
- [ ] Use auto-imports from IDE when available to ensure correct paths
- [ ] Run `npm run type-check` to catch casing issues early
- [ ] For new components, follow the naming convention strictly

By strictly adhering to these guidelines, we can prevent recurring case sensitivity errors that disrupt our builds.

## Detection and Resolution Tools

For detecting case conflicts:
```bash
# Find all files named MerchantModulePlaceholder.tsx, checking case
find src -name "MerchantModulePlaceholder.tsx" -o -name "merchantmoduleplaceholder.tsx" -o -name "Merchantmoduleplaceholder.tsx"

# Find duplicate filenames with different cases
find src -type f | sort -f | uniq -i -d
```

# Recommended Actions For Your Team

1. **Automate casing validation** as part of your CI/CD pipeline
2. **Create a centralized registry** of correct import paths
3. **Add case sensitivity linting** to your IDE configuration
4. **Include validation step** in code review process
5. **Delete all duplicate files** with casing differences

For resolving these issues, always prioritize consistency with the existing codebase convention.
