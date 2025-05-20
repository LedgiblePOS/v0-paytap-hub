
# White Screen Prevention Guide

This document outlines best practices for preventing white screen errors in our application.

## Common Causes of White Screens

1. **Authentication Race Conditions**
   - Components accessing auth state before it's initialized
   - Missing loading states during authentication checks
   - Token refresh issues causing authentication loops

2. **Route Rendering Problems**
   - Route components not properly handling loading/error states
   - Missing error boundaries at the route level
   - Issues with lazy-loaded components

3. **Context Provider Issues**
   - Using hooks outside their provider context
   - Incorrect provider nesting order
   - Missing providers in component tree

4. **Data Dependency Issues**
   - Trying to access data that hasn't been fetched yet
   - Missing loading states during data fetching
   - Uncaught errors in data fetching

5. **Type Mismatches**
   - Using incorrect property names (snake_case vs camelCase)
   - Missing type conversions between DB entities and frontend models

## Prevention Strategies

### 1. Authentication Safety

```tsx
// GOOD - Safety check before rendering protected content
const AuthProtectedComponent = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  
  return <YourProtectedContent />;
}
```

### 2. Structured Page Components

```tsx
// GOOD - Complete page structure with proper states
const ProductsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await api.getProducts();
        setData(result);
      } catch (err) {
        setError(err);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data) return <EmptyState />;
  
  return <ProductList data={data} />;
}
```

### 3. Error Boundaries

```tsx
// GOOD - Error boundaries at appropriate levels
<ErrorBoundary fallback={<ErrorFallback />}>
  <Routes>
    <Route path="/products" element={<Products />} />
    <Route path="/users" element={<Users />} />
  </Routes>
</ErrorBoundary>
```

### 4. Loading Timeouts

```tsx
// GOOD - Safety timeouts for loading states
useEffect(() => {
  const timeoutId = setTimeout(() => {
    if (isLoading) {
      console.warn("Loading timeout reached, showing content anyway");
      setIsLoading(false);
    }
  }, 5000); // 5 second timeout
  
  return () => clearTimeout(timeoutId);
}, [isLoading]);
```

### 5. Type Conversion

```tsx
// GOOD - Convert database entities to frontend models
const convertToModel = (entity) => ({
  id: entity.id,
  userName: entity.user_name, // Convert snake_case to camelCase
  createdAt: entity.created_at
});

// Use the converted model in your components
const user = convertToModel(userData);
```

### 6. Defensive Rendering

```tsx
// GOOD - Defensive rendering with null/undefined checks
const UserProfile = ({ user }) => {
  if (!user) return <LoadingState />;
  
  // Use optional chaining for nested properties
  const fullName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Unknown';
  const email = user?.email || 'No email provided';
  
  return (
    <div>
      <h2>{fullName}</h2>
      <p>{email}</p>
    </div>
  );
};
```

### 7. Content Detection

```tsx
// GOOD - Add markers to detect content rendering
useEffect(() => {
  // Signal that content has been rendered
  document.body.setAttribute('data-content-rendered', 'true');
  
  // Add markers to specific content containers
  if (contentRef.current) {
    contentRef.current.setAttribute('data-content-loaded', 'true');
  }
}, []);
```

### 8. Enhanced Logging

```tsx
// GOOD - Log component lifecycle for debugging
useEffect(() => {
  console.log(`Component mounted: ${componentName}`, { 
    props, 
    state, 
    path: window.location.pathname 
  });
  
  return () => {
    console.log(`Component unmounted: ${componentName}`);
  };
}, [componentName, props, state]);
```

### 9. Route Change Handling

```tsx
// GOOD - Clean up on route changes
const location = useLocation();

useEffect(() => {
  // Reset component state on route change
  setData(null);
  setError(null);
  setIsLoading(true);
  
  // Fetch new data
  fetchData();
}, [location.pathname]);
```

### 10. Automatic Recovery Mechanisms

```tsx
// GOOD - Automatic white screen detection and recovery
const detectWhiteScreen = () => {
  setTimeout(() => {
    const hasVisibleContent = document.querySelectorAll('[data-content-loaded]').length > 0;
    
    if (!hasVisibleContent) {
      console.warn('White screen detected, attempting recovery');
      window.location.reload();
    }
  }, 5000);
};

useEffect(() => {
  detectWhiteScreen();
}, []);
```

## Implementation Patterns

### Standard Page Container Pattern

Use a standardized page container component that handles loading, error states, and fallbacks:

```tsx
<MerchantPageContainer
  title="Products"
  loading={isLoading}
  error={error}
  onRetry={refetchData}
>
  <ProductList data={products} />
</MerchantPageContainer>
```

### White Screen Detection Component

Add a white screen detection component at the application root:

```tsx
<App>
  <WhiteScreenRecovery />
  <AuthProvider>
    <Router>
      <Routes>
        {/* Routes go here */}
      </Routes>
    </Router>
  </AuthProvider>
</App>
```

## Pre-Deployment Checklist

- [ ] All pages use the standardized page container
- [ ] Error boundaries are implemented at appropriate levels
- [ ] Loading states are properly handled for all data-dependent components
- [ ] Type conversions are properly handled for all API responses
- [ ] Authentication checks are performed before rendering protected content
- [ ] Safety timeouts are implemented for loading states
- [ ] Console logs are added for debugging
- [ ] White screen detection and recovery is implemented

By following these practices consistently, we can prevent most white screen issues in our application.
