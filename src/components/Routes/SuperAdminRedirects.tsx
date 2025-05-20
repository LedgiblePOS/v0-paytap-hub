
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/enums';

const SuperAdminRedirects = () => {
  const { user, isLoading } = useAuth();

  // Show loading if auth is being checked
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If user is super admin, redirect to super admin dashboard
  if (user?.role === UserRole.SUPER_ADMIN) {
    return <Navigate to="/super-admin" replace />;
  }

  // Otherwise redirect to regular dashboard
  return <Navigate to="/dashboard" replace />;
};

export default SuperAdminRedirects;
