
# Library Version Compatibility Guide

This document outlines how to handle compatibility issues between different libraries and their versions in our application.

## Current Library Versions and Requirements

| Library | Version | Key Requirements |
|---------|---------|------------------|
| @tanstack/react-query | ^5.56.2 | Use object syntax for queries, meta.errorHandler for errors |
| React Router | ^6.26.2 | Use createBrowserRouter, loaders/actions pattern |
| Supabase | ^2.49.3 | Proper error handling, use of session methods |
| shadcn/ui | Latest | Follow component property documentation exactly |

## Breaking Changes in Recent Updates

### React Query v5 (Current)

Important changes from v4:
- `onError` method removed, use `meta.errorHandler` instead
- Must use object syntax for query configuration
- Suspense mode behavior changes

Example migration:
```typescript
// v4 syntax (no longer works)
const query = useQuery('users', fetchUsers, {
  onError: (error) => console.error(error)
});

// v5 syntax (current)
const query = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  meta: {
    errorHandler: (error) => console.error(error)
  }
});
```

### React Router v6.4+ (Current)

Changes from earlier v6:
- Loaders and actions preferred over useEffect data fetching
- Data router APIs (createBrowserRouter)
- Error boundary integration

Example migration:
```typescript
// Earlier v6
const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </BrowserRouter>
);

// Current v6.4+ preferred pattern
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    loader: homeLoader,
    errorElement: <ErrorPage />
  }
]);

const App = () => <RouterProvider router={router} />;
```

## Version Migration Process

When updating a library to a new major version:

1. **Research Breaking Changes**:
   - Read the official migration guide
   - Review GitHub issues for common problems
   - Check for TypeScript definition changes

2. **Create a Compatibility Layer**:
   - Implement adapter functions if needed
   - Update type definitions
   - Create utility functions to handle both versions

3. **Incremental Migration**:
   - Update usage patterns in one module at a time
   - Run extensive tests after each module
   - Document any workarounds needed

4. **Validation**:
   - Run TypeScript type checking
   - Verify runtime behavior
   - Test edge cases specific to the library

## Type Compatibility Testing

For each major library:

### React Query

Test:
- Error handling behavior
- Suspense integration
- Refetch behavior
- Stale data handling

### React Router

Test:
- Navigation guards
- Parameter extraction
- Nested routes behavior
- Error boundary activation

### Supabase

Test:
- Authentication flows
- Data fetching with filters
- Real-time subscription behavior
- Error response handling

## Library-Specific Type Patterns

### React Query

```typescript
// Correct pattern for defining queries
const query = useQuery({
  queryKey: ['resource', id],
  queryFn: () => fetchResource(id),
  meta: {
    errorHandler: (error: Error) => handleError(error)
  },
  select: (data) => transformData(data)
});

// Correct pattern for mutations
const mutation = useMutation({
  mutationFn: (variables) => updateResource(variables),
  meta: {
    errorHandler: (error) => handleMutationError(error)
  },
  onSuccess: () => {
    // Success handling
  }
});
```

### React Router

```typescript
// Correct pattern for route parameters
const { id } = useParams();
const numericId = id ? parseInt(id, 10) : undefined;

// Correct pattern for navigation
const navigate = useNavigate();
const handleClick = () => {
  navigate(`/resource/${id}`);
};

// Correct pattern for location state
const location = useLocation();
const { state } = location;
```

By following these guidelines, we can minimize compatibility issues when working with external libraries and their various versions.
