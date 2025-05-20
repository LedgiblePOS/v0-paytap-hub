
export interface AuditLogEntity {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  resource_id?: string;
  description: string;
  created_at: string;
  ip_address: string;
  user_agent: string;
  severity?: string;
  metadata?: Record<string, any>;
}

export interface AuditLogFilter {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  action?: string;
  resource?: string;
}

export interface AuditLogTableProps {
  logs: AuditLogEntity[];
  loading: boolean;
}
