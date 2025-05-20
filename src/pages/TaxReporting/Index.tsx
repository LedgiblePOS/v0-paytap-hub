
import React from 'react';
import { useLocation } from 'react-router-dom';
import PageContainer from '@/components/common/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const TaxReporting: React.FC = () => {
  const location = useLocation();
  const isSuperAdmin = location.pathname.startsWith('/super-admin');

  // Simulate data loading
  const { isLoading, error } = useQuery({
    queryKey: ['tax-reporting'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { data: [] };
    }
  });

  return (
    <PageContainer 
      title="Tax Reporting" 
      isLoading={isLoading}
      error={error as Error | null}
      contentType="tax-reporting"
    >
      <div className="space-y-6">
        <Card className="border-dashed">
          <CardHeader className="flex flex-row items-center gap-3">
            <Receipt className="h-6 w-6 text-primary" />
            <CardTitle>Tax Reporting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isSuperAdmin ? (
              <>
                <p>View and manage tax reports across all merchants in the system.</p>
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4 flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <p className="text-sm text-yellow-700">
                      This module is currently in development for the admin interface.
                      Full tax management features will be available soon.
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <p>Manage your tax settings and generate tax reports for your business.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Tax Filing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Create and submit tax documents for your business
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Tax Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Configure your tax jurisdiction and settings
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default TaxReporting;
