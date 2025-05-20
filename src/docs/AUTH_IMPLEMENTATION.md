
# Authentication Implementation Guide

## Architecture Overview

Our authentication system follows these key principles:

1. **Single Source of Truth**: The `AuthContext` provides auth state to the entire application.
2. **Consistent Access Pattern**: The `useAuth` hook is the only way to access auth state.
3. **Type Safety**: All auth operations are properly typed with TypeScript.
4. **Provider Pattern**: All components that need auth must be within an `AuthProvider`.

## Key Components

### 1. Auth Context (src/contexts/auth-context.tsx)
- Defines the React context for authentication
- Contains no implementation, only the context definition

### 2. Auth Provider (src/contexts/AuthContext.tsx)
- Implements the authentication logic
- Manages auth state (user, loading, errors)
- Provides auth methods (signIn, signUp, signOut)
- Wraps children with context provider

### 3. useAuth Hook (src/hooks/useAuth.ts)
- Custom hook to access auth context
- Throws error if used outside AuthProvider
- Provides strongly typed auth interface

### 4. Auth State Helper (src/contexts/auth/AuthState.ts)
- Manages the state for authentication
- Handles user data conversion between database and frontend formats
- Provides error handling utilities

## User Data Conversion

We handle two different user data formats:

1. **UserData** (snake_case): Used in the database
   ```typescript
   {
     id: string,
     email: string,
     first_name: string,
     last_name: string,
     role: string,
     is_active: boolean,
     // etc.
   }
   ```

2. **User Model** (camelCase): Used in the frontend
   ```typescript
   {
     id: string,
     email: string,
     firstName: string,
     lastName: string,
     role: UserRole,
     isActive: boolean,
     // etc.
   }
   ```

Conversion utilities in `userConverters.ts` handle transformations between these formats.

## Correct Implementation Pattern

```tsx
// 1. Import the hook
import { useAuth } from '@/hooks/useAuth';

// 2. Use in component
const MyComponent = () => {
  const { user, isLoading, signOut } = useAuth();
  
  // Use auth state and methods here
};

// 3. Wrap application with provider (in App.tsx)
<AuthProvider>
  <AppRoutes />
</AuthProvider>
```

## Common Error: "useAuth must be used within an AuthProvider"

This error occurs when:
1. A component using `useAuth` is rendered outside of `AuthProvider` in the component tree
2. There's a circular dependency between auth-related modules
3. The import path for `useAuth` or `AuthProvider` is incorrect

### Solution:
- Ensure `AuthProvider` is high in the component tree
- Check for proper import paths
- Avoid circular dependencies
- Use consistent imports across the application

## Best Practices

1. **Always use the hook**:
   ```tsx
   // GOOD
   const { user } = useAuth();
   
   // BAD
   const { user } = useContext(AuthContext);
   ```

2. **Handle loading states**:
   ```tsx
   const { user, isLoading } = useAuth();
   
   if (isLoading) {
     return <Spinner />;
   }
   
   if (!user) {
     return <Navigate to="/login" />;
   }
   ```

3. **Type safety for user data**:
   ```tsx
   const { user } = useAuth();
   
   // User could be null, so check first
   const displayName = user ? `${user.firstName} ${user.lastName}` : 'Guest';
   ```
   
4. **Consistent import paths**:
   ```tsx
   // Use the same import path in all files
   import { useAuth } from '@/hooks/useAuth';
   ```
