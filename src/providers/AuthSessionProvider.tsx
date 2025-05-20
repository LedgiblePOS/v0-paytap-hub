
import React from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider'; // Import directly from source

export const AuthSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authContext = useAuth();
  
  // Use sessionTimeout hook if available
  React.useEffect(() => {
    if (authContext?.user) {
      console.log('Auth session active for user:', authContext.user.id);
    }
  }, [authContext?.user]);

  return <>{children}</>;
};
