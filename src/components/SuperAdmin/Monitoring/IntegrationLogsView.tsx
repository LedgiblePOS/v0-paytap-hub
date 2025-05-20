
import React from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { IntegrationLogEntity } from '@/types/integration';

interface IntegrationLogsViewProps {
  logs: IntegrationLogEntity[];
  loading?: boolean;
}

const IntegrationLogsView: React.FC<IntegrationLogsViewProps> = ({ logs, loading }) => {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center items-center h-40">
          <p className="text-muted-foreground">Loading integration logs...</p>
        </div>
      </Card>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex justify-center items-center h-40">
          <p className="text-muted-foreground">No integration logs found.</p>
        </div>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPpp');
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <Card className="p-6 overflow-hidden">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Integration</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Success</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs">{log.id.substring(0, 8)}...</TableCell>
                <TableCell>{log.integration_id || 'N/A'}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{log.service_type || 'Unknown'}</span>
                    <span className="text-xs text-muted-foreground">{log.service_name || ''}</span>
                  </div>
                </TableCell>
                <TableCell>{log.event_type}</TableCell>
                <TableCell>
                  <Badge variant={log.status === 'success' ? 'success' : log.status === 'error' ? 'destructive' : 'outline'}>
                    {log.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDate(log.created_at)}
                  {log.updated_at && log.updated_at !== log.created_at && (
                    <div className="text-xs text-muted-foreground">Updated: {formatDate(log.updated_at)}</div>
                  )}
                </TableCell>
                <TableCell>{log.response_time || log.duration_ms || 'N/A'} ms</TableCell>
                <TableCell>
                  <Badge variant={log.success ? 'success' : 'destructive'}>
                    {log.success ? 'Success' : 'Failed'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default IntegrationLogsView;
