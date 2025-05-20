
import React from 'react';
import MerchantVerificationsPage from './components/merchant-verification/MerchantVerificationsPage';
import PermissionProtectedRoute from '@/components/Routes/PermissionProtectedRoute';
import { Permission } from '@/utils/permissions/types';

const MerchantVerifications: React.FC = () => {
  return (
    <PermissionProtectedRoute requiredPermission={Permission.VERIFY_MERCHANT}>
      <MerchantVerificationsPage />
    </PermissionProtectedRoute>
  );
};

export default MerchantVerifications;
