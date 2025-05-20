
/**
 * Utility function to retry API calls
 */
export const retryAsync = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (maxRetries <= 1) {
      throw error;
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryAsync(fn, maxRetries - 1, delay * 2);
  }
};

/**
 * Safe data fetcher with built-in error handling
 */
export const fetchWithErrorHandling = async <T>(
  fetchFn: () => Promise<T>,
  errorHandler?: (error: any) => void
): Promise<{ data: T | null; error: Error | null }> => {
  try {
    const data = await retryAsync(fetchFn);
    return { data, error: null };
  } catch (error) {
    if (errorHandler) {
      errorHandler(error);
    } else {
      console.error('API Error:', error);
    }
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
};

/**
 * Type guard to check if an object has expected properties
 */
export function hasRequiredProperties<T extends object>(
  obj: any, 
  properties: (keyof T)[]
): obj is T {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  
  return properties.every(prop => prop in obj);
}
