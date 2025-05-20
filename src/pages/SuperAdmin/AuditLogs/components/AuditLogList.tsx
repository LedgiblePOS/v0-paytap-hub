
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AuditLog } from "@/types/settings";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AuditLogListProps {
  logs: AuditLog[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

// Badge color based on action type
const getBadgeVariant = (action: string) => {
  switch (action?.toUpperCase()) {
    case "CREATE":
      return "default";
    case "UPDATE":
      return "outline";
    case "DELETE":
      return "destructive";
    case "LOGIN":
    case "LOGOUT":
      return "secondary";
    default:
      return "outline";
  }
};

export const AuditLogList = ({ logs, isLoading, isError, error }: AuditLogListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">Error loading audit logs: {error?.message}</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No audit logs found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead className="hidden md:table-cell">User ID</TableHead>
            <TableHead className="text-right">Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                <Badge variant={getBadgeVariant(log.action)}>
                  {log.action}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">
                {log.resource}
              </TableCell>
              <TableCell className="hidden md:table-cell max-w-xs truncate">
                {log.description || "N/A"}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="text-xs text-muted-foreground font-mono">
                  {log.user_id ? log.user_id.slice(0, 8) + "..." : "System"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                {log.created_at ? (
                  <span title={new Date(log.created_at).toLocaleString()}>
                    {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                  </span>
                ) : (
                  "N/A"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
