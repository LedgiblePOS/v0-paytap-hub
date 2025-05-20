
# Authentication Type Safety Guide

This guide focuses on maintaining type safety specifically in authentication components and flows.

## Core Authentication Type Patterns

### 1. User Types

```typescript
// Define clear user types
interface User {
  id: string;
  email: string;
  role: UserRole;
  displayName?: string;
}

// Use discriminated unions for roles
type UserRole = 'admin' | 'merchant' | 'customer';
```

### 2. Authentication State Types

```typescript
// Define possible auth states
type AuthState = 
  | { status: 'loading' }
  | { status: 'authenticated'; user: User }
  | { status: 'unauthenticated' }
  | { status: 'error'; error: string };
```

## Type-Safe Login Form Components

### 1. Form Props Interface

```typescript
interface LoginFormProps {
  onSuccess?: (user: User) => void;
  onError?: (error: string) => void;
  redirectPath?: string;
  userType?: UserRole;
}
```

### 2. Form Values Type

```typescript
// Define form values type
interface LoginFormValues {
  email: string;
  password: string;
  rememberMe?: boolean;
}
```

## Type-Safe Authentication Context

```typescript
interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}
```

## Common Type Safety Issues in Authentication

### 1. Inconsistent User Types

Problem: Different parts of the app expect different user structures

Solution:
- Define a single User type in a shared types file
- Use type guards to validate user objects
- Convert between backend and frontend user formats consistently

### 2. Unhandled Authentication States

Problem: Not accounting for all possible auth states (loading, error, etc.)

Solution:
- Use discriminated unions for auth state
- Implement exhaustive checks in conditional rendering
- Provide fallback UI for each possible state

### 3. Improper Role-Based Access Control Types

Problem: String-based role checks without type safety

Solution:
- Use union types for roles (`'admin' | 'merchant'`)
- Implement type-safe role checking functions
- Use const assertions for role arrays

## Best Practices for Authentication Components

### 1. Type-Safe Route Guards

```typescript
interface ProtectedRouteProps {
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole,
  redirectTo = '/login',
  children
}) => {
  // Implementation with type-safe role checking
};
```

### 2. Login Form Validation

```typescript
const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional()
});

type LoginFormValues = z.infer<typeof loginSchema>;
```

### 3. Type-Safe Authentication Hooks

```typescript
function useAuth(): AuthContextValue {
  // Implementation with proper typing
}

function useRequireAuth(requiredRole?: UserRole): {
  user: User | null;
  isLoading: boolean;
  isAuthorized: boolean;
} {
  // Implementation with role checking
}
```

## Type-Safe Authentication Error Handling

```typescript
// Define specific auth error types
type AuthErrorType = 'credentials' | 'access' | 'network' | 'unknown';

interface AuthError {
  type: AuthErrorType;
  message: string;
  details?: Record<string, any>;
}

// Type-safe error handler
function handleAuthError(error: AuthError): string {
  switch (error.type) {
    case 'credentials':
      return 'Invalid email or password';
    case 'access':
      return 'You do not have permission to access this resource';
    case 'network':
      return 'Network error. Please try again';
    default:
      return 'An unknown error occurred';
  }
}
```

By following these guidelines, we can ensure type safety throughout our authentication flow, preventing common errors and improving the reliability of our auth components.
