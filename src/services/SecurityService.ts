
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';

interface SecurityLogParams {
  userId?: string;
  eventType: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  severity?: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
}

class SecurityService {
  async logSecurityEvent(params: SecurityLogParams): Promise<void> {
    try {
      const { error } = await supabase.from('security_logs').insert({
        user_id: params.userId,
        event_type: params.eventType,
        ip_address: params.ipAddress,
        user_agent: params.userAgent,
        metadata: params.metadata || {},
        severity: params.severity || 'INFO',
      });

      if (error) {
        console.error('Error logging security event:', error);
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  async logFailedLogin(email: string, ipAddress?: string, userAgent?: string): Promise<void> {
    return this.logSecurityEvent({
      eventType: 'FAILED_LOGIN',
      ipAddress,
      userAgent,
      metadata: { email },
      severity: 'WARNING'
    });
  }

  async logPasswordReset(userId: string): Promise<void> {
    return this.logSecurityEvent({
      userId,
      eventType: 'PASSWORD_RESET',
      severity: 'INFO'
    });
  }

  async logSuccessfulLogin(user: User, ipAddress?: string, userAgent?: string): Promise<void> {
    return this.logSecurityEvent({
      userId: user.id,
      eventType: 'SUCCESSFUL_LOGIN',
      ipAddress,
      userAgent,
      severity: 'INFO'
    });
  }

  async logPermissionChange(userId: string, role: string, changedBy: string): Promise<void> {
    return this.logSecurityEvent({
      userId,
      eventType: 'PERMISSION_CHANGE',
      metadata: { role, changedBy },
      severity: 'INFO'
    });
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

  async fetchUserSecurityLogs(userId: string, limit: number = 100): Promise<any[]> {
    const { data, error } = await supabase
      .from('security_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching user security logs:', error);
      return [];
    }

    return data || [];
  }
}

const securityService = new SecurityService();
export default securityService;
