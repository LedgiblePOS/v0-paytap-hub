
import React from 'react';

export interface SecurityAuditItem {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'in_progress' | 'resolved';
  dateDetected: string;
  dateResolved?: string;
  recommendation: string;
  affectedSystem: string;
  date: string;
  affectedArea: string;
  // Add the fields needed by SecurityAuditDashboard
  created_at?: string;
  resource?: string;
  resource_id?: string;
}

interface SecurityIssuesListProps {
  issues: SecurityAuditItem[];
  onResolveIssue: (id: string) => Promise<boolean>;
}

const SecurityIssuesList: React.FC<SecurityIssuesListProps> = ({ issues, onResolveIssue }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Security Issues</h3>
      {issues.length === 0 ? (
        <p className="text-muted-foreground">No security issues found.</p>
      ) : (
        <div className="space-y-3">
          {issues.map((issue) => (
            <div key={issue.id} className="border rounded-md p-4 bg-card">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    issue.severity === 'critical' ? 'bg-red-500' :
                    issue.severity === 'high' ? 'bg-amber-500' :
                    issue.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></span>
                  <h4 className="font-medium">{issue.title || issue.description}</h4>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-muted">
                  {issue.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{issue.description}</p>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {new Date(issue.dateDetected || issue.date || issue.created_at || '').toLocaleDateString()}
                </span>
                {issue.status !== 'resolved' && (
                  <button
                    onClick={() => onResolveIssue(issue.id)}
                    className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SecurityIssuesList;
