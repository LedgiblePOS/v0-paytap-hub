
# React Query Integration Guide

## Overview (Updated April 13, 2025)

React Query is integrated in our application for efficient data fetching and state management. The setup includes:

1. A `QueryClientProvider` in the SuperAdminRoutes component
2. Standard configuration for query stale time, retries, and refetching options
3. Proper error handling for failed queries

## Configuration Details

Our React Query client is configured with these defaults:
```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

## Module Integration

The QueryClientProvider is added at the routing level to ensure all components within the SuperAdmin module have access to React Query's capabilities.

### Usage Pattern

When implementing React Query hooks:

1. Use the object syntax for query configuration:
   ```typescript
   const { data, isLoading, error } = useQuery({
     queryKey: ['resourceName'],
     queryFn: fetchResourceData,
   });
   ```

2. Handle loading and error states appropriately:
   ```typescript
   if (isLoading) return <LoadingIndicator />;
   if (error) return <ErrorDisplay error={error} />;
   ```

3. For mutations, use the useMutation hook with proper error handling:
   ```typescript
   const { mutate, isLoading } = useMutation({
     mutationFn: updateResource,
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['resourceName'] });
       toast.success("Operation successful");
     },
     onError: (error) => {
       toast.error(`Operation failed: ${error.message}`);
     }
   });
   ```

4. Always provide default values for potentially undefined data:
   ```typescript
   // Recommended approach
   const { data: items = [] } = useQuery({...});
   
   // Or handle in components
   function MyComponent({ data = [] }) {
     // Now data will never be undefined
   }
   ```

## Issue Resolution (April 13, 2025)

### Issues Fixed

1. **No QueryClient Error**
   An error occurred when accessing the Subscription module due to missing React Query provider:
   ```
   Error: No QueryClient set, use QueryClientProvider to set one
   ```
   Fixed by adding a QueryClientProvider in the SuperAdminRoutes component.

2. **Undefined Data References**
   Error when components tried to access properties on undefined data:
   ```
   TypeError: filteredLogs is undefined
   ```
   Fixed by:
   - Making props optional or providing default values
   - Using nullish coalescing/optional chaining
   - Adding proper type guards for data access

### Prevention Strategy

To prevent similar issues with React Query in future modules:

1. **Module Dependencies**
   - When implementing modules that rely on React Query:
     - Ensure QueryClientProvider is properly configured at the appropriate level in the component hierarchy
     - Document module dependencies in the module's README or documentation

2. **Data Safety**
   - Always provide default values for query results: `const { data = [] } = useQuery(...)`  
   - Use optional chaining: `data?.items?.map(...)`
   - Add null checks before data operations

3. **Testing Protocol**
   - Implement a pre-deployment checklist that includes:
     - Testing data fetching in all module routes
     - Verifying React Query dependencies are properly set up
     - Testing navigation between modules that use different data fetching strategies

4. **Integration Testing**
   - Add integration tests that verify:
     - Proper initialization of React Query context
     - Data fetching behavior across module boundaries
     - Error handling for failed queries

By following these guidelines, we can ensure that modules using React Query are properly integrated into the application and prevent similar issues in the future.
