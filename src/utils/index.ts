
/**
 * Utility function for class name conditionals
 */
export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Convert snake_case database fields to camelCase for UI components
 */
export function snakeToCamel(obj: Record<string, any>): Record<string, any> {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(o => snakeToCamel(o));
  }

  return Object.keys(obj).reduce((result, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    const value = obj[key];
    
    result[camelKey] = (value !== null && typeof value === 'object') 
      ? snakeToCamel(value) 
      : value;
      
    return result;
  }, {} as Record<string, any>);
}

/**
 * Convert camelCase UI fields to snake_case for database
 */
export function camelToSnake(obj: Record<string, any>): Record<string, any> {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(o => camelToSnake(o));
  }

  return Object.keys(obj).reduce((result, key) => {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    const value = obj[key];
    
    result[snakeKey] = (value !== null && typeof value === 'object') 
      ? camelToSnake(value) 
      : value;
      
    return result;
  }, {} as Record<string, any>);
}
