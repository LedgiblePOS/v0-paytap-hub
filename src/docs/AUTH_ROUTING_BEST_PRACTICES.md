
# Authentication and Routing Best Practices

This document outlines best practices for implementing and maintaining authentication and routing in React applications.

## Route Structure Best Practices

### 1. Proper Nesting of Route Components

**DO:**
```tsx
// Parent component
return (
  <Routes>
    <Route path="/path" element={<Component />} />
  </Routes>
);

// Child component with nested routes
return (
  <Routes>
    <Route path="/nested" element={<NestedComponent />} />
  </Routes>
);
```

**DON'T:**
```tsx
// WRONG: Route outside of Routes
return (
  <Route path="/path" element={<Component />} />
);
```

### 2. Route Organization

**DO:**
- Group related routes together
- Use route objects for complex route structures
- Use nested routes with Outlet for shared layouts

**DON'T:**
- Mix protected and public routes without clear separation
- Declare routes outside of Routes components
- Use direct route rendering without proper wrappers

## Authentication Implementation

### 1. Auth State Management

**DO:**
```tsx
const [user, setUser] = useState<User | null>(null);
const [session, setSession] = useState<Session | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  // Set up auth listener first
  const { subscription } = supabase.auth.onAuthStateChange((event, session) => {
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
  });

  // Then check current session
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
  });

  return () => subscription.unsubscribe();
}, []);
```

**DON'T:**
```tsx
// WRONG: No loading state or session handling
const [user, setUser] = useState(null);

useEffect(() => {
  checkIfUserIsLoggedIn();
}, []);
```

### 2. Protected Routes

**DO:**
```tsx
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingIndicator />;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};
```

**DON'T:**
```tsx
// WRONG: No loading state, abrupt redirects
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) window.location.href = '/login';
  
  return children;
};
```

## Component Design for Authentication

### 1. Form Components

**DO:**
- Use form libraries with validation (react-hook-form + zod)
- Implement clear loading states
- Separate success and error handlers
- Provide clear user feedback

**DON'T:**
- Mix authentication logic with UI components
- Use raw HTML forms without validation
- Ignore loading states

### 2. Layout Components

**DO:**
- Create separate layouts for authenticated and public sections
- Use composition for shared elements
- Implement proper context providers

**DON'T:**
- Duplicate layout code across components
- Implement authentication checks in every component
- Mix layout concerns with authentication logic

## Error Prevention and Handling

### 1. Error Boundaries

**DO:**
```tsx
class AuthErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <AuthErrorFallback />;
    }
    return this.props.children;
  }
}
```

**DON'T:**
- Allow unhandled exceptions to crash the application
- Display technical errors to end users

### 2. Loading States

**DO:**
- Implement timeouts for loading states
- Show meaningful loading indicators
- Provide fallbacks for slow loading

**DON'T:**
- Leave users looking at blank screens
- Allow infinite loading states

## Automatic Refactoring Strategies

### 1. Component Size Monitoring

Monitor component size and complexity:
- Components > 150 lines should be refactored
- Components with > 3 responsibilities should be split
- Nested conditionals > 3 levels deep should be simplified

### 2. Authentication Logic Abstraction

Extract authentication logic:
- Move auth logic to custom hooks
- Centralize auth state management
- Separate UI from business logic

### 3. Route Organization

Maintain clean route structure:
- Group routes by access level
- Implement consistent protection patterns
- Use proper nested routing patterns

By following these best practices, we can maintain a robust authentication and routing system that prevents white screens, loading issues, and improves overall application reliability.

