# Authentication Architecture Best Practices

## Common Authentication Error: "useAuth must be used within an AuthProvider"

This error occurs when a component tries to use the `useAuth` hook outside of the component tree wrapped by an `AuthProvider`. This typically happens in one of these scenarios:

1. The component using `useAuth` is rendered outside of the `AuthProvider` in the component tree
2. There's a circular dependency between auth-related modules
3. Multiple auth hooks/contexts are competing with each other

## Solution: Proper Authentication Architecture

### 1. Clear Separation of Concerns

- **AuthContext**: Define the context type and create the React context
- **AuthProvider**: Implement the auth state and wrap children with context provider
- **useAuth**: A custom hook that uses `useContext` to access the auth context

### 2. Correct Provider Nesting Order

Always follow this provider nesting order in your application:

```jsx
<ErrorBoundary>
  <QueryClientProvider>
    <ThemeProvider>
      <AuthProvider>       {/* Auth provider should be high in the tree */}
        <AuthSessionProvider> {/* Dependent providers after */}
          <AppRoutes />
        </AuthSessionProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
</ErrorBoundary>
```

### 3. Avoiding Circular Dependencies

- Keep the context definition and provider in the same file
- Export the hook separately from the provider
- Use direct imports from the context file rather than through intermediary files

### 4. Debugging Auth Context Issues

When experiencing context-related errors:

1. Check the component tree to ensure proper nesting
2. Inspect for circular dependencies between files
3. Verify that context values are not `undefined`
4. Add error boundaries around authentication components
5. Use React DevTools to inspect the context values

### 5. Testing Auth Components

- Always wrap components using `useAuth` with an `AuthProvider` in tests
- Mock the auth context values appropriately for different test scenarios
- Test both authenticated and unauthenticated states

## Implementation Example

```tsx
// AuthContext.tsx
import React, { createContext, useState, useContext } from 'react';

export interface AuthContextType {
  user: User | null;
  // other auth state and methods
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Implement auth state and methods
  
  return (
    <AuthContext.Provider value={/* auth values */}>
      {children}
    </AuthContext.Provider>
  );
};

// Separate hook file (useAuth.ts)
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

By following these guidelines, you can maintain a clean authentication architecture and avoid common pitfalls that lead to context-related errors.
