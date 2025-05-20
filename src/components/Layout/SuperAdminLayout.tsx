
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import SuperAdminHeader from '@/components/Layout/navigation/SuperAdminHeader';
import SuperAdminSidebar from '@/components/Layout/navigation/SuperAdminSidebar';

interface SuperAdminLayoutProps {
  children?: ReactNode;
}

const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SuperAdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <SuperAdminHeader />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
