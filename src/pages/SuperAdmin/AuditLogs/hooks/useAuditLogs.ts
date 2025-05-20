
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseAuditLogsOptions {
  limit?: number;
  page?: number;
  filters?: {
    action?: string;
    resource?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  };
}

export const useAuditLogs = (options: UseAuditLogsOptions = {}) => {
  const { limit = 10, page = 1, filters = {} } = options;
  const [totalCount, setTotalCount] = useState<number>(0);
  const { toast } = useToast();

  const offset = (page - 1) * limit;
  
  const {
    data: logs,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['auditLogs', limit, offset, filters],
    queryFn: async () => {
      try {
        // Build the query with filters
        let query = supabase
          .from('audit_logs')
          .select('*, profiles:user_id(*)', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);
        
        // Apply filters if provided
        if (filters.action) {
          query = query.eq('action', filters.action);
        }
        
        if (filters.resource) {
          query = query.eq('resource', filters.resource);
        }
        
        if (filters.userId) {
          query = query.eq('user_id', filters.userId);
        }
        
        if (filters.startDate) {
          query = query.gte('created_at', filters.startDate);
        }
        
        if (filters.endDate) {
          query = query.lte('created_at', filters.endDate);
        }
        
        const { data, count, error } = await query;
        
        if (error) throw error;
        
        // Set the total count for pagination
        if (count !== null) {
          setTotalCount(count);
        }
        
        // Transform the data with proper types
        const auditLogs = data.map(log => {
          const profile = log.profiles;
          return {
            id: log.id,
            action: log.action,
            resource: log.resource,
            resourceId: log.resource || '', // Fallback
            description: log.description,
            createdAt: log.created_at,
            userId: log.user_id,
            userEmail: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '',
            userRole: profile ? profile.role : '',
            ipAddress: log.ip_address
          };
        });
        
        return {
          logs: auditLogs,
          count: count || 0
        };
      } catch (err: any) {
        toast({
          title: "Error fetching audit logs",
          description: err.message,
          variant: "destructive"
        });
        throw err;
      }
    }
  });

  return {
    logs: logs?.logs || [],
    count: totalCount,
    isLoading,
    error: error ? (error as Error).message : null,
    refetch,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit)
  };
};

export default useAuditLogs;
