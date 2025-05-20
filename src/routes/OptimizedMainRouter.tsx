
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/enums';
import { NavigationProvider } from '@/contexts/NavigationContext';
import ErrorBoundary from '@/utils/errorBoundary';
import ErrorDisplay from '@/components/Layout/ErrorDisplay';
import { createOptimizedRoute, withPrefetchedRoutes } from '@/utils/routeOptimization';
import performanceMonitoringService from '@/services/monitoring/performanceMonitoringService';

// Optimized lazy-loaded routes
const Login = createOptimizedRoute(() => import('@/pages/Auth/Login'));
const Register = createOptimizedRoute(() => import('@/pages/Auth/Register'));
const ForgotPassword = createOptimizedRoute(() => import('@/pages/Auth/ForgotPassword'));
const ResetPassword = createOptimizedRoute(() => import('@/pages/Auth/ResetPassword'));
const SuperAdminRoutes = createOptimizedRoute(() => import('@/components/Routes/SuperAdminRoutes'));
const MerchantRoutes = createOptimizedRoute(() => import('@/components/Routes/MerchantRoutes'));
const Onboarding = createOptimizedRoute(() => import('@/pages/Onboarding'));
const NotFound = createOptimizedRoute(() => import('@/pages/NotFound'));
const QualityAssurance = createOptimizedRoute(() => import('@/pages/Testing/QA'));

// Enhance the Login component to prefetch related routes for better UX
const EnhancedLogin = withPrefetchedRoutes(Login, [
  () => import('@/pages/Auth/ForgotPassword'),
  () => import('@/pages/Auth/Register')
]);

// Enhance the Dashboard to prefetch merchant routes
const EnhancedMerchantRoutes = withPrefetchedRoutes(MerchantRoutes, [
  () => import('@/pages/Dashboard/index'),
  () => import('@/pages/Products/index'),
  () => import('@/pages/Analytics/index')
]);

const OptimizedMainRouter = () => {
  const { user, isLoading } = useAuth();
  
  // Track route rendering performance
  React.useEffect(() => {
    performanceMonitoringService.mark('router-render');
    
    return () => {
      performanceMonitoringService.measure('router-render-complete', 'router-render');
    };
  }, []);
  
  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center">
      <div className="animate-pulse">Loading...</div>
    </div>;
  }
  
  return (
    <NavigationProvider>
      <ErrorBoundary>
        <Routes>
          {/* Public routes - accessible to everyone */}
          <Route path="/login" element={!user ? <EnhancedLogin /> : <Navigate to={user.role === UserRole.SUPER_ADMIN ? "/super-admin" : "/dashboard"} />} />
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
                <EnhancedMerchantRoutes />
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
                  <EnhancedMerchantRoutes />
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

export default OptimizedMainRouter;
