
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import AdminLogin from '@/pages/Auth/AdminLogin';
import { UserRole } from '@/types/enums';
import ForgotPassword from '@/pages/Auth/ForgotPassword';

/**
 * Public routes component that handles login and registration routes
 */
const PublicRoutes: React.FC = () => {
  const { isAuthenticated, currentUser, loading } = useAuth();
  const location = useLocation();
  
  // Enhanced debug logging
  useEffect(() => {
    console.log("[PublicRoutes] Rendering with state:", {
      isAuthenticated,
      userRole: currentUser?.role,
      path: location.pathname,
      loading
    });

    // Mark public routes as loaded for blank screen detection
    document.body.setAttribute('data-public-routes-loaded', 'true');
  }, [isAuthenticated, currentUser, location, loading]);

  // Show nothing while loading to prevent flash
  if (loading) {
    console.log("[PublicRoutes] Still loading auth state");
    return null;
  }

  // If already authenticated, redirect to appropriate dashboard
  if (isAuthenticated && currentUser) {
    // Don't redirect if user is on unauthorized page
    if (location.pathname === '/unauthorized') {
      return null;
    }
    
    // Direct routing to appropriate dashboard based on user role
    const redirectPath = currentUser.role === UserRole.SUPER_ADMIN 
      ? '/super-admin' 
      : '/dashboard';
    
    console.log(`[PublicRoutes] Redirecting authenticated user to ${redirectPath}`);
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default PublicRoutes;
