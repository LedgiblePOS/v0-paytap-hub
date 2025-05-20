
# White Screen Prevention Guide

This document outlines best practices for preventing white screen errors in our application.

## Common Causes of White Screens

1. **Context Provider Issues**
   - Using hooks outside their provider context
   - Incorrect provider nesting order
   - Missing providers in component tree

2. **Authentication Race Conditions**
   - Components accessing auth state before it's initialized
   - Missing auth state checks before rendering protected content

3. **Data Dependency Issues**
   - Trying to access data that hasn't been fetched yet
   - Missing loading states during data fetching
   - Uncaught errors in data fetching

4. **Type Mismatches**
   - Using incorrect property names (snake_case vs camelCase)
   - Missing type conversions between DB entities and frontend models

## Prevention Strategies

### 1. Context Provider Best Practices

```tsx
// GOOD - Custom hook with safety check
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// GOOD - Proper provider order in App.tsx
<ThemeProvider>
  <AuthProviderWrapper>
    <AuthSessionProvider>
      <YourApp />
    </AuthSessionProvider>
  </AuthProviderWrapper>
</ThemeProvider>
```

### 2. Authentication Safety

```tsx
// GOOD - Safety check before rendering protected content
const AuthProtectedComponent = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  
  return <YourProtectedContent />;
}
```

### 3. Data Fetching Safety

```tsx
// GOOD - Complete loading and error states
const DataComponent = () => {
  const { data, isLoading, error } = useQuery(...);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data) return <EmptyState />;
  
  return <DataDisplay data={data} />;
}
```

### 4. Type Conversion

```tsx
// GOOD - Convert database entities to frontend models
const convertToModel = (entity) => ({
  id: entity.id,
  userName: entity.user_name, // Convert snake_case to camelCase
  createdAt: entity.created_at
});

// Use the converted model in your components
const data = convertToModel(rawData);
```

## Pre-Deployment Checklist

- [ ] All hooks are used within their required providers
- [ ] Provider hierarchy is correctly established in App.tsx
- [ ] Loading states are implemented for all data-dependent components
- [ ] Type conversions are properly handled for all API responses
- [ ] Error boundaries are implemented at appropriate levels
- [ ] Route protection checks auth status before rendering
- [ ] Console logs are added for easier debugging

By following these practices consistently, we can prevent most white screen issues in our application.
