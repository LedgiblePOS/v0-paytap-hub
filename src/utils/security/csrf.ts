
/**
 * CSRF Protection Utilities
 */

/**
 * Generate a CSRF token
 */
export const generateCSRFToken = (): string => {
  // Use crypto API for secure random token generation
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  
  // Fallback for browsers without crypto.randomUUID
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Store CSRF token in sessionStorage
 */
export const storeCSRFToken = (token: string): void => {
  sessionStorage.setItem('csrf_token', token);
};

/**
 * Retrieve CSRF token from sessionStorage
 */
export const getCSRFToken = (): string | null => {
  return sessionStorage.getItem('csrf_token');
};

/**
 * Validate CSRF token against stored token
 */
export const validateCSRFToken = (token: string | null, storedToken: string | null): boolean => {
  if (!token || !storedToken) return false;
  return token === storedToken;
};

/**
 * Add CSRF token to request headers
 */
export const addCSRFToHeaders = (headers: Record<string, string> = {}): Record<string, string> => {
  const token = getCSRFToken();
  
  // If no token exists, generate one and store it
  if (!token) {
    const newToken = generateCSRFToken();
    storeCSRFToken(newToken);
    return {
      ...headers,
      'X-CSRF-Token': newToken
    };
  }
  
  return {
    ...headers,
    'X-CSRF-Token': token
  };
};

/**
 * Initialize CSRF protection
 * Call this on app initialization
 */
export const initCSRFProtection = (): void => {
  if (!getCSRFToken()) {
    const newToken = generateCSRFToken();
    storeCSRFToken(newToken);
  }
};
