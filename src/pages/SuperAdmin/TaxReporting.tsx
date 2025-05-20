
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TaxReporting: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Tax Reporting</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Tax Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Tax reporting functionality will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxReporting;
