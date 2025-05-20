
import { MerchantCustomizationEntity, MerchantCustomizationModel } from '@/types/merchantCustomization';
import { transformSnakeToCamel, transformCamelToSnake } from '../transform';

export const toMerchantCustomizationModel = (entity: MerchantCustomizationEntity): MerchantCustomizationModel => {
  return transformSnakeToCamel(entity) as unknown as MerchantCustomizationModel;
};

export const toMerchantCustomizationEntity = (model: MerchantCustomizationModel): MerchantCustomizationEntity => {
  return transformCamelToSnake(model) as unknown as MerchantCustomizationEntity;
};

export const toMerchantCustomizationModels = (entities: MerchantCustomizationEntity[]): MerchantCustomizationModel[] => {
  return entities.map(toMerchantCustomizationModel);
};

export const toMerchantCustomizationEntities = (models: MerchantCustomizationModel[]): MerchantCustomizationEntity[] => {
  return models.map(toMerchantCustomizationEntity);
};

/**
 * Type guard to check if an object is in MerchantCustomizationEntity format
 */
export const isMerchantCustomizationEntity = (obj: any): obj is MerchantCustomizationEntity => {
  return obj && 
    typeof obj === 'object' && 
    'merchant_id' in obj;
};

/**
 * Type guard to check if an object is in MerchantCustomizationModel format
 */
export const isMerchantCustomizationModel = (obj: any): obj is MerchantCustomizationModel => {
  return obj && 
    typeof obj === 'object' && 
    'merchantId' in obj;
};
