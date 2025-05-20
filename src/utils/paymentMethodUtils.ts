
import { PaymentMethod } from '@/types/enums';
import { PaymentMethod as ServicePaymentMethod } from '@/services/checkout/types';

/**
 * Converts UI PaymentMethod enum to service layer PaymentMethod string
 */
export function toServicePaymentMethod(method: PaymentMethod): ServicePaymentMethod {
  return method as unknown as ServicePaymentMethod;
}

/**
 * Converts service layer PaymentMethod string to UI PaymentMethod enum
 */
export function toUIPaymentMethod(method: ServicePaymentMethod): PaymentMethod {
  return method as unknown as PaymentMethod;
}

/**
 * Get a user-friendly display name for a payment method
 */
export function getPaymentMethodDisplayName(method: PaymentMethod): string {
  return method.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}
