
import React, { useEffect, useState } from 'react';
import { toMerchantModel, toProductModel, toCustomerModel, toTransactionModel, toUserModel, toCategoryModel, toSupplierModel, toMerchantVerificationModel, toSubscriptionPlanModel, toAuditLogModel } from './modelConversions';
import { User, Product, Customer, Transaction, Merchant, Category, Supplier, MerchantVerification, SubscriptionPlan, AuditLog } from '@/types';
import { UserModel, ProductModel, CustomerModel, TransactionModel, MerchantModel, CategoryModel, SupplierModel, MerchantVerificationModel, SubscriptionPlanModel, AuditLogModel } from '@/types';

/**
 * Type predicates to determine if an object is an entity or a model
 */
export function isUserEntity(obj: any): obj is User {
  return obj && typeof obj.first_name !== 'undefined';
}

export function isProductEntity(obj: any): obj is Product {
  return obj && typeof obj.merchant_id !== 'undefined';
}

export function isCustomerEntity(obj: any): obj is Customer {
  return obj && typeof obj.first_name !== 'undefined' && typeof obj.merchant_id !== 'undefined';
}

export function isTransactionEntity(obj: any): obj is Transaction {
  return obj && typeof obj.merchant_id !== 'undefined' && typeof obj.payment_method !== 'undefined';
}

/**
 * Global automatic conversion hook for entity to model
 */
export function useAutoConvert<T extends User | Product | Customer | Transaction | Merchant | Category | Supplier | MerchantVerification | SubscriptionPlan | AuditLog>(
  entity: T | T[] | null | undefined
): 
  T extends User ? UserModel | null :
  T extends Product ? ProductModel | null :
  T extends Customer ? CustomerModel | null :
  T extends Transaction ? TransactionModel | null :
  T extends Merchant ? MerchantModel | null :
  T extends Category ? CategoryModel | null :
  T extends Supplier ? SupplierModel | null :
  T extends MerchantVerification ? MerchantVerificationModel | null :
  T extends SubscriptionPlan ? SubscriptionPlanModel | null :
  T extends AuditLog ? AuditLogModel | null :
  null {
  
  const [model, setModel] = useState<any>(null);
  
  useEffect(() => {
    if (!entity) {
      setModel(null);
      return;
    }
    
    if (Array.isArray(entity)) {
      // Handle array conversion
      const convertedModels = entity.map(item => convertEntityToModel(item));
      setModel(convertedModels);
    } else {
      // Handle single item conversion
      setModel(convertEntityToModel(entity));
    }
  }, [entity]);
  
  return model;
}

/**
 * Detects entity type and applies appropriate conversion
 */
function convertEntityToModel(entity: any): any {
  if (!entity) return null;
  
  if (isUserEntity(entity)) {
    return toUserModel(entity);
  }
  
  if (isProductEntity(entity)) {
    return toProductModel(entity);
  }
  
  if (isCustomerEntity(entity)) {
    return toCustomerModel(entity);
  }
  
  if (isTransactionEntity(entity)) {
    return toTransactionModel(entity);
  }
  
  // Default fallback - try to guess based on properties
  if ('business_name' in entity) {
    return toMerchantModel(entity);
  }
  
  if ('verification_type' in entity) {
    return toMerchantVerificationModel(entity);
  }
  
  if ('product_limit' in entity && 'annual_price' in entity) {
    return toSubscriptionPlanModel(entity);
  }
  
  // If we can't determine the type, return as is
  console.warn('Unable to determine entity type for conversion:', entity);
  return entity;
}

/**
 * Higher-order component that automatically converts entity props to model props
 */
export function withAutoEntityConversion<P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  propsToConvert: string[] = []
): React.FC<P> {
  return (props: P) => {
    const convertedProps = { ...props } as any;
    
    for (const propName of propsToConvert) {
      if (propName in props) {
        const value = props[propName as keyof P];
        
        if (Array.isArray(value)) {
          // Convert array of entities
          convertedProps[propName] = value.map(convertEntityToModel);
        } else if (value && typeof value === 'object') {
          // Convert single entity
          convertedProps[propName] = convertEntityToModel(value);
        }
      }
    }
    
    return React.createElement(Component, convertedProps);
  };
}

/**
 * Helper function to ensure all data in your component is converted
 * This can be used inside service functions to ensure proper conversion
 */
export function ensureModels<T>(data: any, entityType: string): T {
  if (!data) return data;
  
  if (Array.isArray(data)) {
    return data.map(item => convertBasedOnType(item, entityType)) as unknown as T;
  }
  
  return convertBasedOnType(data, entityType) as unknown as T;
}

function convertBasedOnType(data: any, entityType: string): any {
  switch (entityType) {
    case 'user':
      return toUserModel(data);
    case 'product':
      return toProductModel(data);
    case 'customer':
      return toCustomerModel(data);
    case 'transaction':
      return toTransactionModel(data);
    case 'merchant':
      return toMerchantModel(data);
    case 'category':
      return toCategoryModel(data);
    case 'supplier':
      return toSupplierModel(data);
    case 'verification':
      return toMerchantVerificationModel(data);
    case 'subscription':
      return toSubscriptionPlanModel(data);
    case 'audit':
      return toAuditLogModel(data);
    default:
      console.warn(`Unknown entity type: ${entityType}`);
      return data;
  }
}
