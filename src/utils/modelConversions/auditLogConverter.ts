
import { AuditLogEntity, AuditLogModel } from '@/types/audit';

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

export const toAuditLogEntity = (model: AuditLogModel): AuditLogEntity => {
  return {
    id: model.id,
    user_id: model.userId,
    action: model.action,
    resource: model.resource,
    resource_id: model.resourceId,
    description: model.description,
    severity: model.severity,
    metadata: model.metadata,
    created_at: model.createdAt,
    created_by: model.createdBy,
    user_email: model.userEmail,
    user_name: model.userName
  };
};

export const toAuditLogModels = (entities: AuditLogEntity[]): AuditLogModel[] => {
  return entities.map(toAuditLogModel);
};

export const toAuditLogEntities = (models: AuditLogModel[]): AuditLogEntity[] => {
  return models.map(toAuditLogEntity);
};
