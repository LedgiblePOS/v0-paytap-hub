
/**
 * Central type definitions for the application
 * 
 * This file exports all types, interfaces, and enums for easy access.
 * It simplifies imports by providing a single entry point for type definitions.
 */

// Export enums
export * from './enums';

// Export entities
export * from './entities';

// Export models
export * from './models';

// Export specific domain models
export * from './user';
export * from './checkout';
export * from './merchant';
export * from './metrics';
export * from './pos'; // Add POS types export
export * from './product'; // Add explicit product export
export * from './transaction'; // Add explicit transaction export
export * from './audit'; // Add explicit audit log export
export * from './auditLog'; // Add additional audit log export

// Export common utility types
export * from './common';

// Add missing types
export type {
  Customer,
  CustomerModel,
  CartItemType,
  ProductEntity,
  ProductModel,
  TransactionEntity,
  TransactionModel,
  MerchantEntity,
  MerchantModel
} from './models';
