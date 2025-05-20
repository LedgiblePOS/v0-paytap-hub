
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

interface AuditLogParams {
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  description?: string;
  metadata?: Record<string, any>;
}

class AuditLogger {
  async log(params: AuditLogParams): Promise<void> {
    try {
      const { error } = await supabase.from('audit_logs').insert({
        user_id: params.userId,
        action: params.action,
        resource: params.resource,
        resource_id: params.resourceId,
        description: params.description,
        metadata: params.metadata
      });

      if (error) {
        console.error('Error logging audit event:', error);
      }
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }

  async logLogin(user: User): Promise<void> {
    return this.log({
      userId: user.id,
      action: 'LOGIN',
      resource: 'auth',
      description: `User logged in: ${user.email}`
    });
  }

  async logLogout(user: User): Promise<void> {
    return this.log({
      userId: user.id,
      action: 'LOGOUT',
      resource: 'auth',
      description: `User logged out: ${user.email}`
    });
  }

  async logUserAction(user: User, action: string, resource: string, resourceId?: string, description?: string): Promise<void> {
    return this.log({
      userId: user.id,
      action,
      resource,
      resourceId,
      description
    });
  }

  async fetchAuditLogs(limit: number = 100): Promise<any[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching audit logs:', error);
      return [];
    }

    return data || [];
  }

  async fetchUserAuditLogs(userId: string, limit: number = 100): Promise<any[]> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching user audit logs:', error);
      return [];
    }

    return data || [];
  }

  async fetchSecurityLogs(limit: number = 100): Promise<any[]> {
    const { data, error } = await supabase
      .from('security_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching security logs:', error);
      return [];
    }

    return data || [];
  }
}

const auditLogger = new AuditLogger();
export default auditLogger;
