
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { AuditLogModel } from '@/types/auditLog';
import { formatDistance } from 'date-fns';

interface AuditLogViewProps {
  logs: AuditLogModel[];
  loading?: boolean;
}

const AuditLogView: React.FC<AuditLogViewProps> = ({ logs, loading = false }) => {
  const [auditLogs, setAuditLogs] = useState<AuditLogModel[]>([]);

  useEffect(() => {
    // Transform logs to ensure all required fields exist
    const convertedLogs = logs.map(log => ({
      ...log,
      // Make sure all necessary fields exist by using optional chaining and defaults
      resource: log.resource || log.entityType || '',
      resourceId: log.resourceId || log.entityId || '',
      resourceType: log.resourceType || log.resource || log.entityType || '',
      description: log.description || log.details || '',
      userEmail: log.userEmail || ''
    }));
    setAuditLogs(convertedLogs);
  }, [logs]);

  if (loading) {
    return <div>Loading audit logs...</div>;
  }

  if (!auditLogs.length) {
    return <div>No audit logs found.</div>;
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableCaption>A list of recent system audit logs</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{log.action}</TableCell>
                <TableCell>{log.resourceType || log.resource || log.entityType}</TableCell>
                <TableCell>{log.description || log.details}</TableCell>
                <TableCell>{log.userEmail || log.userId}</TableCell>
                <TableCell>
                  {formatDistance(new Date(log.createdAt), new Date(), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AuditLogView;
