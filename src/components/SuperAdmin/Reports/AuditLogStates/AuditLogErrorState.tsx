
import React from "react";
import { AlertTriangle } from "lucide-react";

interface AuditLogErrorStateProps {
  error: Error;
}

const AuditLogErrorState: React.FC<AuditLogErrorStateProps> = ({ error }) => {
  return (
    <div className="flex items-center justify-center h-64 text-red-500">
      <AlertTriangle className="h-8 w-8 mr-2" />
      <div>
        <p className="font-medium">Error loading audit logs</p>
        <p className="text-sm">{error.message}</p>
      </div>
    </div>
  );
};

export default AuditLogErrorState;
