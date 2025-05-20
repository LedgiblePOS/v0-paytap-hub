
import { PostgrestError } from '@supabase/supabase-js';
import { z } from 'zod';
import { AppError, ErrorType } from './errorHandler';

/**
 * Validates request data against a Zod schema
 * @param schema Schema to validate against
 * @param data Request data to validate
 * @throws {AppError} If validation fails
 */
export const validateRequest = <T>(schema: z.ZodType<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.reduce((acc, curr) => {
        const path = curr.path.join('.');
        acc[path] = curr.message;
        return acc;
      }, {} as Record<string, string>);
      
      throw new AppError(
        'Validation error: ' + Object.values(formattedErrors).join('; '),
        ErrorType.VALIDATION_ERROR
      );
    }
    
    throw new AppError('Invalid request data', ErrorType.VALIDATION_ERROR);
  }
};

/**
 * Type-safe error response structure
 */
export interface ApiErrorResponse {
  error: {
    message: string;
    code?: string;
    type: string;
    details?: Record<string, string>;
  };
}

/**
 * Formats API errors into a consistent response structure
 */
export const formatApiError = (error: unknown): ApiErrorResponse => {
  console.error('API Error:', error);
  
  // Handle AppError instances
  if (error instanceof AppError) {
    return {
      error: {
        message: error.message,
        type: error.type,
        details: error.context
      }
    };
  }
  
  // Handle Supabase errors
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const pgError = error as PostgrestError;
    return {
      error: {
        message: pgError.message || 'Database error occurred',
        code: pgError.code,
        type: ErrorType.SERVER_ERROR
      }
    };
  }
  
  // Handle unknown errors
  return {
    error: {
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      type: ErrorType.GENERIC_ERROR
    }
  };
};

/**
 * Database operation result handler with consistent error handling
 * @param operation Async database operation to perform
 * @returns Result of the operation or throws formatted error
 */
export const safeDbOperation = async <T>(
  operation: () => Promise<{ data: T | null; error: PostgrestError | null }>
): Promise<T> => {
  try {
    const { data, error } = await operation();
    
    if (error) {
      throw error;
    }
    
    if (data === null) {
      throw new AppError('No data returned from operation', ErrorType.NOT_FOUND);
    }
    
    return data;
  } catch (error) {
    throw error instanceof AppError ? error : new AppError(
      (error as Error).message || 'Database operation failed',
      ErrorType.SERVER_ERROR
    );
  }
};
