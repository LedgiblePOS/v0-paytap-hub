
# Content Detection Best Practices

This document outlines best practices for ensuring proper content detection and preventing blank/white pages in the application.

## Common Causes of White/Blank Pages

1. **Errors in Component Rendering**: Uncaught errors during component rendering that aren't properly handled
2. **Missing Data**: Components expecting data before it's available
3. **Type Errors**: TypeScript errors that cause components to fail silently
4. **Missing Import Paths**: Components importing from incorrect or non-existent paths
5. **Route Configuration Issues**: Incorrectly configured routes or route parameters

## Key Solutions Implemented

### 1. BlankScreenRecovery Component

The `BlankScreenRecovery` component provides automated detection and recovery from blank pages by:

- Monitoring page content after initial render
- Using progressive checks with increasing delays (backoff strategy)
- Providing self-recovery options when blank pages are detected

### 2. Route Content Validation

The `routeContentValidator.ts` utility provides:

- Route-specific content detection rules
- DOM inspection to verify content is rendered
- Detailed reporting of UI state for debugging

### 3. Debug Route Wrapper

The `DebugRouteWrapper` component adds:

- Lifecycle logging for route components
- Automatic content validation
- Error boundary integration
- Performance metrics

## Implementation Best Practices

### For Component Development

1. **Add Data Attributes for Content Detection**
   - Use `data-testid` attributes for key content sections
   - Add route-specific identifiers (e.g., `data-inventory-page="true"`)
   - Include `data-content-ready` flags to signal when content has fully rendered

   ```tsx
   <div data-testid="inventory-module" data-content-ready="true">
     {/* Content here */}
   </div>
   ```

2. **Implement Proper Loading States**
   - Always include loading skeletons with appropriate height
   - Show loading states during data fetching
   - Include empty states for no-data scenarios

   ```tsx
   {isLoading ? (
     <Skeleton className="h-32 w-full" /> // Note the substantial height
   ) : (
     <YourComponent data={data} />
   )}
   ```

3. **Track Component Lifecycle**
   - Log component mount and unmount events
   - Track loading states with explicit state variables
   - Use refs to check if component is still mounted before state updates

   ```tsx
   const isMountedRef = useRef(true);
   
   useEffect(() => {
     console.log("Component mounted");
     return () => {
       isMountedRef.current = false;
       console.log("Component unmounted");
     };
   }, []);
   ```

### For Error Handling

1. **Use Error Boundaries at Multiple Levels**
   - Wrap route components in error boundaries
   - Add component-specific error boundaries for critical features
   - Provide helpful fallback UI

2. **Implement Safety Timeouts**
   - Add timeouts to prevent infinite loading
   - Force UI updates after safety delays
   - Log timeout events for debugging

   ```tsx
   useEffect(() => {
     const safetyTimeout = setTimeout(() => {
       if (isLoading) {
         console.warn("Safety timeout reached - forcing render");
         setIsLoading(false);
       }
     }, 3000);
     
     return () => clearTimeout(safetyTimeout);
   }, [isLoading]);
   ```

### For TypeScript

1. **Define Clear Interfaces**
   - Create explicit interfaces for component props
   - Document required vs optional props
   - Use union types for different states

   ```tsx
   interface PageContainerProps {
     title: string;
     children: React.ReactNode;
     isLoading?: boolean; // Optional
     error?: Error | null; // Optional
     onRetry?: () => void; // Optional
     contentType?: string; // Optional with default
   }
   ```

2. **Validate External Data**
   - Add runtime checks for data from APIs
   - Provide reasonable defaults
   - Use optional chaining and nullish coalescing

   ```tsx
   const { data } = useQuery(['key'], fetchData);
   const items = data?.items || [];
   ```

## Testing for Content Rendering

1. **Manual Testing Checklist**
   - Test direct navigation to each route
   - Test refresh while on the page
   - Test with network throttling
   - Test with cleared cache

2. **Automated Checks**
   - Use the `BlankScreenRecovery` component on all pages
   - Set up content validation in development environment
   - Log rendering metrics to the console

## Troubleshooting Guide

If blank pages are reported:

1. **Check Console Logs**
   - Look for errors during component mounting
   - Check for failed API requests
   - Verify content validation results

2. **Inspect DOM Structure**
   - Verify main content containers exist
   - Check if content has appropriate height
   - Look for empty containers

3. **Resolution Steps**
   - Implement proper loading and error states
   - Add content detection attributes
   - Ensure error boundaries catch and report issues

By following these best practices, we can significantly reduce the occurrence of blank/white pages and improve the user experience when issues do occur.
