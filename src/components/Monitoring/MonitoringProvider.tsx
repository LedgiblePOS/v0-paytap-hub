
import React, { createContext, useContext, useState, useEffect } from 'react';

type MonitoringContextType = {
  errors: Error[];
  logError: (error: Error) => void;
  clearErrors: () => void;
  isMonitoringEnabled: boolean;
  enableMonitoring: (enabled: boolean) => void;
};

const MonitoringContext = createContext<MonitoringContextType | undefined>(undefined);

export const useMonitoring = () => {
  const context = useContext(MonitoringContext);
  if (!context) {
    throw new Error('useMonitoring must be used within a MonitoringProvider');
  }
  return context;
};

const MonitoringProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [errors, setErrors] = useState<Error[]>([]);
  const [isMonitoringEnabled, setIsMonitoringEnabled] = useState<boolean>(false);

  const logError = (error: Error) => {
    console.error('Application error:', error);
    setErrors((prevErrors) => [...prevErrors, error]);
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const enableMonitoring = (enabled: boolean) => {
    setIsMonitoringEnabled(enabled);
    console.log(`Monitoring ${enabled ? 'enabled' : 'disabled'}`);
  };

  // Set up global error handler
  useEffect(() => {
    if (!isMonitoringEnabled) return;
    
    const handleGlobalError = (event: ErrorEvent) => {
      event.preventDefault();
      logError(event.error || new Error(event.message));
      
      // Log to console but don't interrupt app
      console.error('Global error caught by MonitoringProvider:', event.error || event.message);
    };

    // Set up global promise rejection handler
    const handleRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      const error = event.reason instanceof Error 
        ? event.reason 
        : new Error(String(event.reason));
      
      logError(error);
      console.error('Unhandled promise rejection caught by MonitoringProvider:', error);
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [isMonitoringEnabled]);

  return (
    <MonitoringContext.Provider value={{ 
      errors, 
      logError, 
      clearErrors,
      isMonitoringEnabled,
      enableMonitoring
    }}>
      {children}
    </MonitoringContext.Provider>
  );
};

export default MonitoringProvider;
