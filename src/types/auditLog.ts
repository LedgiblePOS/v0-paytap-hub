
import { AuditSeverity, AuditEntityType } from './enums';

export interface AuditLog {
  id: string;
  user_id?: string;
  timestamp?: string;
  severity: AuditSeverity;
  entity_type?: AuditEntityType;
  entity_id?: string;
  action: string;
  details?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  resource?: string;
  resource_id?: string;
  description?: string;
  metadata?: any;
}

export type AuditLogData = AuditLog;

export interface AuditLogModel {
  id: string;
  userId?: string;
  timestamp?: string;
  severity: AuditSeverity;
  entityType?: AuditEntityType;
  entityId?: string;
  action: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  createdBy?: string;
  resource?: string;
  resourceId?: string;
  resourceType?: string;
  description?: string;
  userEmail?: string;
  userName?: string;
  metadata?: any;
}

export const toAuditLogModel = (entity: AuditLog): AuditLogModel => {
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
    createdBy: entity.user_id,
    userEmail: '',
    userName: '',
    entityType: entity.entity_type,
    entityId: entity.entity_id,
    ipAddress: entity.ip_address,
    userAgent: entity.user_agent,
    timestamp: entity.timestamp
  };
};

export const toAuditLogModels = (entities: AuditLog[]): AuditLogModel[] => {
  return entities.map(toAuditLogModel);
};

// Export these from here as well to fix import issues
export { AuditSeverity, AuditEntityType };
