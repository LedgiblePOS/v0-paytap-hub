
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import ErrorBoundary from '@/utils/ErrorBoundary'; // Fixed casing to match actual file
import { MonitoringInitializer } from '@/components/Monitoring/MonitoringInitializer';
import SecurityMonitor from '@/components/Monitoring/SecurityMonitor';
import { DeploymentEnvironment } from '@/types/enums';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <MonitoringInitializer environment={DeploymentEnvironment.DEVELOPMENT}>
        <SecurityMonitor />
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto p-4">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </MonitoringInitializer>
    </ErrorBoundary>
  );
};

export default AppLayout;
