
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Shield, AlertTriangle, Info, AlertCircle, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface AuditLogRecord {
  id: string;
  action: string;
  resource: string;
  description: string;
  user_id: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  userEmail?: string;
}

interface SecurityLogProps {
  logs: AuditLogRecord[];
  isLoading?: boolean;
}

const SecurityLog: React.FC<SecurityLogProps> = ({ logs = [], isLoading = false }) => {
  // Function to determine log severity based on action or description
  const getLogSeverity = (log: AuditLogRecord): "low" | "medium" | "high" => {
    const highSeverityActions = ["DELETE", "SECURITY_VIOLATION", "AUTH_FAILED"];
    const mediumSeverityActions = ["UPDATE", "IP_BLOCKED", "ACCESS_DENIED"];
    
    // Check for high severity first
    if (highSeverityActions.some(action => log.action.includes(action))) {
      return "high";
    }
    
    // Check for medium severity
    if (mediumSeverityActions.some(action => log.action.includes(action))) {
      return "medium";
    }
    
    // Default to low
    return "low";
  };
  
  const getLogIcon = (log: AuditLogRecord) => {
    const severity = getLogSeverity(log);
    
    switch (severity) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  const getActionBadge = (log: AuditLogRecord) => {
    const severity = getLogSeverity(log);
    
    return (
      <Badge
        variant={severity === "high" ? "destructive" : severity === "medium" ? "outline" : "secondary"}
        className="ml-2"
      >
        {log.action}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Security Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Loading security logs...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Security Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">No security logs found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          Security Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex flex-col p-3 border rounded-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getLogIcon(log)}
                  <span className="ml-2 font-semibold">
                    {log.resource} {getActionBadge(log)}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(log.created_at), "MMM d, yyyy HH:mm:ss")}
                </span>
              </div>
              
              {log.description && (
                <p className="mt-2 text-sm">{log.description}</p>
              )}
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2">
                <div className="flex items-center text-xs text-muted-foreground">
                  {log.user_id && (
                    <div className="flex items-center mr-3">
                      <User className="h-3 w-3 mr-1" />
                      {log.userEmail || log.user_id.substring(0, 8)}
                    </div>
                  )}
                  {log.ip_address && (
                    <div className="mr-3">IP: {log.ip_address}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityLog;
