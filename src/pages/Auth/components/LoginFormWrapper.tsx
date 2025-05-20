
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginFormWrapperProps } from '../types';
import LoginForm from './LoginForm';

/**
 * A wrapper component for login forms to ensure consistent UI across different login pages
 */
const LoginFormWrapper: React.FC<LoginFormWrapperProps> = ({
  title,
  description,
  showRegisterLink = true,
  onSuccess,
  onError,
  redirectPath,
  userType,
  children
}) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <CardDescription>
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm 
              onSuccess={onSuccess}
              onError={onError}
              showRegisterLink={showRegisterLink}
              redirectPath={redirectPath}
              userType={userType}
            />
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginFormWrapper;
