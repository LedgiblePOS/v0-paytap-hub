
# Comprehensive Guide to Preventing TypeScript Errors

This document consolidates TypeScript best practices and common error prevention strategies for our application.

## Common Error Categories and Solutions

### 1. File Path and Import Casing Issues

**Problem**: TypeScript treats `/components/Dialogs/Component.tsx` and `/components/dialogs/Component.tsx` as different files, causing errors like:

```
error TS1261: Already included file name differs from file name only in casing.
```

**Solution**:
- **Use consistent casing for directories**: Always use PascalCase for component directories and files
- **Avoid direct imports of files with potential casing issues**: Use barrel exports (index.ts files)
- **Use absolute imports with path aliases**: Use `@/components/FeatureName` instead of relative paths

**Example**:
```typescript
// Good - Using barrel exports to avoid casing issues
import { UserDialog, EditDialog } from './Dialogs';

// Good - Using absolute imports with path aliases
import { Button } from '@/components/ui/button';

// Avoid - Direct relative imports prone to casing issues 
import UserDialog from './dialogs/UserDialog';
```

### 2. Type Mismatches in Component Props

**Problem**: Component prop types don't match the expected props, leading to errors like:

```
error TS2322: Type '(userData: any) => Promise<void>' is not assignable to type '() => Promise<void>'
```

**Solution**:
- **Document props with JSDoc comments**: Provide clear documentation for each prop
- **Use consistent return types**: Ensure handler functions return consistent types
- **Create dedicated interface files**: For complex components, separate prop interfaces into dedicated files
- **Use discriminated union types for complex props**: For components with different modes

**Example**:
```typescript
/**
 * Props for the UserForm component
 * @property {boolean} isEdit - Whether form is in edit mode
 * @property {User} [user] - User data (required in edit mode)
 * @property {(data: UserFormData) => Promise<void>} onSubmit - Submit handler
 */
interface UserFormProps {
  isEdit: boolean;
  user?: User;
  onSubmit: (data: UserFormData) => Promise<void>;
}
```

### 3. Database Entity vs UI Model Type Confusion

**Problem**: Mixing snake_case database entities with camelCase UI models, causing errors like:

```
error TS2339: Property 'firstName' does not exist on type '{ first_name: string; }'.
```

**Solution**:
- **Define clear boundaries**: Separate data layer from UI layer
- **Create explicit conversion utilities**: For transforming between entity and model formats
- **Create distinct type interfaces**: For database entities and UI models
- **Convert at system boundaries**: Convert to UI models immediately after data fetching

**Example**:
```typescript
// Database entity (snake_case)
interface UserEntity {
  id: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
}

// UI model (camelCase)
interface UserModel {
  id: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

// Conversion utility
const toUserModel = (entity: UserEntity): UserModel => ({
  id: entity.id,
  firstName: entity.first_name,
  lastName: entity.last_name,
  isActive: entity.is_active
});
```

### 4. Inconsistent Function Signatures

**Problem**: Inconsistent function signatures between implementation and usage, causing errors like:

```
error TS2554: Expected 2 arguments, but got 3.
```

**Solution**:
- **Define function types separately**: Create dedicated type definitions for function signatures
- **Use consistent param ordering**: Follow conventions like (required params, optional params, config objects)
- **Avoid optional parameters in the middle**: Place optional params at the end
- **Use function overloads for complex signatures**: When a function can accept multiple argument patterns

**Example**:
```typescript
// Define the function type
type FetchUserFn = (userId: string, includeDetails?: boolean) => Promise<User>;

// Use consistent implementation
const fetchUser: FetchUserFn = async (userId, includeDetails = false) => {
  // Implementation
};
```

### 5. Hook Usage and Return Type Discrepancies

**Problem**: Return type of hooks doesn't match what components expect, causing errors like:

```
error TS2339: Property 'isEditUserOpen' does not exist on type '{ ... }'
```

**Solution**:
- **Explicitly define hook return types**: Use interfaces to define hook return types
- **Use consistent naming conventions**: For state and actions
- **Test hook usage in isolation**: Write unit tests specifically for hook API
- **Create wrapper hooks for complex logic**: Rather than having components manage complex state

**Example**:
```typescript
interface UseUserDialogsResult {
  isNewUserOpen: boolean;
  setNewUserOpen: (open: boolean) => void;
  isEditUserOpen: boolean;
  setEditUserOpen: (open: boolean) => void;
}

export const useUserDialogs = (): UseUserDialogsResult => {
  // Implementation
};
```

## Best Practices for TypeScript Project Structure

### 1. Centralize Type Definitions

- **Group related types together**: In domains like `types/user.ts`, `types/auth.ts`
- **Export types from barrel files**: Create `types/index.ts` for convenience
- **Document complex types**: Use JSDoc comments for complex types
- **Prefer explicit types over inference**: For public functions and APIs

### 2. Create Type Utilities for Common Patterns

- **Create utility types for pagination**: `PaginatedResponse<T>`, `PaginationParams`
- **Create utility types for API responses**: `ApiResponse<T>`, `ApiError`
- **Create standardized authentication types**: `AuthContext`, `UserSession`

### 3. Set Up Effective TypeScript Workflows

- **Use strict mode**: Enable strict TypeScript checking
- **Add pre-commit type checking**: Prevent merging code with TypeScript errors
- **Document common errors**: Add solutions to project documentation
- **Create type checking CI job**: Ensure type safety in CI pipeline

## Type-Safe API Communication

### 1. Define API Response Types

```typescript
// Define API response types
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  message: string;
  code: string;
}

// Use with fetch
const fetchData = async <T>(url: string): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return { data };
  } catch (error) {
    return { 
      error: { 
        message: error instanceof Error ? error.message : 'Unknown error',
        code: 'FETCH_ERROR'
      } 
    };
  }
};
```

### 2. Create Type-Safe Service Layers

```typescript
// User service with type-safe methods
export const userService = {
  async getUser(id: string): Promise<UserResponse> {
    // Implementation
  },
  
  async updateUser(id: string, data: UpdateUserData): Promise<UserResponse> {
    // Implementation
  }
};
```

## Testing Type Safety

### 1. Create Type Tests

```typescript
// test/types/user.test.ts
import { User, UserRole } from '../../types/user';

// This file won't be executed, but will be type-checked
const typeTest = () => {
  // Should compile
  const validUser: User = {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.ADMIN,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // @ts-expect-error - Missing required fields
  const invalidUser: User = {
    id: '123'
  };
  
  return { validUser, invalidUser };
};
```

### 2. Validate Props in Unit Tests

```typescript
// ResetPasswordDialog.test.tsx
it('should validate prop types', () => {
  // Type checking will catch any invalid props
  const validProps: ResetPasswordDialogProps = {
    open: true,
    onOpenChange: jest.fn(),
    email: 'test@example.com',
    onConfirm: jest.fn(),
    isLoading: false
  };
  
  render(<ResetPasswordDialog {...validProps} />);
  expect(screen.getByText('Reset Password')).toBeInTheDocument();
});
```

## Summary of Key Guidelines

1. **Consistency**: Use consistent naming, casing, and import patterns
2. **Explicit Types**: Define and document types for public APIs
3. **Boundary Conversions**: Convert between entity/model types at system boundaries
4. **Isolation**: Keep components small and focused
5. **Documentation**: Use JSDoc comments for complex types and functions
6. **Testing**: Test type safety in unit tests
7. **Workflow**: Integrate type checking into development workflow

By following these guidelines, we can significantly reduce TypeScript errors and improve code quality.
