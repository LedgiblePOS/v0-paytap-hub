
/**
 * Error handling utilities for common type-related errors
 */

/**
 * Safely handle missing exports by providing fallback values
 * @param importPromise Promise from a dynamic import
 * @param exportName The name of the export we're trying to access
 * @param fallback Fallback value if export is missing
 */
export async function safeDynamicImport<T>(
  importPromise: Promise<any>,
  exportName: string,
  fallback: T
): Promise<T> {
  try {
    const module = await importPromise;
    return module[exportName] || fallback;
  } catch (error) {
    console.error(`Failed to import ${exportName}:`, error);
    return fallback;
  }
}

/**
 * Type guard to safely check if an object matches an interface
 * @param obj The object to check
 * @param requiredProps Array of required property names
 */
export function hasRequiredProperties<T>(obj: any, requiredProps: (keyof T)[]): obj is T {
  if (!obj || typeof obj !== 'object') return false;
  
  return requiredProps.every(prop => prop in obj);
}

/**
 * Safe type conversion with proper error handling
 * @param value Value to convert
 * @param converter Conversion function
 * @param fallback Fallback if conversion fails
 */
export function safeConvert<T, U>(
  value: T | null | undefined,
  converter: (val: T) => U,
  fallback: U
): U {
  if (value === null || value === undefined) {
    console.warn('Attempted to convert null/undefined value');
    return fallback;
  }
  
  try {
    return converter(value);
  } catch (error) {
    console.error('Conversion error:', error);
    return fallback;
  }
}

/**
 * Error handler for async operations with automatic retry
 * @param operation Async function to execute
 * @param retries Number of retries
 * @param onError Optional error handler
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  retries: number = 3,
  onError?: (error: any, attempt: number) => void
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (onError) {
        onError(error, attempt + 1);
      }
      await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, attempt)));
    }
  }
  
  throw lastError;
}

/**
 * Error boundary for type operations
 */
export function typeSafeCall<T, U>(
  fn: (arg: T) => U,
  arg: any,
  fallback: U
): U {
  try {
    return fn(arg as T);
  } catch (error) {
    console.error('Type error in function call:', error);
    return fallback;
  }
}

/**
 * Safe access to nested properties
 */
export function getNestedProperty<T>(obj: any, path: string, defaultValue: T): T {
  try {
    return path.split('.').reduce((prev, curr) => {
      return prev && prev[curr];
    }, obj) || defaultValue;
  } catch (error) {
    return defaultValue;
  }
}
