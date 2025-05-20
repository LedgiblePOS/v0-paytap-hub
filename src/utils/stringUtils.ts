
/**
 * Safely converts a string to lowercase, handling null/undefined values
 * @param value The value to convert to lowercase
 * @returns The lowercase string or empty string if input is null/undefined
 */
export const safeToLowerCase = (value: string | null | undefined): string => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.toLowerCase();
};

/**
 * Safely performs string operations with type checking to prevent runtime errors
 * @param value Any value that might be a string
 * @param operation Function to perform on the string
 * @returns Result of operation or default value if input is not a string
 */
export const safeStringOperation = <T>(
  value: unknown, 
  operation: (str: string) => T, 
  defaultValue: T
): T => {
  if (typeof value !== 'string') {
    return defaultValue;
  }
  return operation(value);
};

/**
 * Safely compares strings case-insensitively
 * @param str1 First string to compare
 * @param str2 Second string to compare
 * @returns true if strings match (ignoring case), false otherwise
 */
export const caseInsensitiveCompare = (str1: string | null | undefined, str2: string | null | undefined): boolean => {
  return safeToLowerCase(str1) === safeToLowerCase(str2);
};

/**
 * Safely checks if a string contains a substring (case-insensitive)
 * @param str The string to search in
 * @param searchTerm The substring to search for
 * @returns true if substring exists in string, false otherwise
 */
export const safeContainsIgnoreCase = (str: string | null | undefined, searchTerm: string | null | undefined): boolean => {
  if (!str || !searchTerm) return false;
  return safeToLowerCase(str).includes(safeToLowerCase(searchTerm));
};
