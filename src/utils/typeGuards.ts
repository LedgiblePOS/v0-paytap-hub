
import { Json } from "@/types";

/**
 * Type guards for safely handling different data formats
 */

/**
 * Checks if features is an array or a string and returns a proper array
 */
export function ensureFeaturesArray(features: string | string[] | null | undefined): string[] {
  if (!features) {
    return [];
  }
  
  if (Array.isArray(features)) {
    return features;
  }
  
  if (typeof features === 'string') {
    try {
      // Try to parse if it's a JSON string
      const parsed = JSON.parse(features);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // If parsing fails, treat as a single item
      return [features];
    }
  }
  
  return [];
}

/**
 * Safely accesses potentially nested JSON property
 */
export function getJsonProperty<T>(data: Json | null | undefined, propertyPath: string, defaultValue: T): T {
  if (!data) return defaultValue;
  
  // Handle simple case first
  if (typeof data === 'object' && data !== null && propertyPath in data) {
    return (data as any)[propertyPath] as T;
  }
  
  // Handle nested path
  const parts = propertyPath.split('.');
  let current: any = data;
  
  for (const part of parts) {
    if (current === null || typeof current !== 'object' || !(part in current)) {
      return defaultValue;
    }
    current = current[part];
  }
  
  return current as T;
}

/**
 * Type guard for checking if value exists
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
