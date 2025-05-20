
/**
 * Input validation and sanitization utilities
 */

// Regular expressions for validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;
const NAME_REGEX = /^[a-zA-Z\s'\-]{2,50}$/;
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;
const URL_REGEX = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
const ALPHA_NUMERIC_REGEX = /^[a-zA-Z0-9\s\-_,.]+$/;

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

/**
 * Validate username format
 */
export const isValidUsername = (username: string): boolean => {
  return USERNAME_REGEX.test(username);
};

/**
 * Validate name format (first name, last name)
 */
export const isValidName = (name: string): boolean => {
  return NAME_REGEX.test(name);
};

/**
 * Validate phone number format
 */
export const isValidPhone = (phone: string): boolean => {
  return PHONE_REGEX.test(phone);
};

/**
 * Validate URL format
 */
export const isValidURL = (url: string): boolean => {
  return URL_REGEX.test(url);
};

/**
 * Sanitize text input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  // Replace potentially dangerous characters
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate that input only contains allowed characters
 */
export const hasOnlySafeCharacters = (input: string): boolean => {
  return ALPHA_NUMERIC_REGEX.test(input);
};

/**
 * Safely parse JSON with error handling
 */
export const safeJSONParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return fallback;
  }
};

/**
 * Remove any potential SQL injection patterns
 */
export const removeSQLInjectionPatterns = (input: string): string => {
  return input
    .replace(/'/g, "''") // Escape single quotes
    .replace(/;/g, '') // Remove semicolons
    .replace(/--/g, '') // Remove comment markers
    .replace(/\/\*/g, '') // Remove block comment start
    .replace(/\*\//g, '') // Remove block comment end
    .replace(/xp_/gi, '') // Remove potential for extended stored procedures
    .replace(/EXEC\s+/gi, '') // Remove EXEC statements
    .replace(/EXECUTE\s+/gi, '') // Remove EXECUTE statements
    .replace(/SELECT\s+/gi, '') // Remove SELECT statements
    .replace(/INSERT\s+/gi, '') // Remove INSERT statements
    .replace(/UPDATE\s+/gi, '') // Remove UPDATE statements
    .replace(/DELETE\s+/gi, '') // Remove DELETE statements
    .replace(/DROP\s+/gi, '') // Remove DROP statements
    .replace(/UNION\s+/gi, ''); // Remove UNION statements
};

/**
 * Validate input against a maximum length
 */
export const isWithinMaxLength = (input: string, maxLength: number): boolean => {
  return input.length <= maxLength;
};
