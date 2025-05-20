
import React, { useState } from 'react';
import PageContainer from '@/components/common/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MerchantPaymentReports from '@/components/SuperAdmin/Reports/MerchantPaymentReports';
import MerchantVerificationReports from '@/components/SuperAdmin/Reports/MerchantVerificationReports';
import MerchantActivityReports from '@/components/SuperAdmin/Reports/MerchantActivityReports';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/utils/permissions/types';

const MerchantReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('payment');
  const { can } = usePermissions();
  
  const canViewReports = can(Permission.VIEW_REPORTS);

  if (!canViewReports) {
    return (
      <PageContainer title="Merchant Reports">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground">
              You do not have permission to view reports.
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Merchant Reports">
      <Card>
        <CardHeader>
          <CardTitle>Merchant Analytics & Reports</CardTitle>
          <CardDescription>
            Comprehensive reports on merchant performance, payments, and verification status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="payment">Payment Reports</TabsTrigger>
              <TabsTrigger value="verification">Verification Reports</TabsTrigger>
              <TabsTrigger value="activity">Merchant Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="payment" className="space-y-4">
              <MerchantPaymentReports />
            </TabsContent>
            
            <TabsContent value="verification" className="space-y-4">
              <MerchantVerificationReports />
            </TabsContent>
            
            <TabsContent value="activity" className="space-y-4">
              <MerchantActivityReports />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default MerchantReports;
