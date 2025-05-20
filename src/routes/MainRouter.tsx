
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { UserRole } from '@/types/user';
import { NavigationProvider } from '@/contexts/NavigationContext';
import ErrorBoundary from '@/utils/errorBoundary';
import ErrorDisplay from '@/components/Layout/ErrorDisplay';
import { createOptimizedRoute } from '@/utils/routeOptimization';
import performanceMonitoringService from '@/services/monitoring/performanceMonitoringService';

// Lazy load routes for better performance using our optimization utility
const Login = createOptimizedRoute(() => import('@/pages/Auth/Login'));
const Register = createOptimizedRoute(() => import('@/pages/Auth/Register'));
const ForgotPassword = createOptimizedRoute(() => import('@/pages/Auth/ForgotPassword'));
const ResetPassword = createOptimizedRoute(() => import('@/pages/Auth/ResetPassword'));
const SuperAdminRoutes = createOptimizedRoute(() => import('@/components/Routes/SuperAdminRoutes'));
const MerchantRoutes = createOptimizedRoute(() => import('@/components/Routes/MerchantRoutes'));
const Onboarding = createOptimizedRoute(() => import('@/pages/Onboarding'));
const NotFound = createOptimizedRoute(() => import('@/pages/NotFound'));
const QualityAssurance = createOptimizedRoute(() => import('@/pages/Testing/QA'));

const MainRouter = () => {
  const { user, isLoading } = useAuth();
  
  // Track router performance
  React.useEffect(() => {
    performanceMonitoringService.mark('router-render-start');
    return () => {
      performanceMonitoringService.measure('router-render', 'router-render-start');
    };
  }, []);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <NavigationProvider>
      <ErrorBoundary>
        <Routes>
          {/* Public routes - accessible to everyone */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === UserRole.SUPER_ADMIN ? "/super-admin" : "/dashboard"} />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected routes - require authentication */}
          <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/login" />} />
          
          {/* Testing & QA routes */}
          <Route path="/testing/qa" element={user ? <QualityAssurance /> : <Navigate to="/login" />} />
          
          {/* Super Admin routes */}
          <Route 
            path="/super-admin/*" 
            element={
              user && user.role === UserRole.SUPER_ADMIN ? (
                <SuperAdminRoutes />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />

          {/* Merchant Dashboard routes */}
          <Route
            path="/merchant-dashboard/*"
            element={
              user ? (
                <MerchantRoutes />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          
          {/* Default merchant routes */}
          <Route
            path="/*"
            element={
              user ? (
                user.role === UserRole.SUPER_ADMIN ? (
                  <Navigate to="/super-admin" />
                ) : (
                  <MerchantRoutes />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          
          {/* Catch-all route for 404 pages */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </NavigationProvider>
  );
};

export default MainRouter;
