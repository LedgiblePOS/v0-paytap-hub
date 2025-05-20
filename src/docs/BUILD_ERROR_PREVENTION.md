# Build Error Prevention Guide

This document outlines common build errors we've encountered in our security modules and how to prevent them in future development.

## Common Build Errors and Solutions

### 1. Missing Required Properties in Interface Types

#### Error Example:
```
error TS2345: Argument of type '{ action: string; description: string; severity: AuditSeverity; ... }' is not assignable to parameter of type 'SecurityEvent'. Property 'userId' is missing...
```

#### Prevention:
- Always reference the interface definition before using it in function calls
- Use TypeScript's type checking to verify all required properties are included:
  ```typescript
  // Before submitting:
  type SecurityEvent = {
    userId: string | null;  // Required!
    action: string;
    // other properties
  };
  
  // Verify properties match when creating objects
  const event: SecurityEvent = {
    userId: currentUser?.id || null, // Include all required properties
    action: 'USER_ACTION',
    // other properties
  };
  ```
- Consider creating factory functions for complex objects to ensure all required properties are included

### 2. Module Import Errors

#### Error Example:
```
error TS2307: Cannot find module 'express' or its corresponding type declarations
```

#### Prevention:
- Verify all imported modules are actually installed as dependencies
- For browser-only code, avoid server-side libraries like Express
- When implementing similar patterns as server middleware:
  - Create browser-compatible alternatives
  - Refactor to use fetch interceptors or custom wrappers
- For type definitions that might be missing:
  ```typescript
  // Install type definitions separately
  // npm install --save-dev @types/module-name
  ```

### 3. Type Assignment Errors

#### Error Example:
```
error TS2322: Type 'string' is not assignable to type 'UserRole'
```

#### Prevention:
- Use explicit type assertions when converting between types
  ```typescript
  // Wrong: role: profileData.role,
  // Right: role: profileData.role as UserRole,
  ```
- Implement validation to ensure the value is actually of the expected type
- Create utility functions for common type conversions:
  ```typescript
  function toUserRole(role: string): UserRole {
    if (isValidUserRole(role)) {
      return role as UserRole;
    }
    return 'USER'; // Default role
  }
  ```

## Pre-Commit TypeScript Validation Workflow

To prevent build errors before they happen:

1. Create a pre-commit hook that runs TypeScript type checking:
   ```bash
   npm run type-check
   ```

2. Run linting with type checking:
   ```bash
   npm run lint
   ```

3. Use IDE integrations for real-time error detection:
   - Configure VSCode to show TypeScript errors as you type
   - Enable "strict" mode in tsconfig.json

## Documentation Best Practices

- Document interfaces thoroughly, especially required properties
- Add comments describing expected types and values
- Maintain examples for complex object structures
- Keep a central location for shared types to prevent duplication

By following these practices, we can significantly reduce build errors in our codebase.
