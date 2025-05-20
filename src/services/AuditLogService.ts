
import { supabase } from '@/integrations/supabase/client';
import { AuditLogModel } from '@/types/models';
import { toAuditLogModel, toAuditLogModels } from '@/utils/modelConversions';

export interface FetchAuditLogsOptions {
  limit?: number;
  page?: number;
  userId?: string;
  actionType?: string;
  resource?: string;
  fromDate?: string;
  toDate?: string;
  searchQuery?: string;
}

export interface AuditLogStats {
  totalCount: number;
  actionCounts: Record<string, number>;
  resourceCounts: Record<string, number>;
  userCounts: Record<string, number>;
}

class AuditLogService {
  async fetchAuditLogs(options: FetchAuditLogsOptions = {}): Promise<AuditLogModel[]> {
    try {
      const {
        limit = 100,
        page = 1,
        userId,
        actionType,
        resource,
        fromDate,
        toDate,
        searchQuery
      } = options;

      const offset = (page - 1) * limit;

      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)
        .range(offset, offset + limit - 1);

      // Apply filters if provided
      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (actionType) {
        query = query.eq('action', actionType);
      }

      if (resource) {
        query = query.eq('resource', resource);
      }

      if (fromDate) {
        query = query.gte('created_at', fromDate);
      }

      if (toDate) {
        query = query.lte('created_at', toDate);
      }

      if (searchQuery) {
        query = query.or(`description.ilike.%${searchQuery}%,resource.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching audit logs:', error);
        return [];
      }

      return toAuditLogModels(data);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      return [];
    }
  }

  async getAuditLogById(id: string): Promise<AuditLogModel | null> {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching audit log:', error);
        return null;
      }

      return toAuditLogModel(data);
    } catch (error) {
      console.error('Failed to fetch audit log:', error);
      return null;
    }
  }

  async getAuditLogStats(): Promise<AuditLogStats> {
    try {
      // Get total count
      const { count: totalCount, error: countError } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        throw new Error(`Error getting total count: ${countError.message}`);
      }

      // Get counts per action type
      const { data: actionData, error: actionError } = await supabase
        .from('audit_logs')
        .select('action, count')
        .group('action');

      if (actionError) {
        throw new Error(`Error getting action counts: ${actionError.message}`);
      }

      // Get counts per resource
      const { data: resourceData, error: resourceError } = await supabase
        .from('audit_logs')
        .select('resource, count')
        .group('resource');

      if (resourceError) {
        throw new Error(`Error getting resource counts: ${resourceError.message}`);
      }

      // Get counts per user
      const { data: userData, error: userError } = await supabase
        .from('audit_logs')
        .select('user_id, count')
        .group('user_id');

      if (userError) {
        throw new Error(`Error getting user counts: ${userError.message}`);
      }

      // Format results
      const actionCounts = actionData?.reduce((acc, curr) => {
        acc[curr.action] = parseInt(curr.count);
        return acc;
      }, {} as Record<string, number>) || {};

      const resourceCounts = resourceData?.reduce((acc, curr) => {
        acc[curr.resource] = parseInt(curr.count);
        return acc;
      }, {} as Record<string, number>) || {};

      const userCounts = userData?.reduce((acc, curr) => {
        if (curr.user_id) {
          acc[curr.user_id] = parseInt(curr.count);
        }
        return acc;
      }, {} as Record<string, number>) || {};

      return {
        totalCount: totalCount || 0,
        actionCounts,
        resourceCounts,
        userCounts
      };
    } catch (error) {
      console.error('Failed to get audit log stats:', error);
      return {
        totalCount: 0,
        actionCounts: {},
        resourceCounts: {},
        userCounts: {}
      };
    }
  }
}

const auditLogService = new AuditLogService();
export default auditLogService;
