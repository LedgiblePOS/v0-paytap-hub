
import React, { useEffect } from 'react';
import { DeploymentEnvironment } from '@/types/enums';
// Import AuditSeverity correctly
import { AuditSeverity } from '@/types/enums';

interface MonitoringInitializerProps {
  children: React.ReactNode;
  environment: DeploymentEnvironment;
}

export const MonitoringInitializer: React.FC<MonitoringInitializerProps> = ({ 
  children,
  environment
}) => {
  useEffect(() => {
    // Initialize monitoring based on environment
    console.log(`[MonitoringInitializer] Setting up monitoring for ${environment}`);
    
    // Register error handlers
    const errorHandler = (error: ErrorEvent) => {
      console.error('[MonitoringInitializer] Caught unhandled error:', error);
      // In a real app, this would send to a monitoring service
    };
    
    window.addEventListener('error', errorHandler);
    
    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, [environment]);
  
  return <>{children}</>;
};

export default MonitoringInitializer;
