
# Common React Router Errors and Solutions

This document covers common React Router errors encountered in our application and their solutions.

## Error: A `<Route>` is only ever to be used as the child of `<Routes>`

### Symptom
```
Error: A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.
```

### Root Cause
This error occurs when using `<Route>` components outside of a `<Routes>` component. In React Router v6, all `<Route>` components must be direct children of a `<Routes>` component.

### Solution
Always wrap `<Route>` components in a `<Routes>` component:

```tsx
// CORRECT
<Routes>
  <Route path="/path" element={<Component />} />
  <Route path="/another" element={<AnotherComponent />} />
</Routes>

// WRONG
<Route path="/path" element={<Component />} />
```

When creating modular route files, ensure each file returns a `<Routes>` component:

```tsx
// File: ModuleRoutes.tsx
const ModuleRoutes = () => (
  <Routes>
    <Route path="/module/path" element={<Component />} />
  </Routes>
);
```

## Error: No routes matched location

### Symptom
```
No routes matched location "/path"
```

### Root Cause
This occurs when the current URL doesn't match any of your defined routes, often due to:
- Missing route definitions
- Path mismatch (e.g., trailing slashes)
- Route order issues
- Nested route configuration issues

### Solution

1. Check for exact path matching:
```tsx
<Routes>
  <Route path="/exact-path" element={<Component />} />
</Routes>
```

2. Use wildcard patterns for nested routes:
```tsx
<Routes>
  <Route path="/parent/*" element={<ParentComponent />} />
</Routes>

// In ParentComponent:
<Routes>
  <Route path="child" element={<ChildComponent />} />
</Routes>
```

3. Add a catch-all route:
```tsx
<Routes>
  <Route path="*" element={<NotFound />} />
</Routes>
```

## Error: Cannot render an <Outlet> when no routes are being rendered

### Symptom
```
Cannot render an <Outlet> when no routes are being rendered, so outlets can only be rendered when inside a route element
```

### Root Cause
Using `<Outlet>` outside of a parent route that has child routes.

### Solution
Only use `<Outlet>` in components rendered by parent routes with child routes:

```tsx
<Routes>
  <Route path="/parent" element={<ParentWithOutlet />}>
    <Route path="child" element={<Child />} />
  </Route>
</Routes>

// In ParentWithOutlet.tsx
const ParentWithOutlet = () => (
  <div>
    <h1>Parent Header</h1>
    <Outlet /> {/* This will render the Child component */}
  </div>
);
```

## Error: Component cannot render when inside Routes without a Route

### Symptom
Component doesn't render or behaves unexpectedly when used inside Routes.

### Root Cause
Placing non-Route components directly inside a Routes component.

### Solution
Only place Route components directly inside Routes:

```tsx
// CORRECT
<Routes>
  <Route path="/path" element={<Component />} />
</Routes>

// WRONG
<Routes>
  <Component /> {/* This won't work */}
</Routes>
```

## Error: Multiple routes matching the same path

### Symptom
Unexpected routing behavior where a different component than expected renders for a path.

### Root Cause
Having multiple routes with the same path in different `<Routes>` components.

### Solution
1. Ensure unique paths across your application
2. Be careful with wildcard routes and route ordering
3. Consider using a single, centralized router configuration

```tsx
// ISSUE: Multiple routes matching "/dashboard"
// In RouteFile1.tsx
<Routes>
  <Route path="/dashboard" element={<Dashboard1 />} />
</Routes>

// In RouteFile2.tsx
<Routes>
  <Route path="/dashboard" element={<Dashboard2 />} />
</Routes>

// SOLUTION: Use nested routes with more specific paths
<Routes>
  <Route path="/dashboard/type1/*" element={<Dashboard1 />} />
  <Route path="/dashboard/type2/*" element={<Dashboard2 />} />
</Routes>
```

## Error: White screen after routes change

### Symptom
Application shows a white/blank screen after navigation, especially after authentication changes.

### Root Cause
Common causes include:
- JS errors in route components
- Authentication state issues
- Improper route nesting
- Missing error boundaries

### Solution
1. Add error boundaries around route components:
```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <Routes>
    <Route path="/path" element={<Component />} />
  </Routes>
</ErrorBoundary>
```

2. Add proper loading states during authentication checks:
```tsx
if (isAuthLoading) {
  return <LoadingIndicator />;
}
```

3. Implement timeout mechanisms to prevent infinite loading:
```tsx
useEffect(() => {
  const timeout = setTimeout(() => {
    if (isLoading) {
      setIsLoading(false);
      setHasError(true);
    }
  }, 5000);
  
  return () => clearTimeout(timeout);
}, [isLoading]);
```

## Best Practices

1. **Centralized Route Management**:
   - Keep route definitions organized in dedicated files
   - Group routes by functionality or access level

2. **Proper Route Nesting**:
   - Use layout routes with Outlet for shared UI elements
   - Maintain clean route hierarchies

3. **Type Safety**:
   - Use TypeScript to catch route parameter issues
   - Define route parameter interfaces

4. **Error Handling**:
   - Add error boundaries around route components
   - Implement fallback UI for route errors

5. **Loading States**:
   - Always show loading indicators during route transitions
   - Use loading timeouts to prevent infinite loading

By following these guidelines, we can prevent common routing errors and avoid white-screen issues in our application.
