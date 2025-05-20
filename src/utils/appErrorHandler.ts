
/**
 * Error handler for the application
 * 
 * This file contains utilities for handling errors in a consistent way
 * across the application.
 */

// Error types
export enum ErrorType {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  UNKNOWN = 'unknown',
}

// Error severity levels
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

// Interface for structured error information
export interface AppError {
  message: string;
  type: ErrorType;
  severity: ErrorSeverity;
  originalError?: Error;
  context?: Record<string, any>;
}

// Add AppError class implementation to match the interface
export class AppError extends Error {
  public type: ErrorType;
  public severity: ErrorSeverity;
  public context?: Record<string, any>;
  
  constructor(
    message: string, 
    type: ErrorType = ErrorType.UNKNOWN, 
    severity: ErrorSeverity = ErrorSeverity.ERROR,
    originalError?: Error,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.severity = severity;
    this.context = context;
    
    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Create a structured app error
 */
export const createAppError = (
  message: string,
  type: ErrorType = ErrorType.UNKNOWN,
  severity: ErrorSeverity = ErrorSeverity.ERROR,
  originalError?: Error,
  context?: Record<string, any>
): AppError => {
  return new AppError(message, type, severity, originalError, context);
};

// Import the toast function directly
import { toast } from '@/hooks/use-toast';

/**
 * Handle an error by logging it and showing appropriate UI feedback
 */
export const handleError = (error: Error | AppError | string): void => {
  // Convert to AppError if it's not one already
  const appError = typeof error === 'string'
    ? createAppError(error)
    : (error as Error).message
    ? createAppError((error as Error).message, ErrorType.UNKNOWN, ErrorSeverity.ERROR, error as Error)
    : error as AppError;

  // Log error to console with additional context
  console.error('Application error:', {
    message: appError.message,
    type: appError.type,
    severity: appError.severity,
    originalError: appError.originalError,
    context: appError.context,
  });

  // Show user feedback via toast
  toast({
    title: getErrorTitle(appError),
    description: appError.message,
    variant: getErrorVariant(appError),
  });

  // Track error in monitoring system if available
  // trackError(appError);
};

/**
 * Get a user-friendly error title based on error type
 */
const getErrorTitle = (error: AppError): string => {
  switch (error.type) {
    case ErrorType.NETWORK:
      return 'Connection Error';
    case ErrorType.VALIDATION:
      return 'Validation Error';
    case ErrorType.AUTHENTICATION:
      return 'Authentication Error';
    case ErrorType.AUTHORIZATION:
      return 'Authorization Error';
    case ErrorType.NOT_FOUND:
      return 'Not Found';
    case ErrorType.SERVER:
      return 'Server Error';
    default:
      return 'Error';
  }
};

/**
 * Get the appropriate toast variant based on error severity
 */
const getErrorVariant = (error: AppError): "default" | "destructive" | "warning" => {
  switch (error.severity) {
    case ErrorSeverity.INFO:
      return 'default';
    case ErrorSeverity.WARNING:
      return 'warning';
    case ErrorSeverity.ERROR:
    case ErrorSeverity.CRITICAL:
      return 'destructive';
    default:
      return 'destructive';
  }
};

/**
 * Try to parse the error message from various error response formats
 */
export const parseErrorMessage = (error: any): string => {
  try {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return 'An unknown error occurred';
  } catch (e) {
    return 'An unknown error occurred';
  }
};
