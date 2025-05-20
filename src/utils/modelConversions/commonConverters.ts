
/**
 * Base conversion utilities for transforming between snake_case and camelCase
 */

/**
 * Converts snake_case to camelCase
 */
export function toCamelCase(str: string): string {
  return str.replace(/(_\w)/g, (match) => match[1].toUpperCase());
}

/**
 * Converts camelCase to snake_case
 */
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
