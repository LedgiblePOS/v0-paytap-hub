
import * as z from 'zod';

/**
 * General-purpose validation utilities for form data and API responses
 */

/**
 * Validates an email address
 */
export const isValidEmail = (email: string): boolean => {
  const emailSchema = z.string().email();
  const result = emailSchema.safeParse(email);
  return result.success;
};

/**
 * Validates a UUID string
 */
export const isValidUUID = (id: string): boolean => {
  const uuidSchema = z.string().uuid();
  const result = uuidSchema.safeParse(id);
  return result.success;
};

/**
 * Validates that a number is positive
 */
export const isPositiveNumber = (value: number): boolean => {
  const numberSchema = z.number().positive();
  const result = numberSchema.safeParse(value);
  return result.success;
};

/**
 * Validates a date string
 */
export const isValidDateString = (dateStr: string): boolean => {
  const dateSchema = z.string().refine((val) => !isNaN(Date.parse(val)));
  const result = dateSchema.safeParse(dateStr);
  return result.success;
};

/**
 * Validates required fields in an object
 * @param obj The object to validate
 * @param requiredFields Array of field names that should be present and non-empty
 * @returns Array of missing field names, empty if all required fields are present
 */
export const validateRequiredFields = (
  obj: Record<string, any>, 
  requiredFields: string[]
): string[] => {
  const missingFields: string[] = [];
  
  requiredFields.forEach(field => {
    const value = obj[field];
    
    if (value === undefined || value === null || value === '') {
      missingFields.push(field);
    }
  });
  
  return missingFields;
};

/**
 * Creates a validation result object
 */
export const createValidationResult = (
  isValid: boolean, 
  errors: Record<string, string> = {}
) => ({
  isValid,
  errors,
  hasErrors: Object.keys(errors).length > 0
});

/**
 * Validates data against a Zod schema and returns formatted errors
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns Validation result with errors object
 */
export const validateWithZod = <T>(schema: z.ZodType<T>, data: unknown) => {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return {
      isValid: true,
      data: result.data,
      errors: {},
      hasErrors: false
    };
  }
  
  // Format errors into a more usable structure
  const formattedErrors: Record<string, string> = {};
  
  result.error.errors.forEach((err) => {
    const path = err.path.join('.');
    formattedErrors[path] = err.message;
  });
  
  return {
    isValid: false,
    data: null,
    errors: formattedErrors,
    hasErrors: true
  };
};
