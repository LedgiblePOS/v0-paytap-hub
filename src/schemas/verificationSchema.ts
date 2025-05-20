
import { z } from 'zod';

/**
 * Schema for merchant verification data
 */
export const verificationSchema = z.object({
  businessName: z.string()
    .min(2, { message: "Business name must be at least 2 characters" })
    .max(100, { message: "Business name must be 100 characters or less" }),
  
  businessAddress: z.object({
    street: z.string().min(3, { message: "Street address is required" }),
    city: z.string().min(1, { message: "City is required" }),
    state: z.string().min(1, { message: "State is required" }),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, { message: "Invalid ZIP code format" }),
    country: z.string().min(2, { message: "Country is required" })
  }),
  
  contactInformation: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().regex(/^\+?[0-9]{10,15}$/, { message: "Invalid phone number format" }),
    website: z.string().url({ message: "Invalid website URL" }).optional().nullable()
  }),
  
  businessType: z.enum(['sole_proprietorship', 'partnership', 'llc', 'corporation', 'other'], {
    errorMap: () => ({ message: "Please select a valid business type" })
  }),
  
  taxIdentifier: z.string()
    .regex(/^[0-9]{2}-[0-9]{7}$|^\d{9}$/, { message: "Invalid tax ID format" })
    .optional(),
    
  documents: z.array(
    z.object({
      type: z.enum(['business_license', 'tax_certificate', 'identity', 'other']),
      fileUrl: z.string().url({ message: "Invalid document URL" }),
      fileName: z.string(),
      uploadDate: z.string().datetime({ message: "Invalid date format" })
    })
  ).min(1, { message: "At least one document is required" }),
  
  verificationNotes: z.string().max(500).optional(),
  
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
});

export type VerificationFormData = z.infer<typeof verificationSchema>;

/**
 * Schema for verification rejection form
 */
export const rejectionSchema = z.object({
  reason: z.string()
    .min(10, { message: "Rejection reason must be at least 10 characters" })
    .max(500, { message: "Rejection reason must be 500 characters or less" }),
  
  category: z.enum(['incomplete_information', 'invalid_documents', 'business_policy_violation', 'suspicious_activity', 'other'], {
    errorMap: () => ({ message: "Please select a valid rejection category" })
  }),
  
  contactInstructions: z.string().max(500).optional(),
  
  allowResubmission: z.boolean().default(true)
});

export type RejectionFormData = z.infer<typeof rejectionSchema>;
