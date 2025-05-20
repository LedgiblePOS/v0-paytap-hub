import { AuditSeverity, AuditEntityType } from '@/types/enums';

// Export AuditSeverity from this module to fix the import error
export { AuditSeverity, AuditEntityType };

// Rest of the file would continue here
export const logAuditEvent = (message: string, severity: AuditSeverity) => {
  console.log(`[Audit ${severity}]: ${message}`);
  // Actual implementation would send to backend
};

// Add the missing logAudit method
export const logAudit = (
  eventType: string,
  entityType: AuditEntityType,
  message: string,
  entityId?: string
) => {
  console.log(`[Audit ${eventType}]: ${entityType} ${entityId || ''} - ${message}`);
  // Actual implementation would send to backend
};

// Other audit service functions
export default {
  logAuditEvent,
  logAudit
};
