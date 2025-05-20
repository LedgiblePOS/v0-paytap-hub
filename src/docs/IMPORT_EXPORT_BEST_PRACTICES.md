
# Best Practices for Imports and Exports in TypeScript

This document outlines best practices for handling imports and exports in our TypeScript codebase, based on lessons learned from resolving recent errors.

## 1. Consistent Export Patterns

### Problem

One of our most common errors was:
```
Module 'X' has no exported member 'Y'
```

This typically happens when a module doesn't export what another module is trying to import, or when using the wrong import syntax.

### Solution: Choose Clear Export Patterns

#### For Hooks:

```typescript
// GOOD: Export both named and default for flexibility
export const useAuth = () => { /* implementation */ };
export default useAuth;

// When importing:
import { useAuth } from '@/hooks/useAuth'; // Named import
// OR
import useAuth from '@/hooks/useAuth'; // Default import
```

#### For Components:

```typescript
// GOOD: Default export for main components
const Button = () => { /* implementation */ };
export default Button;

// When importing:
import Button from '@/components/ui/Button';
```

#### For Utility Functions:

```typescript
// GOOD: Named exports for utilities
export const formatDate = () => { /* implementation */ };
export const parseDate = () => { /* implementation */ };

// When importing:
import { formatDate, parseDate } from '@/utils/dateUtils';
```

## 2. Import Path Best Practices

### Problem

Another common issue was:
```
Cannot find module 'X' or its corresponding type declarations
```

This happens with incorrect import paths or case sensitivity issues.

### Solution: Use Absolute Imports with Path Aliases

```typescript
// AVOID: Deep relative imports (error-prone)
import UserProfile from '../../../components/users/UserProfile';

// GOOD: Absolute imports with path aliases
import UserProfile from '@/components/users/UserProfile';
```

### Always Check Case Sensitivity

File paths in imports must match the actual file name case:

```typescript
// WRONG (if file is named Button.tsx)
import Button from '@/components/ui/button';

// CORRECT
import Button from '@/components/ui/Button';
```

## 3. Handling Authentication Hook Pattern

### Problem

We experienced circular dependencies and "useAuth must be used within an AuthProvider" errors.

### Solution: Consistent Auth Hook Pattern

1. Define the auth context and provider in one file
2. Export the useAuth hook from multiple places for backward compatibility
3. Be clear about where the "canonical" implementation lives

```typescript
// src/contexts/AuthContext.tsx
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Export directly from context file
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// src/hooks/useAuth.tsx
// Re-export for better organization
import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth-context';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default useAuth; // Also include default export
```

## 4. Data Model Conversion

### Problem

We had errors with incompatible types:
```
Type 'User' is not assignable to type 'UserData'.
```

### Solution: Clear Type Conversion Functions

1. Define clear interfaces for both frontend and database models
2. Create conversion functions between models
3. Use these conversion functions consistently

```typescript
// Database model (snake_case)
interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  // ...
}

// Frontend model (camelCase)
interface User {
  id: string;
  firstName: string;
  lastName: string;
  // ...
}

// Conversion function
export const toUserModel = (userData: UserData): User => {
  return {
    id: userData.id,
    firstName: userData.first_name,
    lastName: userData.last_name,
    // ...
  };
};

// Inverse conversion
export const toUserData = (user: User): UserData => {
  return {
    id: user.id,
    first_name: user.firstName,
    last_name: user.lastName,
    // ...
  };
};
```

## 5. Resolving Name Conflicts

### Problem

We had a file name case sensitivity clash:
```
File name differs from already included file name only in casing
```

### Solution: Rename Components with Clear Purpose

When shadcn/ui components conflict with our custom components:

1. Choose descriptive names that indicate purpose
2. Use prefixes like "Custom" or suffixes like "Enhanced"
3. Update all references to use the new name

Example:
```typescript
// Instead of conflicting Pagination.tsx and pagination.tsx
// Create CustomPagination.tsx with a clear name
const CustomPagination = () => { /* ... */ };
export default CustomPagination;
```

By following these best practices, we can prevent common import/export errors and maintain a more robust codebase.
