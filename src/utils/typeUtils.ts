
/**
 * Utility types for converting between snake_case and camelCase
 */

// Convert string from snake_case to camelCase
export type SnakeToCamel<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamel<U>>}`
  : S;

// Convert string from camelCase to snake_case
export type CamelToSnake<S extends string> = S extends `${infer T}${infer U}`
  ? T extends Capitalize<T>
    ? `_${Lowercase<T>}${CamelToSnake<U>}`
    : `${T}${CamelToSnake<U>}`
  : S;

// Convert object keys from snake_case to camelCase
export type SnakeToCamelObject<T> = {
  [K in keyof T as K extends string ? SnakeToCamel<K> : K]: T[K] extends Record<string, any>
    ? SnakeToCamelObject<T[K]>
    : T[K] extends Array<Record<string, any>>
    ? SnakeToCamelObject<T[K][number]>[]
    : T[K];
};

// Convert object keys from camelCase to snake_case
export type CamelToSnakeObject<T> = {
  [K in keyof T as K extends string ? CamelToSnake<K> : K]: T[K] extends Record<string, any>
    ? CamelToSnakeObject<T[K]>
    : T[K] extends Array<Record<string, any>>
    ? CamelToSnakeObject<T[K][number]>[]
    : T[K];
};
