
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SuperAdminDashboard: React.FC = () => {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage application users and permissions</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>System Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Monitor system health and performance</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Merchant Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Review and verify merchant accounts</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminDashboard;
