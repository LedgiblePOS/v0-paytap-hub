
/**
 * Central model conversion utilities
 * 
 * This file re-exports all model conversion functions for easy access
 * and serves as the primary entry point for model conversion utilities.
 */

// Export base conversion utilities
export * from '../modelConverter';

// Export specific converters
export * from './userConverter';
export * from './customerConverter';
export * from './transactionConverter';
export * from './metricsConverter';
export * from './merchantConverter';

// Import all individual converters
import userConverters from './userConverter';
import customerConverters from './customerConverter';
import transactionConverters from './transactionConverter';
import metricsConverters from './metricsConverter';
import merchantConverters from './merchantConverter';

// Export a combined object with all converters
const converters = {
  user: userConverters,
  customer: customerConverters,
  transaction: transactionConverters,
  metrics: metricsConverters,
  merchant: merchantConverters
};

export default converters;
