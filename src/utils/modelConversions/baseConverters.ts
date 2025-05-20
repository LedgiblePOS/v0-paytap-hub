
/**
 * Utility functions for converting between snake_case and camelCase
 */

/**
 * Convert camelCase to snake_case
 */
export function toSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, (g) => `_${g[0].toLowerCase()}`);
}

/**
 * Convert snake_case to camelCase
 */
export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Convert object keys from camelCase to snake_case
 */
export function objectToCamelCase(obj: Record<string, any>): Record<string, any> {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(objectToCamelCase);
  }

  const result: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    const camelKey = toCamelCase(key);
    result[camelKey] = typeof obj[key] === 'object' ? objectToCamelCase(obj[key]) : obj[key];
  });
  
  return result;
}

/**
 * Convert object keys from snake_case to camelCase
 */
export function objectToSnakeCase(obj: Record<string, any>): Record<string, any> {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(objectToSnakeCase);
  }

  const result: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    const snakeKey = toSnakeCase(key);
    result[snakeKey] = typeof obj[key] === 'object' ? objectToSnakeCase(obj[key]) : obj[key];
  });
  
  return result;
}
