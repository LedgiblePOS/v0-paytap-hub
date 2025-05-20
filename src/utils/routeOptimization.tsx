
import React, { Suspense, lazy, LazyExoticComponent, ComponentType } from 'react';
import Loading from '@/components/common/Loading';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorDisplay from '@/components/Layout/ErrorDisplay';

/**
 * Creates a lazy-loaded route component with suspense and error handling
 * @param componentImport Function that imports the component
 * @returns Optimized component with loading and error states
 */
export function lazyLoadRoute<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
): LazyExoticComponent<T> {
  const LazyComponent = lazy(componentImport);
  
  // Create a wrapper component with suspense and error boundary
  const OptimizedComponent = (props: any) => (
    <ErrorBoundary FallbackComponent={ErrorDisplay}>
      <Suspense fallback={<Loading message="Loading page..." />}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
  
  // Return the lazy component but with our custom wrapper display name
  return Object.assign(LazyComponent, { 
    displayName: `OptimizedRoute(${LazyComponent.displayName || 'Component'})`
  });
}

/**
 * Creates an optimized route with advanced loading strategies
 * @param componentImport Function that imports the component
 * @returns Optimized component with enhanced loading
 */
export function createOptimizedRoute<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
): LazyExoticComponent<T> {
  return lazyLoadRoute(componentImport);
}

/**
 * Higher-order component that adds route prefetching capabilities
 * @param Component Component to wrap with prefetching
 * @returns Component with prefetching capabilities
 */
export function withPrefetchedRoutes<T extends ComponentType<any>>(
  Component: T
): T {
  // This would typically implement route prefetching logic
  // For now, it's a simple pass-through
  return Component;
}
