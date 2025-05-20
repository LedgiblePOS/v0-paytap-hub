
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface SecurityAuditItem {
  id: string;
  title?: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'in_progress' | 'resolved';
  dateDetected: string;
  dateResolved?: string;
  recommendation?: string;
  affectedSystem?: string;
  date?: string;
  affectedArea?: string;
  created_at?: string;
  resource?: string;
  resource_id?: string;
}

export const useSecurityAudit = () => {
  const [auditItems, setAuditItems] = useState<SecurityAuditItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const { toast } = useToast();

  // Mock fetch function to simulate API call
  const fetchAuditItems = async () => {
    setLoading(true);
    try {
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample data
      const items: SecurityAuditItem[] = [
        {
          id: '1',
          title: 'Weak password policy',
          description: 'The current password policy does not meet security standards',
          severity: 'high',
          status: 'in_progress',
          dateDetected: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          recommendation: 'Implement stronger password requirements',
          affectedSystem: 'Authentication',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          affectedArea: 'User Security',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          resource: 'Authentication',
          resource_id: 'auth_1'
        },
        {
          id: '2',
          title: 'Unencrypted data transmission',
          description: 'Some API endpoints are not using HTTPS',
          severity: 'critical',
          status: 'new',
          dateDetected: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          recommendation: 'Enforce HTTPS for all endpoints',
          affectedSystem: 'API',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          affectedArea: 'Data Security',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          resource: 'API',
          resource_id: 'api_endpoints'
        },
        {
          id: '3',
          title: 'Session timeout not set',
          description: 'User sessions do not expire automatically',
          severity: 'medium',
          status: 'resolved',
          dateDetected: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          dateResolved: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          recommendation: 'Configure session timeout after period of inactivity',
          affectedSystem: 'User Sessions',
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          affectedArea: 'Session Management',
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          resource: 'Sessions',
          resource_id: 'user_sessions'
        }
      ];
      
      setAuditItems(items);
      return items;
    } catch (error) {
      console.error('Error fetching audit items:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch security audit data',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditItems();
  }, []);

  const resolveAuditItem = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAuditItems(prev => prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status: 'resolved' as const,
            dateResolved: new Date().toISOString()
          };
        }
        return item;
      }));
      
      toast({
        title: 'Success',
        description: 'Security issue marked as resolved',
      });
      
      return true;
    } catch (error) {
      console.error('Error resolving audit item:', error);
      toast({
        title: 'Error',
        description: 'Failed to resolve security issue',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
  };

  const handleSeverityFilterChange = (severity: string) => {
    setSeverityFilter(severity);
  };

  const refreshData = async () => {
    toast({
      title: 'Security Audit',
      description: 'Running security audit...',
    });
    return await fetchAuditItems();
  };

  return {
    auditItems,
    loading,
    statusFilter,
    severityFilter,
    handleStatusFilterChange,
    handleSeverityFilterChange,
    resolveAuditItem,
    refreshData
  };
};

export default useSecurityAudit;
