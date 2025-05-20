
/**
 * Utility to help catch and fix common model/entity property access errors
 * This is primarily for demonstration and education purposes
 */

import { User, UserModel, Merchant, MerchantModel, Product, ProductModel } from "@/types";
import { toUserModel, toMerchantModel, toProductModel } from "./modelConversions";

// Warning function that logs to console when an incorrect property access is attempted
export function warnIncorrectPropertyAccess(
  obj: any,
  property: string,
  suggestedProperty: string,
  type: string
) {
  console.warn(
    `TypeScript Error Prevention: Attempted to access '${property}' on a ${type} object. ` +
    `Did you mean to use '${suggestedProperty}'? ` +
    `Consider using proper model conversion functions.`
  );
}

// Common property mappings between snake_case and camelCase
const PROPERTY_MAPPINGS = {
  // User properties
  first_name: "firstName",
  firstName: "first_name",
  last_name: "lastName",
  lastName: "last_name",
  
  // Merchant properties
  user_id: "userId",
  userId: "user_id",
  business_name: "businessName",
  businessName: "business_name",
  business_logo: "businessLogo",
  businessLogo: "business_logo",
  subscription_tier: "subscriptionTier",
  subscriptionTier: "subscription_tier",
  product_limit: "productLimit",
  productLimit: "product_limit",
  product_count: "productCount",
  productCount: "product_count",
  default_currency: "defaultCurrency",
  defaultCurrency: "default_currency",
  
  // Product properties
  merchant_id: "merchantId",
  merchantId: "merchant_id",
  in_stock: "inStock",
  inStock: "in_stock",
  image_url: "imageUrl",
  imageUrl: "image_url",
  category_id: "categoryId",
  categoryId: "category_id",
  
  // Common timestamp properties
  created_at: "createdAt",
  createdAt: "created_at",
  updated_at: "updatedAt",
  updatedAt: "updated_at"
};

// Helper to determine if an object is likely a model or entity
function isLikelyModel(obj: any): boolean {
  // Check for common model properties (camelCase)
  return 'firstName' in obj || 'userId' in obj || 'inStock' in obj || 'createdAt' in obj;
}

function isLikelyEntity(obj: any): boolean {
  // Check for common entity properties (snake_case)
  return 'first_name' in obj || 'user_id' in obj || 'in_stock' in obj || 'created_at' in obj;
}

// Create a proxy to warn about incorrect property access
export function createModelEntityProxy<T>(obj: T, name: string = 'object'): T {
  const isModel = isLikelyModel(obj);
  const isEntity = isLikelyEntity(obj);
  
  if (!isModel && !isEntity) {
    // Can't determine type, return as is
    return obj;
  }
  
  return new Proxy(obj as any, {
    get(target, prop) {
      const property = prop.toString();
      
      // If property exists, return it
      if (property in target) {
        return target[property];
      }
      
      // If property doesn't exist but has a mapping, warn and provide the correct version
      if (property in PROPERTY_MAPPINGS) {
        const suggestedProp = PROPERTY_MAPPINGS[property as keyof typeof PROPERTY_MAPPINGS];
        
        if (suggestedProp in target) {
          warnIncorrectPropertyAccess(
            obj, 
            property, 
            suggestedProp, 
            isModel ? "model" : "entity"
          );
          
          // Return the property value using the correct name
          return target[suggestedProp];
        }
      }
      
      // Property doesn't exist and no mapping found
      return undefined;
    }
  });
}

// Helper functions to auto-create proxies for common types
export function createUserProxy(obj: User | UserModel): User | UserModel {
  if ('first_name' in obj) {
    console.info('Auto-converting User entity to UserModel. Consider using toUserModel explicitly.');
    return toUserModel(obj as User);
  }
  return createModelEntityProxy(obj, 'User');
}

export function createMerchantProxy(obj: Merchant | MerchantModel): Merchant | MerchantModel {
  if ('business_name' in obj) {
    console.info('Auto-converting Merchant entity to MerchantModel. Consider using toMerchantModel explicitly.');
    return toMerchantModel(obj as Merchant);
  }
  return createModelEntityProxy(obj, 'Merchant');
}

export function createProductProxy(obj: Product | ProductModel): Product | ProductModel {
  if ('in_stock' in obj) {
    console.info('Auto-converting Product entity to ProductModel. Consider using toProductModel explicitly.');
    return toProductModel(obj as Product);
  }
  return createModelEntityProxy(obj, 'Product');
}

// Example usage in development environment:
/*
import { createUserProxy } from '@/utils/autoModelFix';

// Instead of accessing user.firstName directly (which would cause an error if user is an entity),
// wrap the user object in a proxy that will warn about incorrect access but still work
const safeUser = createUserProxy(user);
const name = safeUser.firstName; // Will work but warn if user is an entity
*/
