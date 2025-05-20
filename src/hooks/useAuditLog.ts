
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuditLogModel, AuditLog, toAuditLogModels } from '@/types/auditLog';

export const useAuditLog = (limit: number = 10) => {
  const [logs, setLogs] = useState<AuditLogModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        
        // Calculate offset based on page and limit
        const offset = (currentPage - 1) * limit;
        
        // Fetch logs with pagination
        const { data, error: logsError, count } = await supabase
          .from('audit_logs')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);
          
        if (logsError) throw logsError;
        
        // Convert to AuditLogModel format
        const auditLogModels = toAuditLogModels(data as AuditLog[] || []);
        setLogs(auditLogModels);
        setTotalCount(count || 0);
      } catch (err) {
        console.error('Error fetching audit logs:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch audit logs'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, [limit, currentPage]);
  
  const changePage = (page: number) => {
    setCurrentPage(page);
  };
  
  return {
    logs,
    loading,
    error,
    totalCount,
    currentPage,
    changePage,
    pageSize: limit,
    totalPages: Math.ceil(totalCount / limit)
  };
};

export default useAuditLog;
