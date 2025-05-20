
import { AuditSeverity, AuditEntityType } from '@/types/enums';
import { supabase } from '@/lib/supabase';

class AuditService {
  async logAuditEvent(
    description: string,
    severity: AuditSeverity = AuditSeverity.INFO,
    entityType: AuditEntityType = AuditEntityType.SYSTEM,
    entityId?: string
  ) {
    try {
      const { data, error } = await supabase.from('audit_logs').insert({
        description,
        severity,
        entity_type: entityType,
        entity_id: entityId,
        created_at: new Date().toISOString()
      });
      
      if (error) {
        console.error('Error logging audit event:', error);
      }
      
      return data;
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Don't throw to avoid disrupting user flow on audit failures
      return null;
    }
  }
}

export const enhancedAuditService = new AuditService();
