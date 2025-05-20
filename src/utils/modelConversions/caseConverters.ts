
/**
 * Utility functions for converting between snake_case and camelCase
 */

/**
 * Converts a snake_case string to camelCase
 * @param str The snake_case string to convert
 * @returns The camelCase version of the string
 */
export const toCamelCase = (str: string): string => {
  return str.replace(/([-_][a-z])/g, (group) => 
    group.toUpperCase()
      .replace('-', '')
      .replace('_', '')
  );
};

/**
 * Converts a camelCase string to snake_case
 * @param str The camelCase string to convert
 * @returns The snake_case version of the string
 */
export const toSnakeCase = (str: string): string => {
  return str.replace(/([A-Z])/g, (group) => 
    `_${group.toLowerCase()}`
  ).replace(/^_/, '');
};

/**
 * Recursively transforms all keys in an object from snake_case to camelCase
 * @param obj The object to transform
 * @returns A new object with camelCase keys
 */
export const objectToCamelCase = <T extends Record<string, any>>(obj: T): Record<string, any> => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(v => objectToCamelCase(v)) as any;
  }

  return Object.keys(obj).reduce((result, key) => {
    const camelKey = toCamelCase(key);
    const value = obj[key];
    result[camelKey] = 
      value !== null && typeof value === 'object' ? objectToCamelCase(value) : value;
    return result;
  }, {} as Record<string, any>);
};

/**
 * Recursively transforms all keys in an object from camelCase to snake_case
 * @param obj The object to transform
 * @returns A new object with snake_case keys
 */
export const objectToSnakeCase = <T extends Record<string, any>>(obj: T): Record<string, any> => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(v => objectToSnakeCase(v)) as any;
  }

  return Object.keys(obj).reduce((result, key) => {
    const snakeKey = toSnakeCase(key);
    const value = obj[key];
    result[snakeKey] = 
      value !== null && typeof value === 'object' ? objectToSnakeCase(value) : value;
    return result;
  }, {} as Record<string, any>);
};
