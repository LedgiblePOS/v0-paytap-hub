
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { AuditLogModel } from '@/types/auditLog';

interface AuditLogResourcesChartProps {
  auditLogs: AuditLogModel[];
  loading?: boolean;
}

const AuditLogResourcesChart: React.FC<AuditLogResourcesChartProps> = ({ 
  auditLogs,
  loading = false
}) => {
  const resourceData = useMemo(() => {
    if (!auditLogs || auditLogs.length === 0) {
      return [];
    }

    // Count occurrences of each resource type
    const resourceCounts: Record<string, number> = {};
    
    auditLogs.forEach(log => {
      // Use resourceType if it exists, otherwise try resource, entityType, or default to "unknown"
      const resourceType = log.resourceType || log.resource || log.entityType || "unknown";
      resourceCounts[resourceType] = (resourceCounts[resourceType] || 0) + 1;
    });
    
    // Convert to array format for chart
    return Object.entries(resourceCounts).map(([name, value]) => ({ name, value }));
  }, [auditLogs]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resource Activity</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          Loading resource data...
        </CardContent>
      </Card>
    );
  }

  if (!resourceData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resource Activity</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          No resource activity data available.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Activity</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={resourceData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AuditLogResourcesChart;
