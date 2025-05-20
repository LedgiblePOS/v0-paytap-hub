
# File Naming Convention Guidelines

## Index Files

To prevent file casing conflicts in our project, we follow these strict conventions:

1. **Module Index Files**: Always use lowercase `index.tsx` for module entry point files
   ```
   src/pages/Dashboard/index.tsx  ✓ CORRECT
   src/pages/Dashboard/Index.tsx  ✗ INCORRECT
   ```

2. **Component Files**: Use PascalCase for all other component files
   ```
   src/components/Dashboard/DashboardStats.tsx  ✓ CORRECT
   src/components/Dashboard/dashboardStats.tsx  ✗ INCORRECT
   ```

3. **Utility Files**: Use camelCase for utility and helper files
   ```
   src/utils/formatDate.ts  ✓ CORRECT
   src/utils/FormatDate.ts  ✗ INCORRECT
   ```

4. **Directory Names**:
   - Feature directories: camelCase (e.g., `merchant/`, `inventory/`)
   - Page directories: PascalCase (e.g., `Dashboard/`, `Settings/`)

## Import Best Practices

1. **Use Path Aliases**: Always prefer absolute imports with path aliases over relative imports
   ```typescript
   // GOOD: Absolute import with path alias
   import DashboardStats from '@/components/Dashboard/DashboardStats';

   // AVOID: Relative import (more error-prone)
   import DashboardStats from '../../../components/Dashboard/DashboardStats';
   ```

2. **Import from Index Files**: When importing from directories with index files, import the directory itself:
   ```typescript
   // GOOD: Import from index file
   import { Button } from '@/components/ui';

   // ALSO GOOD: Explicit import
   import { Button } from '@/components/ui/button';
   ```

## Prevention Measures

Before committing code:

1. Run type checking to catch casing issues:
   ```bash
   npm run type-check
   ```

2. Use editor features to verify file paths:
   - Let your IDE handle imports (auto-import)
   - Use "Go to Definition" to verify paths

3. If a file rename is needed, use proper git commands:
   ```bash
   git mv OldFileName.tsx newFileName.tsx
   ```

Following these conventions consistently will prevent the common TS1149 errors related to file casing.
