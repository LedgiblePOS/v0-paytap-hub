
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import MerchantVerificationList from '@/components/SuperAdmin/Verification/MerchantVerificationList';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/utils/permissions/types';

const MerchantVerificationsPage: React.FC = () => {
  const { can } = usePermissions();
  const canVerifyMerchants = can(Permission.VERIFY_MERCHANT);

  if (!canVerifyMerchants) {
    return (
      <PageContainer title="Merchant Verifications">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground">
              You do not have permission to verify merchants.
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Merchant Verifications">
      <MerchantVerificationList />
    </PageContainer>
  );
};

export default MerchantVerificationsPage;
