
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import PageContainer from '@/components/common/PageContainer';
import { FirstAtlanticCommerceSettings } from './components/payment-integration/FirstAtlanticCommerceSettings';
import { Permission } from '@/utils/permissions/types';
import { usePermissions } from '@/hooks/usePermissions';

const PaymentIntegration: React.FC = () => {
  const { user } = useAuth();
  const { can } = usePermissions();
  
  // Check if user has permission to view system settings
  const canManagePaymentSettings = can(Permission.VIEW_SYSTEM_SETTINGS);

  console.log('Payment Integration permissions:', {
    user: user?.id,
    userRole: user?.role,
    hasPermission: canManagePaymentSettings
  });

  if (!canManagePaymentSettings) {
    return (
      <PageContainer title="Payment Integration">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground">
              You do not have permission to manage payment integration settings.
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Payment Integration">
      <FirstAtlanticCommerceSettings />
    </PageContainer>
  );
};

export default PaymentIntegration;
