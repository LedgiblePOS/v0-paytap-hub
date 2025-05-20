
/**
 * First Atlantic Commerce (FAC) Payment Gateway Integration
 * This service handles payment processing for merchant subscription upgrades
 * 
 * This file is kept for backward compatibility, and re-exports from the new structure
 */

import { processPayment } from './fac/paymentProcessor';
import { processSubscriptionUpgrade } from './fac/subscriptionService';
import type { 
  CardDetails, 
  BillingAddress, 
  PaymentRequest, 
  PaymentResponse 
} from './fac/types';

// Re-export for backward compatibility
export { 
  processPayment,
  processSubscriptionUpgrade
};

// Re-export types
export type { 
  CardDetails, 
  BillingAddress, 
  PaymentRequest, 
  PaymentResponse 
};
