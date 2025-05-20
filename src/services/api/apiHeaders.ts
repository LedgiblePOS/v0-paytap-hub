
/**
 * API Headers Configuration
 * 
 * Defines security headers and CORS configurations for API requests
 */

// Security headers for all API requests
export const securityHeaders: Record<string, string> = {
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Enable browser XSS protection
  'X-XSS-Protection': '1; mode=block',
  
  // Strict transport security
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
};

// CORS headers for API requests
export const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*', // This should be more restrictive in production
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With'
};

// Set default fetch options
export const defaultFetchOptions: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
};

// Function to get authenticated fetch options
export const getAuthenticatedFetchOptions = (
  token: string | null,
  options: RequestInit = {}
): RequestInit => {
  return {
    ...defaultFetchOptions,
    ...options,
    headers: {
      ...defaultFetchOptions.headers,
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  };
};
