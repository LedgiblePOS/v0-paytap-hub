
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SecurityAudit: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Security Audit</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Security Audit Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Security audit functionality will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityAudit;
