
import React from 'react';
import AppSidebar from './AppSidebar';
import { useAuth } from '@/hooks/useAuth';

interface MerchantLayoutProps {
  children?: React.ReactNode;
}

const MerchantLayout: React.FC<MerchantLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default MerchantLayout;
