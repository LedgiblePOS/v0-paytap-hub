
import { 
  useQuery, 
  UseQueryOptions, 
  UseQueryResult 
} from '@tanstack/react-query';
import { useCallback } from 'react';
import performanceMonitoringService from '@/services/monitoring/performanceMonitoringService';

/**
 * An optimized version of useQuery that includes performance monitoring
 * and enhanced caching strategies
 */
export function useOptimizedQuery<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends Array<unknown> = unknown[]
>(
  queryKey: TQueryKey,
  queryFn: () => Promise<TQueryFnData>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, TError> & { 
  refetchOptimized: () => Promise<any>,
  getPerformanceMetrics: () => { fetchDuration: number | null }
} {
  // Track fetch performance
  let fetchStartTime = 0;
  let fetchDuration = 0;

  const monitoredQueryFn = useCallback(async () => {
    // Mark the start time
    fetchStartTime = performance.now();
    performanceMonitoringService.mark(`query-${queryKey[0]}`);
    
    try {
      // Execute the query function
      const result = await queryFn();
      
      // Calculate and record duration
      fetchDuration = performance.now() - fetchStartTime;
      performanceMonitoringService.measure(`query-${queryKey[0]}`, `query-${queryKey[0]}`);
      
      return result;
    } catch (error) {
      // Also record duration for failed queries
      fetchDuration = performance.now() - fetchStartTime;
      throw error;
    }
  }, [queryFn, queryKey]);

  // Set default cache configurations
  const defaultOptions = {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    ...options
  };

  // Use the React Query hook with our monitored function
  const queryResult = useQuery({
    queryKey,
    queryFn: monitoredQueryFn,
    ...defaultOptions
  });

  // Custom optimized refetch function with performance tracking
  const refetchOptimized = useCallback(async () => {
    performanceMonitoringService.mark(`refetch-${queryKey[0]}`);
    
    try {
      const result = await queryResult.refetch();
      
      performanceMonitoringService.measure(`refetch-${queryKey[0]}`, `refetch-${queryKey[0]}`);
      
      return result;
    } catch (error) {
      console.error(`Error refetching ${queryKey[0]}:`, error);
      throw error;
    }
  }, [queryResult, queryKey]);

  // Get performance metrics
  const getPerformanceMetrics = useCallback(() => {
    return {
      fetchDuration: fetchDuration || null
    };
  }, [fetchDuration]);

  return {
    ...queryResult,
    refetchOptimized,
    getPerformanceMetrics
  };
}
