
import { AlertCircle } from 'lucide-react';

export const AuditLogEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No Audit Logs Found</h3>
      <p className="text-sm text-muted-foreground mt-2">
        There are no audit logs to display for the selected filters.
      </p>
    </div>
  );
};

export default AuditLogEmptyState;
