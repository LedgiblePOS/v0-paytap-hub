
import React from 'react';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from '@/utils/ErrorBoundary'; // Maintaining consistent casing
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { SidebarNavigationItems } from './sidebar/SidebarNavigationItems';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'react-router-dom';

const MainLayoutContent = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  return (
    <div className="flex h-screen">
      <Sidebar className="border-r">
        <SidebarContent className="pt-6">
          <SidebarNavigationItems user={user} location={location} />
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-4 overflow-auto">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default MainLayoutContent;
