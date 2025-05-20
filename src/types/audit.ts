
import { AuditEntityType } from './enums';

export interface AuditLogEntity {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  resource_id: string;
  description: string;
  severity: string;
  metadata: any;
  created_at: string;
  created_by?: string;
  user_email?: string;
  user_name?: string;
  user_agent?: string;
  ip_address?: string;
}

export interface AuditLogModel {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  description: string;
  severity: string;
  metadata: any;
  createdAt: string;
  createdBy: string;
  userEmail: string;
  userName: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface AuditLogFilterParams {
  startDate?: Date;
  endDate?: Date;
  action?: string;
  resource?: string;
  userId?: string;
  severity?: string;
}

export interface AuditLogReportParams {
  timeframe: 'day' | 'week' | 'month' | 'year';
  groupBy: 'action' | 'resource' | 'user' | 'severity';
  startDate?: Date;
  endDate?: Date;
  includeCharts?: boolean;
}
