
import React, { useEffect } from 'react';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import SecurityAuditChecklist from './SecurityAuditChecklist';
import SecurityStatCards from './SecurityStatCards';
import SecurityIssuesList, { SecurityAuditItem } from './SecurityIssuesList';
import SecurityMetricsChart from './SecurityMetricsChart';
import SecurityMetricsOverview from './SecurityMetricsOverview';

const SecurityAuditDashboard: React.FC = () => {
  const {
    auditItems,
    loading,
    refreshData,
    resolveAuditItem,
    statusFilter,
    severityFilter,
    handleStatusFilterChange,
    handleSeverityFilterChange
  } = useSecurityAudit();
  
  useEffect(() => {
    console.log('Security audit dashboard mounted');
  }, []);

  // Prepare stats data
  const stats = {
    totalIssues: auditItems.length,
    criticalIssues: auditItems.filter(item => item.severity === 'critical').length,
    resolvedIssues: auditItems.filter(item => item.status === 'resolved').length
  };

  const lastAuditDate = auditItems.length > 0 
    ? new Date(auditItems[0].dateDetected || auditItems[0].date || '').toISOString()
    : new Date().toISOString();

  // Map audit items to the format expected by SecurityIssuesList
  const mappedAuditItems: SecurityAuditItem[] = auditItems.map(item => ({
    id: item.id,
    title: item.title || item.description,
    description: item.description,
    severity: item.severity,
    status: item.status,
    dateDetected: item.dateDetected || item.date || new Date().toISOString(),
    dateResolved: item.dateResolved,
    recommendation: item.recommendation || 'No specific recommendation available.',
    affectedSystem: item.affectedSystem || 'System',
    date: item.date || item.dateDetected || new Date().toISOString(),
    affectedArea: item.affectedArea || 'Unknown',
    created_at: item.created_at,
    resource: item.resource,
    resource_id: item.resource_id
  }));

  // Mock data for the checklist and chart
  const mockAuditResults = {
    passed: [
      "Password policies enforced",
      "Two-factor authentication available",
      "Data encryption at rest",
      "Regular security audits configured",
    ],
    failed: [
      "Some user accounts have weak passwords",
      "API rate limiting needs configuration"
    ]
  };

  const mockMetricsData = [
    { name: 'Jan', issues: 12, resolved: 10 },
    { name: 'Feb', issues: 15, resolved: 13 },
    { name: 'Mar', issues: 8, resolved: 7 },
    { name: 'Apr', issues: 10, resolved: 8 },
    { name: 'May', issues: 5, resolved: 4 },
    { name: 'Jun', issues: 7, resolved: 6 },
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Security Audit Dashboard</h1>
      
      <SecurityStatCards 
        totalIssues={stats.totalIssues}
        criticalIssues={stats.criticalIssues}
        resolvedIssues={stats.resolvedIssues}
        lastAuditDate={lastAuditDate}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div>
          <SecurityIssuesList
            issues={mappedAuditItems}
            onResolveIssue={resolveAuditItem}
          />
        </div>
        
        <div className="space-y-8">
          <SecurityAuditChecklist auditResults={mockAuditResults} />
          <SecurityMetricsChart data={mockMetricsData} />
        </div>
      </div>
      
      <div className="mt-8">
        <SecurityMetricsOverview />
      </div>
      
      <div className="mt-8 flex justify-end">
        <button 
          onClick={refreshData} 
          className="bg-primary text-white py-2 px-4 rounded hover:bg-primary/90"
          disabled={loading}
        >
          {loading ? 'Running Security Audit...' : 'Run Security Audit'}
        </button>
      </div>
    </div>
  );
};

export default SecurityAuditDashboard;
