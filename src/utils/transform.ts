
/**
 * Core transformation utilities for converting between snake_case and camelCase
 */
import { SnakeToCamelObject, CamelToSnakeObject } from './typeUtils';

/**
 * Converts a snake_case string to camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Converts a camelCase string to snake_case
 */
export function camelToSnake(str: string): string {
  return str.replace(/([A-Z])/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Deep transforms an object's keys from snake_case to camelCase
 */
export function transformSnakeToCamel<T extends Record<string, any>>(obj: T): SnakeToCamelObject<T> {
  if (!obj || typeof obj !== 'object') {
    return obj as any;
  }

  if (Array.isArray(obj)) {
    return obj.map(transformSnakeToCamel) as any;
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    const camelKey = snakeToCamel(key);
    
    // Recursively transform nested objects and arrays
    const transformedValue = 
      value !== null && typeof value === 'object' 
        ? transformSnakeToCamel(value) 
        : value;
    
    acc[camelKey as keyof SnakeToCamelObject<T>] = transformedValue;
    return acc;
  }, {} as SnakeToCamelObject<T>);
}

/**
 * Deep transforms an object's keys from camelCase to snake_case
 */
export function transformCamelToSnake<T extends Record<string, any>>(obj: T): CamelToSnakeObject<T> {
  if (!obj || typeof obj !== 'object') {
    return obj as any;
  }

  if (Array.isArray(obj)) {
    return obj.map(transformCamelToSnake) as any;
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    const snakeKey = camelToSnake(key);
    
    // Recursively transform nested objects and arrays
    const transformedValue = 
      value !== null && typeof value === 'object' 
        ? transformCamelToSnake(value) 
        : value;
    
    acc[snakeKey as keyof CamelToSnakeObject<T>] = transformedValue;
    return acc;
  }, {} as CamelToSnakeObject<T>);
}

/**
 * Type guard to check if an object uses snake_case keys
 */
export function isSnakeCaseObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).some(key => key.includes('_'));
}

/**
 * Type guard to check if an object uses camelCase keys
 */
export function isCamelCaseObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).some(key => /[A-Z]/.test(key) && !key.includes('_'));
}

/**
 * Auto-transforms an object based on detected case style
 */
export function autoTransform<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (isSnakeCaseObject(obj)) {
    return transformSnakeToCamel(obj) as unknown as T;
  }

  if (isCamelCaseObject(obj)) {
    return transformCamelToSnake(obj) as unknown as T;
  }

  return obj;
}
