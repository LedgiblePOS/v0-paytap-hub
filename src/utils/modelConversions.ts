
// Utility file for model conversions
import { AuditLogEntity, AuditLogModel } from '@/types/audit';
import { toMerchantCustomizationModel, toMerchantCustomizationEntity } from './modelConversions/merchantCustomizationConverter';
import { toMerchantModel, toMerchantEntity, toMerchantModels, toMerchantEntities } from './modelConversions/merchantConverter';
import { toProductModel, toProductEntity, toProductModels, toProductEntities } from './modelConversions/productConverter';
import { 
  toTransactionModel, 
  toTransactionEntity, 
  toTransactionModels, 
  toTransactionEntities 
} from './modelConversions/transactionConverter';

export const toAuditLogModel = (entity: AuditLogEntity): AuditLogModel => {
  return {
    id: entity.id,
    userId: entity.user_id,
    action: entity.action,
    resource: entity.resource,
    resourceId: entity.resource_id,
    description: entity.description,
    severity: entity.severity,
    metadata: entity.metadata,
    createdAt: entity.created_at,
    createdBy: entity.created_by || entity.user_id,
    userEmail: entity.user_email || '',
    userName: entity.user_name || ''
  };
};

export const toAuditLogModels = (entities: AuditLogEntity[]): AuditLogModel[] => {
  return entities.map(toAuditLogModel);
};

// Re-export other conversion utilities for backward compatibility
export * from './modelConversions/userConverter';
export * from './modelConversions/merchantCustomizationConverter';
export * from './modelConversions/merchantConverter';
export * from './modelConversions/productConverter';
export * from './modelConversions/transactionConverter';
