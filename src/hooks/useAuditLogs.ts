
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuditLogModel, AuditLog, toAuditLogModels } from '@/types/auditLog';

export interface UseAuditLogsProps {
  limit?: number;
  page?: number;
  userId?: string;
  resourceType?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}

export const useAuditLogs = ({
  limit = 10,
  page = 1,
  userId,
  resourceType,
  action,
  startDate,
  endDate
}: UseAuditLogsProps = {}) => {
  const [auditLogs, setAuditLogs] = useState<AuditLogModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('audit_logs')
          .select('*', { count: 'exact' });
        
        // Apply filters
        if (userId) query = query.eq('user_id', userId);
        if (resourceType) query = query.eq('resource', resourceType);
        if (action) query = query.eq('action', action);
        if (startDate) query = query.gte('created_at', startDate);
        if (endDate) query = query.lte('created_at', endDate);
        
        // Apply pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to).order('created_at', { ascending: false });
        
        const { data, error, count } = await query;
        
        if (error) throw error;
        
        // Convert to models
        const logModels = toAuditLogModels(data as AuditLog[] || []);
        setAuditLogs(logModels);
        setTotalCount(count || 0);
      } catch (err: any) {
        console.error('Error fetching audit logs:', err);
        setError(err.message);
        toast({
          title: 'Error',
          description: 'Failed to load audit logs',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, [limit, page, userId, resourceType, action, startDate, endDate, toast]);

  return {
    auditLogs,
    loading,
    error,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
};
