
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/Layout/AppLayout';
import { UserRole } from '@/types/enums';
import ErrorBoundary from '@/utils/ErrorBoundary';

const ProtectedMerchantLayout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // Fixed the redirect path
    return <Navigate to="/login" replace />;
  }

  // Check if user has merchant role
  if (user.role !== UserRole.MERCHANT && user.role !== UserRole.SUPER_ADMIN) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <ErrorBoundary>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </ErrorBoundary>
  );
};

export default ProtectedMerchantLayout;
