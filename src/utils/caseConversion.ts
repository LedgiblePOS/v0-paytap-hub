/**
 * Converts a string from snake_case to camelCase
 */
export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (m, w) => w.toUpperCase());
};

/**
 * Converts a string from camelCase to snake_case
 */
export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

/**
 * Recursively converts object keys from snake_case to camelCase
 */
export const convertObjectToCamelCase = <T extends Record<string, any>>(obj: T): Record<string, any> => {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }
  
  const camelCaseObj: Record<string, any> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = snakeToCamel(key);
      const value = obj[key];
      
      if (value === null || typeof value !== 'object') {
        camelCaseObj[camelKey] = value;
      } else if (Array.isArray(value)) {
        camelCaseObj[camelKey] = value.map(item => 
          typeof item === 'object' && item !== null 
            ? convertObjectToCamelCase(item) 
            : item
        );
      } else {
        camelCaseObj[camelKey] = convertObjectToCamelCase(value);
      }
      
      // Keep original key too for backward compatibility in critical objects
      if (key !== camelKey && 
          (key === 'first_name' || key === 'last_name' || key === 'is_active' || 
           key === 'merchant_id' || key === 'created_at' || key === 'updated_at')) {
        camelCaseObj[key] = obj[key];
      }
    }
  }
  
  return camelCaseObj;
};

/**
 * Recursively converts object keys from camelCase to snake_case
 */
export const convertObjectToSnakeCase = <T extends Record<string, any>>(obj: T): Record<string, any> => {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }
  
  const snakeCaseObj: Record<string, any> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Skip if the key already exists in snake_case format
      if (key.includes('_')) {
        snakeCaseObj[key] = obj[key];
        continue;
      }
      
      const snakeKey = camelToSnake(key);
      const value = obj[key];
      
      if (value === null || typeof value !== 'object') {
        snakeCaseObj[snakeKey] = value;
      } else if (Array.isArray(value)) {
        snakeCaseObj[snakeKey] = value.map(item => 
          typeof item === 'object' && item !== null 
            ? convertObjectToSnakeCase(item) 
            : item
        );
      } else {
        snakeCaseObj[snakeKey] = convertObjectToSnakeCase(value);
      }
      
      // Keep original key too for backward compatibility in critical objects
      if (key !== snakeKey && 
          (key === 'firstName' || key === 'lastName' || key === 'isActive' || 
           key === 'merchantId' || key === 'createdAt' || key === 'updatedAt')) {
        snakeCaseObj[key] = obj[key];
      }
    }
  }
  
  return snakeCaseObj;
};
