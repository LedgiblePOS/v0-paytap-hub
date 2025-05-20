
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle } from "lucide-react";
import { AuditLogModel } from "@/types";

interface AuditLogTableProps {
  filteredLogs: AuditLogModel[];
  isLoading: boolean;
  isError: boolean;
  error: Error;
}

const AuditLogTable: React.FC<AuditLogTableProps> = ({
  filteredLogs,
  isLoading,
  isError,
  error
}) => {
  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-green-500";
      case "UPDATE":
        return "bg-blue-500";
      case "DELETE":
        return "bg-red-500";
      case "LOGIN":
        return "bg-purple-500";
      case "LOGOUT":
        return "bg-gray-500";
      case "READ":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading audit logs...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <AlertTriangle className="h-8 w-8 mr-2" />
        <div>
          <p className="font-medium">Error loading audit logs</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!filteredLogs || filteredLogs.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No audit logs found for the selected filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredLogs.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {new Date(log.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                <div className="font-medium text-gray-900">{log.userEmail || "Unknown"}</div>
                <div className="text-xs text-gray-500">{log.userRole || "Unknown"}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <Badge className={getActionBadgeVariant(log.action)}>
                  {log.action}
                </Badge>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {log.resource}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {log.description}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {log.ipAddress || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogTable;
