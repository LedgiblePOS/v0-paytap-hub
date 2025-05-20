
import { PaymentMethod as EnumPaymentMethod } from '@/types/enums';
import { PaymentMethod as ServicePaymentMethod } from '@/services/checkout/types';

/**
 * Converts selector component PaymentMethod to service-level PaymentMethod
 */
export const toServicePaymentMethod = (method: EnumPaymentMethod): ServicePaymentMethod => {
  const mapping: Record<string, ServicePaymentMethod> = {
    'CARD': 'CARD',
    'CASH': 'CASH',
    'MOBILE': 'LYNK',
    'TAP_TO_PAY': 'TAP_TO_PAY',
    'CBDC': 'CBDC',
    'LYNK': 'LYNK',
    'APPLE_PAY': 'APPLE_PAY',
    'GOOGLE_PAY': 'GOOGLE_PAY',
    'WIPAY': 'WIPAY'
  };
  
  return mapping[method] || 'CARD';
};

/**
 * Converts service-level PaymentMethod to component-level PaymentMethod
 */
export const fromServicePaymentMethod = (method: ServicePaymentMethod): EnumPaymentMethod => {
  const mapping: Record<string, EnumPaymentMethod> = {
    'CARD': EnumPaymentMethod.CARD,
    'CASH': EnumPaymentMethod.CASH,
    'TAP_TO_PAY': EnumPaymentMethod.TAP_TO_PAY,
    'CBDC': EnumPaymentMethod.CBDC,
    'LYNK': EnumPaymentMethod.LYNK,
    'APPLE_PAY': EnumPaymentMethod.APPLE_PAY,
    'GOOGLE_PAY': EnumPaymentMethod.GOOGLE_PAY,
    'WIPAY': EnumPaymentMethod.WIPAY
  };
  
  return mapping[method] || EnumPaymentMethod.CARD;
};

/**
 * Converts enum PaymentMethod to component-level PaymentMethod
 */
export const fromEnumPaymentMethod = (method: EnumPaymentMethod): EnumPaymentMethod => {
  return method;
};

/**
 * Converts component-level PaymentMethod to enum PaymentMethod
 */
export const toEnumPaymentMethod = (method: string): EnumPaymentMethod => {
  if (Object.values(EnumPaymentMethod).includes(method as EnumPaymentMethod)) {
    return method as EnumPaymentMethod;
  }
  return EnumPaymentMethod.CARD;
};
