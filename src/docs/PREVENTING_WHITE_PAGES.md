
# Preventing White Pages: Authentication and Routing Best Practices

This document provides guidance on preventing the "white page" problem that can occur with authentication and routing issues in React applications.

## Common Causes of White Pages

1. **Authentication State Synchronization Issues**
   - Authentication state not properly initialized
   - Missing loading states during authentication checks
   - Race conditions between route rendering and auth state

2. **Route Configuration Problems**
   - Improper nesting of route components
   - Missing route handlers
   - Redirect loops in authentication logic

3. **Component Rendering Failures**
   - Missing error boundaries
   - Uncaught exceptions in render methods
   - Context providers not properly initialized

## Authentication Implementation Best Practices

### 1. Proper Authentication State Management

```tsx
// CORRECT: Complete authentication state management
const [user, setUser] = useState<User | null>(null);
const [session, setSession] = useState<Session | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  // Set up auth listener FIRST
  const { subscription } = supabase.auth.onAuthStateChange((event, session) => {
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
  });

  // THEN check current session
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
  });

  return () => subscription.unsubscribe();
}, []);
```

### 2. Loading State Implementation

```tsx
// CORRECT: Proper loading state handling
if (loading) {
  return <LoadingIndicator message="Verifying your credentials..." />;
}

// INCORRECT: No loading state
if (!user) {
  return <Navigate to="/login" />;
}
```

### 3. Error Recovery Mechanisms

```tsx
// CORRECT: Implement error boundaries and recovery
<ErrorBoundary fallback={<AuthErrorRecovery />}>
  <AuthenticatedRoutes />
</ErrorBoundary>
```

## Route Configuration Best Practices

### 1. Proper Route Nesting

```tsx
// CORRECT: Proper route nesting
<Routes>
  <Route element={<AuthLayout />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/settings" element={<Settings />} />
  </Route>
</Routes>

// INCORRECT: Missing Routes wrapper
<Route path="/dashboard" element={<Dashboard />} />
```

### 2. Protected Route Implementation

```tsx
// CORRECT: Complete protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingIndicator />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};
```

### 3. Timeout Handling

```tsx
// CORRECT: Add timeouts for loading states
useEffect(() => {
  const timeoutId = setTimeout(() => {
    if (isLoading) {
      setIsLoading(false);
      setError("Authentication check timed out. Please refresh.");
    }
  }, 5000);
  
  return () => clearTimeout(timeoutId);
}, [isLoading]);
```

## Content Detection Strategies

To ensure content is always visible and prevent blank screens, implement multiple content detection strategies:

### 1. HTML Attributes for Content Detection

```tsx
// Add data attributes to signal content is loaded
<div 
  data-testid="dashboard-content" 
  data-content-ready="true"
>
  {content}
</div>
```

### 2. Multiple Detection Points

```tsx
// Mark body and containers at multiple levels
useEffect(() => {
  // Mark body
  document.body.setAttribute('data-content-ready', 'true');
  
  // Mark main content area
  const main = document.querySelector('main');
  if (main) main.setAttribute('data-content-ready', 'true');
  
  // Mark component container
  if (containerRef.current) {
    containerRef.current.setAttribute('data-content-ready', 'true');
  }
}, []);
```

### 3. Fallback Content

```tsx
return (
  <>
    {/* Primary content */}
    {content}
    
    {/* Fallback content for detection */}
    <div className="fallback-content" style={{ display: 'none' }}>
      Content is loading. If you see this message, please wait...
    </div>
  </>
);
```

## Monitoring and Debugging White Page Issues

### 1. Enhanced Logging

```tsx
useEffect(() => {
  console.log('Component mounting state:', {
    isAuthenticated,
    user: user?.id,
    loading,
    route: window.location.pathname
  });
  
  return () => {
    console.log('Component unmounting:', window.location.pathname);
  };
}, [isAuthenticated, user, loading]);
```

### 2. Route Transition Monitoring

```tsx
const location = useLocation();

useEffect(() => {
  console.log('Route changed to:', location.pathname);
  
  // Reset any error state on route change
  setError(null);
}, [location.pathname]);
```

## Implementation Checklist

When implementing or modifying authentication and routing:

1. ✅ Ensure proper loading states for all auth-dependent components
2. ✅ Add error boundaries around route components
3. ✅ Implement authentication state timeouts
4. ✅ Add multiple content detection strategies
5. ✅ Log key state changes for debugging
6. ✅ Test with network latency simulation
7. ✅ Verify behavior with different user roles

By following these best practices, we can prevent white pages and ensure a reliable user experience even when authentication or routing issues occur.

