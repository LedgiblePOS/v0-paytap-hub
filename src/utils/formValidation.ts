
import * as z from 'zod';
import { validateWithZod } from './validationUtils';

/**
 * Form validation helper for consistent validation across the application
 * @param schema Zod schema for validation
 * @param data Data to validate
 * @param onSuccess Function to call with validated data
 * @param onError Function to call with error object
 */
export const validateForm = <T>(
  schema: z.ZodType<T>,
  data: unknown,
  onSuccess: (validData: T) => void,
  onError: (errors: Record<string, string>) => void
): void => {
  const result = validateWithZod(schema, data);
  
  if (result.isValid) {
    onSuccess(result.data as T);
  } else {
    onError(result.errors);
  }
};

/**
 * Common validation patterns that can be reused across forms
 */
export const commonValidations = {
  // User related validations
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\+?[0-9\s\-()]+$/, 'Please enter a valid phone number'),
  
  // Business related validations
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  
  // Financial validations
  price: z.union([
    z.number().nonnegative('Price must be a positive number'),
    z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid price').transform(Number)
  ]),
  percentage: z.union([
    z.number().min(0).max(100, 'Percentage must be between 0 and 100'),
    z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid percentage').transform(Number)
  ]),
  
  // Date validations
  pastDate: z.date().max(new Date(), 'Date cannot be in the future'),
  futureDate: z.date().min(new Date(), 'Date must be in the future'),
  
  // General validations
  nonEmptyString: z.string().min(1, 'This field cannot be empty'),
  positiveNumber: z.number().positive('Must be greater than zero'),
  uuid: z.string().uuid('Invalid ID format')
};

/**
 * Helper to create consistent form schema with typesafe errors
 */
export function createFormSchema<T extends z.ZodRawShape>(schema: T) {
  return z.object(schema);
}
