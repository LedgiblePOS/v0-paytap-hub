
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/enums';
import MerchantRoutes from './MerchantRoutes';
import PublicRoutes from './PublicRoutes';
import SuperAdminRoutes from './SuperAdminRoutes';

const AppRoutes: React.FC = () => {
  // Add error handling for context issues
  try {
    const { user, isLoading } = useAuth();
    
    // Add enhanced debugging logs to trace authentication state
    useEffect(() => {
      console.log('[AppRoutes] Auth state:', { 
        isLoading, 
        isAuthenticated: !!user, 
        userRole: user?.role
      });
    }, [user, isLoading]);
    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-2">Loading...</span>
        </div>
      );
    }

    // Check if we have authentication routes available
    if (!user) {
      console.log('[AppRoutes] No authenticated user, showing PublicRoutes');
      return <PublicRoutes />;
    }
    
    return (
      <Routes>
        {/* Default redirect to dashboard if authenticated */}
        <Route path="/" element={
          user ? (
            user.role === UserRole.SUPER_ADMIN ? (
              <Navigate to="/super-admin" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        
        {/* Include merchant routes */}
        {MerchantRoutes()}
        
        {/* Include super admin routes with proper mapping */}
        <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
        
        {/* Catch all route for 404 */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    );
  } catch (error) {
    console.error('[AppRoutes] Error rendering routes:', error);
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-600 p-4">
        <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
        <p className="mb-4">There was a problem with the authentication system.</p>
        <p className="text-sm bg-gray-100 p-2 rounded">{error instanceof Error ? error.message : 'Unknown error'}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reload Page
        </button>
      </div>
    );
  }
};

export default AppRoutes;
