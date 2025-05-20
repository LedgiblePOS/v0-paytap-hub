
import { isUserData, isUserModel, toUserData, toUserModel } from './modelConversions/userConverter';
import { isMerchantEntity, isMerchantModel, toMerchantEntity, toMerchantModel } from './modelConversions/merchantConverter';
import { isMerchantCustomizationEntity, isMerchantCustomizationModel, toMerchantCustomizationEntity, toMerchantCustomizationModel } from './modelConversions/merchantCustomizationConverter';
import { User, UserData } from '@/types/user';
import { MerchantEntity, MerchantModel } from '@/types/merchant';
import { MerchantCustomizationEntity, MerchantCustomizationModel } from '@/types/merchantCustomization';

/**
 * Universal type converter that automatically determines the source type and converts accordingly
 * @param source The source object to convert (can be entity or model)
 * @returns Converted object (entity to model or model to entity)
 */
export function convertType<T>(source: any): T {
  if (!source) return null as unknown as T;
  
  // Check source type and convert accordingly
  if (isUserData(source)) {
    return toUserModel(source) as unknown as T;
  } else if (isUserModel(source)) {
    return toUserData(source) as unknown as T;
  } else if (isMerchantEntity(source)) {
    return toMerchantModel(source) as unknown as T;
  } else if (isMerchantModel(source)) {
    return toMerchantEntity(source) as unknown as T;
  } else if (isMerchantCustomizationEntity(source)) {
    return toMerchantCustomizationModel(source) as unknown as T;
  } else if (isMerchantCustomizationModel(source)) {
    return toMerchantCustomizationEntity(source) as unknown as T;
  }
  
  // Return original if type not recognized
  return source as T;
}

/**
 * Converts an array of objects from one type to another
 * @param sources Array of source objects
 * @returns Converted array
 */
export function convertTypes<T>(sources: any[]): T[] {
  if (!sources || !Array.isArray(sources)) return [] as T[];
  return sources.map(source => convertType<T>(source));
}

/**
 * Hook to ensure proper type conversion in components
 */
export function useEntityToModel<Entity, Model>(entity: Entity | null): Model | null {
  if (!entity) return null;
  return convertType<Model>(entity);
}

/**
 * Ensures that object is in model format for component use
 * @param data Data that could be in entity or model format
 * @returns Data guaranteed to be in model format
 */
export function ensureModel<T extends User | MerchantModel | MerchantCustomizationModel>(data: any): T | null {
  if (!data) return null;
  
  // User conversion
  if (isUserData(data)) {
    return toUserModel(data) as unknown as T;
  } else if (isUserModel(data)) {
    return data as T;
  }
  
  // Merchant conversion
  if (isMerchantEntity(data)) {
    return toMerchantModel(data) as unknown as T;
  } else if (isMerchantModel(data)) {
    return data as T;
  }
  
  // Merchant customization conversion
  if (isMerchantCustomizationEntity(data)) {
    return toMerchantCustomizationModel(data) as unknown as T;
  } else if (isMerchantCustomizationModel(data)) {
    return data as T;
  }
  
  // If type not recognized, return as is
  return data as T;
}

/**
 * Converts data to entity format for API/database operations
 */
export function ensureEntity<T extends UserData | MerchantEntity | MerchantCustomizationEntity>(data: any): T | null {
  if (!data) return null;
  
  // User conversion
  if (isUserModel(data)) {
    return toUserData(data) as unknown as T;
  } else if (isUserData(data)) {
    return data as T;
  }
  
  // Merchant conversion
  if (isMerchantModel(data)) {
    return toMerchantEntity(data) as unknown as T;
  } else if (isMerchantEntity(data)) {
    return data as T;
  }
  
  // Merchant customization conversion
  if (isMerchantCustomizationModel(data)) {
    return toMerchantCustomizationEntity(data) as unknown as T;
  } else if (isMerchantCustomizationEntity(data)) {
    return data as T;
  }
  
  // If type not recognized, return as is
  return data as T;
}
