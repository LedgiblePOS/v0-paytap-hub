
import { AuditLogData, AuditLogModel } from '@/types/auditLog';

/**
 * Converts database audit log data to UI model
 */
export const toAuditLogModel = (data: AuditLogData): AuditLogModel => {
  return {
    id: data.id,
    userId: data.user_id,
    action: data.action,
    resource: data.resource,
    resourceId: data.resource_id,
    description: data.description,
    createdAt: data.created_at,
    ipAddress: data.ip_address,
    userAgent: data.user_agent
  };
};

/**
 * Converts UI audit log model to database format
 */
export const toAuditLogData = (model: AuditLogModel): AuditLogData => {
  return {
    id: model.id,
    user_id: model.userId,
    action: model.action,
    resource: model.resource,
    resource_id: model.resourceId,
    description: model.description,
    created_at: model.createdAt,
    ip_address: model.ipAddress,
    user_agent: model.userAgent
  };
};

/**
 * Batch conversion functions
 */
export const toAuditLogModels = (dataArray: AuditLogData[]): AuditLogModel[] => {
  return dataArray.map(toAuditLogModel);
};

export const toAuditLogDataArray = (modelArray: AuditLogModel[]): AuditLogData[] => {
  return modelArray.map(toAuditLogData);
};

/**
 * Type guard to determine if an object is an AuditLogModel
 */
export const isAuditLogModel = (log: any): log is AuditLogModel => {
  return log && 
    typeof log === 'object' && 
    'userId' in log && 
    'createdAt' in log;
};

/**
 * Type guard to determine if an object is an AuditLogData
 */
export const isAuditLogData = (log: any): log is AuditLogData => {
  return log && 
    typeof log === 'object' && 
    'user_id' in log && 
    'created_at' in log;
};
