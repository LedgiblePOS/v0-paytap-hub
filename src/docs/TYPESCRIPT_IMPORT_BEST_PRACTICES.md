
# TypeScript Import Best Practices

## Understanding Default vs Named Exports

### Default Exports

```typescript
// Exporting
export default function Button() { /* ... */ }

// Importing
import Button from './Button';
```

Use default exports for:
- Main React components
- Primary class or function in a file
- When there's a clear "main" export

### Named Exports

```typescript
// Exporting
export function useAuth() { /* ... */ }
export type User = { /* ... */ };

// Importing
import { useAuth, User } from './auth';
```

Use named exports for:
- Utilities, hooks, and smaller functions
- Types and interfaces
- Multiple exports from a single file
- Constants

## Common Import Errors

### Error: Module has no default export

```
error TS2613: Module 'X' has no default export.
```

This error occurs when you try to import something as a default export but it's actually a named export.

**Solution:**
```typescript
// Wrong
import SuperAdminNavItems from './SuperAdminNavItems';

// Correct
import { SuperAdminNavItems } from './SuperAdminNavItems';
```

### Error: Module has no exported member

```
error TS2614: Module 'X' has no exported member 'Y'.
```

This occurs when you try to use a named import for something that doesn't exist or is a default export.

**Solution:**
```typescript
// Wrong
import { PageContainer } from '@/components/common/PageContainer';

// Correct
import PageContainer from '@/components/common/PageContainer';
```

## Best Practices

1. **Be Consistent**
   - Use default exports for components
   - Use named exports for utilities, hooks, and types
   - Don't mix export styles in the same file without good reason

2. **Use IDE Features**
   - Configure auto-import
   - Use code completion
   - Let your IDE suggest the correct import style

3. **Import Organization**
   - Group imports by source (external vs internal)
   - Keep related imports together
   - Consider using import sorting tools

4. **Path Aliases**
   - Use path aliases (like `@/components`) for better organization
   - Configure path aliases in tsconfig.json
   - Be consistent with alias usage

## Example Import Structure

```typescript
// External dependencies first
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Then UI components
import Button from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Then hooks and utilities
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/utils/formatters';

// Then types and constants
import { User, Role } from '@/types';
import { API_ENDPOINTS } from '@/constants';
```

By following these conventions, you can avoid common import errors and maintain a consistent, readable codebase.
