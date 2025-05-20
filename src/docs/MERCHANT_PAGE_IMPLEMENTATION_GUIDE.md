
# Merchant Page Implementation Guide

This guide provides instructions for implementing merchant pages that avoid white screen issues.

## Required Pattern for Every Merchant Page

Follow this pattern when implementing any merchant module page:

### 1. Component Structure

```tsx
// src/pages/YourModule/Index.tsx
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/common/PageContainer';
import { useNavigationDebugger } from '@/utils/navigationDebugger';
import ErrorBoundary from '@/utils/errorBoundary';
import { markComponentForDetection } from '@/utils/routeContentValidator';

const YourModulePage = () => {
  // Add debugging - helps trace white page issues
  useNavigationDebugger('YourModule');
  
  // Essential state management
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState(null);
  
  // Reference to mark component for detection
  const contentRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Mark component for detection once it's mounted
    if (contentRef.current) {
      markComponentForDetection('YourModule', contentRef.current);
    }
    
    // Add safety timeout - prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 second timeout
    
    // Fetch your data
    const fetchData = async () => {
      try {
        // Your data fetching logic
        setData(/* your data */);
      } catch (err) {
        console.error('Error in YourModule:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    return () => clearTimeout(loadingTimeout);
  }, []);
  
  return (
    <ErrorBoundary>
      <PageContainer 
        title="Your Module Title" 
        isLoading={isLoading}
        error={error}
        onRetry={() => setIsLoading(true)} // Implement retry logic
        renderState={isLoading ? 'loading' : error ? 'error' : 'ready'}
      >
        <div 
          ref={contentRef}
          className="your-module-content" 
          data-testid="your-module-content"
        >
          {/* Your content here */}
          {data ? (
            <div>Your content...</div>
          ) : (
            <div>No data available</div>
          )}
        </div>
      </PageContainer>
    </ErrorBoundary>
  );
};

export default YourModulePage;
```

### 2. Testing Requirements

Before committing new page code, verify:

1. The page loads correctly with and without data
2. The loading state displays properly
3. Error handling works when data fetching fails
4. Console logs for component mounting and unmounting appear
5. The page has explicit data-testid attributes for automated detection

### 3. Error Prevention Checklist

For every merchant page, implement:

- [ ] `useNavigationDebugger` hook
- [ ] Explicit loading states with timeouts
- [ ] Error states with retry functionality
- [ ] Content references with data-testid attributes
- [ ] Safety timeouts for data fetching operations
- [ ] Debug logging for component lifecycle
- [ ] Defensive rendering (null checks, default values)

By following this pattern consistently across all merchant modules, we can prevent white page issues and improve error detection and recovery.
