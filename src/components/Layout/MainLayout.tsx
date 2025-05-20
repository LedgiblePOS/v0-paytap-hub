
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent
} from '@/components/ui/sidebar';
import { SidebarNavigationItems } from './sidebar/SidebarNavigationItems';
import { useLocation } from 'react-router-dom';

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Mark content as ready for blank screen detection
  useEffect(() => {
    const markContentReady = () => {
      document.body.setAttribute('data-content-ready', 'true');
      document.body.setAttribute('data-layout-loaded', 'true');
    };

    // Apply immediately and with a delay to handle race conditions
    markContentReady();
    setTimeout(markContentReady, 100);
    setTimeout(markContentReady, 500);

    console.log('[MainLayout] Rendering at path:', location.pathname);
  }, [location.pathname]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r">
          <SidebarContent className="pt-6">
            <SidebarNavigationItems user={user} location={location} />
          </SidebarContent>
        </Sidebar>

        <div className="flex-1">
          <main className="w-full p-6" data-testid="main-content" data-content-ready="true">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
