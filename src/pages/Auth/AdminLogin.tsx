
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import LoginFormWrapper from './components/LoginFormWrapper';
import { useAuth } from '@/hooks/useAuth'; // Updated import

/**
 * Admin login page component
 * Specifically for super admin users
 */
const AdminLogin: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (isAuthenticated && user && user.role === 'SUPER_ADMIN') {
      console.log('Admin Login page: Admin already authenticated, redirecting to admin dashboard');
      navigate('/super-admin');
    }
  }, [isAuthenticated, user, navigate]);

  // Handle successful login for super admin
  const handleSuccess = () => {
    toast({
      title: "Welcome back, Admin",
      description: "You have been logged in to the admin portal.",
    });
    navigate('/super-admin');
  };

  // Handle login errors for super admin
  const handleError = (error: string) => {
    console.error("Admin login error:", error);
    setIsLoading(false);
    toast({
      title: "Login Failed",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <LoginFormWrapper
      title="Admin Portal"
      description="Sign in to access the super admin dashboard"
      showRegisterLink={false}
      onSuccess={handleSuccess}
      onError={handleError}
      redirectPath="/super-admin"
      userType="admin"
    >
      <div className="mt-4 text-center text-sm">
        <Link to="/login" className="font-medium text-gray-600 hover:underline">
          Back to Merchant Login
        </Link>
      </div>
    </LoginFormWrapper>
  );
};

export default AdminLogin;
